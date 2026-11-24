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
| 05 | `global` | Lattices and the arithmetic main term | `152` (`70` / `82`) | `1` | ⏳ À faire (Cycle 1 raccordé : `CNT-02`, `MSF-02`, `WUP-01`, `global.count` ; Cycle 5 ✅ Terminé : `IQR-01`–`02` ferment `UFR-01` ; Cycle 6 ✅ Terminé : `DCJ-01`–`03` ferment `DCP-01` ; Cycle 7 ✅ Terminé : `PGU-01`–`03` ferment `RPI-01`, `FMU-01`, `RFV-01` ; Cycle 8 ✅ Terminé : `FDW-01`–`03` ferment `FDG-01` ; 1 interface amont restante : `global.lattice`) |
| 06 | `lifts` | Theta lifts, local factors and the Galois input | `417` (`120` / `297`) | `3` | ⏳ À faire (Cycle 17 ✅ Terminé : `SCR-01`–`03` ferment `SDR-01` ; Cycle 18 ✅ Terminé : `ODN-01`–`03` + `SCR-01`/`03` ferment `OVM-01` ; Cycle 19 ✅ Terminé : `BHM-01`–`03` ferment `BGM-01`, achevant tout le Pilier A du Ch. 6 ; 3 interfaces restantes : `HFT-01`, `OCI-01`, `REX-01`) |
| 07 | `balance` | The arithmetic balance | `7` (`7` / `0`) | `0` | ✅ Terminé |
| 08 | `inputs` | Supplying the arithmetic hypotheses | `255` (`93` / `162`) | `0` | ✅ Terminé (Cycle 1 ✅ Terminé : `WPW-01`–`02` ; Cycle 4 ✅ Terminé : `RCL-01`–`03` ferment `WPW-01` ; Cycle 9 ✅ Terminé : `PRH-01`–`03` ferment `OVL-01` et `TPK-01` ; Cycle 10 ✅ Terminé : `SDD-01`–`02` ferment `SDM-01` ; Cycle 11 ✅ Terminé : `STR-01`–`03` ferment `SCM-01` ; Cycle 12 ✅ Terminé : `DZF-01`–`03` alimentent `ETZ-01`, `ETZ-02`, `SMR-01` ; Cycle 13 ✅ Terminé : `SCB-01`–`03` ferment `ETZ-01` et `EZS-01` et alimentent `ETZ-03`, `SMR-02`, `PSR-01` ; Cycle 14 ✅ Terminé : `HNT-01`–`02` ferment `DSG-01` et `INP-13` ; Cycle 15 ✅ Terminé : `CFT-01`–`03` ferment `ART-01` ; Cycle 16 ✅ Terminé : `PTD-01`–`03` ferment `LCL-01`, 100 % auto-contenu) |
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
8. ✅ **Cycle 8 (Terminé)** — **Ch. 5 (`global`)** : *Formule des dimensions de Weyl compacte sur $U(p) \times U(q)$, calibration de Haar polaire, limite gaussienne des coefficients matriciels tangents et enveloppe globale intégrable par potentiel de mineurs de Cauchy–Binet* (`formal-degree-weyl-envelope.fragment.html` + `formal_degree_weyl_envelope.json`, raccordé à `formal-degree`, `formal_degree.json` ; `FDW-01`–`03`, ferme `FDG-01`).
9. ✅ **Cycle 9 (Terminé)** — **Ch. 8 (`inputs`)** : *Séparation lisse dans le cône positif, comptage de dilatation réticulaire par empilement de boules de Haar, régularité et troncature locale de la rétraction dyadique, modules quadratiques relatifs de normalisation et rétraction, plancher de hauteur totalement complexe et fermeture différentielle en repère mobile* (`partition-relative-height.fragment.html` + `partition_relative_height.json`, raccordé à `partition-overlap`, `thick-partition`, `partition_overlap.json`, `thick_partition.json` ; `PRH-01`–`03`, ferme `OVL-01` et `TPK-01`).
10. ✅ **Cycle 10 (Terminé)** — **Ch. 8 (`inputs`)** : *Borne intégrale de puissance complexe sur pas unitaire, expansion de Gram hermitienne de la norme de colonne duale, majorant de diviseurs en puissances de premiers, borne monotone dyadique des carrés de coefficients et seuils logarithmiques simultanés d'absorption* (`short-detector-divisor-threshold.fragment.html` + `short_detector_divisor_threshold.json`, raccordé à `short-detector-mean-square`, `short_detector_mean_square.json` ; `SDD-01`–`02`, ferme `SDM-01`).
11. ✅ **Cycle 11 (Terminé)** — **Ch. 8 (`inputs`)** : *Redressement simultané par quatre transvections de rang un, cisaillements linéaires préservant les sous-espaces de coordonnées et translatés affines, projection de tête unimodulaire, règle de Leibniz de concaténation de préfixes et homotopie conique $\partial^2 = 0$, transport équivariant d'exactitude de liens, décomposition en tranches finies du double complexe et isomorphisme avec le complexe de représentation* (`split-transvection-retraction.fragment.html` + `split_transvection_retraction.json`, raccordé à `split-connectivity`, `split_connectivity.json` ; `STR-01`–`03`, ferme `SCM-01`).
12. ✅ **Cycle 12 (Terminé)** — **Ch. 8 (`inputs`)** : *Région sans zéro classique de $\zeta$ (exposant $1/200000$ via l'inégalité $3$–$4$–$1$ et le lemme du disque de rayon $1/2$), borne régionale de $\zeta'/\zeta + 1/(s-1)$ en $C(\log(|t|+2))^2$, formule de Perron et déplacement de contour au pôle double donnant $|G(y)| \le K y\, e^{-c\sqrt{\log y}}$ ; borne inverse de Möbius tordue, dérivée logarithmique uniforme à droite de $1$, somme locale des zéros en $11/10 + it$ (rayon $3/5$, constante $120(1 + \log(22C_1)/\log 2)$) avec multiplicités témoins de la dérivée ; réduction au caractère principal, positivité $3$–$4$–$1$ des caractères, exclusion des zéros des caractères non réels et des caractères réels à hauteur $\ge \delta/\log(q(|t|+2))$* (`dirichlet-zero-free-region.fragment.html` + `dirichlet_zero_free_region.json`, raccordé à `progression-relative-error`, `exceptional-twist-zero`, `exceptional-zero-saving`, `small-modulus-progression`, `exceptional_twist_zero.json`, `small_modulus_progression.json` ; `DZF-01`–`03`, alimente `ETZ-01`, `ETZ-02`, `SMR-01`).
13. ✅ **Cycle 13 (Terminé)** — **Ch. 8 (`inputs`)** : *Produit à quatre caractères $F(s) = \zeta(s)L(s,\chi_1)L(s,\chi_2)L(s,\psi)$ à coefficients $\ge 0$, prolongement entier $G(s) = F(s) - \lambda/(s-1)$, croissance $|F| \le 14(9|C_G|/2)^3(q_1q_2)^3$ sur $|s-2|=3/2$, majoration près de $1$ en $38 e^{3/2}\log(3q)$, développement de Taylor alterné en $s=2$ et inégalité clé d'Estermann ; existence de $\psi$ et $\chi_4$, négativité de $\zeta$ sur $(0,1)$, positivité de $L(\sigma,\chi)$, comparaison de facteurs d'Euler $(\omega(q_1q)+1)^2$ et déduction unifiée de la borne inférieure de Siegel $|L(1,\chi)| \ge c q^{-\varepsilon}$ ; borne de Cauchy $|L'(\sigma,\chi)| \le 76 e^{3/2}(\log(3q))^2$ et écart de zéro exceptionnel $\beta \le 1 - c q^{-\varepsilon}$* (`siegel-class-number-bound.fragment.html` + `siegel_class_number_bound.json`, raccordé à `progression-relative-error`, `exceptional-twist-zero`, `exceptional-zero-saving`, `small-modulus-progression`, `power-sum-repulsion`, `exceptional_twist_zero.json`, `exceptional_zero_saving.json`, `small_modulus_progression.json`, `power_sum_repulsion.json`, `progression_relative_error.json` ; `SCB-01`–`03`, ferme `ETZ-01` et `EZS-01`).
14. ✅ **Cycle 14 (Terminé)** — **Ch. 8 (`inputs`)** : *Égalité fondamentale $[C_K : N_{L/K}(C_L)] = [L : K]$ et annulation $\lvert \widehat{H}^{-1}(G, C_L) \rvert = 1$ en cohomologie de Tate cyclique par quotient de Herbrand $h(C_L) = [L : K]$, première et seconde inégalités ; théorèmes des normes de Hasse cyclique et quadratique par assemblage local-idélique sur les unités non ramifiées, et critères de norme locale partout pour un idéal CM $I \cdot c(I) = (a)$ à générateur $a$ totalement positif (approximation de Dedekind aux places finies et racine $d$-ième réelle aux places infinies)* (`quadratic-hasse-norm.fragment.html` + `quadratic_hasse_norm.json`, raccordé à `ambiguous-class-index`, `dyadic-signatures`, `tower-descent`, `dyadic_signatures.json`, `tower_descent.json` ; `HNT-01`–`02`, ferme `DSG-01` et `INP-13`).
15. ✅ **Cycle 15 (Terminé)** — **Ch. 8 (`inputs`)** : *Réciprocité d'Artin globale (formule du produit rationnelle cyclotomique en normalisation de Frobenius arithmétique, identification du symbole abstrait et du symbole idélique par densité et ouverture de $N_{L/K}(\mathbb{I}_L)$, noyau $N_{L/K}(C_L)$ et isomorphisme $C_K/N_{L/K}(C_L) \cong \operatorname{Gal}(L/K)$ d'indice $[L:K]$) ; théorème d'existence global par limitation des normes $N_{M/K}(C_M) = N_{M^{\mathrm{ab}}/K}(C_{M^{\mathrm{ab}}})$, réalisation de Kummer sur les $S$-unités lorsque $\mu_n \subseteq K$, changement de base cyclotomique $K(\mu_m)$ et bijection décroissante $L \mapsto N_{L/K}(C_L)$ ; corps de classes de rayons $K(\mathfrak{m})$ (isomorphisme idélique-idéal $C_K/[U(\mathfrak{m})] \cong \mathrm{Cl}_{\mathfrak{m}}(K) \cong \operatorname{Gal}(K(\mathfrak{m})/K)$, non-ramification hors $\mathfrak{m}_0$, loi de décomposition totale $\mathrm{Frob}_{\mathfrak{p}} = 1 \iff [\mathfrak{p}] = 1$) et spécialisation aux extensions partout non ramifiées et au corps de classes de Hilbert $H = K(1)$* (`global-class-field-theory.fragment.html` + `global_class_field_theory.json`, raccordé à `artin-descent`, `artin_descent.json` ; `CFT-01`–`03`, ferme `ART-01`).
16. ✅ **Cycle 16 (Terminé)** — **Ch. 8 (`inputs`)** : *Finitude de la cohomologie galoisienne locale et dimension cohomologique deux ($\lvert H^t(G_K, M) \rvert, \lvert H^t(G_K, M^*) \rvert < \infty$ et $H^t = 0$ pour $t \ge 3$ dès que $\lvert M \rvert \neq 0$ dans $K$, inconditionnellement sur $K/\mathbb{Q}_\ell$) ; dualité locale de Tate par invariant de Brauer et accouplement de Cartier ($H^r(G_K, M) \cong H^s(G_K, M^*)^\vee$ pour $r+s=2$) transportée aux cup-produits cyclotomiques tordus sur $\mathbb{Z}/\ell^r\mathbb{Z}$ ; dualité globale de Poitou–Tate à support compact ($r+s=3$), accouplement de Shafarevich–Tate ($\amalg^1_S \leftrightarrow \amalg^2_S$), suite exacte à neuf termes sous $(\ell \neq 2 \lor K \text{ totalement complexe})$, invariants locaux $\zeta$-normalisés et compatibilité automatique par conjugaison* (`poitou-tate-duality.fragment.html` + `poitou_tate_duality.json`, raccordé à `local-cohomology-length`, `degree-two`, `local_cohomology_length.json` ; `PTD-01`–`03`, ferme `LCL-01` et rend le Ch. 8 100 % auto-contenu).
17. ✅ **Cycle 17 (Terminé)** — **Ch. 6 (`lifts`)** : *Action de Möbius composante par composante de $\mathrm{SL}_2(F)$ sur le demi-plan de Hilbert, identité de produit des carrés de plongements réels et plancher équilibré de hauteur $z_w \ge \kappa \min(1, P)$ ; topologie et changement d'échelle de Haar fini-adélique, donnée quadratique auto-duale de Weil, factorisation d'Iwasawa constructive $w_0 n(b) = n(y) m(a) k$ avec $k \in \mathrm{SL}_2(\widehat{\mathcal{O}}_F)$, base de voisinages de congruence $N \widehat{\mathcal{O}}_F^{2M}$, décroissance uniforme $\lvert f^*(\varphi, b)\rvert \le C \operatorname{den}(b)^{-M}$, sommabilité/non-annulation et automorphie assortie des séries thêta et d'Eisenstein ; mesure de Haar produit sur une extension scindée $1 \to N \to P \rightleftarrows G_1 \to 1$, trivialité automatique du caractère modulaire de conjugaison $\delta \equiv 1$ sur un réseau de covolume fini et dépliage intégral sur $\mathcal{F}_P = \Phi(D \times \mathcal{F}_1)$* (`siegel-cusp-and-orbit-reduction.fragment.html` + `siegel_cusp_and_orbit_reduction.json`, raccordé à `siegel-discrepancy`, `siegel-weil`, `siegel_discrepancy.json` ; `SCR-01`–`03`, ferme `SDR-01`).
18. ✅ **Cycle 18 (Terminé)** — **Ch. 6 (`lifts`)** : *Caractère additif fini-adélique standard $\psi$ et périodicité réticulaire de $f^*(\varphi, \cdot)$, volume du domaine fondamental de $N\mathcal{O}_F$ et orthogonalité des caractères, extraction des coefficients de Fourier des séries thêta moyennées et d'Eisenstein par dépliage sur $F/N\mathcal{O}_F$, et inversion de Fourier fournissant les densités continues de niveaux quadratiques $D_f$ et $D_\infty$ ; identification scalaire des matrices hermitiennes $1 \times 1$, mesures de Haar coordonnées par homéomorphisme demi-trace sur $\mathrm{Herm}_n(R \otimes_F E)$, finitude locale et stricte positivité ouverte des mesures de fibres de Gram par sections de congruence, stabilité presque partout des réseaux standards sous actions rationnelles, factorisation en produit eulérien par renormalisation place par place et évaluation sur boîtes restreintes ; cocompacité du quotient unitaire binaire anisotrope $U(J, F) \backslash U(J, \mathbb{A}_F)$, finitude locale des mesures thêta cocompactes et factorisation eulérienne à un scalaire près en rang $M = 2$* (`one-vector-density-normalization.fragment.html` + `one_vector_density_normalization.json`, raccordé à `one-vector-mass`, `siegel-weil`, `one_vector_mass.json` ; `ODN-01`–`03`, ferme `OVM-01`).
19. ✅ **Cycle 19 (Terminé)** — **Ch. 6 (`lifts`)** : *Comptage fin de quadriques de rang pair $2M$ sur corps fini ($\lvert N(s) - q^{2M-1}\rvert \le q^{M-1}$ par invariance de la somme de Gauss), relèvement primitif unitaire ($2/q^M$ pour tout $M \ge 1$ et $2/q^2$ en rang binaire) et récurrence de valuation à pas deux en rang supérieur $M \ge 3$ ($2/q^{M-1}$) ; factorisation en produit d'orbites unitaires sur lieux fermés et ouverts réguliers par image réciproque, borne inductive $C_n/q^2$ ($C_n = 3^n - 1$) et convergence absolue du produit eulérien en zone de Weil ($n = 0 \lor n + 2 \le M$), addition de bloc de rang un par annulation produit $c_\infty \prod_{v \in S} c_v = 1$ et propagation d'annulation anisotrope, crible d'ensemble des parties par normes d'idéaux produits et intégrabilité complexe en produit eulérien contre tests archimédiens non compacts ; coordonnées réelles archimédiennes $\mathbb{R}^{2nM[F:\mathbb{Q}]}$ entrelaçant la multiplication à droite, jacobiens de Haar continus strictement positifs $A(g), C(g)$, décroissance de Schwartz et transport par sections locales de congruence clôturant le pilier bas-rang de Siegel* (`binary-higher-rank-mass-convergence.fragment.html` + `binary_higher_rank_mass_convergence.json`, raccordé à `binary-good-mass`, `siegel-weil`, `binary_good_mass.json` ; `BHM-01`–`03`, ferme `BGM-01` et achève tout le Pilier A du Ch. 6).
20. ⏳ **Cycles suivants** — Dépliage ordonné des 4 interfaces amont restantes (Ch. 5 : 1 ; Ch. 6 : 3 ; Ch. 8 : 0).

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
| $P(z)$ | Matrice tangente hermitienne hors-diagonale en coordonnées polaires sur $U(p,q)$ ($P(z)_{a,b} = z_{a,b}$ pour $b < a$, $\varepsilon_a \neq \varepsilon_b$, nulle sur chaque bloc de même signe) | Ch. 5 |
| $J(z)$ | Jacobien polaire hyperbolique $\prod_{0 \le a < b < N} \mathrm{shc}(\mu_a(z) - \mu_b(z))$ ($\mu_a(z)$ valeurs propres de $P(z)$) | Ch. 5 |
| $\Phi(\lambda, X)$ | Potentiel de mineurs de Cauchy–Binet $\sum_{i=0}^{N-2} (\lambda_i - \lambda_{i+1} + 1)\,\ell_{i+1}(X)$ | Ch. 5 |
| $\ell_i(X) = \log \Delta_i(\exp X)$ | Logarithme du mineur principal dominant d'ordre $i$ de $\exp X$ | Ch. 5 |
| $L_\theta$ | Constante de Lipschitz globale de la coupure lisse $\theta : \mathbb{R} \to [0, 1]$ | Ch. 8 |
| $F_0 \subset \mathcal{O}_L^N$ | Ensemble fini local de vecteurs réticulaires tronquant la rétraction dyadique $R$ près de $h_0$ | Ch. 8 |
| $\Lambda_{8s}, \Lambda_{4s/5}$ | Ensembles réticulaires $\{v \in \mathcal{O}_L^N : q_h(v) \le 8s\}$ et $\{v \in \mathcal{O}_L^N : q_h(v) \le \frac{4}{5}s\}$ comparés au facteur de dilatation $10$ | Ch. 8 |
| $N_0(h) = A_h^{-1} h$, $A_h$ | Normalisation à l'échelle commune avec $A_h = P_{\mathrm{mult}}(h)^{1/(N[L:\mathbb{Q}])}$ et $P_{\mathrm{mult}}(h) = \prod_w (\det h_w)^{\mathrm{mult}(w)}$ | Ch. 8 |
| $C_T, C_R$ | Constantes de module quadratique relatif à une échelle ($C_T = (160 L_\theta + 40)C_{10}$) et pour la rétraction dyadique $R$ | Ch. 8 |
| $c_0, C_*$ | Plancher uniforme de hauteur $H(h_x) \ge c_0 := [\max(1, I_0^2)]^{-1} > 0$ et constante de dérivée $C_* = 3 N C_\psi C_R(1 + c_0^{-1})$ à l'exposant $a = 1$ | Ch. 8 |
| $\mathrm{dist}_1(A)$ | Distorsion matricielle par entrées $(1 + \sum_{w,i,j} \lvert (A_w - I_N)_{i,j} \rvert)^2 \in [1, \infty)$ sur $G_p(L, N)$ | Ch. 8 |
| $C, D, C_1, Q_0$ | Constantes du majorant de diviseurs ($D = A^K$, $C = D^2$ à $\varepsilon = 1/400$), préfacteur $C_1 = 1 + 8C \cdot 1048576^{3/200}$ et seuil d'absorption $Q_0 \ge 20$ | Ch. 8 |
| $T_{a,b} = I_m + a b^T$ | Transvection de rang un dans $\mathrm{GL}_m(R)$ pour $b \cdot a = 0$ (inverse $I_m - a b^T$) | Ch. 8 |
| $M_\infty = \bigoplus_{k \ge 0} R e_k$ | Module des suites à support fini sur un anneau commutatif $R$ de rang stable $\le s$ | Ch. 8 |
| $L_n$, $A_{n,j}$ | Sous-module des $n$ premières coordonnées $L_n = \mathrm{span}_R\{e_0,\dots,e_{n-1}\}$ et translaté affine $A_{n,j} = e_j + L_n$ dans $M_\infty$ | Ch. 8 |
| $\mathcal{U}(M)$, $\mathcal{U}_m$ | Ensemble des listes ordonnées unimodulaires $[x_0,\dots,x_{q-1}]$ dans $M$ (ou $R^m$) admettant des formes duales simultanées $F_i(x_j) = \delta_{i,j}$ | Ch. 8 |
| $\kappa_x$ | Opérateur de cône par préfixage $\kappa_x(\langle l\rangle) = \langle [x] \mathbin{++} l\rangle$ sur $\mathbb{Z}[\mathrm{List}(V)]$ vérifiant $\partial \circ \kappa_x = \mathrm{id} - \kappa_x \circ \partial$ | Ch. 8 |
| $\Phi_p : \mathbb{Z}[\mathcal{S}_{n,p}] \to \mathbb{Z}[\mathrm{List}(R^n \times R^n)]$ | Plongement linéaire des listes scindées typées de longueur $p$ sur $C_p(\mathcal{S}_n)$ entrelaçant $d_p$ et $\partial$ | Ch. 8 |

---

## 4. Registre des déclarations Lean `[CORE]` couvertes par section

### Chapitres auto-contenus existants (Ch. 1, 2, 3, 4, 7, 8, 9, 10)
- Couverture complète figée dans `records/*.json` et `records/solution_terms.json` (`989` résultats au total après Cycle 19 : `371` `core-argument` / `618` `rebuilt-infrastructure`, `950` auto-contenus, `4` interfaces ouvertes).

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

### Cycle 8 — Formule des dimensions de Weyl compacte, calibration polaire et enveloppe de mineurs (`formal_degree_weyl_envelope`)
- *Statut* : ✅ Terminé (`content/formal-degree-weyl-envelope.fragment.html` + `records/formal_degree_weyl_envelope.json`, rôle `rebuilt-infrastructure` ; ferme `FDG-01`).
- *Déclarations `[CORE]` couvertes — `FDW-01` (`#global-formal-weyl-limit`)* :
  - `Formalism.L2.G.Model.weyl_dualWeyl`, `finrank_dualWeyl`, `weylQ` (`WeylDim.lean#L259-L312`)
  - `weylForU_closed`, `nablaDim_closed`, `modelIso_closed` (`WeylForU.lean#L7-L11`)
  - `weylForK_closed` (`WeylForK.lean#L1-L4`)
  - `PI.WeylForKWork.weyl_formula_compact`, `prod_pairs_split` (`Formula.lean#L150-L195`)
  - `ReciprocityTheory.ChartRestriction.DS.HW.weyl_dimension_formula_product` (`WeylBridge.lean#L10-L22`)
  - `ReciprocityTheory.ChartRestriction.DS.HW.hwfin_weyl` (`Finrank.lean#L16-L26`)
  - `ReciprocityTheory.ChartRestriction.DS.lemma7`, `nab`, `rhoN_sub_nab` (`RhoNSubNab.lean#L15-L56`)
  - `ReciprocityTheory.ChartRestriction.DS.dimVlam_eq_vand`, `prod_pairs_eq_factorial` (`ProdSubLtEqFactorial.lean#L191-L206`)
  - `ReciprocityTheory.ChartRestriction.DS.formal_degree_constant_eq`, `pi_weight_at_zero_eq` (`FdConst.lean#L41-L154`)
- *Déclarations `[CORE]` couvertes — `FDW-02` (`#global-formal-polar-lower`)* :
  - `ReciprocityTheory.ChartRestriction.DS.omegaDensity_muCDtr`, `tie_d_eq` (`OmegaDensityMuCDtr.lean#L66-L239`)
  - `ReciprocityTheory.ChartRestriction.DS.muCD_eq_cd_vol`, `UpperTriangularPsiTransport.omegaDensity_unique` (`OmegaDensityUnique.lean#L276-L338`)
  - `ReciprocityTheory.ChartRestriction.DS.lemma6a` (`SumInnerBasisSqEqAdjoint.lean#L77-L157`)
  - `ReciprocityTheory.ChartRestriction.DS.formal_degree_inequality`, `hsOp_ge_integral`, `lintegral_fF_coeff_sq_le_finrank_div_fdeg` (`SumNormAdjointSqEqHsOp.lean#L52-L167`)
  - `ReciprocityTheory.ChartRestriction.DS.Lap.Base.matrixCoeffBounds_imply_bound` (`MatrixCoeffBoundsImplyBound.lean#L69-L225`)
  - `ReciprocityTheory.ChartRestriction.DS.Lap.Base.b3` (`Imports.lean#L12-L14`)
  - `ReciprocityTheory.ChartRestriction.DS.matrix_coefficient_pointwise_limit`, `qForm_pmat` (`FdPointwise.lean#L93-L170`)
  - `ReciprocityTheory.ChartRestriction.DS.lintegral_pcoord_smul` (`FdScale.lean#L14-L34`)
  - `ReciprocityTheory.ChartRestriction.DS.fdl_gauss` (`FdLowerA.lean#L68-L101`)
  - `ReciprocityTheory.ChartRestriction.DS.formal_degree_liminf_lower_bound` (`FdLower.lean#L18-L73`)
- *Déclarations `[CORE]` couvertes — `FDW-03` (`#global-formal-envelope-upper`)* :
  - `ReciprocityTheory.ChartRestriction.DS.lemma6c`, `lemma6b` (`IntegrableOfContinuousCompact.lean#L239-L372`)
  - `ReciprocityTheory.ChartRestriction.DS.lemma3b`, `lemma3a`, `lemma3c`, `lemma3d` (`EigenvectorUnitaryMulStar.lean#L66-L167`)
  - `ReciprocityTheory.ChartRestriction.DS.fi_lower`, `fi_convex` (`FiPmatEqFiOneSmulPmat.lean#L34-L83`)
  - `ReciprocityTheory.ChartRestriction.DS.ph_lower`, `ph_scale` (`SCoefGeTwoOfHc.lean#L54-L200`)
  - `ReciprocityTheory.ChartRestriction.DS.potential_lower_min`, `hs_eighth_le_of_small` (`HsEighthLeOfSmall.lean#L36-L94`)
  - `ReciprocityTheory.ChartRestriction.DS.jac_ge_one`, `shc_bounds`, `log_jac_le_rho` (`JacobianLeExp.lean#L39-L105, #L252-L298`)
  - `ReciprocityTheory.ChartRestriction.DS.fdU_far`, `fdU_near`, `fdU_c_pos`, `fdU_exp_le_prod` (`FdUpperB.lean#L54-L207`)
  - `ReciprocityTheory.ChartRestriction.DS.fdU_integrable_prod_exp`, `fdU_lintegral_gauss` (`FdUpperA.lean#L61-L78`)
  - `ReciprocityTheory.ChartRestriction.DS.formal_degree_limsup_upper_bound`, `fdU_major`, `fdU_pointwise` (`FdUpper.lean#L28-L137`)
  - `ReciprocityTheory.ChartRestriction.DS.thmFD` (`ThmFD.lean#L21-L104`)

### Cycle 9 — Séparation lisse dans le cône, modules quadratiques relatifs et plancher de hauteur (`partition_relative_height`)
- *Statut* : ✅ Terminé (`content/partition-relative-height.fragment.html` + `records/partition_relative_height.json`, rôle `rebuilt-infrastructure` ; ferme `OVL-01` et `TPK-01`).
- *Déclarations `[CORE]` couvertes — `PRH-01` (`#inputs-overlap-smooth-separation`)* :
  - `PositivityTheory.KB.SmoothPartitionUnityBasic.pf_GBump` (`GbGSmooth.lean#L70-L93, #L146-L166`)
  - `PositivityTheory.KB.SmoothPartitionUnityBasic.pf_GCount`, `ncard_q_le_mul_le_sqrt_pow_mul_ncard` (`GCount.lean#L157-L284`)
  - `PositivityTheory.KB.SmoothPartitionUnityBasic.pf_GREqv`, `ret_act`, `psd_term` (`RhoNonneg.lean#L76-L130`)
  - `PositivityTheory.KB.SmoothPartitionUnityBasic.pf_GRSmooth` (`GRSmooth.lean#L79-L225`)
- *Déclarations `[CORE]` couvertes — `PRH-02` (`#inputs-overlap-relative-moduli`)* :
  - `PositivityTheory.KB.SmoothPartitionUnityBasic.LipschitzAlgebraNorm.lipAlg`, `detMono` (`DiagForm.lean#L42-L105`)
  - `PositivityTheory.KB.SmoothPartitionUnityBasic.pf_GNrm` (`GProdScale.lean#L107-L185`)
  - `PositivityTheory.KB.SmoothPartitionUnityBasic.pf_GTLip`, `place_form_perturbation_bound_of_sq_le`, `abs_ratio_perturbation_bound_of_estimates` (`RhoNonnegBis.lean#L139-L421`)
  - `PositivityTheory.KB.SmoothPartitionUnityBasic.pf_GRLip`, `pf_GRLip_lemma_6` (`PfGRLip.lean#L97-L500`)
  - `PositivityTheory.KB.SmoothPartitionUnityBasic.pf_GFin` (`PfGFin.lean#L89-L117`)
- *Déclarations `[CORE]` couvertes — `PRH-03` (`#inputs-overlap-height-floor`)* :
  - `PositivityTheory.KB.HeightDistance.one_le_lm_one`, `lm_mul_le`, `one_le_norm_place`, `lm_iv_pos`, `lm_tp_pos` (`MatrixTupleDistortionPos.lean#L90-L238`)
  - `PositivityTheory.KB.HeightDistance.ht_lower`, `lm_prod_le` (`ContinuousHt.lean#L155-L190`)
  - `PositivityTheory.KB.sHt_of` (`SHtOf.lean#L6-L9`)
  - `PositivityTheory.KB.SmoothPartitionUnityBasic.pf_DerB`, `d_key` (`PfDerB.lean#L17-L63`)
  - `PositivityTheory.KB.SmoothPartitionUnityBasic.pf_GFin` (`PfGFin.lean#L118-L130`)
  - `PositivityTheory.KB.sPU_of` (`SPUOf.lean#L23-L31`)
  - `PositivityTheory.KB.sPU` (`SBridge.lean#L32-L35`)

### Cycle 10 — Majorant de diviseurs, pas unitaire complexe, dualité hermitienne et seuils d'absorption (`short_detector_divisor_threshold`)
- *Statut* : ✅ Terminé (`content/short-detector-divisor-threshold.fragment.html` + `records/short_detector_divisor_threshold.json`, rôle `rebuilt-infrastructure` ; ferme `SDM-01`).
- *Déclarations `[CORE]` couvertes — `SDD-01` (`#inputs-short-detector-hermitian-step`)* :
  - `Formalism.FX.LFunctionPartialSum.cpow_sub_eq_integral`, `norm_integral_le`, `integral_rpow_le`, `norm_cpow_sub_le'` (`LFunctionEqGOfOneLt.lean#L15-L73`)
  - `Formalism.HermitianLattices.Ext.PrimitiveCharacterCasts.ZD.norm_cpow_step_le` (`CountZTwist.lean#L13-L30`)
  - `Formalism.HermitianLattices.Ext.PrimitiveCharacterCasts.ZD.duality_inequality` (`CountZDual.lean#L9-L124`)
- *Déclarations `[CORE]` couvertes — `SDD-02` (`#inputs-short-detector-divisor-window`)* :
  - `Formalism.FX.succ_le_max_mul_exp`, `succ_le_max_mul_pow`, `succ_le_pow_of_two_le`, `rpow_eq_prod_primeFactors`, `divisor_weight_bound` (`DivisorBound.lean#L7-L92`)
  - `Formalism.HermitianLattices.Ext.PrimitiveCharacterCasts.ZD.mco_one` (`CountZMoll.lean#L10-L21`)
  - `Formalism.HermitianLattices.Ext.PrimitiveCharacterCasts.ZD.mco_norm_le` (`CountZMoll.lean#L60-L78`)
  - `Formalism.HermitianLattices.Ext.PrimitiveCharacterCasts.ZD.mollifier_identity` (`CountZMoll.lean#L79-L131`)
  - `Formalism.HermitianLattices.Ext.PrimitiveCharacterCasts.ZD.coefficient_square_bound` (`CountZMoll.lean#L133-L191`)
  - `Formalism.HermitianLattices.Ext.PrimitiveCharacterCasts.ZD.numeric_constants` (`CountZNum.lean#L10-L134`)

### Cycle 11 — Redressement par quatre transvections, opérateurs de préfixe et tranches de double complexe (`split_transvection_retraction`)
- *Statut* : ✅ Terminé (`content/split-transvection-retraction.fragment.html` + `records/split_transvection_retraction.json`, rôle `rebuilt-infrastructure` ; ferme `SCM-01`).
- *Déclarations `[CORE]` couvertes — `STR-01` (`#inputs-split-transvection-straightening`)* :
  - `GlobalTheory.T.exists_GL_moving_unimodular_pair_to_last_basis`, `GlobalTheory.UnimodTransvect.tv`, `tv_mulVec`, `vecMul_tv_inv`, `reach_of_last_one`, `reach_last_one`, `reach_first_unimod`, `main` (`ExistsGLMovingUnimodularPairToLastBasis.lean#L17-L126`)
  - `GlobalTheory.T.exists_transvection_preserving_low_and_aff`, `GlobalTheory.ShearLow.main` (`ExistsTransvectionPreservingLowAndAff.lean#L8-L60`)
  - `GlobalTheory.T.cons_mem_uniM_iff_map_sub_smul`, `GlobalTheory.UniModVec.cons_mem_uniM_iff_map_proj` (`ConsMemUniMIffMapSubSmul.lean#L25-L73`)
- *Déclarations `[CORE]` couvertes — `STR-02` (`#inputs-split-prefix-chain-operators`)* :
  - `GlobalTheory.T.seqChain_boundary_prefix_chain`, `GlobalTheory.SeqCx.bd_single_append`, `bd_mapDomain_prepend` (`SeqChainBoundaryPrefixChain.lean#L13-L52`)
  - `GlobalTheory.T.seqChain_boundary_comp_boundary_apply`, `GlobalTheory.SeqCx.BdBd.consMap`, `bd_consMap`, `bd_bd_single`, `GlobalTheory.SeqCx.bd_bd` (`SeqChainBoundaryCompBoundaryApply.lean#L12-L72`)
  - `GlobalTheory.T.seqChain_exactAt_map_iff`, `GlobalTheory.SeqCxMap.bd_mapDomain`, `chains_map` (`SeqChainExactAtMapIff.lean#L8-L57`)
  - `GlobalTheory.T.exactAt_unimodularSeqs_of_link_nil_coordSubspace`, `GlobalTheory.SeqCxLow.link_eq` (`ExactAtUnimodularSeqsOfLinkNilCoordSubspace.lean#L61-L133`)
  - `GlobalTheory.T.exactAt_linkIn_uniM_of_exactAt_map_linearEquiv`, `GlobalTheory.SeqCxLinkEquiv.exactAt_linkIn_of_map` (`ExactAtLinkInUniMOfExactAtMapLinearEquiv.lean#L60-L85`)
  - `GlobalTheory.T.exactAt_linkIn_succ_union_translate_of_ne_nil`, `GlobalTheory.linkExact_low_union_aff_of_ne_nil` (`ExactAtLinkInSuccUnionTranslateOfNeNil.lean#L16-L38`)
- *Déclarations `[CORE]` couvertes — `STR-03` (`#inputs-split-double-slice-transfer`)* :
  - `GlobalTheory.T.pairSeqVerticalCycle_is_boundary_of_slices_exact`, `GlobalTheory.SeqCx.vertical_exact_of_columns` (`PairSeqVerticalCycleIsBoundaryOfSlicesExact.lean#L47-L105`)
  - `GlobalTheory.T.pairSeqHorizontalCycle_is_boundary_of_slices_exact`, `GlobalTheory.SeqCx.dblRow_exact` (`PairSeqHorizontalCycleIsBoundaryOfSlicesExact.lean#L65-L124`)
  - `GlobalTheory.T.splitSet_permRep_chains_iso_splitSeq_chains`, `GlobalTheory.HomStab.splitSet_chains_incl` (`SplitSetPermRepChainsIsoSplitSeqChains.lean#L27-L59`)
  - `GlobalTheory.T.splitSequence_rep_complex_exact`, `GlobalTheory.HomStab.SplitEx.main` (`SplitSequenceRepComplexExact.lean#L11-L78`)
### Cycle 12 — Régions sans zéro de $\zeta$ et des fonctions $L$ de Dirichlet, somme locale des zéros et contour de Perron (`dirichlet_zero_free_region`)
- *Statut* : ✅ Terminé (`content/dirichlet-zero-free-region.fragment.html` + `records/dirichlet_zero_free_region.json`, rôle `rebuilt-infrastructure` ; dépendances `DZF-01` ← `LZE-01`, `DZF-02` ← `LZE-01`, `LZE-02`, `DZF-01`, `DZF-03` ← `DZF-01`, `DZF-02` ; consommateurs `ETZ-01` ← `DZF-02`, `ETZ-02` ← `DZF-01`–`03`, `SMR-01` ← `DZF-01`, `DZF-03`, `ETZ-02` ; aucune dépendance à la borne de Siegel).
- *Déclarations `[CORE]` couvertes — `DZF-01` (`#inputs-riemann-zero-free-region`)* :
  - `Formalism.ZF.mertensInequality`, `Formalism.ZF.VonMangoldtMertensInequality.re_term_vonMangoldt`, `hasSum_re_L`, `comb_nonneg` (`ThreeFourOne.lean#L11-L65`)
  - `Formalism.ZF.zfo_landau`, `zfo_term_re_nonneg`, `zfo_zero_re_lt` (`ZfoTermReNonneg.lean#L9-L63`)
  - `Formalism.ZF.zfo_large`, `zfo_neg_re_le_norm` (`ZfoNegReLeNorm.lean#L10-L93`)
  - `Formalism.ZF.classicalZeroFreeRegionOfBounds` (`ZeroFreeOf.lean#L10-L32`), `Formalism.ZF.zeroFreeRegion`, `landauLocal` (`FinalZFR.lean#L15-L19`)
  - `Formalism.ZF.ldr_mid` (`LdrMid.lean#L9-L124`), `Formalism.ZF.logDerivBoundInRegionOfBounds` (`LogDerivRegionOf.lean#L10-L85`), `Formalism.ZF.logDerivRegion` (`LogDerivRegion.lean#L14-L16`)
  - `Formalism.ZF.abs_zetaPrimeSumError_le_of_large` (`AbsZetaPrimeSumErrorLeOfLarge.lean#L12-L198`), `Formalism.ZF.zetaPrimeSumErrorBoundOfBounds`, `abs_zetaPrimeSumError_le_of_sqrt_log_lt` (`GzPNTOf.lean#L11-L93`), `Formalism.ZF.gzPNT`, `rectShift` (`LogDerivRegion.lean#L18-L21`)
- *Déclarations `[INFRA]` (détails repliés) — `DZF-01`* : `logDerivBoundRightHalfPlane` (`LogDerivRight.lean#L11-L42`), `growthBound`, `norm_Dz_le` (`ZetaGrowth.lean#L11-L95`), `riemannZetaOne_eq_one_sub_of_re_pos` (`RiemannZetaOneEqOneSubOfRePos.lean#L68-L87`), `Dz`, `dz` (`DzDifferentiableOn.lean#L11-L15`), `zetaInvBound_statement`, `tsum_rpow_le`, `norm_term_moebius_le` (`ZetaInvBound.lean#L43-L108`), `zeroFreeBoundedHeight` (`SmallHeight.lean#L9-L42`), `logDerivBoundedHeight` (`ZetaLogDerivativeBounds/SmallHeightLogDeriv.lean#L26-L64`), `zfo_M_bound`, `zfo_growth_ball`, `zfo_diff_ball` (`ZfoGrowthBall.lean#L37-L106`), `perron_formula`, `perron_mellin_Sz`, `perron_mellinConvergent`, `perron_verticalIntegrable` (`Perron.lean#L210-L280`), `rectangle_double_pole`, `rdp_rectInt_double`, `rdp_seg` (`RectDoublePole.lean#L80-L149`), `laurentExpansionAtOne`, `laH_deriv_one` (`LaurentAtOne.lean#L34-L89`), `rectangleShiftOfResidue` (`RectShiftOf.lean#L32-L88`), `norm_perronIntegrand_le_left`, `…_right`, `…_horizontal`, `riemannZeta_ne_zero_of_mem_rectangle` (`RiemannZetaNeZeroOfMemRectangle.lean#L27-L172`), `abs_zetaPrimeSumError_le_of_one_le`, `zetaPrimeSum_nonneg_and_le` (`AbsZetaPrimeSumErrorLeOfOneLe.lean#L10-L51`) ; énoncés `ZeroFreeRegion`, `LogDerivRegion`, `GzPNT` (`Statement.lean#L9-L18`), `Formalism.Sz`, `Formalism.Gz` (`StatementOC.lean#L11-L13`), `ZeroFreeOf` et Props intermédiaires (`ZeroFreeRegion/SmallHeightLogDeriv.lean#L19-L102`).
- *Déclarations `[CORE]` couvertes — `DZF-02` (`#inputs-dirichlet-local-zero-sum`)* :
  - `Formalism.ZeroFreeDirichlet.exists_localZeroExpansion_of_bound`, `deriv_eq_zero_iff_mult_of_local_factor`, `differentiable_prod_sub_pow`, `deriv_sub_mul_at_self` (`ExistsLocalZeroExpansionOfBound.lean#L12-L180`)
  - `Formalism.ZeroFreeDirichlet.localZeroSumBoundOfBounds` et ses lemmes de disque (`LocalZerosOf.lean#L9-L137`), `localZeros` (`NoZeroComplex.lean#L17-L18`)
- *Déclarations `[INFRA]` — `DZF-02`* : `inverseBound`, `norm_term_twist_moebius_le` (`LRight.lean#L12-L86`), `l_log_deriv_right`, `negLD_eq_LSeries_mul_vonMangoldt`, `norm_LSeries_twist_vonMangoldt_le` (`LRight.lean#L88-L126`), `localZeroExpansionWithMultiplicity` (`LocalZeroExpansionWithMultiplicity.lean#L8-L11`), `landau_local3` (`LandauLocal3.lean#L8-L9`), `LandauLocal3` (`LogDerivRegionChiOf.lean#L57-L68`), énoncés `LocalZeros`, `negLD`, `LandauLocal2`, `LGrowth`, `LInvBound`, `LLogDerivRight` (`NoZeroComplexOf.lean#L10-L70`).
- *Déclarations `[CORE]` couvertes — `DZF-03` (`#inputs-dirichlet-zero-free-region`)* :
  - `Formalism.ZeroFreeDirichlet.term_three_four_one_nonneg`, `term_one_add_real_nonneg` et lemmes de termes (`Positivity.lean#L23-L109`)
  - `Formalism.ZeroFreeDirichlet.zeroFreeNonRealCharOfBounds` (`ExceptionalZeroBounds/NoZeroComplexOf.lean#L9-L160`), `realCharZeroFreeLargeHeightOfBounds` (`RealLargeTOf.lean#L9-L168`), `noZeroComplex`, `realLargeT` (`NoZeroComplex.lean#L20-L24`)
  - `Formalism.ZeroFreeDirichlet.zeta_log_deriv_landau_bound` (`ZetaLogDerivLandauBound.lean#L22-L117`), `zeta_neg_log_deriv_re_bound` (`ZetaLogDerivLandauBound.lean#L119-L192`), `trivial_log_deriv_bound` (`TrivLogDeriv.lean#L11-L23`)
- *Déclarations `[INFRA]` — `DZF-03`* : `trivialCharZerosOfZeta`, `one_sub_prime_cpow_neg_ne_zero` (`TrivReal.lean#L9-L29`), `re_negLogDeriv_le`, `euler_factor_logDeriv_bound` (`EulerFactorLogDerivBound.lean#L9-L105`), énoncés `Positivity`, `TrivLogDeriv`, `TrivZeros`, `NoZeroComplex`, `RealLargeT` (`NoZeroComplexOf.lean#L37-L79`), `InRegion`, `IsLZero` (`LandauZeroFreeBounds/Statement.lean#L9-L13`).
- *Hors périmètre (déjà dans `ETZ-02`, non recités)* : `zeroFreeRegionExceptionalZeroOfBounds` (`ZFRDirichletOf.lean#L54-L108`), `zFRDirichlet` (`NoZeroComplex.lean#L32-L33`), `realSmallT`, `twoReal`.
### Cycle 13 — Inégalité clé d'Estermann, borne inférieure de Siegel et écart de zéro exceptionnel (`siegel_class_number_bound`)
- *Statut* : ✅ Terminé (`content/siegel-class-number-bound.fragment.html` + `records/siegel_class_number_bound.json`, rôle `rebuilt-infrastructure` ; dépendances `SCB-01` ← `DZF-01`, `LZE-02`, `SCB-02` ← `SCB-01`, `DZF-01`, `SCB-03` ← `SCB-01`, `SCB-02` ; consommateurs `ETZ-03` ← `SCB-03`, `PRE-02`, `SMR-02` ← `SCB-03`, `PSR-01` ← `SCB-03`, `EZS-02` ← `SMR-02`, `PPM-02` ; ferme les interfaces ouvertes `ETZ-01` et `EZS-01`, ramenant le total de `13` à `11`).
- *Déclarations `[CORE]` couvertes — `SCB-01` (`#inputs-estermann-key-bound`)* :
  - `Formalism.ZeroFreeDirichlet.iteratedDeriv_inv_sub_one_at_two`, `iteratedDeriv_lseries_at_two` (`IteratedDerivInvSubOneAtTwo.lean#L10-L26`)
  - `Formalism.ZeroFreeDirichlet.lseries_taylor_lower_bound`, `one_le_lseries_at_two`, `iteratedDeriv_lseries_alternating_nonneg` (`IteratedDerivLseriesAlternatingNonneg.lean#L10-L151`)
  - `Formalism.ZeroFreeDirichlet.product_lfunction_key_inequality`, `norm_le_of_log_bound`, `exists_taylor_truncation_order`, `two_sub_pow_le_exp` (`BqKeyOf.lean#L10-L152`)
  - `Formalism.ZeroFreeDirichlet.bqKey` (`FinalSiegel.lean#L14-L15`)
- *Déclarations `[INFRA]` (détails repliés) — `SCB-01`* : `prime_power_coefficient_nonneg`, `convolution_nonneg_of_divisors`, `character_convolution_eq` (`ConvolutionNonnegOfDivisors.lean#L10-L70`), `dirichlet_product_coefficients`, `dirichlet_character_lseries_summable`, `dirichlet_character_lseries_eq`, `lseries_zetaMul_eq` (`BqCoeff.lean#L10-L93`), `dirichlet_product_entire`, `zetaSubPole`, `zeta_sub_pole_differentiable`, `zeta_minus_pole_eq` (`BqEntire.lean#L9-L50`), `product_lfunction_growth_bound`, `circle_about_two_geometry`, `zeta_norm_le_on_circle` (`BqGrowth.lean#L11-L82`), `lfunction_norm_le_near_one`, `partial_sum_norm_le_near_one`, `three_le_modulus_of_ne_one`, `two_le_log_three_mul`, `rpow_le_exp_near_one`, `rpow_neg_le_exp_inv_near_one` (`LDerivNearOne.lean#L10-L126`), `lfunction_one_upper_bound` (`LFunctionOneUpperBound.lean#L10-L18`), énoncés `IsProdChar`, `Fbq`, `lamBq`, `BqCoeff`, `BqEntire`, `BqGrowth`, `LFunctionOneUpperBound`, `BqKey`, `BqKeyOf` (`SameCharacterLFunctionOne.lean#L10-L53`, `#L72`).
- *Déclarations `[CORE]` couvertes — `SCB-02` (`#inputs-siegel-theorem-lower-bound`)* :
  - `Formalism.ZeroFreeDirichlet.siegel_product_character_inequality`, `real_character_apply_sq_eq_one`, `product_real_characters_sq_eq_one`, `agree_coprime_of_product_principal`, `two_pow_card_primeFactors_le_self`, `card_primeFactors_add_one_sq_le_rpow`, `div_le_mul_of_main_bound_caseA`, `div_le_mul_of_chain_caseB` (`SiegelProductCharacterInequality.lean#L10-L184`)
  - `Formalism.ZeroFreeDirichlet.siegel_theorem_of` (`SiegelOf.lean#L9-L64`), `siegelLower` (`FinalSiegel.lean#L17-L19`)
- *Déclarations `[INFRA]` — `SCB-02`* : `exists_product_character`, `isProdChar_changeLevel_mul`, `characterModFour`, `characterModFour_apply`, `characterModFour_sq`, `characterModFour_ne_one`, `exists_real_nontrivial_character` (`CharExists.lean#L7-L56`), `zeta_negative_real_axis`, `exponential_integral_nonneg_real` (`ZetaNegReal.lean#L10-L66`), `realCharConj`, `conj_apply_of_sq_eq_one`, `conj_LFunction_conj_of_sq_eq_one` (`TrivReal.lean#L31-L80`), `real_lfunction_real_on_reals`, `real_character_lfunction_im_eq_zero`, `lfunction_tendsto_one_atTop` (`LRealPos.lean#L10-L44`), `lfunction_one_same_character`, `prod_one_sub_inv_ge_inv_card_succ`, `changeLevel_eq_of_agree_coprime`, `euler_factor_term_norm_le`, `euler_factor_product_upper`, `euler_factor_product_lower`, `prod_one_add_mul_one_sub_le_one` (`ExceptionalZeroBounds/SameCharacterLFunctionOne.lean#L9-L145`), `siegel_bound_same_character`, `log_three_mul_le_rpow`, `siegel_bound_key_rearrange` (`SiegelBoundSameCharacter.lean#L9-L106`), énoncés `ProdCharExists`, `ZetaNegReal`, `LRealPos`, `SameCharacterLFunctionOne`, `RealCharExists`, `SiegelOf` (`SameCharacterLFunctionOne.lean#L23-L25`, `#L55-L70`, `#L74-L75`) et `SiegelLower` (`SiegelWalfiszAP.lean#L29-L31`).
- *Déclarations `[CORE]` couvertes — `SCB-03` (`#inputs-exceptional-zero-lower-bound`)* :
  - `Formalism.ZeroFreeDirichlet.lfunction_deriv_near_one` (`LDerivNearOne.lean#L128-L160`)
  - `Formalism.ZeroFreeDirichlet.exceptional_zero_bound_of`, `log_le_const_mul_rpow`, `rpow_neg_eq_inv_pow` (`ExcBoundOf.lean#L9-L102`)
  - `Formalism.ZeroFreeDirichlet.excBound`, `excBound_of_siegelLower` (`SiegelWalfiszAPOfSiegelLower.lean#L26-L32`)
- *Déclarations `[INFRA]` — `SCB-03`* : énoncés `LDerivNearOne`, `ExcBound` (`LogDerivRegionChiOf.lean#L45-L52`) et `ExcBoundOf` (`LogDerivRegionChiOf.lean#L78`).
### Cycle 14 — Cohomologie de Tate cyclique, théorème des normes de Hasse quadratique et normes locales CM (`quadratic_hasse_norm`)
- *Statut* : ✅ Terminé (`content/quadratic-hasse-norm.fragment.html` + `records/quadratic_hasse_norm.json`, rôle `rebuilt-infrastructure` ; dépendances `HNT-01` ← `[]`, `HNT-02` ← `HNT-01` ; consommateurs `DSG-01` ← `HNT-02`, `SAA-03`, `OCR-02`, `INP-13` ← `ART-03`, `ACI-02`, `SAA-03`, `OCR-02` ; ferme les interfaces ouvertes `DSG-01` et `INP-13`, ramenant le total de `11` à `9` et le Ch. 8 de `4` à `2`).
- *Déclarations `[CORE]` couvertes — `HNT-01` (`#inputs-cyclic-tate-vanishing`)* :
  - `GroundTheory.Global.ideleClassToCycTateZero`, `cycNorm_ideleClassGroup`, `ideleClassToCycTateZero_surjective`, `ker_ideleClassToCycTateZero`, `natCard_cycTateZero_ideleClassGroup`, `index_range_ideleClassNorm`, `finrank_le_index_range_ideleClassNorm` (`FirstInequality.lean#L15-L99`)
  - `GroundTheory.Global.secondInequality`, `index_range_ideleClassNorm_eq_finrank`, `natCard_cycTateNegOne_ideleClassGroup`, `natCard_cycTateZero_ideleClassGroup_eq_finrank`, `classFieldAxiom_ideleClassGroup` (`SecondInequality/Cyclic.lean#L12-L48`)
- *Déclarations `[CORE]` couvertes — `HNT-02` (`#inputs-quadratic-hasse-norm`)* :
  - `GroundTheory.Global.mem_range_norm_of_diagonal_mem_range_ideleNorm`, `mem_range_norm_iff_diagonal_mem_range_ideleNorm`, `mem_range_norm_iff_forall_local`, `exists_norm_eq_iff_forall_local` (`HasseNorm.lean#L17-L79`)
  - `GroundTheory.Global.isGalois_isCyclic_of_finrank_eq_two`, `mem_range_norm_iff_diagonal_mem_range_ideleNorm_of_finrank_eq_two`, `mem_range_norm_iff_forall_local_of_finrank_eq_two`, `exists_norm_eq_iff_forall_local_of_finrank_eq_two` (`HasseNorm.lean#L86-L116`)
  - `UpperTheory.V.FW.locFin`, `ideal_step`, `norm_cm` (`LocFin.lean#L8-L92`)
  - `UpperTheory.V.FW.locInf` (`LocInf.lean#L8-L62`)
- *Déclarations `[INFRA]` (détails repliés) — `HNT-02`* : `GroundTheory.Global.IdeleNorm.eventually_ramificationIdx_eq_one`, `map_integerUnitsOver_eq_of_ramificationIdx_eq_one`, `eventually_map_integerUnitsOver_eq`, `mem_range_ideleNorm_iff_forall`, `mem_range_ideleNorm_of_forall` (`LocalNormsEverywhere.lean#L18-L73`).
### Cycle 15 — Théorie globale des corps de classes : réciprocité d'Artin, existence globale et corps de classes de rayons et de Hilbert (`global_class_field_theory`)
- *Statut* : ✅ Terminé (`content/global-class-field-theory.fragment.html` + `records/global_class_field_theory.json`, rôle `rebuilt-infrastructure` ; dépendances `CFT-01` ← `HNT-01`, `CFT-02` ← `CFT-01`, `CFT-03` ← `CFT-01`, `CFT-02` ; consommateur `ART-01` ← `CFT-01`, `CFT-02`, `CFT-03` ; ferme l'interface ouverte `ART-01`, ramenant le total de `9` à `8` et le Ch. 8 de `2` à `1`).
- *Déclarations `[CORE]` couvertes — `CFT-01` (`#inputs-global-reciprocity`)* :
  - `GroundTheory.Global.IdeleClassLimit.abstractSymbol_mk`, `ideleSymbol_diagonal`, `range_diagonal_le_ker_ideleSymbol`, `classSymbol`, `classSymbol_surjective`, `ker_abstractSymbol`, `ker_classSymbol`, `classSymbolEquiv`, `ker_ideleSymbol`, `GroundTheory.Global.Abelianization.of_injective_of_isMulCommutative` (`RangeDiagonalLeKerIdeleSymbol.lean#L19-L178`)
  - `GroundTheory.Global.ideleSymbol_diagonal_and_ker_le`, `ideleSymbol_diagonal`, `diagonal_range_le_ker_ideleSymbol`, `ker_ideleSymbol`, `reciprocityMap`, `reciprocityMap_mk`, `continuous_reciprocityMap`, `ker_reciprocityMap` (`General.lean#L138-L220`)
  - `GroundTheory.Global.index_range_ideleClassNorm_eq_finrank_of_isMulCommutative` (`General.lean#L245-L248`)
- *Déclarations `[INFRA]` (détails repliés) — `CFT-01`* : `GroundTheory.Global.RationalSymbol.ideleSymbol_diagonal_neg_one`, `ideleSymbol_diagonal_prime`, `mem_of_neg_one_mem_of_primeRat_mem`, `apply_eq_of_pow_eq_one_of_forall_prime_pow`, `ideleSymbol_diagonal_apply_of_pow_eq_one_of_prime_pow`, `ideleSymbol_diagonal_apply_of_pow_eq_one`, `ideleSymbol_diagonal_eq_one` (`RationalDiagonal.lean#L166-L301`), `GroundTheory.Global.IdeleNorm.range_ideleNorm_mem_nhds_one` (`RangeDiagonalLeKerIdeleSymbol.lean#L19-L178`).
- *Déclarations `[CORE]` couvertes — `CFT-02` (`#inputs-global-existence`)* :
  - `GroundTheory.Global.maxAbelian`, `finrank_maxAbelian`, `IdeleClassLimit.ker_abstractSymbol_le`, `IdeleClassLimit.index_range_ideleClassNorm_dvd`, `index_range_ideleClassNorm_dvd_card_abelianization`, `range_ideleClassNorm_maxAbelian`, `index_range_ideleClassNorm_eq_card_abelianization`, `exists_isAbelianGalois_range_ideleClassNorm_le` (`NormLimitation.lean#L17-L178`)
  - `GroundTheory.Global.reciprocityMap_intermediateField`, `range_ideleClassNorm_fixedField`, `exists_intermediateField_range_ideleClassNorm_eq_of_le`, `exists_intermediateField_range_ideleClassNorm_eq`, `exists_isAbelianGalois_range_ideleClassNorm_eq` (`Kummer.lean#L20-L190`)
  - `GroundTheory.Global.range_ideleClassNorm_eq_comap`, `exists_isAbelianGalois_range_ideleClassNorm_eq_of_le`, `exists_isAbelianGalois_range_ideleClassNorm_eq_of_finiteIndex`, `isOpen_range_ideleClassNorm`, `range_ideleClassNorm_le_range_iff`, `exists_intermediateField_range_ideleClassNorm_eq_of_finiteIndex` (`ExistsIsAbelianGaloisRangeIdeleClassNormEqOfFini.lean#L35-L185`)
- *Déclarations `[INFRA]` — `CFT-02`* : `GroundTheory.Global.mem_congruenceSubgroup_of_eq_one`, `exists_map_powerSubgroup_le` (`Kummer.lean#L20-L190`), `GroundTheory.Global.isMulCommutative_sup` (`ExistsIsAbelianGaloisRangeIdeleClassNormEqOfFini.lean#L35-L185`).
- *Déclarations `[CORE]` couvertes — `CFT-03` (`#inputs-ray-hilbert-class-fields`)* :
  - `GroundTheory.Global.Modulus.exists_diagonal_mul_mem_idelesOneMod`, `idelesOneModToCoprimeIdeals_surjective`, `toIdealRayClassGroup_surjective`, `toRayClassGroup_surjective`, `ker_toRayClassGroup`, `ker_toIdealRayClassGroup`, `rayClassGroupEquiv`, `rayClassGroupEquiv_mk`, `quotientEquivIdealRayClassGroup` (`IdealRayClass.lean#L61-L246`)
  - `GroundTheory.Global.Modulus.rayClassGroupGalEquiv_mk`, `rayClassArtinEquiv`, `rayClassArtinEquiv_mk`, `unitFiltrationUnits_le_ker_localSymbol`, `ramificationIdx_rayClassField_eq_one` (`RayClassField.lean#L101-L133`)
  - `GroundTheory.Global.Modulus.splitsCompletely_rayClassField_iff`, `GroundTheory.Global.exists_le_rayClassField` (`RayClassField.lean#L147-L163`)
  - `GroundTheory.Global.ramificationIdx_eq_one_of_units_le_ker_localSymbol`, `localSymbol_eq_one_iff_normResidueSymbol`, `splitsCompletely_iff_localSymbol_eq_one`, `splitsCompletely_iff_arithFrobAt_eq_one` (`RayClassFieldLocal.lean#L154-L213`)
  - `GroundTheory.Global.IsUnramifiedEverywhere`, `isUnramifiedIn_iff_ramificationIdx`, `infiniteLocalSymbol_eq_one_iff`, `units_le_ker_localSymbol_of_isUnramifiedIn`, `ideleSymbol_eq_one_of_isUnramifiedEverywhere` (`TrivialModulus.lean#L19-L86`)
- *Déclarations `[INFRA]` — `CFT-03`* : `GroundTheory.Global.natCard_quotient_range_normUnits`, `ramificationIndex_eq_one_of_units_le` (`RayClassFieldLocal.lean#L37-L91`).
### Cycle 16 — Finitude locale, dualité locale de Tate et dualité globale de Poitou–Tate (`poitou_tate_duality`)
- *Statut* : ✅ Terminé (`content/poitou-tate-duality.fragment.html` + `records/poitou_tate_duality.json`, rôle `rebuilt-infrastructure` ; dépendances `PTD-01` ← `[]`, `PTD-02` ← `PTD-01`, `PTD-03` ← `PTD-01`, `PTD-02`, `CFT-01` ; consommateur `LCL-01` ← `PTD-01`, `PTD-02`, `PTD-03` ; ferme la dernière interface ouverte `LCL-01` du Ch. 8, ramenant le total de `8` à `7` et rendant le Ch. 8 100 % auto-contenu).
- *Déclarations `[CORE]` couvertes — `PTD-01` (`#inputs-local-finiteness`)* :
  - `GroundTheory.ProfCoh.finite_cohomology_localField`, `subsingleton_cohomology_localField`, `finite_cohomology_cartierDual_localField` (`TensorHomDualRepRootsOfUnityIsoCartierPairing.lean#L111-L129`)
  - `CompanionTheory.LocalTateOrthogonality.Gcoh.locfin_of` (`GcohFin.lean#L8-L36`)
  - `CompanionTheory.LocalTateOrthogonality.Gcoh.top_locfin` (`GcohTop.lean#L13-L15`)
- *Déclarations `[CORE]` couvertes — `PTD-02` (`#inputs-local-tate-duality`)* :
  - `GroundTheory.ProfCoh.brauerInvOfIsSepClosure_rootsOfUnity`, `tensorHom_dualRepRootsOfUnityIso_cartierPairing`, `localDualityPairing_cohomologyMap` (`TensorHomDualRepRootsOfUnityIsoCartierPairing.lean#L20-L110`)
  - `GroundTheory.ProfCoh.bijective_localDualityPairing`, `bijective_localDualityPairing_flip`, `tate_local_duality` (`TensorHomDualRepRootsOfUnityIsoCartierPairing.lean#L130-L185`)
  - `CompanionTheory.LocalTateOrthogonality.Gcoh.tate_core`, `tate_of` (`GcohTate.lean#L9-L75`)
  - `CompanionTheory.LocalTateOrthogonality.Gcoh.top_tate` (`GcohTop.lean#L11-L12`)
- *Déclarations `[INFRA]` (détails repliés) — `PTD-02`* : `GroundTheory.ProfCoh.bijective_of_zmodToQZ`, `cohomologyAddEquivOfIso` (`TensorHomDualRepRootsOfUnityIsoCartierPairing.lean#L20-L110`).
- *Déclarations `[CORE]` couvertes — `PTD-03` (`#inputs-poitou-tate-duality`)* :
  - `GroundTheory.ProfCoh.gsBaseCase`, `poitouTate_duality_gs`, `poitouTate_sha_gs`, `poitouTate_nineTerm_gs` (`PoitouTateNineTermGs.lean#L23-L71`)
  - `PositivityTheory.Lit1.PTN.nineAddFS_V`, `poitouTateNormalised_holds` (`PoitouTateNormalisedHolds.lean#L13-L21`)
  - `GlobalTheory.PoitouTateConj.conjBack`, `conjBack_mem_Dec`, `conjBack_mem_Ine`, `conjBack_isFrob`, `cycMod_conjBack`, `exists_place_map`, `conjCompatible`, `poitouTateDuality_of_normalised` (`PoitouTateDualityOfNormalised.lean#L12-L228`)
- *Déclarations `[INFRA]` — `PTD-03`* : `PositivityTheory.Lit1.PTN.nineAdd_core` (`NineAddCore.lean#L27-L90`), `GlobalTheory.PoitouTateConj.continuous_conjBack` (`PoitouTateDualityOfNormalised.lean#L12-L228`).
### Cycle 17 — Action de Möbius sur le demi-plan de Hilbert, orbite de Weil adélique, factorisation d'Iwasawa et mesure parabolique d'extension scindée (`siegel_cusp_and_orbit_reduction`)
- *Statut* : ✅ Terminé (`content/siegel-cusp-and-orbit-reduction.fragment.html` + `records/siegel_cusp_and_orbit_reduction.json`, rôle `rebuilt-infrastructure` ; dépendances `SCR-01` ← `[]`, `SCR-02` ← `SCR-01`, `SCR-03` ← `SCR-01` ; consommateur `SDR-01` ← `HVO-01`, `HVO-02`, `SCR-01`, `SCR-02`, `SCR-03` ; ferme l'interface ouverte `SDR-01` du Ch. 6, ramenant le total de `7` à `6` et le Ch. 6 de `6` à `5`).
- *Déclarations `[CORE]` couvertes — `SCR-01` (`#lifts-cusp-mobius-reduction`)* :
  - `GlobalTheory.CompanionTheory.SW.Core.Mobius.main`, `den_ne`, `im_frac`, `comp_frac`, `det_emb` (`MobiusActionUpperHalfPlane.lean#L9-L90`)
  - `GlobalTheory.CompanionTheory.SW.Red.balanced_lower`, `prod_sq_embedding` (`ReductionToSiegelDomain.lean#L12-L54`)
- *Déclarations `[CORE]` couvertes — `SCR-02` (`#lifts-adelic-weil-orbit`)* :
  - `GlobalTheory.CompanionTheory.SW.Core.AfTop.finiteAdele_topology`, `isCompact_Oh`, `isOpen_Oh`, `algebraMap_mem_Oh_iff`, `exists_mul_Oh_subset`, `exists_mul_mem_Oh_of_isCompact`, `isOpen_mul_Oh`, `denseRange_algebraMap` (`FiniteAdeleTopology.lean#L14-L126`)
  - `GlobalTheory.CompanionTheory.SW.Core.Scale.lf_scale`, `mass_of_subgroup`, `scale_unit`, `mass_mul_int`, `mass_den`, `scale_field` (`AdelicHaarMeasureScaling.lean#L40-L332`)
  - `GlobalTheory.CompanionTheory.SW.Core.PiScale.pi_scale` (`AdelicHaarMeasureLinearChange.lean#L126-L205`)
  - `GlobalTheory.CompanionTheory.SW.Core.SelfDual.naQuad`, `OhR`, `LL`, `Gs`, `perp_Gs`, `mass_one`, `LL_good` (`WeilRepresentationQuadraticDatum.lean#L14-L370`)
  - `GlobalTheory.CompanionTheory.SW.Iwasawa.iwasawa_w_n`, `IntAt`, `idem`, `scale`, `scaleInv`, `scale_mul_scaleInv`, `scale_combo`, `scaleUnit`, `kMat`, `image_scale`, `w_n_eq` (`IwasawaDecompositionAdelicSL2.lean#L11-L170`)
  - `CompanionTheory.PlacePermOperatorBicommutantSpan.LN_small`, `oh_mul`, `oh_nat`, `LN`, `co_LN` (`OrbitAdelic.lean#L17-L53`)
  - `CompanionTheory.PlacePermOperatorBicommutantSpan.fstar_decay` (`OrbitAdelic.lean#L76-L116`)
  - `GlobalTheory.CompanionTheory.SW.ThetaSum.theta_summable_and_ne_zero`, `summable_thTerm`, `sb_indN`, `indN_eventually_zero`, `exists_theta_ne_zero` (`ThetaSeriesSummable.lean#L197-L415`)
  - `GlobalTheory.CompanionTheory.SW.ThetaUD.main`, `term_U`, `term_D` (`ThetaFunctionModularity.lean#L76-L153`)
  - `GlobalTheory.CompanionTheory.SW.ThW.thetaInvariance`, `poisson_form`, `base`, `core` (`ThetaFunctionAutomorphy.lean#L96-L320`)
  - `GlobalTheory.CompanionTheory.SW.Core.EiInv.ei_inv` (`ThetaFunctionCuspExpansion.lean#L9-L11`)
- *Déclarations `[CORE]` couvertes — `SCR-03` (`#lifts-parabolic-quotient-volumes`)* :
  - `GlobalTheory.CompanionTheory.SplitExtLat.splitHomeo`, `splitMap`, `kerPart`, `splitEquiv`, `splitHomeo_apply`, `mul_split`, `continuous_conj` (`SplitHomeoApply.lean#L10-L52`)
  - `GlobalTheory.CompanionTheory.SplitExtLat.exists_borel_section_ker` (`ParabolicFundamentalDomainSplit.lean#L11-L58`)
  - `GlobalTheory.CompanionTheory.SplitExtLat.conj_haar_character` (`ParabolicHaarDecomposition.lean#L8-L144`)
  - `GlobalTheory.CompanionTheory.SW.CharacterTrivial.eq_one_of_isFundamentalDomain` (`ModularCharacterTrivialFiniteCovolume.lean#L9-L102`)
  - `GlobalTheory.CompanionTheory.SplitExtLat.isHaarMeasure_map_splitHomeo` (`ParabolicQuotientMeasure.lean#L8-L58`)
  - `GlobalTheory.CompanionTheory.SplitExtLat.ae_exists_smul_mem_image_prod` (`ParabolicFundamentalDomainVolume.lean#L8-L27`)
  - `GlobalTheory.CompanionTheory.SplitExtLat.aedisjoint_smul_image_prod` (`ParabolicIntegralUnfolding.lean#L8-L66`)
  - `GlobalTheory.CompanionTheory.SplitExtLat.setLIntegral_splitHomeo_image_prod` (`ParabolicLeviIntegralFormula.lean#L8-L43`)
  - `GlobalTheory.CompanionTheory.SplitExtLat.exists_haar_fundamentalDomain` (`SplitExtensionFundamentalDomain.lean#L16-L39`)
### Cycle 18 — Coefficients de Fourier thêta/Eisenstein, densités de niveaux quadratiques, normalisation eulérienne et cocompacité binaire anisotrope (`one_vector_density_normalization`)
- *Statut* : ✅ Terminé (`content/one-vector-density-normalization.fragment.html` + `records/one_vector_density_normalization.json`, rôle `rebuilt-infrastructure` ; dépendances `ODN-01` ← `SCR-02`, `ODN-02` ← `ODN-01`, `ODN-03` ← `ODN-02` ; consommateur `OVM-01` ← `SDR-02`, `SCR-01`, `SCR-03`, `ODN-01`, `ODN-02`, `ODN-03` ; ferme l'interface ouverte `OVM-01` du Ch. 6, ramenant le total de `6` à `5` et le Ch. 6 de `5` à `4`).
- *Déclarations `[CORE]` couvertes — `ODN-01` (`#lifts-one-vector-whittaker-coeff`)* :
  - `GlobalTheory.CompanionTheory.SW.Core.StdChar.main`, `fieldChar`, `fieldChar_eq_one_iff`, `exists_rep`, `stdChar`, `continuous_stdChar`, `Oh_subset_of_isClosed` (`StandardAdelicCharacter.lean#L13-L159`)
  - `GlobalTheory.CompanionTheory.SW.FstarPer.fstar_periodic`, `oh_mul`, `continuous_qf` (`WeilOperatorIntegralInvariance.lean#L13-L47`)
  - `GlobalTheory.CompanionTheory.SW.FD.main`, `scaleMap`, `latR_eq_range`, `mem_latR_iff`, `card_places`, `exists_integral_basis`, `exists_real_basis`, `sum_places_int`, `integral_char_eq_zero` (`LatticeFundamentalDomainVolume.lean#L13-L229`)
  - `GlobalTheory.CompanionTheory.SW.Core.Dens.density_of_q`, `qMap`, `gW`, `gauss_I`, `gauss_shift`, `one_dim_integrable`, `prod_integrable` (`QuadraticLevelSetDensity.lean#L12-L157`)
  - `GlobalTheory.CompanionTheory.SW.Core.Dens.density_main`, `indL_SB`, `Hs`, `congN`, `integrable_of_periodic` (`SchurFunctionWhittakerEquivariant.lean#L74-L325`)
  - `GlobalTheory.CompanionTheory.SW.CoefTheta.fourier_coefficient`, `fourier_series`, `sum_selected`, `ph`, `thTerm_shift`, `thTerm_nonneg`, `integral_of_ne_zero`, `sb_indL` (`RealQuadraticFormLemma.lean#L51-L396`)
  - `GlobalTheory.CompanionTheory.SW.CoefEis.fourier_coeff_eis`, `tsum_integral_swap`, `tsum_cosets`, `unfold_char`, `hasSum_integral_cosets`, `cosets_of_multiples`, `mass_multiples`, `sum_places_eq_trace` (`SchurFunctionSmoothRightInvariant.lean#L13-L427`)
- *Déclarations `[CORE]` couvertes — `ODN-02` (`#lifts-one-vector-euler-normalization`)* :
  - `GlobalTheory.CompanionTheory.SW.hermOne_eq_scal`, `HermOne.exists_ne`, `HermOne.exists_eq_algebraMap` (`HermitianOneByOneIsScalar.lean#L12-L70`)
  - `GlobalTheory.CompanionTheory.SW.coord_measures_haar`, `HaarCoord.haar_comap`, `HaarCoord.conj_facts`, `HaarCoord.fixed_eq_tmul`, `HaarCoord.half_trace_tmul`, `HaarCoord.hermMat`, `HaarCoord.hermCoord`, `HaarCoord.hermCoord_add`, `HaarCoord.hermCoord_isHomeomorph` (`CoordinateHaarMeasure.lean#L11-L260`)
  - `GlobalTheory.CompanionTheory.SW.LocFin.fibre_loc_fin`, `null_of_fibres_null` (`GramFiberMeasuresContinuity.lean#L16-L129`)
  - `GlobalTheory.CompanionTheory.SW.LatRat.latV_rational`, `eventually_integral`, `latR`, `Good`, `repr_mul`, `eventually_good_matrix`, `rmul_mem`, `actTup_mem`, `consTup_mem_iff` (`LatticeStableAlmostEverywhere.lean#L13-L148`)
  - `GlobalTheory.CompanionTheory.SW.Fact.exists_isEulerProd`, `exists_test_set`, `fib_facts`, `borel_tup`, `pureL_insert` (`SiegelWeilFormulaRange.lean#L20-L187`)
  - `GlobalTheory.CompanionTheory.SW.EulerBox.euler_box`, `pureL_indicator_eq`, `box_eq`, `measurableSet_box` (`EulerProductMeasureIntegral.lean#L18-L113`)
- *Déclarations `[CORE]` couvertes — `ODN-03` (`#lifts-anisotropic-binary-cocompactness`)* :
  - `GlobalTheory.CompanionTheory.MassCocompact.coCpt` (`Cocompactness.lean#L14-L24`)
  - `GlobalTheory.CompanionTheory.Mass.One.vector_length_formula_up_to_constant`, `finite_rat_compact`, `theta_locFin`, `euler_of_summable` (`VectorLengthFormulaOfParts.lean#L20-L247`)
### Cycle 19 — Comptages de quadriques en rang supérieur, compatibilité globale en produit eulérien et intégrabilité archimédienne de Schwartz (`binary_higher_rank_mass_convergence`)
- *Statut* : ✅ Terminé (`content/binary-higher-rank-mass-convergence.fragment.html` + `records/binary_higher_rank_mass_convergence.json`, rôle `rebuilt-infrastructure` ; dépendances `BHM-01` ← `[]`, `BHM-02` ← `BHM-01`, `ODN-02`, `BHM-03` ← `BHM-02` ; consommateur `BGM-01` ← `BGM-04`, `BHM-01`, `BHM-02`, `BHM-03` ; ferme l'interface ouverte `BGM-01` du Ch. 6 et achève le Pilier A, ramenant le total de `5` à `4` et le Ch. 6 de `4` à `3`).
- *Déclarations `[CORE]` couvertes — `BHM-01` (`#lifts-higher-rank-quadric-count`)* :
  - `PositivityTheory.PfSWUS.HMass.sharpCount`, `SC.sum_sq_eq`, `SC.sum_sq_scale`, `SC.addChar_sum`, `SC.gauss_const`, `SC.sharp` (`SharpCount.lean#L13-L202`)
  - `PositivityTheory.PfSWUS.HMass.lattice_unit`, `SharpCount`, `real_bound2`, `coreSharp`, `dens_unit` (`OneVecBinaryMassOf.lean#L12-L298`)
  - `PositivityTheory.PfSWUS.HMass.oneVecBinaryMass`, `siegelDensitiesLowA_of_leaves` (`MassTop.lean#L5-L8`)
  - `GlobalTheory.CompanionTheory.SW.GBall.density_near_value`, `exists_unif`, `q_int`, `q_smul`, `pi_scale`, `lam_scale`, `isOpen_unit_sphere`, `meas_prim`, `q_nonprim`, `bound_step`, `local_quadratic_density_bound_at_level` (`LocalQuadraticDensityBoundNonzero.lean#L16-L454`)
- *Déclarations `[CORE]` couvertes — `BHM-02` (`#lifts-global-product-compatibility`)* :
  - `GlobalTheory.CompanionTheory.SW.FactS.fact_S`, `prod_factor`, `lat_natMul`, `zero_mem_lat`, `exists_scale`, `pr`, `preimage_lt_top`, `push_inv`, `local_pack` (`SiegelWeilOrbitalMeasure.lean#L38-L450`)
  - `GlobalTheory.CompanionTheory.SW.FactS.OpenFactor.prod_factor_open`, `map_comap_of_carried`, `comap_invariant`, `lintegral_comap_of_carried`, `comap_ne_zero_of_carried`, `comap_finite_compacts` (`RestrictedProductHaarMeasure.lean#L15-L186`)
  - `GlobalTheory.CompanionTheory.SW.GoodMass.mass_fibre_good`, `exists_moved`, `fixed_mem`, `exists_aniso`, `blockOne_herm`, `one_hermND`, `blockOne_hermND`, `arith`, `exists_family`, `key` (`LocalDensitiesBoundedAlmostAll.lean#L23-L273`)
  - `GlobalTheory.CompanionTheory.SW.mass_fibre_summable` (`EulerProductLocalDensitiesConverges.lean#L15-L41`)
  - `GlobalTheory.CompanionTheory.SW.Step.blockOne_step`, `of_cofinite`, `lattice_measurable`, `theta_hypothesis`, `loc_families` (`SiegelWeilMeasureAddRankOneBlock.lean#L33-L211`)
  - `GlobalTheory.CompanionTheory.SW.swMeas_of_not_represented`, `SwEmpty.thetaMeas_of_empty`, `SwEmpty.fibre_zero_of_one` (`SiegelWeilMeasureAddBlockAnisotropic.lean#L19-L130`)
  - `GlobalTheory.CompanionTheory.Mass.SumDev.sum_bounded_prod`, `sum_prod_le`, `mem_asIdeal`, `mem_prod_asIdeal` (`EulerProductConvergenceBound.lean#L11-L122`)
  - `PositivityTheory.PfSWUS.HMass.euler_int_integrable` (`EulerS.lean#L22-L167`)
- *Déclarations `[CORE]` couvertes — `BHM-03` (`#lifts-archimedean-schwartz-coordinates`)* :
  - `GlobalTheory.CompanionTheory.SW.CoordR.coordInf` (`ArchimedeanCoordinates.lean#L13-L75`)
  - `GlobalTheory.CompanionTheory.SW.HaarScale.scaleInf` (`ArchimedeanScaling.lean#L11-L57`)
  - `PositivityTheory.PfSWUS.SchInf.schwartzDensInf_of`, `schwartz_decay` (`Assemble.lean#L17-L81`)
  - `PositivityTheory.PfSWUS.HMass.siegelDensitiesLowA` (`ChapterTop.lean#L4-L5`)
