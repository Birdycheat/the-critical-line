"""Index the verified archive for line-based lookup without extracting its many files."""
import argparse
from contextlib import closing
import io
import json
from pathlib import Path
import re
import sqlite3
import tarfile
import tempfile

from verify_sources import JoinedParts, LOCK, check


DECLARATION = re.compile(
    rb"(?m)^(?:(?:private|protected|noncomputable|unsafe|partial|scoped|local) )*"
    rb"(?:theorem|lemma|def|abbrev|structure|class|inductive) ([^\s({\[]+)"
)


def make_index(parts, destination):
    archive = json.loads(LOCK.read_text(encoding="utf8"))["original_archive"]
    names = [parts / entry["filename"] for entry in archive["parts"]]
    database = destination / "archive-index.sqlite"
    text = destination / "archive-lean.txt"
    if destination.exists():
        raise FileExistsError("Choose a fresh external directory for the index.")
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=destination.parent) as staging:
        stage = Path(staging) / "index"
        stage.mkdir()
        db = sqlite3.connect(stage / database.name)
        try:
            db.execute("create table files(path text primary key, start integer, size integer)")
            db.execute("create table decl(symbol text, file text, line integer)")
            with (stage / text.name).open("wb") as output, JoinedParts(names) as raw, io.BufferedReader(raw) as joined:
                with tarfile.open(fileobj=joined, mode="r|gz") as tar:
                    for member in tar:
                        if not member.isfile() or not member.name.endswith(".lean"):
                            continue
                        name = member.name.removeprefix("lean/")
                        data = tar.extractfile(member).read()
                        output.write(b"\n-- SOURCE " + name.encode() + b"\n")
                        db.execute("insert into files values (?,?,?)", (name, output.tell(), len(data)))
                        output.write(data)
                        start, line = 0, 1
                        for match in DECLARATION.finditer(data):
                            line += data.count(b"\n", start, match.start())
                            start = match.start()
                            symbol = match[1].decode().rsplit(".", 1)[-1]
                            db.execute("insert into decl values (?,?,?)", (symbol, name, line))
                while joined.read(1 << 20):
                    pass
                check(raw.sha256.hexdigest(), archive["sha256"], "Joined archive SHA-256")
            db.execute("create index idx_symbol on decl(symbol)")
            db.commit()
        finally:
            db.close()
        stage.rename(destination)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    actions = parser.add_subparsers(dest="action", required=True)
    build = actions.add_parser("build", help="Build the optional research index from the original archive")
    build.add_argument("parts", type=Path, help="Directory containing the fourteen original archive parts")
    build.add_argument("destination", type=Path, help="New external working directory for the large index")
    find = actions.add_parser("find", help="Find candidate declarations by their unqualified name")
    find.add_argument("index", type=Path)
    find.add_argument("symbol")
    read = actions.add_parser("read", help="Read an inclusive range of original source lines")
    read.add_argument("index", type=Path)
    read.add_argument("path")
    read.add_argument("first", type=int)
    read.add_argument("last", type=int)
    options = parser.parse_args()
    if options.action == "build":
        make_index(options.parts, options.destination)
    else:
        uri = (options.index.resolve() / "archive-index.sqlite").as_uri() + "?mode=ro"
        with closing(sqlite3.connect(uri, uri=True)) as db:
            if options.action == "find":
                for name, number in db.execute("select file,line from decl where symbol=? order by file,line", (options.symbol,)):
                    print(f"{name}:{number}")
            else:
                record = db.execute("select start,size from files where path=?", (options.path,)).fetchone()
                if record is None:
                    parser.error("Source path absent from the index.")
                with (options.index / "archive-lean.txt").open("rb") as source:
                    source.seek(record[0])
                    lines = source.read(record[1]).decode().splitlines()
                if not 1 <= options.first <= options.last <= len(lines):
                    parser.error(f"Choose lines between 1 and {len(lines)}.")
                for number in range(options.first, options.last + 1):
                    print(f"{number:4}  {lines[number - 1]}")
