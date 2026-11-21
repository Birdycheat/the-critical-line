"""Recheck the pinned corpus using local inputs only. No build or network access."""

import argparse
import gzip
import hashlib
import io
import json
from pathlib import Path
import subprocess
import tarfile


ROOT = Path(__file__).resolve().parents[1]
LOCK = ROOT / "records" / "corpus.json"


def git(checkout, *args):
    return subprocess.check_output(["git", "-C", str(checkout), *args])


def check(actual, expected, label):
    if actual != expected:
        raise ValueError(f"{label}: expected {expected}, obtained {actual}")


def hash_file(path):
    h = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


class JoinedParts(io.RawIOBase):
    """Provide a read-only stream over archive parts, recording the joined digest."""

    def __init__(self, paths):
        super().__init__()
        self.paths = iter(paths)
        self.current = None
        self.sha256 = hashlib.sha256()
        self.size = 0

    def readable(self):
        return True

    def readinto(self, buffer):
        while True:
            if self.current is None:
                path = next(self.paths, None)
                if path is None:
                    return 0
                self.current = path.open("rb")
            n = self.current.readinto(buffer)
            if n:
                self.sha256.update(memoryview(buffer)[:n])
                self.size += n
                return n
            self.current.close()
            self.current = None

    def close(self):
        if self.current is not None:
            self.current.close()
        super().close()


def verify_archive(checkout, directory, lock):
    origin = lock["original_archive"]
    entries = git(checkout, "ls-tree", "-rz", origin["archive_commit"]).split(b"\0")
    expected = {}
    for entry in filter(None, entries):
        meta, path = entry.split(b"\t", 1)
        mode, kind, blob = meta.split()
        check(kind, b"blob", path)
        expected[path.decode()] = (mode.decode(), blob.decode())

    parts = [directory / part["filename"] for part in origin["parts"]]
    for path, part in zip(parts, origin["parts"]):
        check(hash_file(path), part["sha256"], str(path))
    checked = 0
    with JoinedParts(parts) as raw, io.BufferedReader(raw) as joined:
        with tarfile.open(fileobj=joined, mode="r|gz") as archive:
            for member in archive:
                if member.isdir():
                    continue
                if not member.isfile():
                    raise ValueError(f"Unexpected archive member: {member.name}")
                path = Path(member.name).as_posix()
                if not path.startswith("lean/"):
                    raise ValueError(f"Unexpected archive path: {path}")
                relative = path[len("lean/"):]
                mode, expected_hash = expected.pop(relative)
                check("100755" if member.mode & 0o111 else "100644", mode, relative)
                content = archive.extractfile(member)
                digest = hashlib.sha1(f"blob {member.size}\0".encode())
                for chunk in iter(lambda: content.read(1 << 16), b""):
                    digest.update(chunk)
                check(digest.hexdigest(), expected_hash, relative)
                checked += 1
        # Read all bytes even if the tar end marker preceded the final gzip trailer.
        while joined.read(1 << 20):
            pass
        check(raw.sha256.hexdigest(), origin["sha256"], "Joined archive SHA-256")
        check(raw.size, origin["bytes"], "Joined archive size")
    check(len(expected), 0, "Git entries missing from archive")
    check(checked, origin["tracked_files"], "Archive member count")
    print(f"All {checked:,} archive files match the original Git tree (path, mode, bytes).")


def verify_olean_manifest(checkout, path, lock):
    manifest = lock["compiled_object_manifest"]
    check(hash_file(path), manifest["sha256"], "Published .olean digest manifest")
    objects = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        digest, filename = line.split(None, 1)
        name = filename.removeprefix("./")
        if name in objects:
            raise ValueError(f"Duplicate compiled module {name}")
        objects[name] = digest
    source_paths = git(checkout, "ls-tree", "-rz", "--name-only", lock["original_archive"]["archive_commit"],
                       "--", "src").decode().split("\0")
    original_objects = {file.removeprefix("src/")[:-5] + ".olean" for file in source_paths if file.endswith(".lean")}
    check(len(objects), manifest["count"], "Compiled module count")
    if original_objects != objects.keys():
        raise ValueError("Compiled module manifest does not match the original source path inventory")
    for name, digest in manifest["selected_objects"].items():
        check(objects[name], digest, name)
    print(f"Matched all {len(objects):,} published compiled module paths to the original source paths.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("checkout", type=Path, help="Pinned Deicyde mirror with the original commit")
    parser.add_argument("--archive-parts", type=Path, help="Directory containing archive.part01 ... archive.part14")
    parser.add_argument("--mathlib", type=Path, help="Pinned Mathlib checkout with the cited files available")
    parser.add_argument("--secondary", type=Path, help="Second mirror with its pinned tree available")
    parser.add_argument("--evidence", type=Path, help="Local report, announcement and verification logs")
    parser.add_argument("--independent-audit", type=Path,
                        help="Directory of files from the second compiled-solution audit, using the manifest filenames")
    parser.add_argument("--olean-manifest", type=Path, help="Published project-oleans.sha256 from the MIT report")
    args = parser.parse_args()
    lock = json.loads(LOCK.read_text(encoding="utf-8"))
    primary = lock["primary_mirror"]
    check(git(args.checkout, "rev-parse", "HEAD").decode().strip(), primary["commit"], "Mirror commit")
    check(git(args.checkout, "rev-parse", "HEAD^{tree}").decode().strip(), primary["tree"], "Mirror tree")
    origin = lock["original_archive"]
    check(git(args.checkout, "rev-parse", origin["archive_commit"] + ":src").decode().strip(),
          origin["src_tree"], "Original source tree")
    for name, expected in primary["source_files_sha256"].items():
        check(hash_file(args.checkout / name), expected, name)
    print(f"Checked the mirror revision and {len(primary['source_files_sha256'])} materialized files.")
    if args.secondary:
        secondary = lock["secondary_mirror"]
        check(git(args.secondary, "rev-parse", "HEAD").decode().strip(), secondary["commit"], "Second mirror")
        check(git(args.secondary, "rev-parse", "HEAD:src").decode().strip(), origin["src_tree"], "Second mirror src")
        print("Both mirrors share the original Git source tree (before Challenge.lean).")
    if args.mathlib:
        mathlib = lock["mathlib"]
        check(git(args.mathlib, "rev-parse", "HEAD").decode().strip(), mathlib["commit"], "Mathlib")
        for name, expected in mathlib["files_sha256"].items():
            check(hash_file(args.mathlib / name), expected, name)
        print("Checked the Mathlib revision and definition files.")
    if args.evidence:
        for item in lock["retrieved_evidence"]:
            check(hash_file(args.evidence / item["filename"]), item["sha256"], item["filename"])
        print("Checked the downloaded report, public logs, checksum manifest and announcement.")
    if args.independent_audit:
        audit = lock["independent_compiled_audit"]
        for item in audit["files"]:
            check(hash_file(args.independent_audit / item["filename"]), item["sha256"], item["filename"])
        closure = audit["module_closure"]
        with gzip.open(args.independent_audit / "main_closure.txt.gz", "rb") as stream:
            body = stream.read()
        check(hashlib.sha256(body).hexdigest(), closure["decompressed_sha256"], "Compiled module list")
        check(len(body.splitlines()), closure["count_including_external_modules"], "Compiled module count")
        print("Checked the independent audit files and the decompressed module list.")
    if args.archive_parts:
        verify_archive(args.checkout, args.archive_parts, lock)
    if args.olean_manifest:
        verify_olean_manifest(args.checkout, args.olean_manifest, lock)


if __name__ == "__main__":
    main()
