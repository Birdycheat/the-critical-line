# Contributing to *The Critical Line* · Contribuer à l’édition

Thank you for helping verify, simplify, and complete the human-readable mathematical reconstruction of the Riemann Hypothesis and Dirichlet GRH formalization.

*(Version française plus bas)*

---

## Three Contribution Tiers (Open to M1/M2+ Readers, Lean Experts & Specialists)

1. **Tier A — Mathematical Audit & Proof Simplification (M1/M2+ · BAC+5)**  
   Read any derived section in `chapter-01.html`–`chapter-10.html` or inspect any of the **91 interactive experiments** (`experiments.html`) to check an algebraic step, test boundary parameters, catch a sign or quantifier slip, or propose a cleaner human argument than the tactic-level derivation.
2. **Tier B — Formal Fidelity Audit (`Lean @e50d098 ↔ Prose`)**  
   Enable **Formal audit mode** (*Show all formal correspondences*) on `atlas.html` or any chapter, click the pinned `#Lxx-Lyy` GitHub permalink on `Deicyde/riemann-hypothesis@e50d098`, and verify that every formal hypothesis (level coprimality, signature parity, Haar normalization, field hypothesis) is faithfully stated in the English prose.
3. **Tier C — Unfolding Pinned Formal-Boundary Interfaces (`outstanding` · Domain Specialists)**  
   Browse `contribute.html#tier-c` to pick an upstream interface whose formal statement and proof term are already kernel-verified in the compiled Lean export, and supply a self-contained human derivation (including deep frontiers such as $\mathrm{GSp}_4$/$U(3)$ deformation rings, regularized Siegel–Weil inputs, orbital period integrals, and relative exponential charts).

## Three Ways to Submit

1. **One-click Passage Ticket (GitHub Issue Form)** — Click **Improve or audit this passage** under any section or on any claim in `atlas.html` (pre-fills the `[ID]`, anchor, and edition stamp; LaTeX `$...$` supported).
2. **No-Account Email** — Click `Email` on any passage (`contact@andreagourion.com`, English or French; indicate preferred attribution or anonymity).
3. **Direct Pull Request on Modular Fragments** — Edit one of the **350+ modular HTML fragments** in `content/` or **260+ JSON claim ledgers** in `records/` (role tags live separately in `records/_roles.json` to prevent merge conflicts).

## Validation Rules Before Opening a Pull Request

Run locally with Node.js ≥ 22 and Python ≥ 3.10 (zero npm dependencies):

```bash
node scripts/build.cjs
node scripts/check.cjs
```

Respect the editorial invariants enforced by CI (`PEDAGOGY.md` and `scripts/check_citations.py`):
- **Mathematical prose first**: State every proof-specific result in ordinary English mathematical prose, with all hypotheses explicit at the point of use.
- **Keep formal identifiers inside correspondence disclosures**: Never place `<code>` tags, `.lean` URLs, or formal system names (`Lean`, `Mathlib`, raw declaration identifiers) in ordinary prose outside `<details class="correspondence">`.
- **Typography**: Vectors and matrices use regular weight (not bold).
- **Acyclic result ledger**: Every `dependencies` array in `records/*.json` must reference valid claim IDs without introducing cycles.

## License

Contributions are published with attribution under **[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.en)** (see [LICENSE.md](LICENSE.md)).

---

## Contribuer en français (Trois chantiers A / B / C)

Vous pouvez contribuer **en français ou en anglais**, avec ou sans compte GitHub (`contact@andreagourion.com`) :

- **Chantier A — Audit mathématique & simplification (accessible dès BAC+5 / M1–M2)** : relire un passage déjà rédigé ou tester l’une des 91 expériences numériques (`experiments.html`) pour traquer une coquille de signe/quantificateur ou proposer une preuve humaine plus directe.
- **Chantier B — Audit de fidélité `Lean ↔ Prose` (profils M2 / Lean)** : activer le bouton *Show all formal correspondences* (mémorisé d’une page à l’autre), suivre le permalien `#Lxx-Lyy` vers `Deicyde/riemann-hypothesis@e50d098` et vérifier qu’aucune hypothèse formelle n’a été omise ou lissée dans le texte.
- **Chantier C — Dépliage des frontières formelles `outstanding` (spécialistes)** : ouvrir `contribute.html#tier-c` pour rédiger en prose mathématique auto-contenue l’une des interfaces amont déjà certifiées par le compilateur Lean (déformations $\mathrm{GSp}_4$/$U(3)$, Siegel–Weil régularisé, intégrales orbitales, exponentielle relative en familles).
- **Licence** : les contributions retenues sont créditées sous licence **[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.fr)**.
