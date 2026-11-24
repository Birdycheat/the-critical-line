# MONOGRAPH_STATE — *The Critical Line*

Source de vérité persistante de l'Orchestrateur pour l'achèvement de la preuve lisible à partir de l'archive Lean 4 épinglée (`Deicyde/riemann-hypothesis@e50d09817ad81469f737e8f637561e6ccf86c670`, Lean `v4.33.1`, Mathlib `@0df444a`).

---

## 1. Plan global des chapitres & statut

| # | Clé | Titre | Résultats (`core` / `infra`) | Interfaces ouvertes | Statut |
| :- | :--- | :--- | :---: | :---: | :--- |
| 01 | `target` | What the Riemann Hypothesis says | `5` (`5` / `0`) | `0` | ✅ Terminé |
| 02 | `pilot` | Prime powers and the Mellin transform | `9` (`9` / `0`) | `0` | ✅ Terminé |
| 03 | `local` | From formal logarithms to divisibility | `9` (`9` / `0`) | `0` | ✅ Terminé |
| 04 | `normalization` | From the global theta function to an integral jet | `122` (`49` / `73`) | `2` | ⏳ À faire (après Cycle 1 : `TDE-01` Weierstrass, `HTC-01`, `RTC-01`) |
| 05 | `global` | Lattices and the arithmetic main term | `141` (`70` / `71`) | `7` | ⏳ À faire (Cycle 1 raccordé : `CNT-02`, `MSF-02`, `WUP-01`, `global.count` ; interfaces amont restantes) |
| 06 | `lifts` | Theta lifts, local factors and the Galois input | `408` (`120` / `288`) | `6` | ⏳ À faire (`BGM-01`, `HFT-01`, `OCI-01`, `OVM-01`, `REX-01`, `SDR-01`) |
| 07 | `balance` | The arithmetic balance | `7` (`7` / `0`) | `0` | ✅ Terminé |
| 08 | `inputs` | Supplying the arithmetic hypotheses | `230` (`90` / `140`) | `11` | ⏳ À faire (Cycle 1 ✅ Terminé : `WPW-01`–`02` ; interfaces amont restantes) |
| 09 | `windows` | The one-sided window theorem | `6` (`6` / `0`) | `0` | ✅ Terminé |
| 10 | `reflection` | Reflection and the final statement | `3` (`3` / `0`) | `0` | ✅ Terminé |

---

## 2. File prioritaire des sous-sections à rédiger

1. ✅ **Cycle 1 (Terminé)** — **Ch. 8 (`inputs`) & raccords Ch. 5 (`global`)** : *Sélection inconditionnelle du premier de niveau $T_u$ dans la fenêtre courte $[T_u^*, (1 + \frac{1}{fk}) T_u^*]$ via les premiers normiques de $\mathbb{Q}(\sqrt{-d})$ modulo $M$* (`word-prime-window.fragment.html` + `word_prime_window.json`, raccordé à `prime-pair`, `count-five`, `word-upper`, `mass-floor`, `global.json` ; `WPW-01`–`02`).
2. ⏳ **Cycle 2** — **Ch. 4 (`normalization`)** : *Biadditivité du défaut d'addition et congruence sous négation de la série correctrice $\varphi$ sur le modèle entier de Weierstrass* (complète `#normalization-torsion-integral-unit` dans `torsion-degree`, pointé dans `STATE.md` l. 177).
3. ⏳ **Cycle 3** — **Ch. 4 (`normalization`)** : *Loi de groupe formel entière d'une équation de Weierstrass courte à bonne réduction ($p \ge 5$)* (ferme l'interface `HTC-01`).
4. ⏳ **Cycles suivants** — Dépliage ordonné des interfaces amont restantes (Ch. 5, Ch. 6, Ch. 8).

---

## 3. Table des notations globales & invariants éditoriaux

### Conventions typographiques et techniques strictes (vérifiées par CI)
- **Langue du monographe** : Anglais scientifique clair (*ordinary English mathematical prose*). Intuition géométrique/analytique en ouverture de chaque sous-section, puis énoncé explicite des hypothèses au point d'usage, puis preuve.
- **Balisage mathématique du site** : Gabarit HTML *L'article vivant* en police Latin Modern (`<i>`, `<sup>`, `<sub>`, `<div class="equation" id="...">`, `<details class="proof" id="...">`). **Pas de blocs LaTeX `$...$` bruts dans les fragments HTML**.
- **Vecteurs et matrices** : Toujours en **graisse normale** (`<i>M</i>`, `<i>v</i>`, jamais `<b>` ni `\mathbf`).
- **Cloisonnement formel strict** : Aucun tag `<code>`, URL `.lean`, ni mot-clé (`Lean`, `Mathlib`, identifiant brut tel que `LevelPrime`, `Count5`, `GlobalTheory`) dans la prose hors de `<details class="correspondence"><summary>Lean correspondence</summary>...</details>`.

### Symboles canoniques partagés
| Symbole | Signification fixée dans le monographe | Chapitres principaux |
| :--- | :--- | :--- |
| $s = \sigma + it$ | Variable complexe dans la bande critique $0 < \sigma < 1$ ; ligne critique $\sigma = 1/2$ | Ch. 1, 2, 9, 10 |
| $B(\rho)$ vs $B(x)$ | $B(\rho)$ : multiplicité pondérée de famille en un zéro/pôle $\rho$ ; $B(x)$ : somme mesurée sur les puissances de premiers | Ch. 2, 7, 9 |
| $\kappa$ | Coefficient d'erreur relative (distinct de l'exposant de pente $\theta$) | Ch. 2, 7, 9 |
| $[Y, Y^{1+\delta}]$, $U = \log Y$ | Fenêtre multiplicative d'exposant $1+\delta$ (coordonnées logarithmiques $[U, (1+\delta)U]$) | Ch. 8, 9 |
| $E / F$, $f$, $v$ | Corps CM $E$ sur corps totalement réel $F$ de degré $f = [F:\mathbb{Q}]$ ; $v = \frac{1}{2}|\mathrm{disc}\,E|^{1/(2f)}$ | Ch. 5, 6, 8 |
| $q, d$ | Paire de premiers auxiliaires ($q \equiv 3 \pmod 8$, $d \equiv 7 \pmod{16}$, corps quadratique imaginaire $\mathbb{Q}(\sqrt{-d})$) | Ch. 5, 6, 8 |
| $g_0, g_1$, $G = \log(g_0 g_1)$ | Deux premiers auxiliaires de niveau dans le comptage de masse ($\log g_i \le C_Y L$) | Ch. 5 |
| $k, m, r$ | Rang positif de colonne $k$, paramètre pair $m \ge 44$, rang de ligne $r = k + m - 1$ (longueur de drapeau $m/2 - 1$) | Ch. 5 |
| $L = x^\varepsilon$ | Échelle logarithmique lente au point de mesure $x$ ($0 < \varepsilon < 1/52$) | Ch. 5, 7, 8 |
| $D^\star, d_u^\star, X_u$ | Masses/volumes normalisés de ligne et colonne pour le mot $u$, liés par $X_u^{fk} = D^\star / d_u^\star$ | Ch. 5 |
| $\Gamma, T_u^*, T_u$ | Facteur auxiliaire $\Gamma \ge 1$, borne inférieure de fenêtre $T_u^* = X_u \Gamma^{-2/(fk)}$, premier normique $T_u = N(\pi_u) \in [T_u^*, (1 + \frac{1}{fk}) T_u^*]$ | Ch. 5, 8 |

---

## 4. Registre des déclarations Lean `[CORE]` couvertes par section

### Chapitres auto-contenus existants (Ch. 1, 2, 3, 7, 9, 10)
- Couverture complète figée dans `records/*.json` et `records/solution_terms.json` (`940` résultats au total après Cycle 1, `26` interfaces ouvertes).

### Cycle 1 — Fenêtre du premier de niveau $T_u$ (`word_prime_window`)
- *Statut* : ✅ Terminé (`content/word-prime-window.fragment.html` + `records/word_prime_window.json`, rôle `core-argument`).
- *Déclarations `[CORE]` couvertes — `WPW-01` (`#inputs-short-norm-primes`)* :
  - `UpperTheory.T3.ShortNorm`, `UpperTheory.T3.ModAt` (`ShortNorm.lean#L8-L16`)
  - `UpperTheory.T3.shortNorm` (`Primes.lean#L5`)
  - `GlobalTheory.Hk.normPrimes_short_interval_lower`, `sum_lam_zero_le_card_normPrimes`, `sqrt_le_short_main` (`NormPrimesImagQuadShortIntervalLowerBound.lean#L10-L147`)
  - `GlobalTheory.Hk.exists_lFam_ray`, `card_ray_le` (`ExistsLFamRay.lean#L50-L128`)
  - `GlobalTheory.Hk.ShortInt.trivialClass_shortInterval`, `zeros`, `sum_psi`, `exc_le`, `sum_est`, `err_le` (`TrivialClassShortInterval.lean#L20-L281`)
  - `UpperTheory.T3.normPrimesN` (`normPrimesN.lean#L108-L157`)
  - `UpperTheory.Top.hostOfField` (`HostOfField.lean#L8-L15`)
  - `GlobalTheory.EX.two_type_primes`, `excluded_count_lt`, `exists_pair_disjoint_exceptional` (`ExistsTwoLargeNormOnePrimes.lean#L17-L96`)
  - *4 interfaces analytiques amont de `WPW-01`* : `GlobalTheory.T.rayClassLFunction_zero_free_region`, `GlobalTheory.T.rayClassLFunction_unique_simple_exceptional_zero`, `GlobalTheory.T.exists_rayClassLFunction_real_zero_far_from_one`, `GlobalTheory.T.rayClassFamily_psi_with_exceptional_zero`.
- *Déclarations `[CORE]` couvertes — `WPW-02` (`#inputs-word-prime-window`)* :
  - `UpperTheory.T3.levelPrimeN` (`levelPrimeN.lean#L36-L161`)
  - `GlobalTheory.EX.NormOne`, `GlobalTheory.EX.NormPrimes`, `GlobalTheory.EX.LevelPrime` (`LogCondLeThree.lean#L15-L18, #L75-L85`)
  - `GlobalTheory.EX.levelPrime_unconditional`, `normPrimes_unconditional`, `normPrimes_and_levelPrime_unconditional` (`NormPrimesAndLevelPrimeUnconditional.lean#L26-L82`)
  - `GlobalTheory.EX.OB.exists_levCh_of_levelPrime` (`ExistsLevChOfLevelPrime.lean#L20-L113`)
  - `GlobalTheory.EX.normOne_host` (`NormOnePrimeElements.lean#L15-L20`)
  - `GlobalTheory.Mem.LevelChoice.exists_levCh`, `mod_eq_one_of_norm` (`ModEqOneOfNorm.lean#L12-L65`)
  - `LevCh` (`DuStarPos.lean#L38-L56`), `ColumnsAtT.Xu` / `ColumnsAtT.Tstar` (`DataKernels.lean#L157-L159`), `Formalism.BasicNotions.D7.T_win` (`RhoDetPrimeEqMuTildeMulChiPow.lean#L153-L154`)
  - `GlobalTheory.Core.Rk.levelPrime_window` (`LevelPrimeWindow.lean#L11-L92`)
  - `Formalism.MainNotions.GlobalTheoryTheory.count_at_of` (`JointsL.lean#L20-L142`)
  - `UpperTheory.Top.recS` (`ObjCTrue.lean#L30-L36`)
  - `GlobalTheory.Fc.objCP_and_of_recExP`, `objCP_of_recExP` (`ExistsObjectsOfAdmissibleTwistDatum.lean#L70-L123`)
