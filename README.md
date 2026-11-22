# The Critical Line

An English-language (with a [French doorway](explorer.html)), open collaborative web monograph reconstructing the human-readable mathematics of the Riemann Hypothesis and Dirichlet GRH formalization announced by Levent Alpöge, working with Claude — directed and edited by **Andréa Gourion**.

- **Three reading tracks on [the home page](index.html)**:
  1. **Analytical Skeleton (~45 min · L3/M1)**: Chapters 1 → 2 → 7 → 9 → 10, following a hypothetical off-line zero to contradiction while treating the arithmetic boxes as stated inputs.
  2. **Specialist Route — Novel Proof Core (`core-argument`)**: Direct navigation and [filtered atlas view](atlas.html?role=core-argument#ledger) isolating the proof’s genuinely new mechanisms from rebuilt classical background.
  3. **Complete Self-Contained Reconstruction (`core-argument` + `rebuilt-infrastructure`)**: All ten [fast standalone chapters](chapter-01.html), [single-page monograph](book.html), and [91+ interactive experiments](experiments.html), with classical infrastructure rebuilt inside the formal archive explicitly labeled.
- **Two factual audit counters (no unweighted percentages)**:
  1. **Formal archive coverage**: 7,272+ inspected exported declarations, 1,912+ verified compiled proof-value paths, and 7,685+ pinned `.lean` source ranges on `Deicyde/riemann-hypothesis@e50d098` across the 14 archive parts (175,187 compiled modules).
  2. **Pedagogical graph status**: 830+ self-contained M2-level mathematical nodes alongside ~28 pinned formal-boundary interfaces (kernel-verified in the compiled Lean export, open for human specialist translation).
- **Contribute across three tiers**: Open [Contribute (`contribute.html`)](contribute.html) for **Tier A** (M1/M2+ mathematical audit & proof simplification), **Tier B** (`Lean ↔ Prose` hypothesis fidelity check with persistent Formal Audit Mode), and **Tier C** (unfolding deep `outstanding` formal interfaces). See [CONTRIBUTING.md](CONTRIBUTING.md).
- **License**: Original prose, mathematical reconstructions, figures, and interactive labs © 2026 Andréa Gourion and contributors, licensed under **[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.en)** ([LICENSE.md](LICENSE.md)).

## Rebuild and verify locally

Use Node.js ≥ 22 and Python ≥ 3.10 (standard libraries only; zero npm runtime or build dependencies).

```powershell
node scripts/build.cjs
node scripts/check.cjs
python -m http.server 8744 --bind 127.0.0.1
```

Open [the local reading room](http://127.0.0.1:8744/). Desktop printing from `print.html` (~945 A4 pages) includes `[ID]` passage cross-references (`[PIL-06]`, `[KRL-01]`) and prints primary formal declaration identifiers and source paths in the `#results` appendix while keeping chapter prose clean. On mobile devices, prefer the fast standalone chapters (`chapter-01.html`–`chapter-10.html`) or pre-compiled PDF releases.

## Clean automated deployment via GitHub Pages

Pushing to GitHub automatically runs [.github/workflows/pages.yml](.github/workflows/pages.yml):
1. Builds all 18 static pages with live repository URLs (`GITHUB_REPOSITORY` and `SITE_URL`).
2. Runs standalone mathematical, dependency-DAG, anchor, and numerical checks (`node scripts/check.cjs`) plus formal-vocabulary separation across all generated HTML pages.
3. Stages a clean `_site/` artifact (generated HTML, `assets/`, `records/`, `LICENSE.md`, `CONTRIBUTING.md`, excluding internal working notes) and deploys to **GitHub Pages**.

## Source and modular structure

- `content/` contains the 10 chapter roots and **350+ modular HTML fragments** (`*.fragment.html`).
- `records/` freezes the formal corpus (`corpus.json`), metadata (`edition.json`), cited classical literature (`background_theorems.json`), target theorems (`targets.json`), conflict-free role tags (`_roles.json`), and **260+ modular claim ledgers** (`*.json`).
- `assets/labs.js` shares one exact mathematical computation between static rendering and live browser controls; `assets/reader.js` powers persistent Formal Audit Mode (`localStorage`), multi-criteria atlas filtering, and lazy lab activation.
