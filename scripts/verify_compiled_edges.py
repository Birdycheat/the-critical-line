"""Read selected direct theorem edges from single-part Lean 4.33.1 .olean files.

Supply the verified archives and index named in records/compiled_edge_inputs.json.
No Lean imports or project compilation are required. Example:
  python scripts/verify_compiled_edges.py CACHE_DIR --manifest PATH/project-oleans.sha256 --leantar PATH/leantar

The decoder reads only ModuleData.constNames, ModuleData.constants, the
ConstantVal type and definition/theorem value. Its expression traversal follows
Lean/Util/FoldConsts.lean in the pinned Lean source. Projection type names are
separate because Lean's fold visits only the structure expression of a projection.
"""

import argparse
import gzip
import hashlib
import json
import struct
import subprocess
import tarfile
import tempfile
from pathlib import Path

BOOK = Path(__file__).resolve().parents[1]
RECORD = BOOK / "records" / "compiled_edge_inputs.json"
EXPR_ARITY = {4: 2, 5: 2, 6: 3, 7: 3, 8: 4, 10: 2, 11: 3}
CHILD_POSITIONS = {5: (0, 1), 6: (1, 2), 7: (1, 2), 8: (1, 2, 3), 10: (1,), 11: (2,)}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def checked_file(path, expected_hash):
    content = path.read_bytes()
    require(sha(content) == expected_hash, f"Unexpected SHA-256 for {path}")
    return content


class CompactModule:
    """Decode internal compact-region references for the pinned little-endian 64-bit ABI."""

    def __init__(self, data, version, revision):
        self.data = data
        require(data[:7] == b"olean\x02\x01", "Unsupported object format")
        require(data[7:40].rstrip(b"\0") == version.encode("ascii"), "Unexpected Lean version")
        require(data[40:80] == revision.encode("ascii"), "Unexpected Lean source revision")
        self.base, self.root = struct.unpack_from("<QQ", data, 80)
        require(self.base % 8 == 0, "Misaligned compact-region base")

    def offset(self, pointer):
        offset = pointer - self.base
        require(96 <= offset <= len(self.data) - 8 and offset % 8 == 0,
                f"Invalid or external compact-region pointer {pointer:#x}")
        return offset

    def tag(self, pointer):
        return self.data[self.offset(pointer) + 7]

    def args(self, pointer, expected_tag=None):
        position = self.offset(pointer)
        references, size, arity, tag = struct.unpack_from("<IHBB", self.data, position)
        require(references == 0 and tag < 240 and 8 + 8 * arity <= size <= len(self.data) - position,
                f"Invalid constructor at {position}")
        require(expected_tag is None or tag == expected_tag, f"Unexpected constructor at {position}")
        return struct.unpack_from(f"<{arity}Q", self.data, position + 8)

    def array(self, pointer):
        position = self.offset(pointer)
        require(self.tag(pointer) == 246, f"Expected array at {position}")
        length, capacity = struct.unpack_from("<QQ", self.data, position + 8)
        require(length == capacity and length <= (len(self.data) - position - 24) // 8,
                f"Invalid compact array at {position}")
        return struct.unpack_from(f"<{length}Q", self.data, position + 24)

    def string(self, pointer):
        position = self.offset(pointer)
        require(self.tag(pointer) == 249, f"Expected string at {position}")
        size, capacity, chars = struct.unpack_from("<QQQ", self.data, position + 8)
        end = position + 32 + size
        require(0 < size <= capacity and end <= len(self.data) and self.data[end - 1] == 0,
                f"Invalid string at {position}")
        result = self.data[position + 32:end - 1].decode("utf-8")
        require(len(result) == chars, f"Invalid character count at {position}")
        return result

    def name(self, pointer):
        parts = []
        while pointer != 1:  # Tagged immediate for Name.anonymous.
            tag = self.tag(pointer)
            parent, component = self.args(pointer)
            if tag == 1:
                parts.append(self.string(component))
            elif tag == 2 and component & 1:
                parts.append(str(component >> 1))
            else:
                raise ValueError(f"Unsupported name constructor at {self.offset(pointer)}")
            pointer = parent
        return ".".join(reversed(parts))

    def expression_constants(self, root):
        stack = [root]
        seen = set()
        constants = set()
        projections = set()
        while stack:
            pointer = stack.pop()
            if pointer in seen:
                continue
            seen.add(pointer)
            tag = self.tag(pointer)
            args = self.args(pointer)
            require(0 <= tag <= 11, f"Unknown Expr constructor {tag}")
            require(tag not in EXPR_ARITY or len(args) == EXPR_ARITY[tag], f"Wrong arity for Expr {tag}")
            if tag == 4:  # Expr.const
                constants.add(self.name(args[0]))
            if tag == 11:  # Expr.proj
                projections.add(self.name(args[0]))
            stack.extend(args[i] for i in CHILD_POSITIONS.get(tag, ()))
        return {"expr_const": sorted(constants), "projection_type_names": sorted(projections),
                "distinct_expression_objects": len(seen)}

    def declarations(self, selected):
        _, names, infos, _, _ = self.args(self.root, 0)
        name_list, info_list = self.array(names), self.array(infos)
        require(len(name_list) == len(info_list), "Mismatched declaration arrays")
        result = {}
        for name_ptr, constant_info in zip(name_list, info_list):
            name = self.name(name_ptr)
            if name not in selected:
                continue
            tag = self.tag(constant_info)
            require(tag in (1, 2), f"Expected definition or theorem at {name}")
            value_structure, = self.args(constant_info)
            constant_val, value = self.args(value_structure, 0)[:2]
            name_check, _, type_expr = self.args(constant_val, 0)
            require(name_ptr == name_check and name not in result, f"Name table disagrees at {name}")
            result[name] = {"kind": "definition" if tag == 1 else "theorem",
                            "type": self.expression_constants(type_expr),
                            "value": self.expression_constants(value)}
        require(set(result) == set(selected), f"Missing declarations: {set(selected) - set(result)}")
        return result


def input_module_path(module):
    return module.replace(".", "/") + ".olean"


def bundle_objects(cache_dir, lock, manifest):
    bundle = lock["bundle"]
    archive = cache_dir / bundle["file"]
    checked_file(archive, bundle["sha256"])
    needed = {input_module_path(row["module"]) for row in lock["modules"] if "artifact_file" not in row}
    data = {}
    counts = {"identical": 0, "different": 0}
    with tarfile.open(archive, "r:gz") as tar:
        for member in tar:
            if not member.isfile():
                continue
            prefix = "alp-oleans/lib/"
            require(member.name.startswith(prefix), "Unexpected bundle member")
            key = member.name[len(prefix):]
            content = tar.extractfile(member).read()
            counts["identical" if sha(content) == manifest[key] else "different"] += 1
            if key in needed:
                require(key not in data, f"Duplicate bundle member {key}")
                data[key] = content
    require(set(data) == needed, "Bundle does not contain all selected modules")
    return data, counts


def cached_objects(cache_dir, lock, leantar):
    info = lock["module_cache"]
    index = cache_dir / info["index_file"]
    checked_file(index, info["index_sha256"])
    selected = {row["module"]: row for row in lock["modules"] if "artifact_file" in row}
    records = {}
    with gzip.open(index, "rt", encoding="utf8") as stream:
        metadata = json.loads(next(stream))
        require(metadata["toolchain"] == "leanprover/lean4:v" + lock["lean_version"], "Index toolchain mismatch")
        for line in stream:
            name, trace_hash, member, digest = json.loads(line)
            if name in selected:
                require(name not in records, f"Duplicate cache version for {name}")
                records[name] = (trace_hash, member, digest)
    require(set(records) == set(selected), "Missing module in publisher index")
    payload = []
    result = {}
    with tempfile.TemporaryDirectory(prefix="grh-compiled-edges-") as temp:
        bases = [Path(temp) / str(i) for i in range(4)]
        for base in bases:
            base.mkdir()
        for name, row in selected.items():
            trace_hash, member, digest = records[name]
            require(member == Path(row["artifact_file"]).with_suffix(".ltar").name and
                    digest == row["artifact_sha256"], f"Publisher index disagrees for {name}")
            artifact = (cache_dir / row["artifact_file"]).resolve()
            checked_file(artifact, digest)
            payload.append({"file": str(artifact), "base": list(map(str, bases)), "hash": trace_hash})
        subprocess.run([str(leantar), "-x", "-j", "-"], input=json.dumps(payload).encode(), check=True)
        for name in selected:
            result[input_module_path(name)] = (bases[0] / (name.split(".")[-1] + ".olean")).read_bytes()
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("cache_dir", type=Path, help="Directory holding the named tarball, index and four .art files")
    parser.add_argument("--manifest", required=True, type=Path, help="Published MIT project-oleans.sha256")
    parser.add_argument("--leantar", default="leantar", help="Executable supporting LTR4 and -x -j - (tested with 0.1.20)")
    args = parser.parse_args()
    lock = json.loads(RECORD.read_text(encoding="utf8"))
    raw_manifest = checked_file(args.manifest, lock["object_manifest"]["sha256"]).decode()
    manifest = {path.removeprefix("./"): digest for digest, path in (line.split() for line in raw_manifest.splitlines())}
    data, counts = bundle_objects(args.cache_dir, lock, manifest)
    data.update(cached_objects(args.cache_dir, lock, args.leantar))
    modules = {}
    for row in lock["modules"]:
        key = input_module_path(row["module"])
        content = data[key]
        digest = sha(content)
        require(digest == row["sha256"], f"Unexpected extracted .olean SHA-256 for {key}")
        reader = CompactModule(content, lock["lean_version"], lock["lean_revision"])
        modules[row["module"]] = {"object_sha256": digest, "mit_manifest_sha256": manifest[key],
                                  "matches_mit": digest == manifest[key], "bytes": len(content),
                                  "declarations": reader.declarations(row["declarations"])}
    print(json.dumps({"lean_revision": lock["lean_revision"], "bundle_comparison": counts,
                      "modules": modules}, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
