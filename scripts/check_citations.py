"""Compare every pinned HTML citation to the independent archive index or a pinned checkout."""
import argparse
import json
import re
import sqlite3
from functools import lru_cache
from html.parser import HTMLParser
from pathlib import Path
from subprocess import check_output
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = set()
        self.disclosures = []
        self.silent = 0

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag in ("script", "style"):
            self.silent += 1
        if tag == "details":
            technical = "correspondence" in attributes.get("class", "").split()
            if technical and "open" in attributes:
                raise ValueError("Formal correspondence opens by default")
            self.disclosures.append(technical)
        url = attributes.get("href", "")
        if url:
            self.links.add(url)
        if not any(self.disclosures) and (tag == "code" or
                re.search(r'github\.com/(Deicyde/riemann-hypothesis|leanprover-community/mathlib4)\b|\.lean(?:#|$)', url, re.I)):
            raise ValueError(f"Formal source in ordinary reading at line {self.getpos()[0]}: {url or tag}")

    def handle_data(self, text):
        if not self.silent and not any(self.disclosures) and re.search(
                r'\b(?:Lean|Mathlib|riemannHypothesis|GlobalTheory|Count5|CountV|VWin|Row0b|link_gl)\b', text):
            raise ValueError(f"Formal vocabulary in ordinary reading at line {self.getpos()[0]}: {text[:170]}")

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.silent -= 1
        if tag == "details":
            self.disclosures.pop()

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('mirror',type=Path)
    p.add_argument('mathlib',type=Path)
    p.add_argument('--index',type=Path,help='Directory containing archive-index.sqlite and archive-lean.txt')
    args = p.parse_args()
    corpus = json.loads((ROOT/'records/corpus.json').read_text('utf8'))
    repos = {(v.get('url') or v['repo']).removeprefix('https://github.com/').rstrip('/'): (repo,v['commit']) for v,repo in [(corpus['primary_mirror'],args.mirror),(corpus['mathlib'],args.mathlib)]}
    for repo, rev in repos.values():
        assert check_output(['git','-C',str(repo),'rev-parse','HEAD'],text=True).strip()==rev
    links=Links()
    for page in ROOT.glob('*.html'):
        try:
            links.feed(page.read_text('utf8'))
            if links.disclosures:
                raise ValueError("Unclosed disclosure")
        except ValueError as error:
            raise ValueError(f"{page.name}: {error}") from error
    written_calls = []
    declaration_sites = []
    for file in (ROOT/'records').glob('*.json'):
        record = json.loads(file.read_text('utf8'))
        written_calls.extend((file.name, call) for call in record.get('written_source_calls', []))
        for claim in record.get('claims', []):
            for source in claim.get('sources', []):
                if isinstance(source, dict) and 'declaration_lines' in source:
                    declaration_sites.append((file.name, source))
        links.links.update(re.findall(r'https://github\.com/[^\s"<>]+/blob/[a-f0-9]{40}/[^\s"<>]+\.lean(?:#L\d+(?:-L\d+)?)?',file.read_text('utf8')))
    ix=sqlite3.connect((args.index/'archive-index.sqlite').as_uri()+'?mode=ro',uri=True) if args.index else None
    @lru_cache(maxsize=None)
    def lines(repo,pin,name):
        if ix and repo==args.mirror and name.startswith('src/') and name not in ('src/Challenge.lean',):
            record=ix.execute('select start,size from files where path=?',(name,)).fetchone()
            if record:
                with (args.index/'archive-lean.txt').open('rb') as f:
                    f.seek(record[0])
                    return f.read(record[1]).decode().splitlines()
        return check_output(['git','-C',str(repo),'show',pin+':'+name]).decode().splitlines()
    count=0
    errors=[]
    for url in sorted(links.links):
        m=re.fullmatch(r'https://github\.com/([^/]+/[^/]+)/blob/([^/]+)/([^#?]+)(?:#L(\d+)(?:-L(\d+))?)?',url)
        if not m or m[1] not in repos:
            continue
        repo,expected=repos[m[1]]
        if m[2]!=expected: raise ValueError('Unpinned reference '+url)
        src=lines(repo,expected,unquote(m[3]))
        a,b=int(m[4] or 1),int(m[5] or m[4] or 1)
        if not (1<=a<=b<=len(src)): errors.append(f'Outside {len(src)} lines: {url}')
        count+=1
    # A written name can be namespace-qualified in the ledger and unqualified
    # in Lean. Match its complete final identifier, including any trailing prime.
    primary = corpus['primary_mirror']['url'].removeprefix('https://github.com/').rstrip('/')
    exact_spellings = 0
    for filename, call in written_calls:
        site = call['callsite']
        repo, pin = repos[site.get('repository', primary)]
        if site.get('commit', pin) != pin:
            errors.append(f"{filename}: unexpected revision for {site['path']}")
            continue
        source_lines = lines(repo, pin, site['path'])
        line = site['line']
        identifier = call['callee'].rsplit('.', 1)[-1]
        pattern = rf"(?<![\w']){re.escape(identifier)}(?![\w'])"
        if 'spelling' in site:
            spelling = site['spelling']
            if spelling.rsplit('.', 1)[-1] != identifier:
                errors.append(f"{filename}: {spelling} does not name {identifier}")
            pattern = rf"(?<![\w'.]){re.escape(spelling)}(?![\w'])"
            exact_spellings += 1
        if not 1 <= line <= len(source_lines) or not re.search(pattern, source_lines[line - 1]):
            errors.append(f"{filename}: {identifier} missing at {site['path']}:{line}")
    checked_heads = 0
    for filename, source in declaration_sites:
        repo, pin = repos[source.get('repository', primary)]
        source_lines = lines(repo, pin, source['path'])
        names = [source['declaration'], *source.get('related_declarations', [])]
        if set(names) != set(source['declaration_lines']):
            errors.append(f"{filename}: incomplete set of declaration lines for {source['path']}")
            continue
        for name, number in source['declaration_lines'].items():
            pattern = r"\b(?:theorem|lemma|def|abbrev|structure|class|inductive)\s+([\w'.]+)"
            valid_line = 1 <= number <= min(len(source_lines), source['lines'][1])
            head = re.search(pattern, source_lines[number-1]) if valid_line else None
            written_name = head[1].removeprefix('_root_.') if head else ''
            if not written_name or not (name == written_name or name.endswith('.' + written_name)):
                errors.append(f"{filename}: declaration {name} missing at {source['path']}:{number}")
            checked_heads += 1
    if errors: raise ValueError('\n'.join(errors))
    print(f'Checked {count} pinned URLs and their line ranges, and {len(written_calls)} written call names at the recorded source lines. Checked {exact_spellings} complete call-site spellings and {checked_heads} recorded declaration locations.')
if __name__=='__main__':main()
