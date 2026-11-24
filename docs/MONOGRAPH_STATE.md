# MONOGRAPH_STATE — *The Critical Line*

Source de vérité persistante de l'Orchestrateur pour l'achèvement de la preuve lisible à partir de l'archive Lean 4 épinglée (`Deicyde/riemann-hypothesis@e50d09817ad81469f737e8f637561e6ccf86c670`, Lean `v4.33.1`, Mathlib `@0df444a`).

---

## 1. Plan global des chapitres & statut

| # | Clé | Titre | Résultats (`core` / `infra`) | Interfaces ouvertes | Statut |
| :- | :--- | :--- | :---: | :---: | :--- |
| 01 | `target` | What the Riemann Hypothesis says | `5` (`5` / `0`) | `0` | ✅ Terminé |
| 02 | `pilot` | Prime powers and the Mellin transform | `9` (`9` / `0`) | `0` | ✅ Terminé |
| 03 | `local` | From formal logarithms to divisibility | `9` (`9` / `0`) | `0` | ✅ Terminé |
| 04 | `normalization` | From the global theta function to an integral jet | `126` (`49` / `77`) | `0` | ✅ Terminé (Cycle 3 : `WFG-01`–`02` ferment `HTC-01`, `TDE-01`, `CED-01`–`02`, 100 % auto-contenu) |
| 05 | `global` | Lattices and the arithmetic main term | `149` (`70` / `79`) | `2` | ⏳ À faire (Cycle 1 raccordé : `CNT-02`, `MSF-02`, `WUP-01`, `global.count` ; Cycle 5 ✅ Terminé : `IQR-01`–`02` ferment `UFR-01` ; Cycle 6 ✅ Terminé : `DCJ-01`–`03` ferment `DCP-01` ; Cycle 7 ✅ Terminé : `PGU-01`–`03` ferment `RPI-01`, `FMU-01`, `RFV-01` ; 2 interfaces amont restantes : `FDG-01`, `global.lattice`) |
| 06 | `lifts` | Theta lifts, local factors and the Galois input | `408` (`120` / `288`) | `6` | ⏳ À faire (`BGM-01`, `HFT-01`, `OCI-01`, `OVM-01`, `REX-01`, `SDR-01`) |
| 07 | `balance` | The arithmetic balance | `7` (`7` / `0`) | `0` | ✅ Terminé |
| 08 | `inputs` | Supplying the arithmetic hypotheses | `233` (`93` / `140`) | `10` | ⏳ À faire (Cycle 1 ✅ Terminé : `WPW-01`–`02` ; Cycle 4 ✅ Terminé : `RCL-01`–`03` ferment `WPW-01` ; interfaces amont restantes) |
| 09 | `windows` | The one-sided window theorem | `6` (`6` / `0`) | `0` | ✅ Terminé |
| 10 | `reflection` | Reflection and the final statement | `3` (`3` / `0`) | `0` | ✅ Terminé |

---

## 2. File prioritaire des sous-sections à rédiger

1. ✅ **Cycle 1 (Terminé)** — **Ch. 8 (`inputs`) & raccords Ch. 5 (`global`)** : *Sélection inconditionnelle du premier de niveau $T_u$ dans la fenêtre courte $[T_u^*, (1 + \frac{1}{fk}) T_u^*]$ via les premiers normiques de $\mathbb{Q}(\sqrt{-d})$ modulo $M$* (`word-prime-window.fragment.html` + `word_prime_window.json`, raccordé à `prime-pair`, `count-five`, `word-upper`, `mass-floor`, `global.json` ; `WPW-01`–`02`).
2. ✅ **Cycle 2 (Terminé)** — **Ch. 4 (`normalization`)** : *Biadditivité du défaut d'addition et congruence sous négation de la série correctrice $\varphi$ sur le modèle entier de Weierstrass* (`curve-exponential-defect.fragment.html` + `curve_exponential_defect.json`, raccordé à `torsion-degree`, `torsion_degree.json` ; `CED-01`–`02`, complète `#normalization-torsion-integral-unit`).
3. ✅ **Cycle 3 (Terminé)** — **Ch. 4 (`normalization`)** : *Loi de groupe formel entière d'une équation de Weierstrass, logarithme invariant et factorisation de corde cubique* (`weierstrass-formal-group.fragment.html` + `weierstrass_formal_group.json`, raccordé à `height-two-coordinate`, `curve-exponential-defect`, `height_two_coordinate.json`, `torsion_degree.json`, `curve_exponential_defect.json` ; `WFG-01`–`02`, rend le Ch. 4 100 % auto-contenu).
4. ✅ **Cycle 4 (Terminé)** — **Ch. 8 (`inputs`)** : *Région sans zéro, répulsion de Bessel en $s=1$ et formule explicite tronquée pour les fonctions $L$ de classes de rayons sans équation fonctionnelle* (`ray-class-l-functions.fragment.html` + `ray_class_l_functions.json`, raccordé à `word-prime-window`, `word_prime_window.json` ; `RCL-01`–`03`, ferme les 4 interfaces analytiques amont de `WPW-01`).
5. ✅ **Cycle 5 (Terminé)** — **Ch. 5 (`global`)** : *Réalisations isométriques de quotients et sous-réseaux arithmétiques et changement de base archimédien du sous-réseau orthogonal, du radical nilpotent et du centre* (`isometric-quotient-realization.fragment.html` + `isometric_quotient_realization.json`, raccordé à `deep-orbit-cover`, `unipotent-hom-cover`, `unipotent-first-radius`, `unipotent_first_radius.json`, `unipotent_lattice_radii.json` ; `IQR-01`–`02`, ferme `UFR-01`).
6. ✅ **Cycle 6 (Terminé)** — **Ch. 5 (`global`)** : *Jauge de Haar riemannienne, jacobien de la carte exponentielle ordonnée, indice du sous-groupe de congruence et borne absolue de covolume hermitien* (`deep-cusp-jacobian-index.fragment.html` + `deep_cusp_jacobian_index.json`, raccordé à `deep-cusp-count`, `deep-sobolev`, `deep_cusp_count.json`, `deep_sobolev.json` ; `DCJ-01`–`03`, ferme `DCP-01`).
7. ✅ **Cycle 7 (Terminé)** — **Ch. 5 (`global`)** : *Asymptotiques locales de jauge sur sous-groupes algébriques matriciels, module de conjugaison du radical unipotent isotrope, calibration par tranche de la constante d'Iwasawa, inégalité de covolume sur tranches dénombrables, finitude du volume quotient, constante arithmétique à cinq facteurs et majoration de $\zeta_E(l)$* (`parabolic-gauge-unfolding.fragment.html` + `parabolic_gauge_unfolding.json`, raccordé à `real-parabolic-integration`, `marked-flag-unfolding`, `rare-flag-volume`, `real_parabolic_integration.json`, `marked_flag_unfolding.json`, `rare_flag_volume.json` ; `PGU-01`–`03`, ferme `RPI-01`, `FMU-01` et `RFV-01`).
8. ⏳ **Cycles suivants** — Dépliage ordonné des interfaces amont restantes (Ch. 5, Ch. 6, Ch. 8).

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
| $\mathcal{D}$ | Domaine fondamental mesurable de $\Gamma = G(F)$ dans $G(\mathbb{A}_F)$ (lorsque le corps de base $F$ est en portée) | Ch. 5 |
| $P_\infty = \prod_v c_v$ | Produit archimédien des constantes de jauge riemannienne de Haar | Ch. 5 |
| $k_g = \mu_{\mathrm{fin}}(K_g)$ | Volume de Haar fini-adélique positif du sous-groupe de congruence de niveau $g$ | Ch. 5 |
| $\nu_E = |\mathrm{disc}(E)|^{1/(2f)} / 2$ | Demi-discriminant racine du corps CM $E$ | Ch. 5 |
| $d_N = \dim_{\mathbb{R}} N$ | Dimension réelle du radical unipotent d'un drapeau isotrope | Ch. 5 |
| $V(r) = \mathrm{vol}(\mathrm{U}(r))$ | Volume de Hilbert–Schmidt du groupe unitaire compact $\mathrm{U}(r)$ | Ch. 5 |
| $S(r) = \prod_{l=1}^r \frac{2\pi^l}{(l-1)!}$ | Produit des aires de sphères unitaires du groupe unitaire compact $\mathrm{U}(r)$ | Ch. 5 |

---

## 4. Registre des déclarations Lean `[CORE]` couvertes par section

### Chapitres auto-contenus existants (Ch. 1, 2, 3, 4, 7, 9, 10)
- Couverture complète figée dans `records/*.json` et `records/solution_terms.json` (`955` résultats au total après Cycle 7 : `371` `core-argument` / `584` `rebuilt-infrastructure`, `874` auto-contenus, `18` interfaces ouvertes).

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
  - *4 interfaces analytiques amont de `WPW-01` (fermées par Cycle 4 : `RCL-01`–`03`)* : `GlobalTheory.T.rayClassLFunction_zero_free_region`, `GlobalTheory.T.rayClassLFunction_unique_simple_exceptional_zero`, `GlobalTheory.T.exists_rayClassLFunction_real_zero_far_from_one`, `GlobalTheory.T.rayClassFamily_psi_with_exceptional_zero`.
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

### Cycle 2 — Défaut d'addition biadditif et négation sur Weierstrass (`curve_exponential_defect`)
- *Statut* : ✅ Terminé (`content/curve-exponential-defect.fragment.html` + `records/curve_exponential_defect.json`, rôle `rebuilt-infrastructure`).
- *Déclarations `[CORE]` couvertes — `CED-01` (`#normalization-curve-negation-congruence`)* :
  - `Formalism.L2.Th1.C.mvExp`, `LG`, `Cong` (`HasSecondLogDeriv.lean#L18-L24`)
  - `Formalism.L2.Th1.C.IsLogPair` (`HasSecondLogDeriv.lean#L75-L90`)
  - `Formalism.L2.Th1.C.PhNormAt` (`IsotropicVanish.lean#L23-L32`)
  - `Formalism.L2.Th1.B.phO` (`CurveHyp.lean#L32-L76`)
  - `Formalism.L2.Th1.G.curveNegNorm` (`FinalA.lean#L20-L21`)
  - `Formalism.L2.Th1.G.curve_neg_norm_holds` (`CurveFormalFirstLevelHolds.lean#L54-L64`)
  - `Formalism.L2.Th1.C.phi_norm_from_datum` (`IntegralEndomorphismFromDatum.lean#L170-L181`)
  - `Formalism.L2.Th1.C.phNormUnit_of` (`USideB.lean#L226-L294`)
  - `Formalism.L2.Th1.C.IntegralMvPolynomialLemmas.intMv_of_sq`, `lGHalf_of` (`DegreeLeOfMemAntidiagonal.lean#L152-L245`)
- *Déclarations `[CORE]` couvertes — `CED-02` (`#normalization-curve-biadditive-defect`)* :
  - `Formalism.L2.Th1.G.weierstrass_biadditive_mod_equiv` (`FinalA.lean#L20-L21`)
  - `Formalism.L2.Th1.G.curve_formal_first_level_holds` (`CurveFormalFirstLevelHolds.lean#L66-L76`)
  - `Formalism.L2.Th1.C.first_level_from_universal_holds` (`ConstantCoeffVecConsPairEqZero.lean#L171-L203`)
  - `Formalism.L2.Th1.B.Sim.simeq_iff` (`SimeqPadicIntegers.lean#L18-L127`)
  - `Formalism.L2.Th1.B.f1O` (`FinalB.lean#L49-L55`)
  - `Formalism.L2.Th1.B.AddSgStar_of` (`PderivZeroZeroWeierstrassDifference.lean#L301-L524`)
  - `Formalism.L2.Th1.B.ParO.ParO_of` (`InVarAddInVarNeZero.lean#L200-L315`)
  - `Formalism.L2.Th1.B.Cube_of` (`ConstantCoeffEqZeroOfParallelogram.lean#L115-L298`)
  - `ReciprocityTheory.ChartRestriction.L1.phNorm_int` (`FgPhInt.lean#L12-L85`)
  - `ReciprocityTheory.ChartRestriction.L1.sq_formula` (`FgIsoU.lean#L53-L122`)

### Cycle 3 — Loi de groupe formel entière de Weierstrass & factorisation de corde (`weierstrass_formal_group`)
- *Statut* : ✅ Terminé (`content/weierstrass-formal-group.fragment.html` + `records/weierstrass_formal_group.json`, rôle `rebuilt-infrastructure`).
- *Déclarations `[CORE]` couvertes — `WFG-01` (`#normalization-weierstrass-formal-group`)* :
  - `Formalism.L2.Th1.A.fgl`, `wSer`, `logSer`, `expSer` (`CompInv.lean#L36-L125`)
  - `Formalism.ELL.wSeriesExistsUnique_holds`, `wSeriesLeadingTerm_holds`, `wSeriesSubstUnique_holds` (`WSeries.lean#L17-L234`)
  - `Formalism.ELL.wSeriesUnique` (`FormalGroupPointsNoTorsion.lean#L74-L78`)
  - `Formalism.L2.Th1.A.formal_group_chord` (`FormalGroupEqWSeries.lean#L104-L466`)
  - `Formalism.L2.Th1.A.logSpec_of`, `expSpec_of`, `logNeg_of` (`LogExp.lean#L60-L119`)
  - `Formalism.L2.Th1.A.flowThirdPoint` (`FlowThird.lean#L74-L123`)
  - `Formalism.L2.Th1.A.formal_group_group_law`, `formal_group_logarithm`, `formal_group_inverse` (`FormalLogarithmBaseChange.lean#L144-L578`)
  - `Formalism.L2.Th1.A.fglGroup`, `fglLog` (`FglInvariant.lean#L14-L16`)
  - `Formalism.L2.Th1.A.bridgeLaw` (`TwoTorsionU.lean#L15-L16`)
  - `Formalism.L2.Th1.A.bridgeLaw_of` (`BridgeJ.lean#L59-L115`)
  - `Formalism.L2.Th1.A.uSerEq_of` (`BridgeK.lean#L173-L213`)
  - `ReciprocityTheory.ChartRestriction.L1.curve_law`, `lgS_eq_logSer` (`ShortWIntModel.lean#L12-L34`)
  - `ReciprocityTheory.ChartRestriction.L1.cm3` (`FgClose.lean#L25-L68`)
- *Déclarations `[CORE]` couvertes — `WFG-02` (`#normalization-weierstrass-chord-factorization`)* :
  - `Formalism.ELL.cube_two`, `CubeTwoAlt.main` (`CubeTwo.lean#L303-L412`)
  - `Formalism.L2.Th1.A.cube_two_relation`, `CubeR.two_univ`, `coeffMem_of` (`FormalGroupConstCoeffZero.lean#L128-L245`)
  - `Formalism.L2.Th1.A.cubeTwoR` (`CubeThreeR.lean#L8-L10`)
  - `Formalism.L2.Th1.A.bridgeCurve_of` (`BridgeJ.lean#L59-L115`)
  - `Formalism.L2.Th1.A.bridgeCurve` (`TwoTorsionU.lean#L15-L16`)

### Cycle 4 — Fonctions $L$ de classes de rayons sans équation fonctionnelle (`ray_class_l_functions`)
- *Statut* : ✅ Terminé (`content/ray-class-l-functions.fragment.html` + `records/ray_class_l_functions.json`, rôle `core-argument` ; ferme les 4 interfaces amont de `WPW-01`).
- *Déclarations `[CORE]` couvertes — `RCL-01` (`#inputs-ray-class-zero-free`)* :
  - `GlobalTheory.Hk.LFam` (`LamIdealOfNotPrimePow.lean#L12-L88`)
  - `GlobalTheory.T.rayClassLFunctionFamily_continuation_growth` (`RayClassLFunctionFamilyContinuationGrowthStatement.lean#L8-L9`)
  - `GlobalTheory.Hk.RayCont.continuation_growth` (`RayClassLFunctionFamilyContinuationGrowth.lean#L206-L250`)
  - `GlobalTheory.T.rayClassFamily_logDeriv_re_gt_one` (`RayClassFamilyLogDerivReGtOneStatement.lean#L8-L9`)
  - `GlobalTheory.Hk.LogDeriv.logDeriv_F`, `eq_exp_of_conv`, `norm_ge_of_conv` (`RayClassFamilyLogDerivReGtOne.lean#L68-L295`)
  - `GlobalTheory.LogDerivZeros.main`, `norm_logDeriv_le` (`NormOneSubConjMul.lean#L49-L242`)
  - `GlobalTheory.T.rayClassLFunction_logDeriv_local_formula` (`RayClassLFunctionLogDerivLocalFormulaStatement.lean#L8-L9`)
  - `GlobalTheory.HkLocal.logDeriv_local` (`RayClassLFunctionLogDerivLocalFormula.lean#L21-L157`)
  - `GlobalTheory.T.rayClassLFunctionFamily_logDeriv_positivity` (`RayClassLFunctionFamilyLogDerivPositivityStatement.lean#L8-L9`)
  - `GlobalTheory.Hk.LFamPos.positivity` (`RayClassLFunctionFamilyLogDerivPositivity.lean#L53-L104`)
  - `GlobalTheory.T.rayClassLFunction_zero_free_region` (`RayClassLFunctionZeroFreeRegionStatement.lean#L8-L9`)
  - `GlobalTheory.Hk.ZeroFree.zero_free_region`, `re_le_one`, `re_LSeries_le`, `pole_le`, `inv_le_ell` (`RayClassLFunctionZeroFreeRegion.lean#L17-L311`)
  - `GlobalTheory.T.rayClassLFunction_unique_simple_exceptional_zero` (`RayClassLFunctionUniqueSimpleExceptionalZeroStatement.lean#L8-L9`)
  - `GlobalTheory.Hk.RealZero.main`, `exists_bound` (`RayClassLFunctionUniqueSimpleExceptionalZero.lean#L72-L258`)
- *Déclarations `[CORE]` couvertes — `RCL-02` (`#inputs-ray-class-bessel-repulsion`)* :
  - `GlobalTheory.T.tsum_exp_mul_aChi_bounds` (`ExpSumBoundsStatement.lean#L8-L9`)
  - `GlobalTheory.Hk.LFam.exp_sum_bounds` (`ExpSumBounds.lean#L255-L291`)
  - `GlobalTheory.T.norm_rayClassFamily_F_one_ge_of_real_character` (`NormRayClassFamilyFOneGeOfRealCharacterStatement.lean#L8-L9`)
  - `GlobalTheory.Hk.RealChar.norm_F_one_ge`, `besW_le_integral`, `integral_le` (`NormRayClassFamilyFOneGeOfRealCharacter.lean#L176-L423`)
  - `GlobalTheory.T.exists_rayClassLFunction_real_zero_far_from_one` (`ExistsRayClassLFunctionRealZeroFarFromOneStatement.lean#L8-L9`)
  - `GlobalTheory.Hk.LFam.real_zero_far_from_one`, `norm_deriv_F_le_near_one` (`ExistsRayClassLFunctionRealZeroFarFromOne.lean#L11-L76`)
- *Déclarations `[CORE]` couvertes — `RCL-03` (`#inputs-ray-class-explicit-formula`)* :
  - `GlobalTheory.Hk.LogDerivHalf.logDeriv_sub_exceptional_le` (`LogDerivSubExceptionalLe.lean#L92-L260`)
  - `GlobalTheory.PerronCoeff.truncated_perron_of_le_two_vonMangoldt` (`TruncatedPerronOfLeTwoVonMangoldt.lean#L9-L157`)
  - `GlobalTheory.T.rayClassFamily_psi_with_exceptional_zero` (`RayClassFamilyPsiWithExceptionalZeroStatement.lean#L8-L9`)
  - `GlobalTheory.Hk.PsiExc.psi_exceptional`, `shift`, `exists_line`, `contour` (`RayClassFamilyPsiWithExceptionalZero.lean#L14-L502`)

### Cycle 5 — Réalisations isométriques de quotients/sous-réseaux et changement de base archimédien (`isometric_quotient_realization`)
- *Statut* : ✅ Terminé (`content/isometric-quotient-realization.fragment.html` + `records/isometric_quotient_realization.json`, rôle `rebuilt-infrastructure` ; ferme `UFR-01`).
- *Déclarations `[CORE]` couvertes — `IQR-01` (`#global-isometric-quotient-realization`)* :
  - `GlobalTheory.T.quotient_lattice_realized_isometrically` (`QuotientLatticeRealizedIsometricallyStatement.lean#L7-L8`)
  - `GlobalTheory.QuotCoord.quot_realized`, `exists_quot_matrix`, `exists_coisometry`, `exists_frame`, `sizeQ_eq_size` (`QuotientLatticeRealizedIsometrically.lean#L9-L287`)
  - `GlobalTheory.T.exists_isometric_realisation_of_sublattice'` (`ExistsIsometricRealisationOfSublatticeStatement.lean#L7-L8`)
  - `GlobalTheory.exists_isometric_realisation_of_sublattice`, `GlobalTheory.SubReal.exists_isometry_factor` (`ExistsIsometricRealisationOfSublattice.lean#L28-L125`)
  - `Formalism.HN.rerealize`, `Formalism.HN.quotRealize` (`ShiftInvariance.lean#L58-L59`)
  - `Formalism.HN.lattice_rerealization` (`Rerealize.lean#L197-L341`)
- *Déclarations `[CORE]` couvertes — `IQR-02` (`#global-archimedean-orthogonal-span`)* :
  - `GlobalTheory.T.complexSpanAtRealPlace_autPointLattice_properties` (`ComplexSpanAtRealPlaceAutPointLatticePropertiesStatement.lean#L8-L9`)
  - `GlobalTheory.RealSpan.spanAt_properties`, `isSkew_map`, `inNil_map`, `inCen_map`, `span_perp` (`ComplexSpanAtRealPlaceAutPointLatticeProperties.lean#L87-L185`)
  - `GlobalTheory.PerpBaseChange.perpSet_baseChange`, `mem_span_of_forms` (`PerpSetBaseChange.lean#L24-L157`)
  - `GlobalTheory.IntegralBoundFlagMeasures.main` (`ImportsMore.lean#L7-L34`)

### Cycle 6 — Jauge de Haar riemannienne, indice de congruence et covolume absolu (`deep_cusp_jacobian_index`)
- *Statut* : ✅ Terminé (`content/deep-cusp-jacobian-index.fragment.html` + `records/deep_cusp_jacobian_index.json`, rôle `rebuilt-infrastructure` ; ferme `DCP-01`).
- *Déclarations `[CORE]` couvertes — `DCJ-01` (`#global-deep-chart-jacobian`)* :
  - `GlobalTheory.T.riemannianHaarGauge_exists_pos_unique` (`RiemannianHaarGaugeExistsPosUniqueStatement.lean#L6-L7`)
  - `GlobalTheory.GaugeConst.exists_unique_isGauge`, `exists_limit_of_chart`, `exists_limit` (`ExistsLimitOfChart.lean#L59-L303`)
  - `GlobalTheory.CompactDualExists.exists_density_of_chart` (`NonemptyCompactDualHaar.lean#L17-L94`)
  - `GlobalTheory.ExpChartExpanding.expanding`, `orderedProductExp_expanding_real_smul` (`OrderedProductExpExpandingRealSmul.lean#L176-L223`)
  - `GlobalTheory.ProductChart.lintegral_chart_le`, `lintegral_le_of_balls`, `eventually_ball_subset` (`EventuallyBallSubset.lean#L18-L526`)
- *Déclarations `[CORE]` couvertes — `DCJ-02` (`#global-deep-congruence-index`)* :
  - `GlobalTheory.CongIndex.measure_Kset_le`, `measure_le_card_mul`, `exists_end`, `congr_of_end`, `card_end_quot` (`MeasureLeCardMul.lean#L14-L216`)
- *Déclarations `[CORE]` couvertes — `DCJ-03` (`#global-deep-global-covolume`)* :
  - `GlobalTheory.T.leftQuotientCovolume_eq_fundamentalDomain_inter` (`LeftQuotientCovolumeEqFundamentalDomainInterStatement.lean#L6-L7`)
  - `GlobalTheory.CovolRat.covol_eq_inter_fund` (`LeftQuotientCovolumeEqFundamentalDomainInter.lean#L11-L41`)
  - `GlobalTheory.covol_eq_measure_inter_fund` (`LeftQuotientCovolumeEqMeasureInterFundamentalDom.lean#L9-L43`)
  - `GlobalTheory.T.unitaryGaugeVolume_le_classNumber_definite` (`UnitaryGaugeVolumeLeClassNumberDefiniteStatement.lean#L6-L7`)
  - `GlobalTheory.DefiniteVolume.gaugeVol_le`, `coset_of_isom`, `covol_le`, `gauge_local` (`UnitaryGaugeVolumeLeClassNumberDefinite.lean#L126-L247`)
  - `GlobalTheory.T.rank_two_definite_unimodular_hermitian_class_bound` (`RankTwoDefiniteUnimodularHermitianClassBoundStatement.lean#L6-L7`)
  - `GlobalTheory.RankTwoCount.rankTwoClasses`, `card_glueData_le`, `defClassNum_le_card` (`RankTwoDefiniteUnimodularHermitianClassBound.lean#L150-L256`)
  - `GlobalTheory.ShortVec.exists_short_vector` (`ExistsShortVectorUnimodularHermitianLatticeRankT.lean#L239-L383`)
  - `GlobalTheory.PlaneSplit.planeSplit` (`DefiniteUnimodularPlaneSplitAlongVector.lean#L290-L408`)
  - `GlobalTheory.RankOneClasses.card_classes_le` (`CardRankOneHermitianLatticeClassesLe.lean#L162-L240`)
  - `GlobalTheory.RealIdealCount.ncard_real_ideals_le` (`NcardRealGeneratedIdealsLe.lean#L64-L104`)
  - `GlobalTheory.GlueLines.card_gluings_le` (`CardUnimodularGluingsTwoLinesLe.lean#L218-L331`)
  - `GlobalTheory.classNumber_le_minkowski_count` (`ClassNumberLeMinkowskiCount.lean#L8-L13`)
  - `GlobalTheory.T.absolute_hermitian_volume_bound_arith` (`AbsoluteHermitianVolumeBoundArithStatement.lean#L6-L7`)
  - `GlobalTheory.VolArith.volume_bound_arith`, `volU_two`, `prod_rankFac_le` (`AbsoluteHermitianVolumeBoundArith.lean#L10-L125`)
  - `GlobalTheory.T.hermAbsoluteVolumeBound_of_volume_ratio_induction` (`HermAbsoluteVolumeBoundOfVolumeRatioInductionStatement.lean#L6-L7`)
  - `GlobalTheory.FlagMeas.AbsVol.absoluteVolume_of_volumeStep` (`HermAbsoluteVolumeBoundOfVolumeRatioInduction.lean#L37-L71`)
  - `GlobalTheory.UnitaryVolume.volume_unitary`, `volume_zero` (`RiemannianHaarGaugeVolumeUnitaryGroupEq.lean#L66-L133`)
  - `GlobalTheory.zetaProd_sphereVolume_bounds`, `GlobalTheory.ZetaProd.zeta_le`, `GlobalTheory.ZetaProd.prod_three_le` (`ZetaProdSphereVolumeBounds.lean#L9-L192`)


### Cycle 7 — Mesures de Haar paraboliques, calibration d'Iwasawa et constante à cinq facteurs (`parabolic_gauge_unfolding`)
- *Statut* : ✅ Terminé (`content/parabolic-gauge-unfolding.fragment.html` + `records/parabolic_gauge_unfolding.json`, rôle `rebuilt-infrastructure` ; ferme `RPI-01`, `FMU-01` et `RFV-01`).
- *Déclarations `[CORE]` couvertes — `PGU-01` (`#global-parabolic-modulus-shape`)* :
  - `GlobalTheory.GaugeSubLoc.gauge_local_asymptotics` (`GaugeMeasureMatrixAlgebraSubgroupLocalAsymptotic.lean#L164-L210`)
  - `GlobalTheory.GaugeConjScale.map_conj_eq_inv_det_smul`, `scalar_eq_inv_det`, `hs_conj_le` (`MapConjGaugeMeasureEqInvDetSmul.lean#L30-L181`)
  - `GlobalTheory.FlagModulus.flag_finrank_det` (`FlagNilradicalFinrankAndAbsDetConj.lean#L246-L356`)
  - `GlobalTheory.PerpModulus.perp_modulus` (`SignedFormOrthogonalFinrankDetUnitary.lean#L260-L296`)
  - `GlobalTheory.RealFormBasis.finrank_and_det` (`FinrankAndDetOfRealBasisSkewPart.lean#L49-L177`)
  - `GlobalTheory.DoubledFlag.sum_eq_dimN_and_layerProd_eq` (`DoubledFlagSumEqUnipotentDimAndLayerProd.lean#L22-L133`)
  - `GlobalTheory.FlagModulus.modulus` (`IsotropicFlagLeviConjHaarModulus.lean#L260-L424`)
  - `GlobalTheory.IwasawaShape.exists_lintegral_eq`, `exists_lintegral_eq_of_measurable` (`ExistsLintegralEqOfMeasurable.lean#L12-L244`)
  - `GlobalTheory.IwasawaShape.iwasawa_shape` (`IwasawaIntegrationFormulaUpToConstant.lean#L64-L98`)
- *Déclarations `[CORE]` couvertes — `PGU-02` (`#global-parabolic-slab-squeeze`)* :
  - `GlobalTheory.IwConst.flag_dims` (`IsotropicFlagDimensionCount.lean#L89-L117`)
  - `GlobalTheory.VolMaxK.volume_maxK`, `exists_gauge_allPos` (`VolumeUnitaryMaximalCompactEqProd.lean#L212-L277`)
  - `GlobalTheory.IwSand.gau_sandwich` (`IwasawaProductGaugeSandwichNearOne.lean#L139-L210`)
  - `GlobalTheory.IwConstBox.prod_gauge_body` (`TendstoProdGaugeMeasuresGaugeBody.lean#L42-L81`)
  - `GlobalTheory.IwConst.localised_iwasawa_asymptotics` (`LocalisedIwasawaIntegralSmallBallAsymptotics.lean#L35-L182`)
  - `GlobalTheory.IwConst.iwasawa_unfold_lintegral` (`IwasawaLintegralUnfoldCompactLevi.lean#L31-L82`)
  - `GlobalTheory.IwConst.slab_measure_squeeze` (`SlabMeasureSqueeze.lean#L11-L63`)
  - `GlobalTheory.IwConst.iwasawa_constant` (`IwasawaIntegrationFormulaConstant.lean#L157-L368`)
- *Déclarations `[CORE]` couvertes — `PGU-03` (`#global-flag-five-factor-quotient`)* :
  - `GlobalTheory.FlagMeas.covol_prod_le_tsum_slices` (`CovolProdLeTsumSlices.lean#L8-L57`)
  - `GlobalTheory.FlagUnfold.unfoldBound` (`IsotropicFlagUnfoldingBound.lean#L213-L284`)
  - `GlobalTheory.FlagMeas.fundDom_volume_pos_lt_top` (`UnitaryAdelicQuotientVolumePosLtTop.lean#L14-L45`)
  - `GlobalTheory.FiveFactors.prod_five_factors`, `volU_eq`, `prod_rankFac`, `dimN_eq`, `cIw_eq` (`ProdFiveFactorsHermitianVolume.lean#L9-L128`)
  - `GlobalTheory.FlagMeas.Bound.flagMeasureBound` (`IsotropicFlagProbabilityBoundOfVolumeRatio.lean#L64-L104`)
  - `GlobalTheory.DedekindZetaBound.one_le_zetaE_and_le`, `hasSum_zeta_pow` (`OneLeDedekindZetaRealValueAndLeZetaPow.lean#L39-L76`)
  - `GlobalTheory.FlagMeas.ConstBd.zeta_prod` (`FlagExplicitConstantLeExpNegHalf.lean#L55-L66`)