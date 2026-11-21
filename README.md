# The Critical Line

An English-language, independent web monograph on the RH and Dirichlet GRH formalization announced by Levent Alpöge, working with Claude. Open [the book](index.html) directly, including offline. [STATE.md](STATE.md) gives the present mathematical scope and the continuation point.

## Rebuild and read

Use Node.js 22.22.1 and Python 3.10.11 (standard libraries). The site has no runtime dependencies. The static build lets the proof text, native MathML, numbered citations, diagrams, and expanded print edition work from disk. Interactive controls load when their figures approach the viewport.

```powershell
node scripts/build.cjs
node scripts/check.cjs
python -m http.server 8744 --bind 127.0.0.1
```

Open [the local reading room](http://127.0.0.1:8744/). Direct-file reading uses the same pages. Browser printing from `print.html` includes default figure states, worked solutions, mathematical statements, glossary and bibliography. On screen, technical source links appear in closed correspondence panels.

## Editorial template

The six pages use Andréa Gourion’s *L’article vivant* template, release 55. The running head, article opener, numbered sections, simplex mark and copper line drawings come from the same site design. The monograph sets its text in Latin Modern Roman and its mathematics in Latin Modern Math on screen and in print. The standalone frontispiece embeds a subset of the same math font for its labels. The provenance and original file hashes are in [the template record](records/template.json). Navigation is specific to the monograph. Font licensing accompanies the local font files.

## Source and content

- `content/` contains the original chapter fragments. `records/edition.json` orders the chapters and supplies notation and bibliography. In `records/background_theorems.json`, each cited background theorem has a statement, an application, a source locator and links to its uses. Write proof-specific results with their hypotheses in the manuscript and result ledger. Keep all formal names, source links and code in correspondence disclosures.
- `records/corpus.json` freezes the formal corpus, original archive, Mathlib, dependency lock and published evidence. Claim files and `records/route.json` document scopes, dependencies, source locations and reconstruction status.
- `assets/labs.js` shares one computation between static rendering and live figures. `scripts/plate.cjs` generates the critical-strip frontispiece. Figure domains, methods, numerical error treatment and defaults are data, stored beside the mathematical routines.
- `scripts/verify_sources.py` checks the original archive and both mirrors. `scripts/check_citations.py` verifies line ranges in pinned source. The inputs and local paths used for this edition are in [STATE.md](STATE.md).
- `scripts/browser-check.cjs` exercises keyboard controls, share links, offline defaults, print and responsive layouts. It accepts a locally installed Playwright module and an output directory for temporary browser artifacts.

To reproduce the source checks on another machine, use the repository URLs, commits, archive-part URLs and hashes in `records/corpus.json`. Keep downloaded research data in an external directory. The citation check can read Git objects directly from the pinned checkouts. With the fourteen original parts already present, `python -B scripts/index_sources.py build PATH_TO_PARTS NEW_EXTERNAL_DIRECTORY` builds the optional full-text index for faster lookups. The matching `find` and `read` commands appear in [STATE.md](STATE.md).

For the direct dependency comparison, download the compressed solution to external storage and verify the compressed SHA-256 in [the selected-term record](records/solution_terms.json). Run `zstd -d --long=30 solution.ndjson.zst` there. The following commands rerun the selection from the repository root. Set `$grhEvidence` to the external directory containing the unpacked solution.

```powershell
$record = Get-Content -Raw records/solution_terms.json | ConvertFrom-Json
$selection = @($record.selected_declarations.PSObject.Properties.Name) + @($record.missing_names)
$selection | Set-Content -Encoding utf8 (Join-Path $grhEvidence 'selection.txt')
python -B -X utf8 scripts/export_dependencies.py (Join-Path $grhEvidence 'solution.ndjson') --sha256 $record.uncompressed_sha256 --names-file (Join-Path $grhEvidence 'selection.txt') --allow-missing
```

The reader verifies the full uncompressed SHA-256 and separately lists direct names in the type and value of each selected declaration. The [compiled-object comparison](records/compiled_edge_comparison.json) gives the input objects, commands and fingerprints from the second reader. The site check also compares those fingerprints with the stored export data.

Original formalization, author announcement, Mathlib, and external verification logs are linked with attribution. Computational evidence and exposition review are recorded independently.
