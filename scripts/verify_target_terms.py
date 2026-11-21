"""Inspect the five target types in the independent Lean challenge NDJSON."""

import argparse
from array import array
import hashlib
import json
from pathlib import Path
import re


BOOK = Path(__file__).resolve().parents[1]
EXPR_ID = re.compile(rb'"ie":([0-9]+)')
NAME_ID = re.compile(rb'"in":([0-9]+)')


def require(condition, message):
    if not condition:
        raise ValueError(message)


class TargetIndex:
    """Offset tables keep the multi-million-node export on disk."""

    def __init__(self, stream, lines, sha256):
        self.stream = stream
        self.expressions = array("Q")
        self.names = array("Q", [0])
        self.declarations = {}
        self.name_cache = {0: ""}
        position = 0
        digest = hashlib.sha256()
        for line_no, raw in enumerate(stream, 1):
            digest.update(raw)
            if line_no in lines:
                self.declarations[line_no] = json.loads(raw)
            if b'"ie":' in raw:
                number = int(EXPR_ID.search(raw)[1])
                require(number == len(self.expressions), f"Unexpected expression index {number}")
                self.expressions.append(position)
            elif b'"in":' in raw:
                number = int(NAME_ID.search(raw)[1])
                require(number == len(self.names), f"Unexpected name index {number}")
                self.names.append(position)
            position += len(raw)
        require(digest.hexdigest() == sha256, "Wrong challenge SHA-256")

    def node(self, offset):
        self.stream.seek(offset)
        return json.loads(self.stream.readline())

    def name(self, key):
        if key not in self.name_cache:
            record = self.node(self.names[key])
            value = record.get("str") or record["num"]
            prefix = self.name(value["pre"])
            last = value["str"] if "str" in value else str(value["i"])
            self.name_cache[key] = f"{prefix}.{last}" if prefix else last
        return self.name_cache[key]

    def inspect(self, expr):
        """Follow subexpression edges without recursively unfolding the named constants."""
        pending = [expr]
        seen, constants = set(), set()
        while pending:
            key = pending.pop()
            if key in seen:
                continue
            seen.add(key)
            record = self.node(self.expressions[key])
            require(record.pop("ie") == key, f"Missing expression {key}")
            ((kind, value),) = record.items()
            if kind == "const":
                constants.add(self.name(value["name"]))
            elif kind == "app":
                pending.extend([value["fn"], value["arg"]])
            elif kind in {"forallE", "lam"}:
                pending.extend([value["body"], value["type"]])
            elif kind == "letE":
                pending.extend([value["body"], value["type"], value["value"]])
            elif kind == "proj":
                pending.append(value["struct"])
                constants.add(self.name(value["typeName"]))
            elif kind not in {"natVal", "strVal", "bvar", "sort"}:
                raise ValueError(f"Unsupported expression kind {kind!r} at {key}")
        return len(seen), sorted(constants)


def inspect_targets(stream, book):
    lines = set()
    for target in book["targets"]:
        ref = target["challenge_export"]
        lines.update([ref["theorem_record_line"], ref["proposition_definition_line"]])
    index = TargetIndex(stream, lines, book["challenge_export"]["uncompressed_sha256"])
    results = {}
    for target in book["targets"]:
        ref = target["challenge_export"]
        theorem = index.declarations[ref["theorem_record_line"]]["thm"]
        prop = index.declarations[ref["proposition_definition_line"]]["def"]
        name = target["declaration"]
        require(index.name(theorem["name"]) == name, f"Wrong theorem at {name}")
        require(index.name(prop["name"]) == target["type"], f"Wrong proposition at {name}")
        require(theorem["type"] == ref["type_expression_id"], f"Wrong type ID at {name}")
        require(prop["value"] == ref["proposition_value_expression_id"], f"Wrong proposition body at {name}")
        type_node = index.node(index.expressions[theorem["type"]])
        require(type_node["const"] == {"name": prop["name"], "us": []}, f"Wrong type expression at {name}")
        size, constants = index.inspect(prop["value"])
        _, proof_constants = index.inspect(theorem["value"])
        require("sorryAx" in proof_constants, f"Expected a challenge placeholder at {name}")
        result = {"distinct_body_subexpressions": size, "direct_body_constants": constants}
        stored = ref.get("inspected_body")
        if stored:
            require(result == stored, f"Body inspection differs from targets.json at {name}")
        results[name] = result
    return results


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("challenge", type=Path, help="Uncompressed challenge.ndjson from the verification report")
    parser.add_argument("--json", action="store_true", help="Print all constants occurring in the five bodies")
    args = parser.parse_args()
    book = json.loads((BOOK / "records" / "targets.json").read_text(encoding="utf-8"))
    with args.challenge.open("rb") as stream:
        results = inspect_targets(stream, book)
    if args.json:
        print(json.dumps(results, ensure_ascii=False, indent=2))
    else:
        for name, result in results.items():
            print(f"{name}: {result['distinct_body_subexpressions']} body nodes, "
                  f"{len(result['direct_body_constants'])} named constants")
        print("Five named type references, proposition bodies and challenge placeholders verified.")


if __name__ == "__main__":
    main()
