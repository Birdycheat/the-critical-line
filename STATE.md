# Edition state · 20 November 2026

This is a working edition. Open [the monograph](index.html), [source atlas](atlas.html), or [print edition](print.html). The English text is an independent reconstruction of Levent Alpöge’s work with Claude.

## Corpus

The primary mirror is Deicyde/riemann-hypothesis at `e50d09817ad81469f737e8f637561e6ccf86c670`. Mathlib is `0df444a360eaa60ab8c11dca51a86af692955474`, Lean v4.33.1. The fourteen archive parts concatenate to SHA-256 `9631b4f020199e580ba86178cb56c6e9b09f690c2369a80dc4334aa93f49c7fc`. A streamed comparison checked every original path, executable mode and Git blob against the mirror before its comparator additions. The [corpus lock](records/corpus.json) contains both mirror revisions, build metadata, lockfile and log digests, and dated verification results.

The separate read-only research materials live outside the synchronized project in `C:\Users\angouf\.codex\visualizations\2026\11\21\01a1fbb4-95ce-7ce0-823e-4d2560a3f8b3`. This location contains the detached sparse formal-source and mathlib-source checkouts, secondary mirror, complete original compressed archive and local indices. The original source text remains unchanged. The book is a static edition of the L’article vivant template from andreagourion.com, release 55. All six pages share its original type, article hierarchy, running head and colophon. Its pinned design sources are in [the template record](records/template.json).

## Reconstruction and review

- The five target statements and the classical proof expression have been inspected. The challenge expression indices are recorded. The source atlas distinguishes written uses from elaborated proof dependencies.
- The pilot on the ramp, both centerings, Mellin identities, family residues and precise window handoff received a separate review against the source. Equations and their numerical examples can be read offline.
- The balance chapter reconstructs the local character expansion, density loss, discarded-character errors, scale constraints and the specialized exponent. The window chapter includes localization tails, positive-part inequalities, pole isolation, nonreal and real pole contradictions and the epsilon choice. A second reader checked the analytic inequalities.
- The local, normalization and geometry chapters derive the cyclic correction-radius optimization, transport the selected integral theta expansion to adapted coordinates, identify the determinant lattice and reconstruct the analytic main-term matching. Uniform rank, size, and all-prime estimates still enter as hypotheses at specific steps. Separate project review checked all six normalization claims, the three radius claims and the layer-cake calculation. The lift chapter identifies both parallel global lifts with a common even source. Its account of the long chain derives nonvanishing at each stage from the Rallis identity, checks the shifted special value including the endpoint at 1, and traces rank, adjoint propagation and surjectivity. The two new iterated-chain claims await a separate reading.
- The arithmetic inputs chapter reconstructs a cokernel-length increase of at most R in each sufficiently high cyclotomic layer. It derives the bound of R exceptional twists and explains how the degree-two estimate enters for these twists. The newly traced steps are INP-10 through INP-12. Their source ranges and written calls have been checked. The chapter also identifies the local conditions, quantifier order and rescaling of cohomological windows to the analytic scale. Reflection, primitive reduction and the exact zeta exception have individual proofs.
- Review here means separate source-based project review. Independent external human review of the exposition remains outstanding. The external kernel runs on the formal proof are reported separately. This workstation has 31.4 GiB of RAM and the installed Lean differs from the pin. No local build or full solution-kernel replay was attempted.

## Resume

```powershell
$grhEvidence = 'C:\Users\angouf\.codex\visualizations\2026\11\21\01a1fbb4-95ce-7ce0-823e-4d2560a3f8b3'
python -B scripts/verify_sources.py "$grhEvidence/formal-source" --archive-parts "$grhEvidence" --mathlib "$grhEvidence/mathlib-source" --secondary "$grhEvidence/secondary-mirror" --evidence "$grhEvidence" --independent-audit "$grhEvidence/independent-audit" --olean-manifest "$grhEvidence/project-oleans.sha256"
python -B -X utf8 scripts/verify_target_terms.py "$grhEvidence/challenge.ndjson" --json
node scripts/build.cjs
python -B scripts/check_citations.py "$grhEvidence/formal-source" "$grhEvidence/mathlib-source" --index "$grhEvidence"
node scripts/check.cjs
```

Use `python -B -X utf8 scripts/index_sources.py find "$grhEvidence" riemannHypothesis` to locate a declaration and `python -B -X utf8 scripts/index_sources.py read "$grhEvidence" src/Main.lean 1 6` to inspect its written proof. Recheck the theorem’s hypotheses and the downstream call before adding ledger edges. Read [the correction history](CORRECTIONS.md) and the `open_interfaces` in [the route ledger](records/route.json).

## Next mathematical work

1. Extend the reconstructed inert/signal expansion and the mixed-row estimate to the other prime classes. Identify the integral host data and prove the nonvanishing required of the evaluated map before applying the uniform divisibility supplier.
2. Open the doubling identity and local zeta-factor evaluation used by the long chain. Match the resulting norm and surjectivity data to the global evaluation map. Reconstruct the rank tail and uniform estimates behind Count5. Keep track of which constants are fixed before the asymptotic variable is chosen.
3. Reconstruct the Ferrero–Washington generator bounds, descent identification and the independent degree-two estimate used for the exceptional twists. Check the separate representation counts for the plus window and the compatibility of the auxiliary fields.
4. Reconcile every crucial written dependency with the elaborated solution as resources permit. Retain the independent challenge as evidence about the statements. Perform an end-to-end human review after the remaining input proofs are reconstructed.

This release is local. A browser can open the six HTML files directly. The static build includes ten chapters, fourteen chapter experiments, the critical-strip frontispiece, and seventy claims. Source paths and line ranges for 545 pinned URLs were checked against the locked versions. The corpus comparison inspected 175,190 files. These checks establish file identity and citation locations. The review field of each claim describes the mathematical reading performed.

Chrome exercised every chapter figure at 390, 768 and 1360 pixels, keyboard changes, resets, shared parameters, both search fields, the mobile menu, and the six page layouts. With JavaScript disabled, navigation, the source panels and all fourteen static figure states remained available. The A4 print check produced 67 pages with running folios, a notation and bibliography appendix, and numbered chapter citations. No page was empty and extracted words stayed inside each page boundary. Browser screenshots, temporary PDF and research caches reside outside the synchronized project.
