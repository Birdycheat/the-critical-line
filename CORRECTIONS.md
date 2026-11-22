# Correction history

## 21 November 2026

- The polynomial detecting a failed test takes the value one at every failed tuple in the complex torus. Its smallness is an integral over the compact unit torus. The example with a zero at 2 verifies both assertions on their respective domains. [The polynomial test](book.html#lifts-hecke-small-polynomial)
- The auxiliary character sum is unnormalized, so its error on the zero fibre is ℓ to the chosen power times the initial form. The abstract character estimate permits a nonsurjective label homomorphism. The local type used in its application has a surjection. Its proof constructs an element mapping to 1 in every conjugated radical, which also detects characters of smaller order. [Character sum](book.html#lifts-hecke-auxiliary-type) · [Cuspidality](book.html#lifts-hecke-cuspidal-type)
- In the rationality argument, a degree bound comes from the archimedean translates of the original form. Conjugation permutes the embedding labels and preserves this degree. Evaluation at the finitely many class representatives then places all conjugate forms in one finite-dimensional space before eigenvalue multiplicities are considered. [The common space](book.html#lifts-hecke-conjugate-forms)

- The dimension comparison formerly denoted the ambient rank by the same letter used for the length of a minor list. In the source, the Hermitian space has dimension k+m−1, the frames have length m/2−1, and the negative signature index is m/2. The [projection count](book.html#global-relative-count) and the [Gram error](book.html#global-gram-error) now use n=k+m−1 in the exponent −nf log(n)/16.

- The earlier reading of the stability argument identified `SBig` as the field-transfer input for the cohomological bound. The pinned file `SBridgeAlt.lean` defines this alternate proposition. In the selected proof `NumThree.sNum` invokes the layer inequality from `SLayerCut.sha_le`. Its map is a surjection between two twisted coinvariant quotients, and it bounds the length at the base by the length at the layer. The [field-change section](book.html#inputs-field-cycle-transfer) follows the two uses of primitivity through the written calls.

- An A4 inspection found clipped leading digits on four-digit source numbers and the final address on a different page from its title. The source list now reserves space for its longest number and keeps each printed citation together.

- For a good unramified Whittaker coefficient the local integral is proved in a right half-plane. In rank two the example evaluates the continued Euler polynomial at z=½; direct convergence there is not part of this calculation. Matching the global product to the mean on a Gram fibre is a separate theorem.
- In the separating-period bound, the product minimum applies first to differences of lattice points to give disjoint boxes, and then to a point itself to extract 1/R. It requires no lower bound R on every individual coordinate.
- At a form with a stabilizer, the normalizing sum of the partition counts all group labels giving each orbit point. Distinct orbit points in the same orbit can have different total weights.

- At one height label the product of the dyadic list sizes counts candidate centres. A separate injection into relative rational matrices bounds the multiplicity per centre. Neither count by itself is the cardinality of the coset fibre.
- The determinant and inverse-matrix residues classify a finite set of possible column matrices up to an integral left change of basis. The families of positive forms parametrized by them can still vary continuously.
- The colored swap in the unitary commutant can act nontrivially when its slots have distinct places. Its contraction with inputs supported on the two distinct blocks vanishes. The commutant assertion gives a spanning family, including in small dimension where its members can be dependent.
- In the inert CM argument n is the degree of the multiplier: there are n−1 nonidentity kernel points. The prime-to-p coordinate bound concerns the larger full n-torsion. The induction on the formal multiplier uses the extra power of T inside the substitution and divides only by 2.

- Equality of the invertible Fourier coefficients alone leaves singular frequencies undetected. In the lower Siegel–Weil range the vanishing argument acts first on a convolution. Recovering the original Fock value uses a test with nonzero scalar on the vacuum.
- The two coordinate roundings for a positive lattice form are coupled through the off-diagonal entries. In the basis (1,1+i) of ℤ[i], ignoring the shear at (2/5,2/5) gives squared distance 4/5. Correcting for it gives 1/5.
- For a realized minor label the maximum defining its size includes its terminal nonzero minor. The positive terminal sizes multiply to the square root of the normalized ideal norm. In the orbital bound the unipotent covolume belongs to the word and the stabilizer volume belongs to the term.

- At b=2a the geometric majorant for the Eisenstein series has ratio 1 at the special point. The smaller-rank branch of Siegel–Weil supplies the holomorphic value under the Witt-index condition. Absolute integrability for exchanging the three quotient integrations is established separately from the square-integrable diagonal slices.
- The inner cutoff of a corrected lattice form vanishes at squared length 4d. In the Gaussian example at d=16, all the vectors with nonzero second coordinate have zero weight. The positive fractions on the first coordinate are lower bounds. The affine-block comparison gives a boundary at the existing size; the lower bound on size in stable homology belongs to a subsequent argument.

- The formal degree, the rescaling of the joint polynomial and the pushforward of Haar measure all affect the value of the real-place factor. Strict positivity also needs the separate argument on the shared compact type.
- A stabilizer can fix a Hermitian form while contributing several labels to a partition. For the Gaussian units there are four equal weights. In the Hecke transfer, the primitive for an orbit representative is defined on tuples in the entire smaller group and invariant under the stabilizer; this allows it to be translated to all labels in the orbit.
- In odd degree only one real part or imaginary part of the cyclic trace can survive at one place. The degree-three trace on three tangent vectors demonstrates the sign and scaling. Establishing a period then requires integration on an arithmetic cycle.

- Three written dependencies in the prescribed-prime argument omitted the trailing apostrophe of the wrapper actually called in Lean. The register now gives each wrapper’s exact identifier. The source-line check distinguishes a name ending in an apostrophe from the unprimed name.

- The finite Satake identity determines an average over the cosets in a double class. On the twelve terms of the rank-two example the induced values at α = 1 are 1/3, 1 and 3, while the normalized zonal coefficient is 2/3 on the class. When the original coefficient is zero at the identity, testing its Hecke equation on each double-class indicator gives its vanishing everywhere.
- The central unit-torus average preserves the original periods by a basepoint prism. The subsequent Haar average gives a tensor at the identity, which transports to an invariant form because the stabilizer fixes it. Equality of the periods of this invariant form uses the two Hecke rates. In the initial cocycle-to-form construction the orientation sign already matters in degree one.
- The zero-density estimate counts primitive characters that admit a zero. It chooses one zero per character and sets aside at most one character of conductor one. The quadratic-twist second moment allows an exceptional squarefree part as well as the ordinary square class. Its common-height bound precedes the argument that allows each prime to select a different height.
- In the height-two logarithm comparison the Frobenius on the coefficients must also act on a substituted series. At p = 5 a Teichmüller unit of order 31 makes the error from omitting that action visible in degree 25.

- The quotient in the inert integral consists of cosets gK, obtained by multiplying on the right by K. A representative for each smaller coset is fixed before comparing radical coordinates. Diagonal matrices with outer valuations +1 and −1 can have the same length and the same double coset while giving distinct terms. Either of the two final columns can be the only one that detects a denominator.
- A surface of smaller dimension can have zero ambient volume. The cohomological period estimate first averages the vertices of a closed cycle, then uses an ambient density bound. The local constant depends on the cycle and can be chosen before the form and the iteration. In cusp reduction the real diagonal parameter is the degree root of the idèle norm, as the Gaussian rational line of height 2 and real parameter √2 illustrates.

- In the rank-four inert example every entry has the same valuation in both matrices. Eliminating the middle row leaves a corrected corner of 0 or i/3. The quotient has 9 or 81 elements, respectively. The rank-three value 65/54 elsewhere in the chapter is one diagonal cell; the Euler factor sums over all diagonal labels.
- The Hecke estimate needs orthogonality to the common fixed space. A mean-zero coefficient has zero projection to that space because its members are constant almost everywhere. The coefficient itself can have positive norm.
- In the height-two normalization the torsion product gives an upper bound on the degree of the first unit. Exact degree p² uses the inert CM action. The translated theta factor divides by F(t), which is its value at the translating point before translation.
- At p = 5 and derivative order 27 the p-adic figure now displays exactly 13/12 for the allowed loss and 59/12 for the guaranteed gain. Decimal rounding could put the displayed loss below its upper bound or the displayed gain above its lower bound. The reflection figure identifies the starting character, its inverse at 1−s and the conjugate return to the original character.
- Following a link to a proof could scroll to a closed disclosure. A direct address, the outline and a repeated click on the current address now open the requested proof including its enclosing disclosures.

- At a good inert place, a surviving row must have a corner satisfying the exact trace relation. The level condition f≥2e gives such a corner for every row counted by the index. It is sharp for the displayed row 1/2 in the unramified extension of ℚ₂. The dyadic example concerns the local lemma. The chain requires every dyadic place outside its exceptional set to split.
- Finiteness of the cusp cover concerns the chart labels. The common diagonal variables still range over an unbounded set. The determinant adjustment uses a finite list of unit classes and place-dependent scalar roots. Overlapping charts suffice because the integrand is nonnegative.
- The window experiment formerly subtracted two upper tails close to one. At k = 160, σ = 3, δ = 0.1 the displayed envelope mass was zero. A positive Poisson sum gives 2.172022206886884 × 10⁻²⁸ percent. An independent 78-decimal calculation checked both masses for all 29,640 control settings.
- The residue figure now uses equal horizontal and vertical scales. For β = 0.9 and τ = 0.25 the ray makes an angle of 52.7° with the real axis. The pilot also treats a singleton for which only the inverse character has a zero at the test point.
- In the incidence step, 5/26 is the exact mean-zero norm for the projective plane over the field of order 25. The double-coset estimate gives 1/√26 and the arithmetic comparison uses 1/5. The three can be distinguished by averaging signed point values on the lines.

- In the CM model the congruence for the singular modulus is at an auxiliary degree-one principal prime. Frobenius at the inert target exchanges the two CM roots. The example keeps the primes 59 and 5 distinct.
- For an integral character, the residue prime helps determine the lift. In the level-five example, switching the image of ζ from 3 to 9 at 11 changes χ(2) from ζ⁴ to ζ². The absolute order of the character remains five.
- The moment for the moving differential-form coefficients has order 2am after squaring. The sufficient inequality A<N−1 in the cusp estimate does not decide boundary convergence. The Hilbert-space angle gives 2/5, which the selected period estimate relaxes to 3/5.
- The exact off-diagonal vanishing is for the specified zero-label nonidentity part of the geometric kernel. A different theorem bounds the full cross-word correlation. Central characters alone need not distinguish two types of the same unitary group.
- Following a dependency in a filtered atlas previously left the destination hidden. The atlas keeps the query and reveals the requested entry across navigation.

- The constant spherical coefficient at a split prime of residue size three in rank two has Satake parameters √3 and 1/√3. Its series starts 1+8X+38X². The two-move Euler correction instead counts paths to one fixed lattice, and its rank-two example uses residue size two.
- A ramified theta entry may have a denominator. The scalar that clears its readings locally has order ⌈eB⌉. After the stabilizer-weighted sum and final period, a floor controls a negative-power shift of the input lattice for the integral dual pairing.
- A nondegenerate Jacobi sum divides the rational prime p. Its explicit quotient is its inverse-character partner. The earlier phrase about divisibility by p reversed this implication. The F₇ example identifies each partner at the two primes above 7.
- The degree-three dyadic example now uses ℚ(ζ₂₀), with four complex places and a square root of −1. The four free generators allowed by the rank bound contribute a factor of at most q⁴. The matching factor cancels in the character count, leaving torsion and the kernel estimate.
- The full target dimension in the frame argument is integral; D* is its predicted positive real size. The comparison uses the upper half of the independent two-sided point count. An invertible arithmetic basis change and an isometric restriction of columns serve different purposes.

- At an inert unramified place, equality of finite double-coset sums passes to the infinite sum because the original coefficient is constant on each double coset. Its sum of absolute values on that block is bounded by the corresponding sum for the induced spherical model.
- Positive rank at the base tuple supplies a coordinate to lift. Period separation uses a single archimedean pair across the lines, with finite tests chosen for each line. Both properties enter the proof that the common coefficient scalar is nonzero.
- In the finite cyclic construction the lower word has degree 2e for the positive twist e. Remove common powers of ℓ from a relation in a free abelian cover before projecting to finite homology. The determinant interpolation acts on α by inverse conjugates; reindexing its evaluation produces positive powers of κᵉ.
- In the primitive-character length argument the witness to the unit-difference branch and the parity element for fixing cocycles serve distinct purposes. At a conductor prime away from ℓ an inertia element acting by a unit difference extends one coboundary witness to the full decomposition group.
- The mass increment assumes that the CM extension is unramified at all finite places. The row formal degree on the selected Haar measure equals a normalized Vandermonde at large gap. Count5 invokes its weaker lower bound with tolerance one third. The progression count used to choose primes allows an exceptional real zero in its relative main term.

- Count5 bounds the prime level Tᵤ attached to each word. The cardinality of the word set enters the slope penalty. The prime sum in the fifth clause of IdentU and its matched main term agree separately across sampled indices and stages.
- The exponent in the cohomological allowance belongs to the raw measurement scale b. At fixed x, exp(x^ε/2) is √b and can be absorbed before normalizing the combined measurements. Carrying the same [Z,Z^(3/2)] interval into logarithmic coordinates makes the positive-part majorant explicit.
- In the primitive-character evaluation the signed carry is 2⌊bu/F⌋−(b−1). Reindexing by b gives the factor χ(b)b^k−1. The ℓ-adic norm conclusion needs that factor to be a unit and a strict depth bound. The calculation underlying the ideal generator uses different root-of-unity ambiguities for the field norm and the simultaneous residue congruence.
- The discriminant-place contraction counts the non-top boxes and a shared top-row allowance. The column bound has one denominator charge per lift and a separate credit at the first lift. For Count5 the endpoint gaps, formal degrees, mass factors and two prime indices are combined before division by fk to obtain the 11L loss.

- For the split local doubling integral, the twist records the signed sum of elementary divisors while decay records their absolute sum. Absolute convergence is justified by summing upper bounds for individual lattices. In the rank-two example the number of primitive maps must be divided by the number of units in the local quotient.
- Distinguished the six prime classes from the separate condition that a place be free of the level. Rational lifting allows a zero target. The proof of a nonzero evaluation concerns the whole adjusted base-tuple map.
- The free residue-group action supplies a rank deficit for the real frame. The two auxiliary local indices supply an absolute size contribution to Count5, and the normalized Vandermonde variation controls differences between words.
- The detecting cycles see the finite image of powered twisted norms. The two torsion orders belong to integral group homology in consecutive degrees. The arithmetic face count uses an ordered tuple acted on by a single group element. The finite stabilizer contributes a separate factor.
- In the primitive-character length bound the local inertia annihilator divides the next global annihilator. The quotient kills the image of Frobenius evaluation. The space for the empty list already vanishes over the base prime, whose separate cost cancels from the final bound.

- The odd-degree rank bound applies to the filtered homology classes. The detecting functionals bound the dimension of their image through a quotient of the test image. In the dual arithmetic system, raising the cyclotomic elements at levels d and qd to different powers contributes the factor q, and inversion of Frobenius supplies the minus sign.

## 20 November 2026

- Traced the public classical theorem through `rhOfAll`, `Formalism.VW.rh_of_every`, and `Formalism.VW.rh_of_right`. The other zeta proof in `Claim.zeta` has a separate caller.
- Distinguished the Mellin identities proved for Re s > 1 from the half-plane Re s > 2 used when the transformed data are packaged for the window theorem.
- The group tested by the two explicit family weights is the full H factor. The character-survival subgroup in averaging has a different role. The residue argument requires an index witnessing a zero, while the abstract family type alone may be empty.
- At the specialized quantitative entry the exponents are e_D=2 and e_L=0. Their sum plus seven gives nine.
- Added the positive-half-plane hypothesis on the set of poles and the empty-central-disk branch in the pole isolation argument. The tail kernel uses σ−2.
- Distinguished the analytic interval exponent 3/2 from the cohomological interval exponent 2. Recorded window bounds and parameter choices in their dependency order.
- Separated the Jacobi symbol condition for corrected integrality from the inert/signal prime and model hypotheses for the host-coordinate factorization. Checked the positive correction in the integral factor and the negative orbit exponent against their distinct source applications.
- Traced the mixed-row optimizer to the evaluated matrix-entry bound with sign −1.
- Distinguished the two parallel global lifts from the long chain. In the latter, the endpoint of the shifted special-value product is 1 and needs its own nonvanishing input.
- Distinguished the numerator’s continued nonzero value from the positive real normalizing product in the theta norm. The residual integral includes the real group and carries the finite-level volume through the pushforward Haar measure.
- The rank-one split/inert comparison specializes the local formula only. The chain starts at higher rank. Individual nonvanishing of the lifted basis vectors needs independence of the lifted labels to imply the adjoint surjection.
- The plus case-I estimate on the selected route calls the U3 implementation. The rank-four counting theorem indexes its Frobenius multisets and keeps repetitions. Distinct representatives can have the same trace at the comparison prime.
- The degree-two statement bounds log of the group order. In the homology estimate the field is first enlarged, then its degree and discriminant are expressed in terms of the original field. The exponent 150 is a sufficient witness extracted from the proof.
- The marked twists remain in the sum. On the common window their size determines which estimate applies. A fixed level keeps the same weighted Dirichlet family while the auxiliary arithmetic data vary with ε.
- The minus estimate takes one global product of primitive denominator-cleared Bernoulli values per twist. It pays once across odd primes away from the field degree and treats its odd divisors separately.
- The final third-place proof calls `TopPlug` and `TopShape`. Its `topDesWin` call fixes the exponents 2 and 0. Earlier citations to `CharacterBoxes/ShapeWin` exhibited an alternative assembly with the same exponents. The third-place source now supports the selected-path claims in balance and normalization.
- At an inert place right multiplication by a lattice stabilizer can move the enlarged row lattice. Its quotient length is invariant under the induced integral isomorphism. That length suffices for the coset calculation.
- On the geometric side the column construction consumes the logarithmic CM period. The global comparison in the selected third-place theorem comes separately from `link_gl`. The `OmLink` implication belongs to another assembly.
- The generator bound contributes 8 through the first cyclotomic layer, Kummer radicals, units and the class number. The witness 30 comes from the annihilator determinant. Their product 240 enters only after bounding length by exponent times single-prime torsion dimension.
- The first-column decomposition of a regular Gram fibre carries a local pushforward factor |t|ᵥ⁻² for each remaining column. It cancels on taking the product over all places by the number-field product formula. The earlier description of integration in stages suppressed that normalization.
- The bound on the reduced Siegel domain in the one-vector mass formula concerns one Hermitian column in ambient dimension M ≥ 3. The several-column theorem uses first-column recursion and a separate extension to general Schwartz tests on each regular fibre. The earlier description of a higher-rank lattice discrepancy conflated these two steps.
- Unfolding a rational isotropic line still leaves integration on the full group modulo its rational stabilizer. A compact transverse set and a cutoff argument justify the comparison with integrals on the line stabilizer. The shell measure alone does not give that comparison.
- The published file-size table lists 350,862,970 unpacked bytes for the challenge export. Bytewise comparison of a fresh decoding with the local unpacked copy gives 350,862,311 bytes. Both SHA-256 digests match the published manifest. The corpus record keeps the published figure and the measured size separately.

### Source model and the two parallel theta lifts

The description of an iterated theta integral in the local chapter defines its span and what it means to meet a summand. Three named definitions in that source file were absent by name from the full published solution export. The chapter now presents this construction as a mathematical model and explains the specific nonzero projection used in each of the two parallel Galois-side lifts. All 111 written calls recorded elsewhere in the route have a direct counterpart in their caller’s exported value. The comparison concerns these named calls, and the published record lists its selection and the three absent names. [Theta integrals](book.html#local-chain) · [Direct references](records/solution_terms.json)

### Normalizing a primitive column in a split algebra

The shorter account of transverse compactness described a single largest coordinate. Over the two components of a split place the largest entries can occur at different indices. The revised argument exhibits those two pivots, carries along a functional pairing to one, and uses scalar one at all but finitely many places. Only after forming the normalized hyperbolic pair does it invoke the compact family of isometries on its Gram fibre. [Transverse compactness](book.html#lifts-isotropic-transverse) · [Split pivots](book.html#lifts-primitive-witness-local)

### The threshold for a scalar count in an isotropic shell

The upper branch of the two-radius comparison includes the threshold itself. In the half-Gaussian example its value there is 25 and the exact nonzero count is still zero. Four vectors enter later, at closed radius one half. The chapter now derives the dimension of the scalar count after pairing and specifies which branch applies at equality. [Dilation and the threshold](book.html#lifts-adelic-box-count)

### The dimension retained in the minor-list sum

The count at each minor size carries the number of columns in one word's source space. The common row dimension enters later, when all words map into the same row space. The text now keeps those two quantities distinct before summing ordered word pairs. [The end of the list count](book.html#global-diagonal-rank-sum) · [The common row map](book.html#global-minor-frame-rank)

### The set of split places in Galois subtraction

The earlier summary said that the construction is repeated at every split place. In the argument used to obtain the common companion, a specified set of split places has Frobenius classes dense after any finite exclusion. The local conclusion is obtained at each place in that set with the requisite data. The related statement covering all split places uses its own hypotheses. [Recovering the even-dimensional representation](book.html#lifts-subtract)

### The space and the vector retained by the Casimir cut

The bound on the initial vector's mean Casimir defect alone does not persist under differentiation. The nonnegative part of the shifted bounded inverse supplies one nonzero vector. The kernel of its negative part supplies the space on which the bound holds through all subsequent derivatives. A threshold coordinate can belong to this kernel and have zero image under the positive part. The finite compact starting space for raising is the image of the original finite space. [From the mean to the invariant bound](book.html#normalization-casimir-window) · [The threshold example](book.html#fig-casimir-cutoff)

### Reconstructing a companion with fixed auxiliary places

The limiting representation is constructed for one fixed pair of auxiliary places. Its independence of a finite list of imposed tests follows within that construction. Passing from one auxiliary pair to another uses a separate isomorphism argument. The domains of the approximating identities are open dense subsets of the Galois group, with Frobenius elements chosen inside the necessary finite intersections. [Trace construction](book.html#lifts-odd-companion-trace) · [Local transport](book.html#lifts-odd-companion-three-places)

### The last minor and the discriminant of its real field

The normalized ideal uses the different of the maximal real subfield extended to the CM field. Rewriting its norm with the archimedean sizes introduces the factor (D_E/D_F²)^(2e). The field hypothesis sets that factor to one in the arithmetic family. The two-field example checks what happens when this hypothesis fails. [The last-minor identity and its scope](book.html#global-minor-ideal-height)

### Translating an algebraically generated tensor column

A translate of an algebraic tensor column can lie only in its Hilbert closure. The signed pairing at a translated projected column is justified by right invariance of Haar measure and square integrability of the coefficient functions. The ordinary orthogonal projection can be inserted or removed because the vector on its other side lies in the invariant coefficient space. [The coordinate and trace formulas](book.html#normalization-positive-column-trace)

### Which local systems must pass the genericity tests

In the odd-rank application the collection W of power-sum places lies above ℓ. Genericity is imposed on the union of W with the other finite test set Z. The polynomial division in the two-stage approximation tests each intermediate system and does not require a nonzero detector on the original target. A separate finite-dimensional argument places the rational original Hecke eigenvalues in a common finite extension. [The extended Hecke system](book.html#lifts-hecke-congruence-tests) · [The finite field of coefficients](book.html#lifts-hecke-coefficient-field)

### Local weights, global projectors and the last minor

The rank extraction now distinguishes the local cocharacter and its tangent, the degree test on all tangents, the structure of the full image algebra, and the density of the simple-spectrum locus on the extracted module. The global matrix algebra is obtained as a span under two explicit structural inputs. Its nilpotence test follows by translating a nonzero vector in an irreducible summand. The fixed-weight comparison distinguishes the period operator on the matrix lattice from the operator on the rank-m target. The last minor proof uses isotropy, the anisotropy condition of the second flag and transversality of the first frame. Rank alone would allow a zero leading minor. At the owner’s request vectors and matrices in the edition use ordinary weight. Explicitly bold matrix and vector symbols, an ambiguous index on a matrix unit and a nonmathematical fraction slash were corrected.

The abstract rank theorem now proves its product, conjugacy, factorization and group-row inputs. The example with unequal multiplicities specifies the whole acting group, and the construction states which equivariant maps span the original space. In the Hecke approximation the level can deepen at the split auxiliary place. The corrected text specifies this freedom and distinguishes the denominator condition for contraction from the additional local-support restriction in the application. The diagonal Gram bound now states the joint estimate on same-row term pairs before separating the two sums over minor lists.

### The two circle tests and the local determinant comparison

The common-level argument distinguishes the finite partition bounding the translates from the partition chosen later for polynomial approximation. Moving both matrix arguments gives the upper exponent bound. Holding the first matrix at the identity gives the lower bound, after a nonzero value on that slice has been found. On the Galois side the determinant comparison holds at each split spherical place under its stated assumptions. Recovering the entire Weil polynomial also needs multiplicative genericity and the geometric annihilation relation there. The transfer example uses three roots to satisfy the odd-rank hypothesis. [The two inequalities](book.html#lifts-hecke-weight-partial-sums) · [The determinant](book.html#lifts-geometric-determinant-character) · [The geometric transfer](book.html#lifts-geometric-hodge-package)

### Type place, weight place and degrees of the correspondences

The fixed place carrying the cuspidal type is separate over the real subfield from the place where every witness carries its base weight test. One application gives both conclusions at the base and a further place away from ℓ. At a further place over ℓ the two applications each retain the base test. The finite exceptional set is preserved from each individual level to its tower. It can change with the level. The constructed Hecke polynomial has leading coefficient one. The abstract geometric transfer admits an arbitrary nonzero leading scalar. [Local tests](book.html#lifts-geometric-level-tests) · [Witnesses](book.html#lifts-geometric-level-witnesses)

The cohomological transfer uses the finite étale source map of each chosen correspondence. The initial integral covering condition is upgraded to surjectivity in a later local argument. The trace condition for the automorphic function permits a further word-polynomial multiplier on each tested polynomial. The finite-dimensional argument constructs one multiplier sufficient for all the tests. [The spectral function](book.html#lifts-geometric-level-spectral-test) · [The geometric transfer](book.html#lifts-geometric-hodge-package)

### From an isogeny at fine level to the integral congruence

The fine-level quotient constructs an isogeny and a candidate pair of maps. Their existence at the requested source level follows only after checking the descent condition. For a general Hecke correspondence the source degree counts points before applying the target. In the fixed-point formula, the more specialized correspondences satisfy additional hypotheses on both legs. [The descent](book.html#lifts-geometric-tower-descent) · [The source degree](book.html#lifts-geometric-tower-degree) · [The trace formula](book.html#lifts-geometric-hodge-holomorphic-test)

For a good-reduction witness the restricted correspondence has its full source fibre throughout the integral model. In a congruence witness the equal fibre count is asserted where the residue characteristic is invertible. The special-fibre identity follows from a bijection of integral sections and injectivity on their residue points. It is here that the closedness of the selected model is used. [The two restrictions](book.html#lifts-geometric-cover-good) · [The residue identity](book.html#lifts-geometric-cover-congruence)

### Fine labels, ordinary sections and integral degrees

At a Hecke place an integral translation may take the lattice to a proper sublattice. The equality of kernel tests proves that the ratio of two such translations acts invertibly. With right actions, an inverse transition label acts by the original group element. Both conventions determine which side of a coset appears in the fibre count. [Kernel tests](book.html#lifts-integral-hecke-fibre-count) · [The forgetful map](book.html#lifts-integral-forgetting-degree)

The generic cover may miss whole components. The generic quotient comparison used to compute the integral forgetful degree supplies the additional surjectivity for its two particular models. Flatness and local constancy extend that degree to special points. The ordinary congruence instead uses a count of valuation-ring sections, keeping the target point and its multiplicity together. [Generic cover](book.html#lifts-integral-cover-splitting) · [Residue identity](book.html#lifts-integral-congruence-witness)

### Counting points in an ordinary kernel

The distinguished special subgroup for a subspace of dimension j has length Qʲ. When the subspace contains the reduction line, it has Qʲ⁻¹ geometric points. Each local factor then has length Q. This is where the relative Frobenius comparison needs infinitesimal points as well as field-valued points. The comparison identifies the larger quotient with the smaller quotient followed by relative Frobenius. [Reduced kernels](book.html#lifts-ordinary-reduced-quotient) · [The extra length](book.html#lifts-ordinary-frobenius-quotient)

Properness extends a specified generic torsion point uniquely. The lift of a specified special torsion point uses flatness and an algebraically closed fraction field, and several lifts may occur. Counting these latter fibres recovers the one-dimensional reduction kernel. [The two extensions](book.html#lifts-ordinary-torsion-sections)

### The two orders of composition in the tangent test

Restriction to the dual numbers keeps the constant and linear coefficients. The return map sends the linear term to degree Q and raises each coefficient to its Qth power. Composing in this order gives Frobenius on the longer ring. Reversing the maps gives only the Qth power of the constant term. At length Q an ordinary tangent can still be nonzero. It cannot have the lift with injective return map needed in the longer case. [The ring calculation](book.html#lifts-ordinary-two-composites)

### Comparing variations at a generic point

Two deformations of the same abelian variety can have distinct first-order Hodge coefficients. The comparison in the ordinary-point argument needs both candidate lifts in the filtration of one marked abelian scheme. Its classifying map is used to transport the Frobenius inclusion through the generic residue field, where the maps into the field and the dual numbers may differ to first order. The two resulting coefficients must then agree modulo the original filtration. [Transport through the residue field](book.html#lifts-ordinary-variation-descent) · [The quotient in which the coefficients agree](book.html#lifts-ordinary-variation-coefficient-coset)

### Regular weight for components of a displayed vector

The signed nonzero components in the integral basis-vector table previously inherited a heavier weight than its zero entries. All components now use the same regular face. Their signs and the existing colors distinguish the values. Mathematical variables in disclosure headings also use regular weight. [The signed basis-vector table](book.html#fig-rank-grid)

### Which module and which Frobenius

Annihilator identities in the coefficient ring need a reason to persist in cohomology. The new proof first passes to a free module, then to a projective summand, and exchanges the two tests under vector-space duality. The separate proof of the character multiplicities uses the bijection on the regular coefficient algebra obtained by raising scalars to their qth powers. The Frobenius acting on primitive cohomology can kill a Hodge class. [Transport of the two kernels](book.html#lifts-ordinary-cohomology-annihilator) · [Comparison of multiplicities](book.html#lifts-ordinary-frobenius-multiplicities)

In the normalization chapter the Greek letters ν and λ name vectors of weights. Marking the symbols in the model introduction and the lowering question keeps them at regular weight inside the bold text on screen and in print.

For the elementary Hecke operator the 𝔴′-torsion test identifies the distinguished part of the kernel. The polarized comparison with equal multipliers recovers the complementary part. The proof now includes that intermediate implication and shows how the ideal generator gives an actual integral source label. The two descents have different finite targets. The polarization test after extending the homomorphisms gives an isomorphism of the two integral line bundles. [Reading the elementary labels](book.html#lifts-isogeny-elementary-descent) · [Extending the polarization](book.html#lifts-isogeny-polarization).
