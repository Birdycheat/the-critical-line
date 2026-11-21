"""Find the direct named references of declarations in a compact lean4export 3.1 NDJSON file.

Example: python -B scripts/export_dependencies.py solution.ndjson riemannHypothesis rhOfAll
For a batch use --names-file names.txt (one name per line) and optionally --allow-missing.
Pass --sha256 HEX to also read and verify the entire uncompressed stream.
The export must already be decompressed on external storage. No index is written.
"""

import argparse
from array import array
from bisect import bisect_right
from functools import lru_cache
import hashlib
import json
from pathlib import Path
import re
import sys
import time

from verify_target_terms import TermReader, require


BLOCK_SIZE = 512 * 1024
DECLARATION = re.compile(rb'^\{"(def|thm|opaque|axiom|quot|inductive)":')


class SparseTable:
    """One entry per block containing records in this increasing ID sequence."""

    def __init__(self, index, marker, first_id):
        self.index = index
        self.marker = marker
        self.pattern = re.compile(re.escape(marker) + rb'([0-9]+)(?=[,}])')
        self.first = array("Q")
        self.blocks = array("Q")
        self.next_id = first_id

    def add(self, block_id, data):
        start = data.find(self.marker)
        if start < 0:
            return
        first = int(self.pattern.match(data, start)[1])
        last = int(self.pattern.match(data, data.rfind(self.marker))[1])
        require(first == self.next_id and last >= first, f"Discontinuous {self.marker!r} sequence at {first}")
        self.next_id = last + 1
        self.first.append(first)
        self.blocks.append(block_id)

    @lru_cache(maxsize=32)
    def offsets(self, slot):
        data = self.index.block(self.blocks[slot])
        rows = array("Q")
        for match in self.pattern.finditer(data):
            require(int(match[1]) == self.first[slot] + len(rows), "Unordered expression or name IDs")
            rows.append(data.rfind(b"\n", 0, match.start()) + 1)
        return rows

    def __getitem__(self, key):
        slot = bisect_right(self.first, key) - 1
        require(slot >= 0 and key < self.next_id, f"Missing {self.marker!r} index {key}")
        return self.index.boundaries[self.blocks[slot]] + self.offsets(slot)[key - self.first[slot]]


def candidates(data, pattern):
    """A match can occur inside an expression or another record; yield full rows once."""
    previous = -1
    for match in pattern.finditer(data):
        if match.start() < previous:
            continue
        start = data.rfind(b"\n", 0, match.start()) + 1
        end = data.find(b"\n", match.end())
        previous = len(data) if end < 0 else end
        yield start, data[start:previous]


def name_fields(names):
    # Match whole string components, including escaped UTF-8 source characters.
    # The export's Name.num and Name.str are distinct; a reported numeric segment
    # uses its decimal spelling, as in the challenge verifier.
    fields = set()
    for name in names:
        component = name.rsplit(".", 1)[-1]
        fields.add(re.escape(b'"str":' + json.dumps(component, ensure_ascii=False).encode()))
        if component.isascii() and component.isdecimal():
            fields.add(b'"i":' + component.encode() + rb'(?=[,}])')
    return re.compile(b"|".join(sorted(fields)))


def declaration_entries(kind, info):
    if kind == "inductive":
        for field, label in (("types", "inductive"), ("ctors", "constructor"), ("recs", "recursor")):
            for item in info[field]:
                yield label, item
    else:
        yield kind, info


class ExportReader(TermReader):
    def __init__(self, stream):
        self.stream = stream
        self.boundaries = array("Q", [0])
        self.names = SparseTable(self, b'"in":', 1)
        self.expressions = SparseTable(self, b'"ie":', 0)
        self.name_cache = {0: ""}

    @lru_cache(maxsize=32)
    def block(self, block_id):
        start, end = self.boundaries[block_id:block_id + 2]
        self.stream.seek(start)
        return self.stream.read(end - start)

    def scan(self, source, targets, expected):
        meta = json.loads(source.readline()).get("meta", {})
        require(meta.get("format", {}).get("version") == "3.1.0", "Expected a compact lean4export 3.1.0 NDJSON file")
        source.seek(0)
        component_pattern = name_fields(targets)
        wanted_ids, declarations = {}, {}
        name_pattern = None
        digest = hashlib.sha256() if expected else None
        line_number = 1
        while data := source.read(BLOCK_SIZE):
            if not data.endswith(b"\n"):
                data += source.readline()
            start = self.boundaries[-1]
            block_id = len(self.boundaries) - 1
            self.boundaries.append(start + len(data))
            self.names.add(block_id, data)
            self.expressions.add(block_id, data)
            if digest:
                digest.update(data)
            if len(declarations) < len(targets):
                for _, raw in candidates(data, component_pattern):
                    if not raw.startswith(b'{"in":'):
                        continue
                    key = json.loads(raw)["in"]
                    if len(self.name_cache) > 8192:
                        self.name_cache = {0: ""}
                    name = self.name(key)
                    if name in targets:
                        require(name not in wanted_ids, f"Ambiguous requested name {name!r}")
                        wanted_ids[name] = key
                        name_pattern = re.compile(rb'"name":(?:' + b"|".join(str(n).encode() for n in wanted_ids.values()) + rb')(?=[,}])')
                if name_pattern is not None:
                    for offset, raw in candidates(data, name_pattern):
                        marker = DECLARATION.match(raw)
                        if marker is None:
                            continue
                        kind = marker[1].decode()
                        for label, item in declaration_entries(kind, json.loads(raw)[kind]):
                            if item["name"] not in wanted_ids.values():
                                continue
                            name = self.name(item["name"])
                            require(name not in declarations, f"Duplicate declaration {name}")
                            declarations[name] = (label, item, start + offset, line_number + data.count(b"\n", 0, offset))
            line_number += data.count(b"\n")
            if len(declarations) == len(targets) and not digest:
                break
        if digest:
            require(digest.hexdigest() == expected.lower(), "Uncompressed SHA-256 differs")
        return meta, declarations

    def references(self, expression):
        nodes, names = self.inspect(expression)
        return {"expression_id": expression, "distinct_nodes": nodes, "constants": names}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("export", type=Path)
    parser.add_argument("names", nargs="*", help="Full dot-separated declaration name(s)")
    parser.add_argument("--names-file", type=Path, action="append", default=[],
                        help="One full name per UTF-8 line. Blank lines and lines starting with # are ignored.")
    parser.add_argument("--allow-missing", action="store_true",
                        help="Return success even when named declarations are absent. JSON always lists missing names.")
    parser.add_argument("--sha256", help="Expected SHA-256 of the complete uncompressed NDJSON")
    args = parser.parse_intermixed_args()
    if args.sha256 and not re.fullmatch(r"[0-9a-fA-F]{64}", args.sha256):
        parser.error("--sha256 requires 64 hexadecimal digits for the uncompressed file")
    started = time.perf_counter()
    before = args.export.stat()
    names = list(args.names)
    for filename in args.names_file:
        lines = (line.strip() for line in filename.read_text(encoding="utf-8-sig").splitlines())
        names.extend(line for line in lines if line and not line.startswith("#"))
    names = list(dict.fromkeys(names))
    if not names:
        parser.error("Supply at least one declaration name or a nonempty --names-file")
    with args.export.open("rb") as scanner, args.export.open("rb") as random_access:
        reader = ExportReader(random_access)
        meta, declarations = reader.scan(scanner, set(names), args.sha256)
        seconds = time.perf_counter() - started
        result = {}
        missing = [name for name in names if name not in declarations]
        for name in names:
            if name not in declarations:
                continue
            kind, info, offset, line = declarations[name]
            entry = {"kind": kind, "name_id": info["name"], "line": line, "byte_offset": offset,
                     "type": reader.references(info["type"]),
                     "value": reader.references(info["value"]) if "value" in info else None}
            if kind == "recursor":
                entry["rules"] = [{"constructor": reader.name(rule["ctor"]), "rhs": reader.references(rule["rhs"])}
                                  for rule in info["rules"]]
            result[name] = entry
        after = args.export.stat()
        require((before.st_size, before.st_mtime_ns) == (after.st_size, after.st_mtime_ns),
                "Input file changed during inspection")
        print(json.dumps({"format": meta, "input_file": str(args.export.resolve()), "file_size": before.st_size,
                          "scanned_bytes": reader.boundaries[-1], "complete_scan": reader.boundaries[-1] == before.st_size,
                          "reference_semantics": "Direct constant nodes and projection structure names. Named definitions are not unfolded.",
                          "requested_names": names, "missing_names": missing,
                          "verified_sha256": args.sha256, "scan_seconds": round(seconds, 3),
                          "total_seconds": round(time.perf_counter() - started, 3), "declarations": result},
                         indent=2, ensure_ascii=False))
        if missing and not args.allow_missing:
            sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError) as err:
        sys.exit(str(err))
