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
    def handle_starttag(self, tag, attrs):
        self.links.update(v for k,v in attrs if k == 'href' and v)

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
        links.feed(page.read_text('utf8'))
    for file in (ROOT/'records').glob('*.json'):
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
    if errors: raise ValueError('\n'.join(errors))
    print(f'Found every cited source and checked {count} pinned URLs and their line ranges.')
if __name__=='__main__':main()
