# Edition state · 20 November 2026

This is a working edition. Open [the monograph](index.html), [source atlas](atlas.html), or [print edition](print.html). The English text is an independent reconstruction of Levent Alpöge’s work with Claude.

## Corpus

The primary mirror is Deicyde/riemann-hypothesis at `e50d09817ad81469f737e8f637561e6ccf86c670`. Mathlib is `0df444a360eaa60ab8c11dca51a86af692955474`, Lean v4.33.1. The fourteen archive parts concatenate to SHA-256 `9631b4f020199e580ba86178cb56c6e9b09f690c2369a80dc4334aa93f49c7fc`. A streamed comparison checked every original path, executable mode and Git blob against the mirror before its comparator additions. The [corpus lock](records/corpus.json) contains both mirror revisions, build metadata, lockfile and log digests, and dated verification results.

The separate read-only research materials live outside the synchronized project in `C:\Users\angouf\.codex\visualizations\2026\11\21\01a1fbb4-95ce-7ce0-823e-4d2560a3f8b3`. This location contains the detached sparse formal-source and mathlib-source checkouts, secondary mirror, complete original compressed archive and local indices. The original source text remains unchanged. The book is a static edition of the L’article vivant template from andreagourion.com, release 55. All six pages share its original type, article hierarchy, running head and colophon. Its pinned design sources are in [the template record](records/template.json).

## Reconstruction and review

- The five target statements and the classical proof expression have been inspected. The challenge expression indices are recorded. The source atlas distinguishes written uses from elaborated proof dependencies.
- The pilot on the ramp, both centerings, Mellin identities, family residues and precise window handoff received a separate review against the source. Equations and their numerical examples can be read offline.
- The balance chapter reconstructs the local character expansion, density loss, discarded-character errors, scale constraints and the specialized exponent. The window chapter includes localization tails, positive-part inequalities, pole isolation, nonreal and real pole contradictions and the epsilon choice. A second reader checked the analytic inequalities.
- The local, normalization and geometry chapters derive the mixed-row correction radii, transport an integral theta expansion to adapted coordinates and identify the determinant lattice. New worked calculations track the inverse-logarithm coefficient at 5, the two-row optimum, a determinant derivative and the elimination of both auxiliary lattice quantities from the slope bound.
- The CM period calculation now follows the metric normalization from its fractional-ideal index through the Chowla–Selberg expression and the weighted column average. The selected third-place theorem receives the separate global comparison from link_gl. Its row argument supplies divisibility.
- The two parallel lifts on the Galois side are distinguished from the long chain. The chain chapter derives the continued Rallis identity with its volume factor, the two-good-place and one-inert-place local quotients, finite support and level-character cancellation, the real lowest-type integral, continuation, nonzero vectors and the adjoint surjection. LZF-01 through LZF-05 link these computations to the chain. A separate reader checked the denominator against the rank-one model and distinguished positivity of the normalizer from nonvanishing of the twisted numerator.
- The inert-place section now derives exact shell counts and the bilateral Levi series, including the odd-rank extra factor. Right multiplication preserves the quotient length via an isomorphism. A second reader reproduced the fixed-cell value 65/54.
- The arithmetic chapter follows the uniform generator bounds and cyclotomic descent to the exceptional twists, constructs a single interval avoiding their intermediate range, and bounds the exceptional degree-two groups. The degree-two supplier bounds the logarithm of the group order, with a sufficient exponent of 150 through witnesses 24 and 141. An integral boundary matrix example derives three different quantities: torsion order 2, chosen index 4 and allowance 8. The plus estimate includes character cases, indexed rank-four trace products, rank-three counts, level absorption and compatibility of the selected field. The minus estimate distinguishes primes dividing the field degree, reconstructs Bernoulli denominator clearing and the fixed-prime bound, then absorbs the two into one window. The generator calculation derives 8 from units and a class-number bound. The determinant separately supplies 30. The two-prime construction uses zero density and a dyadic maximal mean-square estimate twice with thresholds uniform in the first prime. Source-based cross-readings and the remaining inputs are recorded per claim.
- A cold reader followed a proposed zero from real part 0.60 to the contradiction, then tested the normalizing quotient, Bernoulli product, marked-window argument and cohomology bound. The first reading exposed a missing uniform-window argument, two different meanings of a family, and ambiguity about repeated eigenvalue data. The second reading checked the changes, including strict endpoints, and reproduced the small Bernoulli and integral-lattice calculations. Distinct indices may carry identical traces; the product retains the multiplicities.
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

1. Extend the inert/signal integral theta expansion to the other prime classes and identify the integral host and nonvanishing of the evaluated map before using the uniform divisibility supplier.
2. Open the actual orbit/rank tail feeding Count5 and the common CM family supplying the class-sum and individual matrix estimates. The selected metric and its normalization already have a dedicated reconstruction.
3. Continue down the remaining proof-specific cohomological suppliers, especially K-theoretic detection, quantitative orbit/stabilizer estimates and the reciprocity count behind the primitive-character length. The auxiliary-prime construction is traced to its relative progression theorem, zero-density estimate, mean square and contour tail.
4. Reconcile written dependencies with elaborated direct dependencies when a compatible compiled environment is available. Retain the independent challenge as evidence about the statements. An external specialist review of the human-readable book is outstanding.

This release is local. The six static pages can be opened directly. The current build has ten chapters, sixteen chapter experiments plus the critical-strip frontispiece, and 117 claims. The citation check resolved 954 pinned URLs at their stated lines. The corpus comparison inspected 175,190 files. File identity, typed theorem evidence, exposition review and numerical tests are recorded separately.

Chrome exercised all sixteen chapter figures at 390, 768 and 1360 pixels, keyboard changes, resets, shared parameters, both search fields, the mobile menu, source-title toggling, numbered notes and all six page layouts. With JavaScript disabled, full citation titles, source panels and static figure states remained available. The A4 test produced 124 pages with running folios and numbered references. No page was empty or had extracted words outside the page boundary. Both new figures and the printed pages for the CM period, split/inert formula, inert recurrence and two-prime construction received a visual check. The book contains 662 distinct numbered chapter references. Browser screenshots, the temporary PDF and research caches reside outside the synchronized project.
