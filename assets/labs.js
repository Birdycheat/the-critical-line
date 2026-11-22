/* The same pure routines produce the printed figure and every browser state. */
(function (root) {
  "use strict";
  const range = (key, label, min, max, step, value) => ({
    key,
    label,
    min,
    max,
    step,
    value,
  });
  const choose = (key, label, options, value) => ({
    key,
    label,
    options,
    value,
  });
  const ramifiedCoordinates = [["0", "0"], ["1", "1"], ["eta", "η"], ["sum", "1 + η"]];
  const gaussianLabels = Array.from({length: 7}, (_, i) => [String(i), String(i)]);
  const periodLayers = {
    opposite: {label: "N = 4, jumps (−1, 1)", height: 4, jumps: [-1, 1]},
    upper: {label: "N = 1, jumps (0, 1)", height: 1, jumps: [0, 1]},
    flat: {label: "N = 2, jumps (0, 0)", height: 2, jumps: [0, 0]},
  };
  const configs = {
    "iwahori-translated-slopes": {
      title: "Which eigenvalue valuations change under the central translation?",
      kind: "A two-dimensional Iwahori double coset",
      section: "lifts",
      params: [
        choose("prime", "Local prime r", [["3", "3"], ["5", "5"], ["7", "7"]], "3"),
        range("power", "Double-coset power m", 0, 3, 1, 2),
        range("shift", "Valuation of the central scalar d", 0, 2, 1, 1),
      ],
      caption: "Over K = ℚᵣ the two Iwahori factors are the upper unipotent with entry 1 and the lower unipotent with entry r. They flank diag(1, r⁻ᵐ). The central scalar is rᵈ. The test evaluates the matrix g obtained by multiplying this product by r⁻ᵐᵈ.",
      method: "To compute with integers, multiply g by r raised to m(1 + d) and call the result B. For m > 0 its characteristic polynomial reduces to X(X − 1). Both residue roots lift by Hensel’s lemma. The lift of 1 is a unit and the product of the two roots is det B = rᵐ. Subtract m(1 + d) from their valuations to recover those of g. At m = 0 the discriminant is r(r + 4), of odd valuation at each listed prime.",
    },
    "filtered-lattice-modification": {
      title: "Which powers put the columns and inverse rows at the same depth?",
      kind: "Two lattices over a Laurent series field",
      section: "lifts",
      params: [
        choose("degrees", "Filtration degrees", [["mixed", "(−1, 2)"], ["swapped", "(2, −1)"], ["flat", "(0, 0)"]], "mixed"),
        range("height", "Target depth N", 0, 3, 1, 3),
        choose("rule", "Exponent on column i of X", [["subtract", "N − hᵢ"], ["add", "N + hᵢ"]], "subtract"),
      ],
      caption: "In the Laurent series field K((u)), let A = K[[u]] and set E = u. The two lattices are A² and Q A², where column i of Q is column i of U multiplied by u to the power hᵢ. The columns of U are (1, 0) and (1, 1). The rows of its inverse are (1, −1) and (0, 1). A vector lies at depth N when all its entries belong to uᴺA.",
      method: "Choose a diagonal X. Its companion X′ uses the complementary exponent in each position so that XX′ is E to the power 2N times the identity. Right multiplication by X shifts each column of Q, whereas left multiplication by X′ shifts each row of Q⁻¹. Thus the filtration starts at hᵢ on the column and at −hᵢ on the inverse row. With the subtract rule, QX = uᴺU and X′Q⁻¹ = uᴺU⁻¹. The A-linear combinations of the columns of X give exactly the coefficient vectors in K((u))² that Q sends into uᴺA². Both modifiers have integral entries exactly when N bounds the absolute values of the two degrees. The arithmetic theorem chooses such an N and constructs the modification from lifted coefficients in the Breuil–Kisin ring. Clearing denominators there can introduce a power of ℓ in the product.",
    },
    "logarithm-zero": {
      title: "Which column does the translated logarithm give?",
      kind: "A rank-three monodromy calculation",
      section: "lifts",
      params: [
        choose("translation", "Translation parameter a", [["-1", "−1"], ["0", "0"], ["1", "1"], ["2", "2"]], "1"),
        choose("column", "Column to inspect", [["1", "First"], ["2", "Second"], ["3", "Third"]], "3"),
      ],
      caption: "Let J send e₃ to e₂, e₂ to e₁ and e₁ to zero. Set E(z) = I + zJ + (z²/2)J². In this polynomial model over ℚ, Q = U E(L) with L = X + b. Set its invertible parameter t equal to 1. The initial columns of U are u₁ = (1, 1, 0), u₂ = (0, 1, 1) and u₃ = (0, 0, 1). Each tuple lists a column from top to bottom.",
      method: "The translation gₐ fixes U and adds a to both X and b, so gₐ(L) = L + s with s = 2a. To evaluate the translated logarithm at zero, put X = −b − s. Then the invariant-column identity ρ(a)gₐ(Q) = Q gives ρ(a)U = U E(−s). In these columns monodromy is M = −J because N = −∂/∂X. Right multiplication combines the columns of U. The third column includes (s²/2)u₁ because J²e₃ = e₁.",
    },
    "orbital-unipotent-fibre": {
      title: "Does the unipotent fibre cancel on both translates?",
      kind: "Two slices of one test on GL₂(ℚ₅)",
      section: "lifts",
      params: [
        choose("slice", "Diagonal matrix", [["units", "diag(1, 6)"], ["split", "diag(5, 1/5)"]], "units"),
        choose("coset", "Representative X modulo ℤ₅", [["zero", "0"], ["1", "1/5"], ["2", "1/25"], ["3", "1/125"]], "2"),
      ],
      caption: "Set K = GL₂(ℤ₅) and D = K diag(1/5, 5) K. The same test f has value −4 on K, +1 on D and zero elsewhere. Change the upper-right entry of the identity matrix to X to obtain u(X). It belongs to K exactly when X lies in Λ = ℤ₅. For γ = diag(A, B), the conjugate u(X)⁻¹γu(X) equals γu(Y), where Y = Φ(X) = (1 − B/A)X.",
      method: "Normalize additive Haar measure by μ(ℤ₅) = 1. In both slices the determinant is a unit, so the least valuation among A, B and AY determines the two elementary divisors. A minimum of 0 gives K and a minimum of −1 gives D. For diag(1, 6), the image cells are translates of 5ℤ₅. The shell (1/5)ℤ₅ ∖ ℤ₅ has mass 5 − 1 = 4. For diag(5, 1/5), the image of ℤ₅ under multiplication by 24/25 is (1/25)ℤ₅, since 24 is a 5-adic unit. This whole cell contributes +1. Cuspidality requires vanishing on every translate.",
    },
    "signed-weil-operator": {
      title: "Which Frobenius iterate is the input?",
      kind: "A Frobenius model on the rational function field",
      section: "lifts",
      params: [range("degree", "Signed exponent α", -2, 2, 1, 1)],
      caption: "In the rational function field ℚ(t), the model Frobenius φ fixes ℚ and substitutes t² for t. Start with U = t and write α = n₂ − n₁, where n₁ = max(−α, 0) and n₂ = max(α, 0). Multiply the input by V/s and follow it to the output. Both iterates use ordinary substitution.",
      method: "Take height H = 1, κ = 0, a = t², Z = aU = t³ and Z′ = t. Their product is h = a² = t⁴. Write φ₁ and φ₂ for the iterates with indices n₁ and n₂. Then V = φ₂(h)φ₁(Z)φ₂(Z′) and s = φ₂(a)³φ₁(a). The last two rows check the defining equation Vφ₂(U) = sφ₁(U) before division. The fraction V/s acts by multiplication on the displayed input in ℚ(t).",
    },
    "crystalline-invariant-columns": {
      title: "Which columns does the Galois action fix?",
      kind: "Conjugation over ℚ(i)",
      section: "lifts",
      params: [
        choose("scalar", "Frame scalar w", [["one", "1"], ["i", "i"], ["sum", "1 + i"]], "i"),
        choose("coefficient", "Column coefficient a", [["one", "1"], ["two", "2"], ["i", "i"], ["sum", "1 + i"]], "one"),
      ],
      caption: "Let g be complex conjugation. It acts on scalars by conjugation and on columns by T(z) = −g(z). Compare the product XQ with the normalized column U = XQ/w, then test the multiple aU.",
      method: "Take Q = 1 − i, Γ = −i and X = w(1 − i). Then Γg(Q) = Q and wT(X) = g(w)XΓ. Multiplying the two identities gives T(XQ) = [g(w)/w]XQ. Division by w therefore gives T(U) = U. Since T(aU) = g(a)U and U is nonzero, aU is fixed exactly when a belongs to ℚ. This quadratic-field calculation models the scalar cancellation in the period matrix.",
    },
    "integral-lattice-saturation": {
      title: "Which columns generate the integral lattice?",
      kind: "A diagonal basis and its integral span",
      section: "lifts",
      params: [
        range("power", "Exponent a of u", 0, 2, 1, 1),
        choose("vector", "Test vector x", [["e1", "e₁"], ["ue1", "u e₁"], ["u2e1", "u² e₁"], ["e2", "e₂"]], "e1"),
        range("loss", "Exponent r of 3", 0, 2, 1, 1),
        range("precision", "Precision n", 1, 4, 1, 2),
      ],
      caption: "Write S for the ring 𝔖 = ℤ₃[[u]] and let 𝒪 be the 3-adic completion of S[1/u]. The intersection of S² with 𝒪² is S². The columns of V = diag(uᵃ, 1) form a basis of 𝒪². Their S-span, uᵃS × S, also has rank two. The first test asks about one vector. The second asks whether VG ≡ 3ʳI modulo 3ⁿ for some matrix G over S.",
      method: "For x = uʲe₁ the first coefficient in the column basis is uʲ⁻ᵃ. It lies in S exactly when j ≥ a. The vector e₂ is always the second column. Substituting u = 0 in the (1, 1)-entry of VG over S gives zero whenever a > 0. For any fixed r, taking n = r + 1 leaves the nonzero target residue 3ʳ, so no such r works at every precision. Over 𝒪, the matrix 3ʳV⁻¹ gives the target exactly. For a > 0 the quotient of S² by the column span is S/(uᵃ), free over ℤ₃ on the powers of u of degree below a. Thus the span is saturated for 3. If it contains 3x, it contains x.",
    },
    "period-witness-compatibility": {
      title: "When do two witnesses give the same lower-order class?",
      kind: "Normalized witnesses on one frame",
      section: "lifts",
      params: [
        choose("tangent", "Action on t", [["4", "g(t) = 4t"], ["-1", "g(t) = −t"]], "4"),
        range("degree", "Degree d of the added term", 2, 4, 1, 4),
        range("scale", "Scalar exponent k at order four", 0, 3, 1, 2),
      ],
      caption: "Over ℤ₃[[t]], let J have its only nonzero entry, a one, in position (1, 2). Put B = I + tJ. The first candidate is 3(B + t³J), tested modulo t³. The second is 3ᵏ(B + tᵈJ), tested modulo t⁴. Divide each by its own scalar to compare their (1, 2)-entries modulo t³. Their other normalized entries already agree.",
      method: "The generator g fixes the coefficients and sends t to wt. Put Δ = B g(B)⁻¹ = I + (1 − w)tJ. For a candidate β = c(B + tᵈJ), the defect Δg(β) − β is c(wᵈ − 1)tᵈJ because J² = 0. The test at order m requires this defect to be divisible by tᵐ. Checking the generator suffices for its cyclic group because the action preserves (tᵐ) and the twist is invertible. With w = 4 a nonzero coefficient still counts, even when 3 divides it. With w = −1 every even power of t is fixed.",
    },
    "period-common-power": {
      title: "Which power changes both matrices to the target height?",
      kind: "Common powers in a polynomial matrix pair",
      section: "lifts",
      params: [
        choose("layer", "Starting height and jumps", Object.entries(periodLayers).map(([key, layer]) => [key, layer.label]), "opposite"),
        range("target", "Target height H", 0, 4, 1, 1),
      ],
      caption: "Work in the polynomial ring ℤ[t]. At height m, the diagonal factors in the first matrix have exponents m + h₁ and m + h₂. In its companion they have exponents m − h₁ and m − h₂. Compare the smallest starting exponent with the power you need to divide out.",
      method: "Write D₊ and D₋ for the diagonal matrices with those powers of t. Take P with rows (1, 1) and (0, 1), and form A = D₊P⁻¹ and A′ = PD₋. Their product is t²ᵐI because P⁻¹P cancels. Changing the height from N to H shifts all four exponents by H − N. Try H = 2 in the first two layers. Divide by t² in the layer starting at 4 and multiply by t in the layer starting at 1. Both products become t⁴I. A negative exponent at the target gives a pole on the diagonal.",
    },
    "translated-trace-precision": {
      title: "Which traces detect divisibility in the lattice?",
      kind: "Translated traces on a two-dimensional 2-adic lattice",
      section: "lifts",
      params: [
        range("n", "Power n", 0, 3, 1, 1),
        range("a", "Coefficient a", -8, 8, 1, 1),
        range("b", "Coefficient b", -8, 8, 1, 1),
      ],
      caption: "Let I be the identity and D = diag(1, −1). Their ℤ₂-span is the lattice M. For X = aI + bD the diagonal entries are a + b and a − b. Compare their divisibility with the two trace residues. A zero in a residue column means that its modulus divides the trace.",
      method: "Since D² = I and tr(D) = 0, the ordinary trace is 2a and the trace after right multiplication by D is 2b. Both vanish modulo 2ⁿ⁺¹ exactly when a and b are divisible by 2ⁿ, which is the condition X ∈ 2ⁿM. At n = 1 take a = 0 and b = 1. The ordinary trace is zero at every precision, while tr(XD) = 2 detects the missing divisibility. Alternatively, once the diagonal entries have been divided by 2ⁿ, they must have the same parity for the quotient to belong to M.",
    },
    "square-torus-fixed-points": {
      title: "What does a fixed point contribute to the trace?",
      kind: "Holomorphic fixed-point weights on a square elliptic curve",
      section: "lifts",
      params: [
        range("real", "Real part a", -4, 4, 1, 0),
        range("imag", "Imaginary part b", -4, 4, 1, 4),
        choose("y", "Evaluate at y", [["0", "0"], ["1", "1"]], "0"),
      ],
      caption: "Multiplication by Θ = a + bi acts on E = ℂ/ℤ[i]. At y = 0 the sum of the local weights gives the alternating trace on the structure sheaf. At y = 1 an isolated fixed point contributes one.",
      method: "A point z is fixed when (1 − Θ)z belongs to ℤ[i]. For Θ ≠ 1 the kernel has order N = |1 − Θ|², the determinant of multiplication by 1 − Θ on the square lattice. Every fixed point has the same derivative Θ and weight (1 − yΘ)/(1 − Θ). Summing over the N points gives the polynomial (1 − a + bi)(1 − yΘ), since N/(1 − Θ) is the complex conjugate of 1 − Θ. The choice Θ = 0 gives a constant map. Every nonzero Θ gives an isogeny.",
    },
    "gaussian-quotient-marking": {
      title: "Which marking preserves the label on the quotient?",
      kind: "An isogeny of the square elliptic curve",
      section: "lifts",
      params: [
        choose("u", "Real coordinate u", gaussianLabels, "1"),
        choose("v", "Imaginary coordinate v", gaussianLabels, "0"),
        choose("factor", "Multiplier", [["F", "F = 1 − i"], ["h", "h = 1 + i"]], "F"),
        choose("shift", "Change of lift y", [["zero", "0"], ["one", "1"], ["i", "i"], ["both", "1 + i"]], "zero"),
      ],
      caption: "On E = ℂ/ℤ[i], choose a label x = u + iv modulo 7 and an integral lift x + 7y. Multiply the lift by the selected factor and divide by 14 to get a point of E. Its image under h = 1 + i has level 7. At level N the pair (a, b) denotes the point (a + bi)/N modulo ℤ[i].",
      method: "Changing the lift adds the selected multiplier times y/2 to the level-14 point. This is either zero or (1 + i)/2, and h kills both points. With F = 1 − i the composite hF = 2 gives the prescribed x/7. Choosing h again gives h² = 2i, so the image is ix/7. Only the zero label is fixed by i modulo 7, since (i − 1)(−i − 1) = 2 is invertible modulo 7.",
    },
    "ramified-residues": {
      title: "Which residues admit a witness at the ramified place?",
      kind: "Coefficient equations in a product of two local rings",
      section: "lifts",
      params: [
        choose("first", "Coordinate at 𝔴", ramifiedCoordinates, "eta"),
        choose("second", "Coordinate at 𝔳", ramifiedCoordinates, "sum"),
        choose("relation", "Equation", [["generate", "ex = au"], ["project", "ex = du"], ["split", "x = au + (1 − e)v"]], "split"),
      ],
      caption: "Choose a residue x in S × S, where S = 𝔽₂[η]/(η²). The projector is e = (1, 0). The two integral coefficients a and d both reduce to (η, 0). Test each equation with its own hypothesis.",
      method: "Multiplication by η sends h + jη to hη for h and j in 𝔽₂. Thus the first coordinate of x must have zero constant term in all three tests. When it does, its η coefficient fixes the constant term of the first coordinate of u. The remaining bit there and the four possibilities at 𝔳 give eight choices of u. In the decomposition, the second coordinate of v is prescribed and its first coordinate is free, giving four choices for each u.",
    },
    "polarized-graph": {
      title: "When does the moving plane stay isotropic?",
      kind: "First-order lifts of a Lagrangian plane",
      section: "lifts",
      params: [
        choose("prime", "Characteristic", [["2", "2"], ["3", "3"], ["5", "5"]], "3"),
        choose("direction", "Direction (a, b)", [["same", "Equal (1, 1)"], ["first", "First only (1, 0)"], ["opposite", "Opposite (1, −1)"], ["zero", "Zero (0, 0)"]], "same"),
        choose("lift", "Lift of e₁", [["given", "Given generator"], ["unit", "Multiply by 1 + ε"]], "given"),
      ],
      caption: "Over 𝔽ₚ[ε]/(ε²), lift the plane Fil spanned by e₁ and e₂ using e₁ + εa f₂ and e₂ + εb f₁. Read the first-order coefficient of each lift and its class modulo Fil.",
      method: "The alternating form pairs eᵢ with fⱼ by δᵢⱼ. The constant pairing is zero, and ε² is zero. The two cross terms give ε(b − a). An alternating form vanishes on the plane exactly when it vanishes on its two generators paired together. Multiplication of the first generator by 1 + ε adds e₁ to its first-order coefficient. This adds a vector of Fil and preserves the quotient class.",
    },
    "ordinary-frobenius-coefficients": {
      title: "Which terms survive cubing modulo t⁴?",
      kind: "Cubing a truncated polynomial over a field of nine elements",
      section: "lifts",
      params: [
        choose("coefficient", "Coefficient", [["one", "1"], ["omega", "ω"], ["sum", "1 + ω"]], "omega"),
        choose("degree", "Degree in t", [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"]], "1"),
      ],
      caption: "Choose one term of a polynomial in 𝔽₉[t]/(t⁴), where ω² = −1. Follow it through the dual numbers and back. Cubing a sum adds the individual outputs.",
      method: "The first map sends t to ε with ε² = 0. The second map cubes each surviving coefficient and sends ε to t³. Since ω³ = −ω, cubing a coefficient a + bω gives a − bω for a and b in 𝔽₃. A term of degree two or three would reach degree six or nine under cubing, so it vanishes modulo t⁴.",
    },
    "ordinary-torsion-reduction": {
      title: "What does one special torsion point retain?",
      kind: "Roots of unity in a finite flat group scheme",
      section: "lifts",
      params: [
        choose("q", "Residue prime q", [["2", "2"], ["3", "3"], ["5", "5"]], "3"),
        choose("e", "Test ring order e", [["1", "1 · field"], ["2", "2"], ["4", "4"], ["6", "6"]], "4"),
      ],
      caption: "Use the group scheme μq × (ℤ/qℤ) with the second coordinate fixed at 1. The special fibre is defined over 𝔽q. Testing its equation over a ring with nilpotents detects structure at its single point in this component.",
      method: "In characteristic zero the first coordinate can be any q-th root of unity. On the special fibre write it as 1 + t. The equation becomes t to the power q equals zero. In the test ring 𝔽q[ε]/(εᵉ), raising to the q-th power multiplies every exponent of ε by q. All coefficients below degree ⌈e/q⌉ must vanish. Each higher coefficient has q choices.",
    },
    "ordinary-line-cancellation": {
      title: "Which point receives the even and odd contributions?",
      kind: "Subspaces above one quotient subspace",
      section: "lifts",
      params: [
        choose("q", "Field size Q", [["2", "2"], ["3", "3"], ["5", "5"]], "3"),
        choose("r", "Dimension of U", [["0", "0 · zero space"], ["1", "1 · line"], ["2", "2 · plane"]], "1"),
      ],
      caption: "Each column follows the lifts of one fixed subspace U of the quotient plane. The residue map cycles through P₀ → P₁ → P₂ → P₀. The full preimage starts one step ahead of the graphs.",
      method: "Take the last coordinate line C in the three-dimensional space over the field of Q elements. A lift of U missing C is the graph of a linear map from U to C, with Q choices for each basis vector. The unique lift containing C is the full preimage. For dimension j, apply the residue map another 3 − j times and count each lift with weight Q raised to j(j − 1)/2. Add the weights at the final point separately for even and odd dimensions.",
    },
    "clopen-branch-reduction": {
      title: "Does one generic branch remain open and closed?",
      kind: "Two integral models over the localization of ℤ at 5",
      section: "lifts",
      params: [
        choose("model", "Integral model", [["glued", "Branches meeting modulo 5"], ["product", "Product of two copies of R"]], "glued"),
      ],
      caption: "Over ℚ the two branches are distinct. The projector with values (1, 0) selects the first. In the smooth product model that branch remains open and closed after reduction. In the glued model its closure meets the other branch.",
      method: "Let R = ℤ₍₅₎, the rational numbers with denominator prime to 5. Write the model as R[X]/(X(X−d)). Evaluation at 0 and d sends a + bX to (a, a + db). For d = 1 this gives R × R. For d = 5 the image consists of pairs congruent modulo 5. Over ℚ the projector is 1 − X/d. It extends over R precisely when 1/d belongs to R. Reducing the polynomial modulo 5 also records whether its roots coincide.",
    },
    "quadratic-place-restrictions": {
      title: "Which place above 17 can carry the weight test?",
      kind: "Restricting primes in the eighth cyclotomic field",
      section: "lifts",
      params: [
        choose("root", "Residue of ζ at the candidate place", [["15", "15"], ["2", "2"], ["9", "9"], ["8", "8"]], "15"),
      ],
      caption: "Keep the type place fixed. A candidate for the weight place must agree on the imaginary quadratic subfield and differ on the real subfield. The table checks these two field conditions.",
      method: "In E = ℚ(ζ) take ζ of order eight. The four roots of X⁴ + 1 modulo 17 specify the four places over 17. The imaginary quadratic subfield is generated by ζ² and the maximal real subfield by ζ + ζ⁻¹. For a residue x of ζ, its inverse is −x³ because x⁴ = −1. The two subfield discriminants divide a power of 2, so their generator residues determine the contracted primes at 17.",
    },
    "weight-circle-spectrum": {
      title: "Which exponents occur when a circle acts on a vector?",
      kind: "Circle exponents in a determinant-twisted symmetric cube",
      section: "lifts",
      params: [
        choose("vector", "Vector", [["sum", "Sum of the four monomials"], ["highest", "Highest vector e₁³"], ["lowest", "Lowest vector e₂³"]], "sum"),
        choose("circle", "Circle", [["t1", "t₁(z) = diag(z, 1)"], ["t2", "t₂(z) = diag(z, z)"]], "t1"),
      ],
      caption: "On the first circle only the highest monomial attains exponent 2. On the second circle all four monomials have exponent 1. A coefficient of zero removes that row from the selected vector.",
      method: "Work in det⁻¹ ⊗ Sym³(ℂ²), of highest weight κ = (2, −1). The rows list e₁ʲe₂³⁻ʲ in order j = 0, 1, 2, 3, with the same determinant twist in each row. On diag(z, 1), the monomial contributes zʲ and the twist contributes z⁻¹. On diag(z, z), the monomial contributes z³ and the twist contributes z⁻². Read off the powers on rows whose coefficient is one. The upper bound sₖ(κ) is the sum of the first k entries of κ.",
    },
    "hecke-four-point-approximation": {
      title: "Which functions on four points attain the error bound?",
      kind: "2-adic approximation on the cyclic group of order four",
      section: "lifts",
      params: [
        choose("witness", "Function in P", [["character", "Character χ"], ["inverse", "Inverse character χ⁻¹"], ["combination", "Combination with values (1, 1, −1, −1)"]], "character"),
      ],
      caption: "The two characters reach the radius 1/√2 at the odd elements. Their displayed linear combination has error at most 1/2 on all four elements. All three functions belong to the same two-dimensional space.",
      method: "Write C₄ additively and work in ℚ₂(i), with i² = −1 and |2|₂ = 1/2. The space P is spanned by χ(h) = iʰ and χ⁻¹(h) = i⁻ʰ. Translation multiplies each character by a scalar, so P is translation invariant and dim P = |C₄|/2. For the combination take ((1−i)/2)χ + ((1+i)/2)χ⁻¹. Compute the error at each h from |1±i|₂ = 1/√2, which follows by squaring 1±i. The largest of the four errors measures the distance of the displayed function from 1.",
    },
    "rank-weight-projectors": {
      title: "How many eigenspaces does a four-dimensional operator have?",
      kind: "Spectral projectors and differences of weights",
      section: "lifts",
      params: [
        choose("weights", "Distinct weights", [["separated", "0, 1, 4"], ["adjacent", "0, 1, 2"]], "separated"),
        choose("repeated", "Weight with two coordinates", [["low", "Lowest"], ["middle", "Middle"], ["high", "Highest"]], "middle"),
      ],
      caption: "Read the four diagonal entries of each projector. A second 1 in one row means that eigenspace is a plane. Switch to equally spaced weights to see which two pairs then give the same difference.",
      method: "Let D act diagonally with the four displayed entries. For each distinct weight h, evaluate Pₕ(x) = ∏(x−k)/∏(h−k), taking both products over the other distinct weights k. The rank is the sum of the diagonal entries of Pₕ(D). To test differences, let the commutator X ↦ DX−XD act on matrices. A map from the weight-k space to the weight-h space has commutator eigenvalue h−k. Its block has dimension rank(Pₖ) × rank(Pₕ).",
    },
    "polynomial-cut": {
      title: "How much 5-adic precision does a local test cost?",
      kind: "Reweighting a finite approximation of polynomial evaluations",
      section: "lifts",
      params: [
        choose("power", "Polynomial to test", [["0", "1"], ["1", "X"], ["2", "X²"], ["3", "X³"]], "1"),
        choose("filter", "Rule", [["all", "Average at 0 and 10"], ["cut", "Keep nonzero points"]], "cut"),
      ],
      caption: "For X, the average recovers the target 5 exactly. Filtering leaves the value at 10. Read the old error on X² to see where the new error on X comes from.",
      method: "Compute ordinary rational values first. The original weights at 0 and 10 are both 1/2. Multiplication by Q(x)/Q(5)=x/5 changes them to 0 and 1. For the test Xᵏ, evaluate at the target 5 and compare with the chosen weighted sum. The displayed 5-adic error is 5⁻ᵛ for a nonzero difference divisible by 5ᵛ and equals zero for an exact match.",
    },
    "satake-multiplicities": {
      title: "Does the determinant determine the three roots?",
      kind: "Testing the local polynomial at a prescribed place",
      section: "lifts",
      params: [
        choose("roots", "Allowed roots", [["primes", "2, 3, 5"], ["powers", "1, 2, 4"]], "powers"),
        choose("candidate", "Candidate multiplicities", [["middle", "0, 3, 0"], ["simple", "1, 1, 1"], ["first", "2, 1, 0"]], "middle"),
      ],
      caption: "The allowed roots annihilate every displayed candidate. Inspect all multiplicities with the prescribed determinant, then compare the two traces. For roots 1, 2, 4 a repeated root passes the determinant test.",
      method: "Each candidate is a diagonal three-by-three matrix. Enumerate all ten nonnegative triples with sum three and keep those whose product of roots, counted with multiplicity, equals the product of the three prescribed roots. The trace sums roots with the same multiplicities.",
    },
    "column-degree-defect": {
      title: "Does one character account for the whole coefficient space?",
      kind: "Projecting the evaluation vector on a four-element group",
      section: "normalization",
      params: [
        choose("modes", "Characters in the space", [["1", "1"], ["2", "1, χ₁"], ["3", "1, χ₁, χ₂"]], "2"),
        choose("mass", "Total Haar mass M", [["1", "1 (probability)"], ["4", "4 (counting)"]], "1"),
      ],
      caption: "Keep the constant character and add a second character to the coefficient space. The excess squared norm is the part of the evaluation vector outside the constants. Changing the Haar mass rescales both the formal degree and the squared norms.",
      method: "On pairs of bits use χ₁(a,b)=(−1)ᵃ and χ₂(a,b)=(−1)ᵇ. Each point has mass M/4. The vector w representing evaluation at (0,0) is the sum of the selected characters divided by M. Its projection Ew onto the constants is its average. The table evaluates these functions at all four points. Sum their squares with mass M/4 to obtain the two norms.",
    },
    "frobenius-good-places": {
      title: "Which prime still realizes the chosen Frobenius?",
      kind: "Testing an inverse Frobenius on seventh roots of unity",
      section: "lifts",
      params: [
        choose("prime", "Rational prime q", [3, 11, 17, 29, 61, 89].map(q => [String(q), String(q)]), "61"),
        choose("omit", "Additional exclusion", [["none", "None"], ["61", "Places above 61"]], "none"),
      ],
      caption: "Look for a good place whose inverse Frobenius cubes a seventh root of unity. Once 61 is excluded, try 89. The smaller primes illustrate how a candidate can fail a different part of the test.",
      method: "In E = ℚ(√5,i), each listed odd prime is unramified. The absolute residue degree is one when both 5 and −1 are squares modulo q, and two otherwise. If 5 is a nonsquare, the real residue field has degree two and contains a square root of −1. The good-place condition also asks that −1 be a square in ℚq. At a place of residue degree f the inverse Frobenius exponent is the inverse of q^f modulo 7. All listed primes are away from ℓ = 13.",
    },
    "casimir-cutoff": {
      title: "Which directions survive the Casimir cutoff?",
      kind: "A diagonal operator on three coordinates",
      section: "normalization",
      params: [
        choose("amplitude", "First coordinate of the trial vector", [["3", "3"], ["4", "4"], ["5", "5"]], "3"),
        choose("outer", "Largest eigenvalue of U/R", [["2", "2"], ["3", "3"]], "2"),
      ],
      caption: "Read down the middle column. The second axis belongs to the cut because N vanishes there. The witness Py has zero second coordinate because P also vanishes there. Its first coordinate shows that the cut contains a nonzero vector.",
      method: "Write R = 2S and take U/R diagonal with entries 0, 1 and b. On an axis with entry u, T acts by t = 1/(1+u²). The positive and negative parts of T−½I act by P = max(t−½,0) and N = max(½−t,0). For the trial vector y = (a,1,1), weight the three diagonal entries by a², 1 and 1 and divide by a²+2 to obtain each mean.",
    },
    "galois-character-peeling": {
      title: "Does this vector span the required character?",
      kind: "Testing a character on a four-element group",
      section: "lifts",
      params: [
        choose("element", "Group element (a,b)", [["11", "(1,1)"], ["10", "(1,0)"], ["01", "(0,1)"], ["00", "(0,0)"]], "11"),
        choose("candidate", "Vector in the enlarged space", [["mixed", "eα + eβ"], ["pure", "eα"]], "mixed"),
      ],
      caption: "At (1,1) the two characters agree. A vector with a component in the added β-line can pass that test. Compare its image at (1,0) before deciding which line belongs to the α-subrepresentation.",
      method: "Use C₂ × C₂ in characteristic zero. Define α(a,b)=(−1)^a and β(a,b)=(−1)^b. In (α ⊕ 1) ⊕ β the displayed vectors have zero component on the trivial line. A vector spans α exactly when its image equals α(g)v for every g. The final count checks all four group elements by this equality.",
    },
    "regular-unit-shift": {
      title: "Which of three shifted models survive?",
      kind: "Lowering a weight of U(2,1)",
      section: "normalization",
      params: [
        choose("gap", "Gap between the two positive weights", [["1", "1"], ["2", "2"], ["3", "3"]], "1"),
        choose("position", "Coordinate to lower", [["1", "First (+)"], ["2", "Second (+)"], ["3", "Third (−)"]], "1"),
      ],
      caption: "The minimum gap between opposite signs is initially 6000. Only the two positive entries can meet after one lowering. A surviving shift gives the eigenvalue of Ω and the partial-trace scalar of its projector. A zero partial trace removes the shift.",
      method: "Use the integral parameter (6000+a,6000,0) with signs (+,+,−). Subtract one at the selected position and test strict decreasing order on the resulting tuple. For an allowed shift s the differential eigenvalue is the original λs+(3−1)/2. The partial-trace scalar is the product, over t≠s, of (λs−1−λt)/(λs−λt). The prescribed opposite-sign gap is 200·3³=5400.",
    },
    "hyperplane-mass-stratum": {
      title: "How can two planes have the same discriminant order?",
      kind: "Two contributions to the sum over hyperplanes",
      section: "global",
      params: [
        choose("prime", "Rational prime", [["11", "11"], ["59", "59"], ["83", "83"]], "11"),
        choose("plane", "Plane and chosen lattice", [["standard", "Coordinate plane, smaller lattice"], ["defect", "Tilted plane, maximal lattice"]], "standard"),
      ],
      caption: "For a fixed prime the two examples have the same discriminant order. Switching planes moves a factor from the index of the lattice to the product of the bad residue sizes. Multiplying the two final entries bounds the total allowance at this value of m by 1 after division by B.",
      method: "Use the standard Hermitian space over ℚ(ζ₁₂). Each listed prime p is 11 modulo 12 and equals a²+2b². The tilted plane is spanned by e₁ and a e₂+b(1+i)e₃. Its full lattice in these generators has Gram matrix diag(1,p). In the coordinate plane use 𝔓e₁+Re₂ with N(𝔓)=p². Both have d=p². The normalized allowance for an individual defect label is 1/m², and at most m² labels have this size. The displayed p is a defect prime in the tilted plane.",
    },
    "gluing-residues": {
      title: "Which two fractions can come from one lattice vector?",
      kind: "Orthogonal projections and their residues",
      section: "global",
      params: [
        choose("weight", "Second diagonal Gram entry", [["1", "1"], ["2", "2"], ["5", "5"]], "2"),
        range("first", "First integer coordinate", -2, 2, 1, 1),
        range("second", "Second integer coordinate", -2, 2, 1, 0),
      ],
      caption: "Read each projection in its own line basis. Either residue determines the other. For Gram matrix diag(1,2) there are three paired residues on the integer slice, including the zero pair.",
      method: "For Gram matrix diag(1,T), use the orthogonal vectors u=(1,1) and w=(−T,1). Writing an integer vector as αu+βw gives α=(s+Tt)/(T+1) and β=(t−s)/(T+1). Their sum is t. Residues lie in [0,1) and always sum to an integer. As s ranges over all integers, the choices (s,0) realize every numerator modulo T+1 on this slice. At T=5 the displayed controls also reach the half-residue pair at (2,−1). Over the full number ring the common quotient is its quotient by (T+1).",
    },
    "rational-line-orbit": {
      title: "How does one rational orbit meet the integral plane?",
      kind: "Witt extension on the standard Hermitian plane",
      section: "global",
      params: [choose("line", "Unit vector on the chosen line", [["axis", "(1, 0)"], ["thirds", "(3/5, 4/5)"], ["fifths", "(5/13, 12/13)"], ["eighths", "(8/17, 15/17)"]], "thirds")],
      caption: "The two unit vectors span isometric rational lines. On the slice with rational coordinates, the first integer point on the chosen ray can lie beyond its unit vector. The dashed segment marks the difference of the two unit vectors used in the extension formula.",
      method: "On the slice with rational coordinates, write the unit vector as (a/q,b/q) with a and b coprime. Bézout’s identity gives the same intersection over the integers of E: the integral vectors on this E-line are the multiples of (a,b). Its squared length is q². The lattice generated by the unit vector contains the intersection with additive index q raised to the field degree D = [E ∶ ℚ]. Each line admits a lattice of discriminant order one.",
    },
    "parabolic-shell": {
      title: "Which box keeps its mass under dilation?",
      kind: "Haar measure on an isotropic line stabilizer",
      section: "lifts",
      params: [
        choose("degree", "Number of real places of F", [["1", "1"], ["2", "2"]], "1"),
        choose("rank", "Dimension of the complement W", [["1", "1"], ["2", "2"], ["3", "3"]], "1"),
        choose("stretch", "Scalar at infinity", [["-1", "1/2"], ["0", "1"], ["1", "2"]], "1"),
      ],
      caption: "Moving only the scalar range changes the mass of a shell. A left translate moves the additive box as well. Its volume growth cancels the change in idèle density.",
      method: "The flow is defined at every real time. Here the times are −log 2, 0 and log 2, so the scaling factors are exact fractions. At a real place the horizontal variable is a complex vector of dimension s, while the real central coordinate scales by the square of the chosen scalar. For d places and scale u the two image-volume factors are u^(2ds) and u^(2d). The scalar density gains their reciprocal. The finite components, the unitary domain and multiplicative Haar volume of the scalar range stay fixed.",
    },
    "cartan-power": {
      title: "When does the power bound fall below one?",
      kind: "One moving plane in signature (3, 1)",
      section: "normalization",
      params: [choose("scale", "Largest singular value", [["0", "1"], ["0.25", "2¹ᐟ⁴"], ["1", "2"], ["8", "2⁸"], ["16", "2¹⁶"], ["32", "2³²"]], "16")],
      caption: "The curve follows the logarithm of the Frobenius power bound. The dot marks the chosen singular value. Each number below is the natural logarithm of an upper bound for the same unit-vector coefficient. A negative entry certifies a coefficient of absolute value less than one.",
      method: "On one positive and one negative coordinate use the matrix with diagonals cosh(s) and off-diagonals sinh(s), taking s to be the logarithm of the selected singular value. The other two coordinates are fixed. The log singular values are s, −s, 0, 0, so t² = 2s² and F² = exp(2s) + exp(−2s) + 2. The weight gap is 64,000. The three bounds are evaluated in logarithms so even very small upper bounds remain distinguishable.",
    },
    "convex-nerve-cut": {
      title: "Which faces survive a cut?",
      kind: "The nerve of three closed intervals",
      section: "inputs",
      params: [range("cut", "Position of the cut", 0, 4, 0.5, 2)],
      caption: "A label or pair appears on the slice exactly when it occurs on both closed halves. At the midpoint only B meets the slice. At 1 or 3 the slice also witnesses an edge and one half keeps every face.",
      method: "A occupies [0,1], B occupies [1,3], and C occupies [3,4]. Intersect each interval and pairwise intersection with the left half, the cut point and the right half. The displayed pairs stand for their unordered label supports. Permuting or repeating an entry preserves its witness. The empty face has a witness in every nonempty slice.",
    },
    "split-gram-phases": {
      title: "Which phase permits division in both components?",
      kind: "A split Hermitian denominator at 5",
      section: "lifts",
      params: [
        range("first", "First component of t", 0, 4, 1, 1),
        range("second", "Second component of t", 0, 4, 1, 4),
      ],
      caption: "A phase permits division when both entries of its denominator are nonzero. At t = (1, 4), the two real signs give zeros in opposite components, leaving i and −i.",
      method: "Take the two reductions of i to be 2 and 3 in the field of five elements. Conjugation swaps the two entries. For each phase λ compute δ = 1 − conjugate(λ)t component by component and multiply its entries for the norm. The denominator is invertible exactly when the norm is nonzero modulo 5. All computations take place in the residue algebra. Every selected t = (a,b) occurs for two length-one columns. In the standard split plane take x = (1,0) and y with first coordinate conjugate(t) and second coordinate (1,1−ab). Then h(y,x) = t and the two coordinate norms of y sum to ab+(1−ab) = 1.",
    },
    "marked-ideal-weight": {
      title: "Which part of the orbit weight remembers the ideal?",
      kind: "Covolumes of a marked Gaussian lattice",
      section: "global",
      params: [
        choose("rank", "Block rank j", [["2","2"],["3","3"],["4","4"]], "2"),
        choose("norm", "Ideal generator", [["1","1"],["2","1 + i"],["4","2"],["5","2 + i"]], "2"),
        choose("scale", "Last quotient generator m", [["1","1"],["2","2"],["3","3"]], "2"),
      ],
      caption: "At fixed ideal and rank, changing m scales the row and full covolumes in opposite directions. Their product is the factor multiplying the quotient slab mass. Changing the ideal or the rank changes that product.",
      method: "Work over O = ℤ[i]. Put N = |α|² for the selected generator and k = j − 1. The split lattice is α⁻¹O ⊕ Λ′ with Λ′ = O^(k−1) ⊕ mO. A row mapping Λ′ to α⁻¹O has k − 1 coordinates in α⁻¹O and the last in (mα)⁻¹O. Each complex coordinate contributes its fundamental area. The table uses exact products of rational areas.",
    },
    "progression-difference": {
      title: "Which prime powers survive the difference?",
      kind: "From a smoothed sum to a sharp cutoff",
      section: "inputs",
      params: [
        choose("y", "Sharp cutoff y", [["4", "4"], ["8", "8"], ["12", "12"]], "4"),
        choose("width", "Relative step δ", [["2", "1/2"], ["4", "1/4"]], "2"),
        choose("chi", "Character modulo 3", [["principal", "Principal"], ["quadratic", "Quadratic"]], "principal"),
      ],
      caption: "Each bar shows the fraction of the original prime-power term retained at n. Multiply its weight by Λ(n) and χ(n) to obtain the signed last column. Add the sharp sum and the short-interval contribution to recover the scaled difference.",
      method: "Set u = (1 + δ)y and b = yu/(u − y). The coefficient in b(Sχ(u)/u − Sχ(y)/y) is one through y and b(1/n − 1/u) on y < n ≤ u. At the upper endpoint it is zero. For n = pᵏ with p prime, Λ(n) = log p. All other integers have Λ(n) = 0. Both characters vanish on multiples of 3. At residues 1 and 2 the principal values are (1, 1) and the quadratic values are (1, −1).",
    },
    "flag-layer-exponents": {
      title: "Which flag layers supply the exponent?",
      kind: "The volume factor of an isotropic flag",
      section: "global",
      params: [
        choose("n", "Ambient dimension n", [["4", "4"], ["6", "6"], ["8", "8"]], "4"),
        choose("jumps", "Rank jumps j", [["1", "(1)"], ["2", "(2)"], ["1,1", "(1, 1)"]], "1"),
        choose("depth", "Largest graded size", [["1", "1/2"], ["2", "1/4"], ["3", "1/8"]], "1"),
      ],
      caption: "Setting f = 1 illustrates the archimedean exponents at a single real place. This calculation requires no CM extension with that signature unramified at all finite places. Layer k joins blocks k positions apart. Each matrix entry gives one direction. Read the exponent terms from left to right in the completed flag. Add the layer sums and halve the exponent to obtain the volume factor P.",
      method: "With a single jump the graded size is the selected value s. With two jumps the sizes are (s², s). The completed ranks are the jumps, the middle rank n − 2Σjᵢ, and the jumps in reverse. Each short block has height hᵢ = τᵢ^(2jᵢ), the middle has height 1, and the opposite blocks have reciprocal heights. For two blocks b < c, the number of directions is r_b r_c. The contribution before the square root is h_b^(r_c)/h_c^(r_b). The table adds its negative base-two logarithm to layer c − b. A middle block of rank zero keeps its position and contributes zero directions. The setting s = 1/2 evaluates the algebraic formula at the cutoff.",
    },
    "central-rounding": {
      title: "Where does rounding half a skew-adjoint matrix land?",
      kind: "The center of a Gaussian Hermitian plane",
      section: "global",
      params: [
        choose("quarters", "Coefficient t of the target ti", [
          ["0", "0"], ["1", "1/4"], ["2", "1/2"], ["3", "3/4"], ["4", "1"],
          ["5", "5/4"], ["6", "3/2"], ["7", "7/4"], ["8", "2"],
        ], "5"),
      ],
      caption: "Use the hyperbolic plane with pairing matrix J = [[0,1],[1,0]] over the Gaussian integers. The target Z has coefficient ti in the upper-right corner and zeros elsewhere. Triangles mark t and circles mark the available coefficients. The upper segment shows the distance after rounding Z/2 and subtracting the adjoint. The lower segment gives the distance to the closest integral central coefficient.",
      method: "In this plane the adjoint of zE₁₂ is its complex conjugate times E₁₂. The integral center permits every imaginary integer coefficient. Rounding ti/2 to ki and subtracting its adjoint gives 2ki. This covers the target with an explicitly bounded error. The example also lets you see when a nearer integral central matrix exists. At a tie the figure selects the larger coefficient.",
    },
    "cusp-trace-mass": {
      title: "How much of a projection can lie in a small region?",
      kind: "Trace and volume on two points",
      section: "global",
      params: [
        choose("denom", "Measure of the deep point", [["4", "1/4"], ["16", "1/16"], ["64", "1/64"]], "16"),
        choose("profile", "Values before normalization", [["flat", "(1, 1)"], ["tilted", "(1, 4)"], ["deep", "(0, 1)"]], "tilted"),
      ],
      caption: "The two points have total measure one. Project onto the function with the selected moderate and deep values, after normalizing its squared norm to one. The last column is each point’s contribution to the trace.",
      method: "If the weights are μ₁ and μ₂ and the two function values are a and b, divide (a,b) by the square root of μ₁a² + μ₂b². The diagonal of the resulting projection kernel is the square of the normalized function at each point. Multiply it by the point’s measure to integrate it.",
    },
    "minor-shells": {
      title: "How can a shell have more candidates and carry less weight?",
      kind: "A single minor in the Gaussian integers",
      section: "global",
      params: [range("last", "Last shell shown", 0, 5, 1, 1)],
      caption: "Count every nonzero Gaussian integer in each size interval. The third column adds its actual weight |z|⁻³, rounded to three decimals. The last column gives the exact upper bound obtained by assigning every candidate the largest weight in its shell.",
      method: "For z = a + bi and shell h, enumerate integer pairs with 4ʰ ≤ a² + b² < 4ʰ⁺¹. Write Nₕ for their number. Both coordinates have absolute value below 2ʰ⁺¹, so Nₕ < 16·4ʰ. The weighted shell contributes at most Nₕ·2⁻³ʰ < 16·2⁻ʰ. From the first omitted shell H onwards, the geometric series sums to 32·2⁻ᴴ. This example counts all possible entries in one lattice. A pairing of two flags may realize only some of them.",
    },
    "primitive-hyperplanes": {
      title: "What changes when the marked hyperplane is counted first?",
      kind: "An incidence mass in a Gaussian lattice",
      section: "global",
      params: [range("norm", "Squared length of the primitive normal", 1, 4, 1, 3)],
      caption: "Work in the single lattice ℤ[i]³. Each hyperplane is marked by its primitive normal up to four units. The first mass divides its count by 384, the number of lattice symmetries. The second adds one reciprocal stabilizer order for each orbit.",
      method: "Enumerate the three Gaussian coordinates with total squared length d. In this range a nonprimitive vector has every coordinate divisible by 1+i. Remove those vectors and identify the four common unit multiples. For coordinate norm at most four, all Gaussian integers of each occurring norm differ by a unit. Hence two surviving normal lines are in the same orbit precisely when their sorted coordinate norms agree.",
    },
    "dyadic-unit-signs": {
      title: "Which real sign patterns do these units supply?",
      kind: "Cyclotomic unit signatures at conductor 24",
      section: "inputs",
      params: [
        choose("shift", "Translate by", [["1","±1"],["5","±5"],["7","±7"],["11","±11"]], "1"),
        choose("unit", "Use the translated unit", [["0","No"],["1","Yes"]], "1"),
        choose("negative", "Multiply by −1", [["0","No"],["1","Yes"]], "0"),
      ],
      caption: "The four entries of the signature vector record the embeddings up to complex conjugation. A one means a negative value. Conjugating the unit permutes the four places, and multiplication by −1 complements every bit.",
      method: "For M=24 and c=13 the real cyclotomic unit has bit ⌊13t/24⌋ modulo two. Evaluate it at the translated unit residue, optionally omit the unit, and add the global sign modulo two. Replacing t by −t gives the same bit. These units generate four of the sixteen patterns. Other real units can enlarge this subgroup.",
    },
    "binary-lattice-limit": {
      title: "What does a single residue box contribute?",
      kind: "Equidistribution in a Hermitian plane",
      section: "lifts",
      params: [range("scale", "Lattice scale N", 3, 15, 1, 4)],
      caption: "Each dot is the normalized sum on one congruence class of the four integer coordinates of ℤ[i]². The horizontal line is its volume 1/81. Change N to read the exact sum at that scale.",
      method: "Use ε = 1/N and h(t) = max(1−|t|,0). Center the first tent at 2 and the other three at zero. Select x ≡ (1,0,0,0) modulo 3. For 0 ≤ u,v < N the multiplicity of u−v=j is N−|j| when |j|<N. Counting pairs with each prescribed residue therefore evaluates all four tent sums in integer arithmetic. This is the vector count at the identity translate. The proof also averages translates.",
    },
    "stickelberger-fibres": {
      title: "Can a projection hide the nonzero coefficient?",
      kind: "Stickelberger coefficients modulo ℓ",
      section: "inputs",
      params: [
        choose("prime", "Prime ℓ", [["2","2"],["3","3"]], "2"),
        range("level", "Source depth n", 3, 4, 1, 3),
        range("depth", "Projection depth d", 2, 3, 1, 3),
      ],
      caption: "Keep one representative from each pair of opposite units at the source. The table groups their weighted coefficients by the target pairs. A coarse projection can make every row zero. Increasing d changes which terms are added together.",
      method: "Use M=fℓⁿ, f=3 at ℓ=2 and f=2 at ℓ=3, with c=13 in both cases. For every source unit 2s<M, take u between 0 and M−1 with 13u ≡ s (mod M), then form ⌊13u/M⌋−6. Use the trivial character at 2 and the sign modulo 3 at 3. Group by ±s modulo ℓᵈ and reduce the weighted sums modulo ℓ. Here the roots of unity in the local unit group are exactly ±1.",
    },
    "one-vector-density": {
      title: "How much mass comes from vectors divisible by 3?",
      kind: "A single Hermitian norm at an inert prime",
      section: "lifts",
      params: [range("depth", "Exponent k in the dilation a = 3ᵏ", 0, 2, 1, 1)],
      caption: "Use three Gaussian integer coordinates and the norm |x₁|² + |x₂|² + |x₃|² at 3. The rows separate vectors by their largest common power of 3. Compare the density at target a² in the integral lattice with the density at target 1 in the enlarged lattice.",
      method: "Write x = 3ʲy with y primitive. Modulo 3 there are 224 nonzero vectors of norm zero in 𝔽₉³ and 252 vectors of norm one. Smooth lifting divides these counts by 3⁵. Changing x to 3ʲy costs 3⁻⁶ʲ in source volume and contributes 3²ʲ from scaling the target interval. The density on a⁻¹ times the lattice therefore gains a factor a⁴.",
    },
    "quadratic-character": {
      title: "Where does the bit on the square of a lift go?",
      kind: "Characters across an index-two subgroup",
      section: "inputs",
      params: [range("value", "Common value on e₁ and e₂", 0, 1, 1, 0), range("square", "Value on σ²", 0, 1, 1, 1)],
      caption: "The subgroup has three generators. Conjugation by σ exchanges the first two and fixes σ². The controls give all four invariant characters φ. Compare them with the characters Θ used to count them.",
      method: "Use V = 𝔽₂² ⋊ ℤ/4, with σ swapping the two coordinates, and U consisting of elements with even last coordinate. For φ(x,y,2z) = a(x+y)+cz, subtract c times the character z. The remainder extends with value zero on σ. Add c times the sign of V/U, obtaining Θ(x,y,k) = a(x+y)+c(k mod 2), with arithmetic modulo two.",
    },
    "whittaker-cutoff": {
      title: "Does the real integral approach its continued value?",
      kind: "Whittaker coefficient at infinity",
      section: "lifts",
      params: [
        choose("shift", "Shift w", [["-1","−1"],["0","0"],["1","1"]], "-1"),
        range("quarter", "Target in quarters", 1, 4, 1, 1),
      ],
      caption: "The solid curve integrates the real part over [−R,R]. The dashed line gives the exact value of the continued coefficient. At w = −1, increasing the cutoff keeps the integral oscillating.",
      method: "Use signature (1,1), frequency B > 0 and the Lebesgue normalization of the example. The truncated integral is half the integral from 0 to R of cos(2πBy)/(1+y²)^(1+w). At w = −1 integrate the cosine exactly. At w = 0,1 the plot uses composite Simpson quadrature with step 1/64; the horizontal line uses the closed Fourier formula.",
    },
    "inertia-orbits": {
      title: "How many Frobenius orbits survive as the level grows?",
      kind: "Primes in a cyclotomic tower",
      section: "inputs",
      params: [
        choose("prime", "Odd prime", [["3","3"],["7","7"]], "3"),
        range("depth", "Exponent t in the conductor 2ᵗ", 2, 6, 1, 5),
      ],
      caption: "Start at any odd residue and multiply repeatedly by the chosen prime. Each row is one complete orbit in the cyclotomic Galois group. A row represents a prime of the cyclotomic layer above that prime of ℚ.",
      method: "List the odd residues modulo 2ᵗ. For the smallest unvisited residue, apply multiplication by the selected prime until its orbit closes. Repeat until every unit occurs. The orbit length is the residue degree and the orbit count is the index of the Frobenius subgroup. This calculation gives the cyclotomic part of the bound before accounting for the auxiliary field.",
    },
    "localization-kernel": {
      title: "Which kernel classes come from the integral map?",
      kind: "Reduction of a localization map",
      section: "inputs",
      params: [range("depth", "Reduction depth r", 1, 3, 1, 1)],
      caption: "Multiply by 3 from ℤ/27 to ℤ/9. At depth r reduce both groups modulo 3ʳ before applying the map. Compare its kernel with the residues of elements killed by the original map.",
      method: "Enumerate all classes x in the reduced source. Put x in the reduced kernel whenever 3x vanishes in the reduced target. Independently reduce the nine original kernel elements 0,3,…,24. The cokernel order is the size of the reduced target divided by the size of the image.",
    },
    "genus-mass": {
      title: "How much of the average comes from each class?",
      kind: "Haar average · a finite quotient",
      section: "lifts",
      params: [range("second", "Value on the larger class", 0, 6, 1, 5)],
      caption: "The identity class has value 2. Change the value on the other class and follow the same function through three ways of grouping its terms.",
      method: "Enumerate all permutations of three letters. Use the subgroup generated by the transposition (12) on the left, then on both sides. Count the original permutations represented by each class. The normalized average assigns each permutation mass one sixth.",
    },
    "split-graph": {
      title: "Can a third coordinate join two split pairs?",
      kind: "Integral chains over a finite field",
      section: "inputs",
      params: [range("dimension", "Ambient dimension over 𝔽₂", 2, 3, 1, 2)],
      caption: "A vertex consists of a vector v and a covector λ with λ(v) = 1. Two vertices can share an edge when both cross-evaluations vanish. Forgetting the order gives the graph shown here. The two orders of an edge give opposite boundaries in the chain calculation.",
      method: "Enumerate the binary vectors and covectors, computing each evaluation modulo two. Join every compatible pair and count the connected components by a graph search. A marks (e₁,e₁*) and C marks (e₁,e₁*+e₂*). The diagram shows the whole graph in rank two and the selected path through U = (e₃,e₃*) in rank three.",
    },
    "hermitian-density": {
      title: "Count the frames behind one local density",
      kind: "Inert prime · full-rank coefficient",
      section: "lifts",
      params: [
        choose("frame", "Orthonormal frame", [["line", "One vector in dimension 2"], ["pair", "Two vectors in dimension 3"]], "pair"),
        range("level", "Congruence level", 1, 3, 1, 1),
      ],
      caption: "Each column must have norm one. Two columns must also be orthogonal for the Hermitian form. Passing to the next power of 3 increases the number of solutions, while the normalized density stays the same.",
      method: "At level one enumerate vectors over the nine elements a+bi with i²=−1. Conjugation sends i to −i. Compare their norms and inner products modulo 3. For an ambient dimension m and n columns, the linearized Gram map has n² independent scalar outputs and 2mn input coordinates, giving 3^(2mn−n²) lifts per frame at each further level. Divide the count at level t by 3^(t(2mn−n²)).",
    },
    "orbit-weights": {
      title: "How much weight belongs to each orbit point?",
      kind: "Partition of unity · two centres",
      section: "inputs",
      params: [
        range("height", "Bump value at the second centre", 1, 4, 1, 2),
      ],
      caption: "The bump equals 1 at the first centre. Its support meets just two points of the chosen orbit. Each point occurs under 72 different group elements. Add the weights in a row to see the share attached to that centre.",
      method: "Take rank two over the Eisenstein integers. A unitary integral matrix permutes the two coordinate lines and multiplies each by one of six units. Thus 2·6² = 72 matrices fix h₀. The 72 matrices carrying h₀ to the second form are a coset of this stabilizer. Normalize the bump value of each label by the sum of all 144 values.",
    },
    "height-grid": {
      title: "How many grid points must one height label allow?",
      kind: "Counting rational centres",
      section: "lifts",
      params: [
        range("u", "First depth u", 0, 3, 1, 1),
        range("v", "Second depth v", 0, 3, 1, 0),
      ],
      caption: "Each entry lists the number of candidate numerators for one scalar coordinate of a rank-two centre. Multiply the four entries to count all candidates. Several candidates may describe the same centre.",
      method: "Use one real place, R = 1 and label μ = (u,v). At depth k = μᵢ + μⱼ the numerator runs over all integers from −2ᵏ to 2ᵏ. The list size 2·2ᵏ+1 is at most 3·2ᵏ. Multiplying gives the uniform bound 3⁴·4²⁽ᵘ⁺ᵛ⁾. A further multiplicity bound is needed for the number of rational cosets using each centre.",
    },
    "trace-cycles": {
      title: "How does a permutation turn into a product of traces?",
      kind: "Tensor contractions at two inputs",
      section: "inputs",
      params: [
        range("copies", "Identical blocks d", 1, 3, 1, 1),
        choose("place", "Places of the inputs", [["same", "Same place"], ["distinct", "Distinct places"]], "same"),
      ],
      caption: "Follow each cycle of the permutation and multiply the matrices encountered along it. Take one trace per cycle. Repeating the matrices in d blocks shows why two cycles and one cycle scale differently.",
      method: "The two input matrices are A = [[1,1],[1,0]] and B = [[0,1],[1,3]]. Put d copies of each on the diagonal. For distinct places, they occupy disjoint coordinate spaces. For the identity permutation sum AᵢᵢBⱼⱼ over i,j. For the swap sum AᵢⱼBⱼᵢ. These are contractions of tensors with the chosen inputs. The two-input example precedes alternation.",
    },
    "fourier-rank": {
      title: "Can every invertible frequency miss a nonzero function?",
      kind: "Fourier transform on 27 matrices",
      section: "lifts",
      params: [
        range("a", "Upper-left entry a", 0, 2, 1, 1),
        range("b", "Off-diagonal entry b", 0, 2, 1, 0),
        range("c", "Lower-right entry c", 0, 2, 1, 1),
      ],
      caption: "Each panel fixes b. Columns give a and rows give c. A filled circle marks an invertible frequency and an open one a singular frequency. The square marks your selection. Look for the only frequency whose average is nonzero.",
      method: "For the function F(B) = ζᴮ¹¹ and ζ³ = 1, enumerate the 27 symmetric matrices B over the field of order 3. The trace exponent is (1−a)B₁₁−2bB₁₂−cB₂₂. Count the terms of phases 1, ζ and ζ² before applying 1+ζ+ζ²=0. The finite group illustrates the information lost when the singular frequencies are omitted.",
    },
    "shear-rounding": {
      title: "Which lattice point is nearest after a shear?",
      kind: "Exact two-dimensional lattice",
      section: "inputs",
      params: [
        range("first", "First coordinate in fifths", 0, 5, 1, 2),
        range("second", "Second coordinate in fifths", 0, 5, 1, 2),
      ],
      caption: "The two controls give the coordinates of p in the basis (1, 1+i). The plot shows its image in the complex plane. Compare the square obtained by rounding both coordinates with the ring obtained after correcting the shear. The cross marks p.",
      method: "In basis coordinates G[x,y] = (x+y)²+y². With p = (x,y), first choose n nearest to y and then m nearest to x+y−n. Since (m+n,n) ranges over all integer pairs, this choice is a nearest Gaussian integer for this form. Distances in the readout are squared lengths, computed with denominator 25.",
    },
    "minimum-scale": {
      title: "Which short vectors can change a chosen direction?",
      kind: "Gaussian lattice count",
      section: "inputs",
      params: [
        choose("scale", "Correction scale d", [["1", "1"], ["4", "4"], ["16", "16"]], "4"),
        choose("direction", "Test direction", [["primal", "e₁"], ["dual", "e₂ / 64"]], "primal"),
      ],
      caption: "The points are the possible first coordinates z of a contributing vector (z,0). Filled disks have weight 1. Open diamonds lie in the transition region. Switch the test direction to see why all of their contributions can vanish.",
      method: "For h = diag(1,64), the inner cutoff is zero at squared length 4d and above. Since 4d ≤ 64, a contributing vector has second coordinate zero. Enumerate a² + b² < 4d for z = a + bi. Summing a² + b² over the full-weight disk gives a lower bound for the e₁ numerator. The number of candidates bounds the denominator Z from above. In the other direction each rank-one value is zero. The outer cutoff equals one at all three scales because μ ≤ 1/16.",
    },
    "kernel-order": {
      title: "Pair the lifts before or after summing the source terms",
      kind: "Exact countable kernel model",
      section: "lifts",
      params: [
        range("cutoff", "Source cutoff M", 1, 8, 1, 2),
        choose("phase", "Phase z of the second input", [["one", "1"], ["i", "i"], ["minus", "−1"]], "i"),
      ],
      caption: "Each target point has mass ½. Multiply the first lift by the conjugate of the second, then average the two rows. In the other order, only pairs of source indices with the same parity contribute.",
      method: "The kernel is n yⁿ⁻¹ for y = ±1; the source weights are (1/2)ⁿ⁻¹ and (z/2)ⁿ⁻¹. Each value is computed as a Gaussian integer divided by a power of two. The second calculation sums all equal-parity pairs independently. With Sₘ = ∑ₙ₌₁ᴹ n/2ⁿ⁻¹ and S∞ = 4, the absolute contribution of all omitted pairs is at most 16 − Sₘ². The bound applies to the infinite series before cancellation.",
    },
    "central-period": {
      title: "Which intervals keep their integral under central averaging?",
      kind: "Periods of a differential form",
      section: "inputs",
      params: [
        range("start", "Starting coordinate s", 0, 0.875, 0.125, 0),
        choose("length", "Interval length", [["1", "1 · full cycle"], ["0.25", "1/4 · open arc"], ["0.5", "1/2 · open arc"]], "1"),
      ],
      caption: "The solid curve is the original coefficient 2 + cos(2πx). The dashed line is its central average 2. Compare their integrals on a full cycle, then move a quarter arc from s = 0 to s = 1/8.",
      method: "In the two-place unit example the central action translates x by a full turn. On an interval from s to s + L the averaged integral is 2L. For the original form add [sin(2π(s + L)) − sin(2πs)]/(2π). At eighth-turn endpoints these sine values are 0, ±1 or ±√2/2, so equality is decided exactly. The plotted curve joins 97 samples. Decimal integral values are rounded to four places.",
    },
    "mobius-product": {
      title: "Which divisor terms survive truncation?",
      kind: "Exact integer computation",
      section: "inputs",
      params: [
        choose("cuts", "Lengths (Y, N)", [["2-4", "(2, 4)"], ["3-4", "(3, 4)"], ["4-6", "(4, 6)"], ["5-8", "(5, 8)"], ["6-8", "(6, 8)"]], "3-4"),
        range("n", "Product index n", 1, 48, 1, 6),
      ],
      caption: "Compare n = 3 and n = 6 at lengths (3, 4). The entry for d = 1 changes from retained to omitted. Which cancellation does the product lose?",
      method: "List every positive factorization n = db. The product retains d ≤ Y and b ≤ N. A retained pair contributes μ(d), which is zero if d has a squared prime factor and otherwise alternates with the number of its distinct prime factors. The last column gives the contribution to the truncated polynomial. This finite calculation illustrates the coefficient identity at small lengths. The analytic zero detector chooses its lengths from the height of the box.",
    },
    "satake-average": {
      title: "Average twelve cosets in one Hecke class",
      kind: "Inert Satake transform",
      section: "lifts",
      params: [
        choose("alpha", "Satake parameter α", ["1", "1/2", "2", "1/3", "3", "-1"].map(x => [x, x.replace("-", "−")]), "1"),
      ],
      caption: "Each dot is the induced value φ on one coset of K diag(3,1/3) K. The dashed line is the mean of all twelve. Compare α = 2 with 1/2, then try α = 3 to make every dot meet the line.",
      method: "In the rank-two inert unitary group over ℚ₃(i), a coset of diagonal exponent a has value (α/3)ᵃ. There are nine exponents +1, two zero and one −1 in this double class. Every coset has Haar volume one. Their sum is the Hecke eigenvalue of the indicator, and division by twelve gives the normalized zonal value. The nonzero parameters here define local induced functions. Applying the calculation to a representation requires a K-fixed Hecke eigenvector with that parameter and a bi-invariant matrix coefficient nonzero at the identity. Occurrence in a given unitary automorphic representation is a separate input.",
    },
    "inert-length": {
      title: "Find the length by reducing two rows",
      kind: "Inert lattice over ℤ₃[i]",
      section: "lifts",
      params: [
        choose("s", "Row coefficient s", [["1", "1"], ["2", "2"]], "1"),
        choose("t", "Imaginary coefficient t", [["0", "0"], ["1", "1"], ["2", "2"]], "0"),
      ],
      caption: "Change the corner of the matrix while keeping all entry valuations fixed. Subtract a multiple of row 3 from row 1. Does the last column supply another independent residue direction?",
      method: "Use i² = −1, a = 0 and the middle diagonal (3, 1/3). Row 1 of G is (1, 1, s/3, (−s+ti)/3) and row 3 is (0, 0, 1/3, −1/3). Rows 2 and 4 are integral. Since s is a unit and 1 and i are independent modulo 3, −s+ti is always a unit. All six matrices have the same entry valuations. Let Λ be the lattice generated by the standard rows and the rows of G over O = ℤ₃[i]. Every row belongs to (1/3)O⁴. Multiplication by 3 followed by reduction modulo 3 therefore identifies Λ/O⁴ with the row span of 3G over 𝔽₉. Each independent row contributes one unit of length and a factor of nine in the size.",
    },
    "inert-cell": {
      title: "Count a cell of the inert Euler factor",
      kind: "Unitary group in rank three",
      section: "lifts",
      params: [
        choose("q", "Base residue size q", [["3", "3"], ["5", "5"]], "3"),
        choose("diagonal", "Diagonal valuation a", [["0", "0"], ["1", "+1"], ["-1", "−1"]], "0"),
        range("excess", "Excess length j", 0, 3, 1, 2),
      ],
      caption: "Fix the middle lattice to be the standard lattice. Increase the length cutoff by one. The corner gains a digit at every step. On alternate steps the row also gains a digit in the quadratic residue field.",
      method: "The middle rank is one and its lattice length is zero. At excess j, put e=max(a,0)+⌊j/2⌋ and f=2 max(a,0)+j. Each of the q²ᵉ row classes admits a lift and has qᶠ possible corrected corners. Count them to find the ball of radius |a|+j, then subtract the preceding ball to obtain the number at exactly that length. The ball below |a| is empty. Every displayed integer is exact.",
    },
    "flag-average": {
      title: "Average point values along projective lines",
      kind: "Finite flag incidence",
      section: "inputs",
      params: [
        choose("q", "Field size q", [2, 3, 5, 25].map(q => [String(q), String(q)]), "25"),
        choose("points", "Marked points", [["pair", "Opposite pair"], ["collinear", "Three on one line"], ["triangle", "Three in a triangle"]], "pair"),
      ],
      caption: "Compare the two three-point configurations. Which new line sums appear when the third point moves off the line? What happens to the squared norm?",
      method: "In homogeneous coordinates take A=(1:0:0), B=(0:1:0). The pair has weights +1 and −1. For a triple give A and B weight +1 and C weight −2. Use C=(1:1:0) on the line AB or C=(0:0:1) off it. Every line aX+bY+cZ=0 has a unique representative (1,b,c), (0,1,c) or (0,0,1). Enumerate those representatives, summing the marked values at their incident points. For q=25 write each coefficient as u+vt in 𝔽₅[t]/(t²−3), encoded by u+5v. The line test for the collinear third point needs only b=−a. Moving the third point off the common line produces one line of sum +2 and two of sum −1. In both three-point configurations the squared line sums add to 6q.",
    },
    "jacobi-primes": {
      title: "Test a cubic Jacobi sum at both primes",
      kind: "Cyclotomic character lift",
      section: "inputs",
      params: [
        choose("p", "Rational prime p", [["7", "7"], ["13", "13"], ["19", "19"]], "7"),
        choose("root", "Root defining χ", [["lower", "Smaller root"], ["upper", "Larger root"]], "lower"),
      ],
      caption: "Choose the reduction of ω that defines the character χ. Then reduce the same algebraic integer J at each of the two primes above p.",
      method: "Let ω² + ω + 1 = 0. With r the chosen root modulo p and h = (p−1)/3, lift each nonzero x by finding k in {0,1,2} such that rᵏ ≡ xʰ and setting χ(x) = ωᵏ. Set χ(0) = 0. Count the values of χ(x)χ(1−x) and use ω² = −1−ω to write their sum as A+Bω. The inverse-character partner is its conjugate under ω ↦ ω². Both calculations are exact in ℤ[ω].",
    },
    "split-endpoint": {
      title: "Count the paths to one split lattice",
      kind: "Split Euler factor",
      section: "lifts",
      params: [
        choose("q", "Residue-field size q", [2, 3, 4, 5].map(q => [String(q), String(q)]), "2"),
        range("degree", "Degree k in T = X²", 0, 6, 1, 2),
      ],
      caption: "Keep the rank-two endpoint (2, −1) fixed. An intermediate lattice of excess length k contributes at degree 3 + 2k in X. Compare its multiplicity with the coefficient that survives the Euler correction.",
      method: "After removing X³, write T = X². Multiplying the uncorrected series 1/((1−T)(1−qT)) by 1−qT gives 1/(1−T), whose coefficients are all 1. Hence aₖ = 1 + q aₖ₋₁ for k ≥ 0, with zero coefficients at negative indices. Independently, dual Hermite forms with diagonal exponents (u, k−u) have qᵘ choices of their one upper-right entry, for 0 ≤ u ≤ k. Multiply the uncorrected series by 1−(q+1)T+qT² to obtain the last column. All displayed counts are exact integers.",
    },
    "gram-pair": {
      title: "Measure two period frames",
      kind: "Normalized Gram matrices",
      section: "global",
      params: [
        choose("a", "First-column scale a", [["0.5", "½"], ["1", "1"], ["1.5", "3/2"]], "1"),
        choose("h", "Directional overlap h", [["0", "0"], ["0.6", "3/5"], ["1", "1"]], "0.6"),
        choose("column", "Column kept in each word", [["first", "First"], ["second", "Second"]], "first"),
      ],
      caption: "Compare each word with an orthonormal frame, then measure the overlap between the two words. The full calculation uses both columns in each word. The restricted calculation keeps the same single column in both.",
      method: "In ℝ⁴ take P₁ = 2[a e₁, e₂] and P₂ = 3[h e₁ + √(1−h²) e₃, e₄]. The eᵢ form the standard orthonormal basis. Divide P₁ by √4 and P₂ by √9 before forming the Gram blocks Kᵤᵥ. Subtract the identity from each diagonal block and sum the squares of all entries to get Q. Restricting each word to a column takes the corresponding row and column of every block. This finite model illustrates the normalization and the isometric restriction.",
    },
    prism: {
      title: "Insert the gluing element into the cyclic word",
      kind: "Finite-field calculation",
      section: "inputs",
      params: [
        choose("twist", "Twist e", [["1", "1"], ["2", "2"]], "1"),
        range("weight", "Character weight x", 0, 4, 1, 2),
        choose("gluing", "Gluing element g", [["3", "8"], ["1", "2"], ["5", "10"]], "3"),
      ],
      caption: "Each row inserts g at one position in every word, evaluates the scalar functional and adds the integer representatives. Opposite signs cancel the paired rows. The last insertion gives the prism value modulo 5.",
      method: "Work in the multiplicative group of the field with eleven elements. Use base 2 for logarithms, ζ = 4 for the root of order five, and v(g) = log₂(g) modulo 5. Represent each logarithm by its residue from 0 to 9. For each adjacent pair its carry is the floor of the sum of those representatives divided by 10. For each of the 5ᵉ words multiply the e carries by v of the last entry. Signs come from the insertion position, counted from zero.",
    },
    "floor-sum": {
      title: "Read a Bernoulli value from the carries",
      kind: "Exact finite sum",
      section: "inputs",
      params: [
        choose("depth", "Level F", [["1", "5"], ["2", "25"], ["3", "125"]], "1"),
        choose("multiplier", "Multiplier b", [["2", "2"], ["3", "3"], ["4", "4"]], "2"),
      ],
      caption: "Group the units u by the quotient j in bu = Fj + y. Within a group the signed carry θ is constant. Multiply it by the sum of the representatives to obtain that row’s contribution to S.",
      method: "Fix the trivial primitive character, ℓ = 5 and k = 2. At every displayed level T is −1/3. With D = 24 the congruence becomes 24bS + 16(b² − 1) ≡ 0 modulo F. Enumerate all units 1 ≤ u < F and compute each floor exactly. The choices b = 2 and 3 make b² − 1 a 5-adic unit. The choice b = 4 still satisfies the congruence and tests what happens to the valuation when that hypothesis fails.",
    },
    "rank-grid": {
      title: "Complete a zero-sum grid",
      kind: "Ramified rank",
      section: "global",
      params: [
        choose("row", "Basis row", [["2", "2"], ["3", "3"], ["4", "4"]], "2"),
        choose("column", "Basis column", [["2", "2"], ["3", "3"], ["4", "4"]], "3"),
      ],
      caption: "The selected entry is +1 and the other eight free entries are zero. The zero-sum conditions force three more signs where its row and column meet the identity row and column. The margins sum the displayed entries.",
      method: "Take one free orbit for two copies of the multiplicative group of residues modulo 5. In each coordinate the residues are ordered 2, 3, 4, 1. The entry at (h, k) is the product of the two differences of indicators, (1[h = a] − 1[h = 1])(1[k = b] − 1[k = 1]), for the selected basis pair (a, b). Every operation is exact integer arithmetic.",
    },
    marks: {
      title: "Find an interval between marked twists",
      kind: "Window selection",
      section: "inputs",
      params: [
        range("first", "First twist exponent k", 0, 16, 1, 2),
        range("second", "Second twist exponent k", 0, 16, 1, 8),
      ],
      caption: "The dotted segment in row 1 and the dashed segment in row 2 are the forbidden ranges for the two marked twists. The solid segment in row 3 is the interval chosen for the whole sum. At k=0 the twist is 1 and forbids no points.",
      method: "Take X=2¹⁶, α=½ and β=2. The sliders mark actual twists e=2ᵏ. In u=log₂ x the forbidden interval is [k/2,2k). Begin with U=16. While an obstruction k/2 lies in (U/8,U], erase it and replace U by U/8. Choose [U/2,U] in the resulting u-coordinate. The plot uses log₂ u so every doubling interval has the same width. Each forbidden segment includes its left endpoint and excludes its right endpoint. The selection uses binary-exact comparisons.",
    },
    euler: {
      title: "Split one place or keep it inert",
      kind: "Unramified Euler factors",
      section: "lifts",
      params: [
        choose("q", "Base residue size q", [2, 3, 5, 7].map(q => [String(q), String(q)]), "3"),
        range("s", "Real argument s", 0.5, 4, 0.1, 1.5),
      ],
      caption:
        "The solid curve gives the split quotient. The dashed curve gives the inert quotient. Both use the same base residue size, the same normalizer and one trivial Euler parameter at each place above it. The dots mark the chosen argument.",
      method:
        "Set the two ranks a=1 and b=8 and the inverse twisting character equal to 1. Write x=q^(−s−½). Two places of norm q give a numerator (1−x)⁻². One place of norm q² gives (1−x²)⁻¹. Since b is even, the single normalizing factor is (1−x²)⁻¹ in both cases. This finite algebra example illustrates the local formula without specifying a global representation. Curves join 141 samples, with no infinite series or tail to approximate.",
    },
    ramp: {
      title: "Weigh the prime powers",
      kind: "Finite sum",
      section: "pilot",
      params: [
        range("x", "Cutoff x", 2, 48, 1, 12),
        choose(
          "chi",
          "Character",
          [
            ["one", "Trivial · modulus 1"],
            ["four", "Quadratic · modulus 4"],
          ],
          "one",
        ),
      ],
      caption:
        "Each stem gives one signed contribution. Integers with several distinct prime divisors contribute zero. Open the table to inspect prime powers and the centering term.",
      method:
        "Prime-power support and character values use integer arithmetic. We evaluate logarithms in binary64. For the character modulo 4 we use β(1) = π/4 and the alternating derivative series with 32,768 terms. Half the first omitted term corrects the tail. The remaining alternating series of first differences is bounded by half the difference of log(n)/n at n=65537 and 65539, since this function is decreasing and convex there. This bounds the error in β′(1) by 2.4×10⁻⁹. Euler’s constant is rounded to 16 decimal places.",
    },
    mellin: {
      title: "Integrate one ramp",
      kind: "Convergent integral",
      section: "pilot",
      params: [
        range("n", "Integer n", 1, 12, 1, 3),
        range("s", "Real exponent s", 1.1, 4, 0.1, 2),
        range("u", "Log cutoff U", 0.5, 10, 0.5, 3),
      ],
      caption:
        "The solid curve is the density in u = log(x/n). Shading ends at U. The integral beyond the shaded interval has an exact expression even though the picture ends at a finite u.",
      method:
        "For real s > 1 the density is n⁻ˢ(e⁻⁽ˢ⁻¹⁾ᵘ − e⁻ˢᵘ). We sample 201 points. The printed area uses analytic antiderivatives for both the finite part and the infinite tail, evaluated in binary64.",
    },
    residue: {
      title: "Add residues at one zero",
      kind: "Hypothetical local model",
      section: "pilot",
      params: [
        range("b", "Real part β", 0.1, 0.9, 0.05, 0.6),
        range("t", "Imaginary part τ", 0, 4, 0.25, 1),
        range("m", "Multiplicity m", 1, 5, 1, 2),
        range("a", "Second weight a", 0.25, 3, 0.25, 1),
      ],
      caption:
        "The solid segment starts at the origin. The dashed segment adds the second contribution along the same ray, determined by −1/[ρ(ρ−1)]. At τ = 0 this ray points along the positive real axis. Both axes use the same scale.",
      method:
        "Model two local factors at the same hypothetical zero ρ = β+iτ with multiplicities m and 1, and positive weights 1 and a. Complex division uses the conjugate formula. The plot rescales to the vector length. An inverse-character half-sum uses the same rule after the multiplicities are averaged.",
    },
    padic: {
      title: "Count factors of a prime",
      kind: "Exact integer computation",
      section: "local",
      params: [
        choose(
          "p",
          "Prime p",
          [2, 3, 5, 7, 11].map((x) => [String(x), String(x)]),
          "5",
        ),
        range("d", "Derivative order d", 1, 160, 1, 30),
      ],
      caption:
        "Each bar counts multiples of a successive prime power in d!. Summing these counts gives the exact factorial valuation. The displayed inverse-series loss is a bound.",
      method:
        "Integer division implements Legendre’s formula. The inverse series bound uses (d−1)/(p²−1) for a single inverse, or at most that loss for a nonconstant coefficient after integral substitution. The first three odd powers in the slope expansion have exact remainder p⁻⁷/(1−p⁻²).",
    },
    window: {
      title: "Move a good window",
      kind: "Logarithmic coordinates",
      section: "windows",
      params: [
        range("u", "Log start U", 2, 10, 0.5, 4),
        range("delta", "Width δ", 0.1, 1, 0.1, 0.5),
      ],
      caption:
        "The shaded segment is the only interval controlled in this picture. Its endpoints correspond under the exponential map. Moving the slider illustrates the coordinate change, not the existence theorem.",
      method:
        "For U>0 set Y=eᵁ. The logarithmic interval [U,(1+δ)U] maps exactly onto [Y,Y¹⁺ᵟ]. Endpoints are rounded to three significant figures. The grey regions are left uncontrolled.",
    },
    kernel: {
      title: "Localize a high derivative",
      kind: "Normalized kernel profile",
      section: "windows",
      params: [
        range("k", "Derivative order k", 5, 160, 1, 40),
        range("s", "Real center σ", 3, 12, 0.5, 6),
      ],
      caption:
        "The solid kernel peaks at k/σ. The dashed envelope for a growth bound e²ᵘ peaks later, at k/(σ−2). Each curve is divided by its own maximum to show location.",
      method:
        "We sample 241 equally spaced abscissas and evaluate log(K(u)/K(k/a)) = k log(u a/k) − au + k for a=σ and σ−2. The endpoint u=0 is set to zero. Height normalization removes the factorial and does not compare masses.",
    },
    orthogonal: {
      title: "Average over a subgroup",
      kind: "Exact finite group example",
      section: "balance",
      params: [
        choose(
          "j",
          "Character frequency j",
          [0, 1, 2, 3, 4, 5].map((x) => [String(x), String(x)]),
          "1",
        ),
      ],
      caption:
        "On H = {0,2,4} inside ℤ/6ℤ, the three values of exp(2πijh/6) either coincide or form an equilateral triangle. Their average selects frequencies 0 and 3.",
      method:
        "The membership test 3 | j is exact. The diagram draws trigonometric coordinates in binary64 and labels coincident points together. The projected average is either 0 or 1.",
    },
    reflection: {
      title: "Reflect a proposed zero",
      kind: "Hypothetical contradiction model",
      section: "reflection",
      params: [
        range("b", "Right-hand real part β", 0.52, 0.98, 0.02, 0.76),
        choose("side", "Starting zero of ψ", [["right", "Right of ½"], ["left", "Left of ½"]], "right"),
        range("fraction", "Fraction of gap for θ", 0.1, 0.9, 0.1, 0.5),
        range("epsfrac", "Fraction of ε ceiling", 0.1, 0.9, 0.1, 0.5),
      ],
      caption:
        "The solid dot starts at a proposed zero of ψ. The functional equation takes a half-turn about ½ to the square for ψ⁻¹. Conjugating the square gives the open circle for ψ at the original height. The dashed vertical line is θ.",
      method:
        "For the specialized exponent ½+9ε, take θ=½+f(β−½), then ε=g(θ−½)/9, with 0<f,g<1. Any additional theorem-specific upper bound on ε must also be enforced by taking a smaller value. The starting point has imaginary part 1. The functional equation sends ρ to 1−ρ and exchanges ψ with its inverse. Complex conjugation sends that point to 1−conj(ρ) and exchanges the characters again.",
    },
  };
  configs.cost = {
    title: "Balance the four costs",
    kind: "Constrained parameter model",
    section: "balance",
    params: [
      range("power", "x = 2 to the power", 10, 30, 1, 18),
      range("e", "Small loss ε", 0.01, 0.09, 0.01, 0.04),
      range("mfrac", "Chain length within its range", 0, 1, 0.05, 0.5),
      range("nscale", "Group-size multiplier", 1, 4, 0.25, 2),
      range("kfrac", "Position of k in its range", 0, 1, 0.05, 0.5),
    ],
    caption:
      "The four bars show the leading normalized costs on a base-two logarithmic scale. Moving m changes both x/m and the admissible interval for k. The companion text tracks the powers lost to density and discarded characters.",
    method:
      "For this real-parameter illustration m interpolates geometrically between x^(½−ε) and x^(½+ε/2). Round n up from a multiple of √(xm/x^(½−ε)); choose k between xm and n²x^(½−ε) by geometric interpolation. These choices realize the displayed scale inequalities. No number field or character family is constructed.",
  };
  configs.lattice = {
    title: "Measure the index of a lattice",
    kind: "Exact lattice analogy",
    section: "local",
    params: [
      range("a", "Horizontal spacing a", 1, 5, 1, 3),
      range("b", "Vertical spacing b", 1, 5, 1, 2),
      range("h", "Integer shear h", 0, 4, 1, 1),
    ],
    caption:
      "The parallelogram is a fundamental cell of the sublattice generated by (a,0) and (h,b). Its area is also its index in the ambient integer lattice.",
    method:
      "Basis vectors and the determinant use exact small integers. Translate the first generator to reduce the first coordinate modulo a after reducing the second modulo b. The diagram uses Euclidean area. Arakelov metrics, degrees and heights require additional input.",
  };
  configs.theta = {
    title: "Compose integral operators on finite sets",
    kind: "Finite-matrix analogy",
    section: "local",
    params: [
      range("len", "Steps", 1, 6, 1, 3),
      choose(
        "sign",
        "Initial function",
        [
          ["plus", "(1, 0)"],
          ["minus", "(1, −1)"],
        ],
        "plus",
      ),
      choose(
        "mix",
        "Kernel",
        [
          ["mix", "Local mixing"],
          ["avg", "Averaging projection"],
        ],
        "mix",
      ),
    ],
    caption:
      "Each row is a function on two points. The next row sums the preceding values against the chosen kernel. The projection can kill a nonzero starting function in one step.",
    method:
      "Counting measure on two points gives the kernels [[3/4,1/4],[1/4,3/4]] and [[1/2,1/2],[1/2,1/2]]. Small dyadic rational values are exactly representable in binary64. This example isolates composition and the need for a nonvanishing argument.",
  };
  configs.rates = {
    title: "Compare pole and disk radii",
    kind: "Hypothetical contradiction model",
    section: "windows",
    params: [
      range("b", "Hypothetical β", 0.62, 0.92, 0.05, 0.77),
      range("k", "Derivative order k", 1, 80, 1, 16),
      range("f", "Fraction of height allowance", 0.1, 0.9, 0.1, 0.5),
    ],
    caption:
      "For a single isolated pole the normalized derivative grows like d⁻⁽ᵏ⁺¹⁾. A regular remainder controlled on a larger disk has a smaller exponential rate. The single-pole picture isolates one comparison in the full family argument.",
    method:
      "Fix θ=0.55, σ=40 and ρ=β+i f√((σ−θ)²−(σ−β)²). Then d=|σ−ρ|<σ−θ and R=(d+σ−θ)/2 lies strictly between. Plot (R/d)^(j+1) in logarithmic scale. Other poles, real-part inequalities and the localization estimates are handled in the chapter.",
  };
  configs.center = {
    title: "Subtract the main term",
    kind: "Finite sums and a numerical constant",
    section: "pilot",
    params: [
      range("x", "Final cutoff x", 4, 48, 1, 24),
      choose(
        "chi",
        "Character",
        [
          ["one", "Trivial · modulus 1"],
          ["four", "Quadratic · modulus 4"],
        ],
        "one",
      ),
    ],
    caption:
      "The solid curve is the smoothed sum Sχ, the dashed curve is its main term M, and the dotted curve is their difference. The values displayed below refer to the right endpoint.",
    method:
      "Sample x continuously at 201 equally spaced points from 1 to the cutoff; compute each finite sum using its full prime-power support. For χ modulo 4, β(s)=1−3⁻ˢ+5⁻ˢ−⋯ and β(1)=π/4 by the arctangent series. Differentiating at 1 is justified by uniform Dirichlet convergence on compact subsets of Re s>0, using paired consecutive odd terms. β′(1) is evaluated by the corrected alternating series in the ramp experiment. Fixed-cutoff plots give no asymptotic estimate.",
  };
  configs.zero = {
    title: "Read multiplicity from a local pole",
    kind: "Hypothetical local model",
    section: "pilot",
    params: [
      range("b", "Real part β", 0.1, 0.9, 0.05, 0.6),
      range("t", "Height τ", 0, 4, 0.25, 1),
      range("m", "Multiplicity m", 1, 5, 1, 2),
      range("h", "Regular factor slope a", -2, 2, 0.25, 0.5),
    ],
    caption:
      "Approach the hypothetical zero ρ horizontally, with s=ρ+u. The dotted curve shows u(L′/L − a), after removing the regular term a. Multiplying by u makes its limiting coefficient visible in the solid curve.",
    method:
      "Use the entire model L(s)=(s−ρ)ᵐ exp(a(s−ρ)). Then D=L′/L=m/u+a, so uD=m+au. To compare finite quantities the dotted line plots u(D−a)=m. The formulas extend these two plotted products continuously to u=0; D itself is undefined there. No root finder is used.",
  };
  configs.kernel.params.push(
    range("width", "Window width δ", 0.1, 1, 0.1, 0.5),
  );
  configs.kernel.caption +=
    " The shaded window is centered on the solid peak in logarithmic coordinates. The two percentages record its normalized mass under the kernel and under the envelope.";
  configs.kernel.method +=
    " For this illustration U=(k/σ)/(1+δ/2) and V=(1+δ)U. Each percentage is the integral of the unit-mass density a·exp(−au)(au)ᵏ/k! from U to V. To evaluate even the smallest percentages, count arrivals in a unit-rate Poisson process. Its (k+1)st arrival lies in (aU,aV] exactly when at most k arrivals occur by aU and enough further arrivals occur by aV. The two counts are independent Poisson variables of means aU and a(V−U). We add their positive probabilities in binary64. The proof chooses σ as a function of δ before selecting the window and k.";
  const fmt = (x, d = 4) =>
    Number(x.toPrecision(d)).toString().replace(/^-/, "−");
  function primeBase(n) {
    for (let p = 2; p <= n; p++) {
      if (n % p) continue;
      let m = n;
      while (m % p === 0) m /= p;
      return m === 1 ? p : 0;
    }
    return 0;
  }
  function character(n, chi) {
    return chi === "one" ? 1 : n % 2 === 0 ? 0 : n % 4 === 1 ? 1 : -1;
  }
  let betaDerivative;
  function centeringRatio() {
    if (betaDerivative !== undefined) return betaDerivative;
    let sum = 0;
    for (let j = 1; j < 32768; j++) {
      const n = 2 * j + 1;
      sum += ((j % 2 === 1 ? 1 : -1) * Math.log(n)) / n;
    }
    const next = 65537;
    sum -= Math.log(next) / (2 * next);
    return (betaDerivative = (sum * 4) / Math.PI);
  }
  function contributions(x, chi) {
    const rows = [];
    for (let n = 2; n <= x; n++) {
      const p = primeBase(n);
      if (!p) continue;
      const sign = character(n, chi),
        weight = x / n - 1;
      rows.push({ n, p, sign, weight, y: sign * Math.log(p) * weight });
    }
    return rows;
  }
  function mellin(n, s, u) {
    const a = n ** -s,
      total = a / (s * (s - 1));
    const tail = a * (Math.exp(-(s - 1) * u) / (s - 1) - Math.exp(-s * u) / s);
    return { total, tail, area: total - tail };
  }
  function factorial(p, d) {
    const parts = [];
    for (let q = p; q <= d; q *= p) parts.push([q, Math.floor(d / q)]);
    return parts;
  }
  function reducedFraction(numerator, denominator) {
    let a = Math.abs(numerator), b = denominator;
    while (b !== 0) [a, b] = [b, a % b];
    const top = String(numerator / a).replace("-", "−");
    return denominator === a ? top : top + "/" + (denominator / a);
  }
  function profile(k, a, u) {
    return u === 0 ? 0 : Math.exp(k * Math.log((u * a) / k) - a * u + k);
  }
  function gammaWindowMass(k, start, width) {
    if (width === 0) return 0;
    const added = [Math.exp(-width)];
    for (let n = 1; n <= k + 1; n++) added.push(added[n - 1] * width / n);
    // With no prior arrivals we need at least k+1 new ones. Bound the
    // omitted tail by a geometric series once the ratios are below one.
    let term = added[k + 1], enough = term;
    for (let n = k + 2; ; n++) {
      const ratio = width / n;
      term *= ratio;
      if (ratio < 1 && term <= Number.EPSILON * enough * (1 - ratio)) break;
      enough += term;
    }
    let prior = Math.exp(-start), mass = prior * enough;
    for (let j = 1; j <= k; j++) {
      prior *= start / j;
      enough += added[k + 1 - j];
      mass += prior * enough;
    }
    return mass;
  }
  function eulerQuotients(q, s) {
    const x = q ** (-s - 0.5);
    return { split: (1 + x) / (1 - x), inert: 1, normalizer: 1 / (1 - x * x) };
  }
  function bernoulliCarries(depth, multiplier) {
    const level = 5 ** depth;
    const groups = Array.from({ length: multiplier }, (_, quotient) => ({
      quotient,
      carry: 2 * quotient - (multiplier - 1),
      representatives: 0,
    }));
    for (let u = 1; u < level; u++) {
      if (u % 5 === 0) continue;
      const quotient = Math.floor((multiplier * u) / level);
      groups[quotient].representatives += u;
    }
    const sum = groups.reduce((total, group) => total + group.carry * group.representatives, 0);
    const cleared = 24 * multiplier * sum + 16 * (multiplier ** 2 - 1);
    let valuation = 0;
    for (let integer = sum; integer > 0 && integer % 5 === 0; integer /= 5) valuation++;
    return { level, groups, sum, cleared, valuation };
  }
  const residueUnits = [2, 3, 4, 1];
  function cubicJacobi(p, rootChoice) {
    const roots = [];
    for (let r = 0; r < p; r++) {
      if ((r * r + r + 1) % p === 0) roots.push(r);
    }
    const root = roots[rootChoice === "lower" ? 0 : 1];
    const powers = [1, root, (root * root) % p];
    const h = (p - 1) / 3;
    function characterExponent(x) {
      let power = 1;
      for (let j = 0; j < h; j++) power = (power * x) % p;
      return powers.indexOf(power);
    }
    const counts = [0, 0, 0];
    for (let x = 2; x < p; x++) {
      const exponent = characterExponent(x) + characterExponent(p + 1 - x);
      counts[exponent % 3]++;
    }
    const a = counts[0] - counts[2], b = counts[1] - counts[2];
    const partner = [a - b, -b];
    const reductions = roots.map(r => {
      const reduce = (u, v) => ((u + v * r) % p + p) % p;
      const value = reduce(a, b), conjugate = reduce(...partner);
      return { root: r, value, conjugate, order: Number(value === 0), partnerOrder: Number(conjugate === 0) };
    });
    return { root, h, counts, a, b, partner, norm: a * a - a * b + b * b, reductions };
  }
  function splitEndpointCoefficients(q, degree) {
    const rows = [];
    let previous = 0, twoBack = 0;
    for (let k = 0; k <= degree; k++) {
      const before = 1 + q * previous;
      let hermite = 0;
      for (let u = 0; u <= k; u++) hermite += q ** u;
      const after = before - (q + 1) * previous + q * twoBack;
      rows.push({ k, xDegree: 3 + 2 * k, before, hermite, after });
      twoBack = previous;
      previous = before;
    }
    return rows;
  }
  function gramPair(a, h, column) {
    // In normalized coordinates the three blocks are diag(a²,1), I and diag(ah,0).
    const diagonal = (a * a - 1) ** 2;
    const overlap = a * h;
    const cross = overlap ** 2;
    const keepFirst = column === "first";
    return {
      full: [diagonal, 0, cross],
      retained: [keepFirst ? diagonal : 0, 0, keepFirst ? cross : 0],
      overlap,
      retainedOverlap: keepFirst ? overlap : 0,
    };
  }
  function rankGrid(row, column) {
    const difference = (unit, selected) => Number(unit === selected) - Number(unit === 1);
    return residueUnits.map(h =>
      residueUnits.map(k => difference(h, row) * difference(k, column) || 0),
    );
  }
  function prismInsertions(twist, weight, gluingLog) {
    const positions = Array(2 * twist + 1).fill(0);
    for (let wordIndex = 0; wordIndex < 5 ** twist; wordIndex++) {
      const word = [];
      let digits = wordIndex;
      for (let pair = 0; pair < twist; pair++) {
        const j = digits % 5;
        digits = Math.floor(digits / 5);
        word.push((2 * weight * j) % 10, (2 * weight) % 10);
      }
      for (let position = 0; position < positions.length; position++) {
        const entries = [...word];
        entries.splice(position, 0, gluingLog);
        let value = entries[2 * twist] % 5;
        for (let pair = 0; pair < twist; pair++) {
          value *= Math.floor((entries[2 * pair] + entries[2 * pair + 1]) / 10);
        }
        positions[position] += value;
      }
    }
    return positions;
  }
  function selectWindow(exponents) {
    const marks = [...new Set(exponents.map(k => k / 2))];
    let upper = 16;
    while (true) {
      const obstruction = marks.findIndex(a => upper / 8 < a && a <= upper);
      if (obstruction === -1) return [upper / 2, upper];
      marks.splice(obstruction, 1);
      upper /= 8;
    }
  }
  function chart({
    equal = false,
    xMin = 0,
    xMax,
    yMin = 0,
    yMax,
    xt = "x",
    yt = "value",
    title,
    paint,
  }) {
    const dw = equal ? (122 * (xMax - xMin)) / (yMax - yMin) : 482;
    const X = (x) => 309 - dw / 2 + (dw * (x - xMin)) / (xMax - xMin);
    const Y = (y) => 170 - (122 * (y - yMin)) / (yMax - yMin);
    // Reserve room for numerical ticks at the larger mobile label size.
    const tickWidth = text => 12 * text.length + 6;
    let leftMargin = 0, rightMargin = 0;
    let axes = "";
    for (let j = 0; j <= 4; j++) {
      const y = yMin + ((yMax - yMin) * j) / 4;
      const label = fmt(y, 3);
      leftMargin = Math.max(leftMargin, tickWidth(label) - 59);
      axes +=
        '<path class="grid" d="M68 ' +
        Y(y) +
        'H550"/><text x="59" y="' +
        (Y(y) + 4) +
        '" text-anchor="end">' +
        label +
        "</text>";
    }
    for (let j = 0; j <= 4; j++) {
      const x = xMin + ((xMax - xMin) * j) / 4;
      const label = fmt(x, 3);
      const halfWidth = tickWidth(label) / 2;
      leftMargin = Math.max(leftMargin, halfWidth - X(x));
      rightMargin = Math.max(rightMargin, X(x) + halfWidth - 580);
      axes +=
        '<text x="' +
        X(x) +
        '" y="192" text-anchor="middle">' +
        label +
        "</text>";
    }
    const line = (pts, cls = "ink") =>
      '<path class="' +
      cls +
      '" d="M' +
      pts.map(([x, y]) => X(x).toFixed(2) + " " + Y(y).toFixed(2)).join(" L") +
      '"/>';
    return (
      '<svg class="plot" role="img" aria-label="' +
      title +
      '" viewBox="' + -leftMargin + ' -2 ' + (580 + leftMargin + rightMargin) + ' 227"><title>' +
      title +
      "</title>" +
      axes +
      '<text x="68" y="24">' +
      yt +
      '</text><text x="310" y="215" text-anchor="middle">' +
      xt +
      "</text>" +
      paint(X, Y, line) +
      "</svg>"
    );
  }
  const sample = (max, count, fn) =>
    Array.from({ length: count + 1 }, (_, i) => [
      (i * max) / count,
      fn((i * max) / count),
    ]);
  const metrics = (pairs) =>
    '<dl class="metrics">' +
    pairs
      .map(([k, v]) => "<div><dt>" + k + "</dt><dd>" + v + "</dd></div>")
      .join("") +
    "</dl>";
  function flagAverages(q, points) {
    const histogram = new Map();
    const characteristic = q === 25 ? 5 : q;
    function visitLine(a, b, c) {
      const atA = Number(a === 0), atB = Number(b === 0);
      const atC = points === "triangle" ? c === 0 : b === (characteristic - a) % characteristic;
      const sum = points === "pair" ? atA - atB : atA + atB - 2 * Number(atC);
      histogram.set(sum, (histogram.get(sum) || 0) + 1);
    }
    for (let b = 0; b < q; b++) {
      for (let c = 0; c < q; c++) visitLine(1, b, c);
    }
    for (let c = 0; c < q; c++) visitLine(0, 1, c);
    visitLine(0, 0, 1);
    return [...histogram].sort(([a], [b]) => a - b);
  }
  function mobius(integer) {
    let remainder = integer;
    let sign = 1;
    for (let factor = 2; factor * factor <= remainder; factor++) {
      if (remainder % factor !== 0) continue;
      remainder /= factor;
      if (remainder % factor === 0) return 0;
      sign = -sign;
    }
    return remainder === 1 ? sign : -sign;
  }

  // Encode a+bi as a+3b over F₃, so conjugation changes only the sign of b.
  function countHermitianFrames(dimension, columns) {
    const vectors = [];
    for (let word = 0; word < 9 ** dimension; word++) {
      let remaining = word, norm = 0;
      const vector = [];
      for (let i = 0; i < dimension; i++) {
        const digit = remaining % 9;
        const a = digit % 3, b = Math.floor(digit / 3);
        vector.push([a, b]);
        norm += a * a + b * b;
        remaining = Math.floor(remaining / 9);
      }
      if (norm % 3 === 1) vectors.push(vector);
    }
    if (columns === 1) return { first: vectors.length, frames: vectors.length };
    let frames = 0;
    for (const left of vectors) {
      for (const right of vectors) {
        let real = 0, imag = 0;
        for (let i = 0; i < dimension; i++) {
          const [a, b] = left[i], [c, d] = right[i];
          real += a * c + b * d;
          imag += a * d - b * c;
        }
        if (real % 3 === 0 && imag % 3 === 0) frames++;
      }
    }
    return { first: vectors.length, frames };
  }
  const residueFrameCounts = new Map();
  function hermitianDensity(pair, level) {
    const m = pair ? 3 : 2, n = pair ? 2 : 1;
    if (!residueFrameCounts.has(m)) residueFrameCounts.set(m, countHermitianFrames(m, n));
    const { first, frames } = residueFrameCounts.get(m);
    const lift = 3 ** (2 * m * n - n * n);
    return { first, frames, lift, count: frames * lift ** (level - 1), density: reducedFraction(frames, lift) };
  }
  function heightGrid(u, v) {
    const depths = [2 * u, u + v, u + v, 2 * v];
    const counts = depths.map(k => 2 * 2 ** k + 1);
    const candidates = counts.reduce((product, count) => product * count, 1);
    const bound = 81 * 4 ** (2 * (u + v));
    return { depths, counts, candidates, bound };
  }
  function traceCycles(copies, samePlace) {
    const a = [[1, 1], [1, 0]], b = [[0, 1], [1, 3]];
    const blockSize = 2 * copies, shift = samePlace ? 0 : blockSize;
    const dimension = blockSize + shift;
    function entry(matrix, offset, i, j) {
      i -= offset;
      j -= offset;
      if (i < 0 || i >= blockSize || j < 0 || j >= blockSize || Math.floor(i / 2) !== Math.floor(j / 2)) return 0;
      return matrix[i % 2][j % 2];
    }
    let identity = 0, swap = 0;
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        identity += entry(a, 0, i, i) * entry(b, shift, j, j);
        swap += entry(a, 0, i, j) * entry(b, shift, j, i);
      }
    }
    return { identity, swap };
  }
  function fourierRank(a, b, c) {
    const counts = [0, 0, 0];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const exponent = (1 - a) * x - 2 * b * y - c * z;
          counts[(exponent % 3 + 3) % 3]++;
        }
      }
    }
    return counts;
  }
  function shearRounding(first, second) {
    const nearest = fifths => Math.floor((fifths + 2) / 5);
    const n = nearest(second);
    const make = m => {
      const horizontal = first + second - 5 * (m + n);
      const vertical = second - 5 * n;
      return { m, n, squaredNumerator: horizontal * horizontal + vertical * vertical };
    };
    return { direct: make(nearest(first)), corrected: make(nearest(first + second - 5 * n)) };
  }
  function minimumScale(d) {
    const points = [];
    const radius = Math.ceil(Math.sqrt(4 * d));
    let fullWeight = 0, numerator = 0;
    for (let a = -radius; a <= radius; a++) {
      for (let b = -radius; b <= radius; b++) {
        const norm = a * a + b * b;
        if (norm >= 4 * d) continue;
        const full = norm <= d;
        points.push({ a, b, full });
        if (full) {
          fullWeight++;
          numerator += norm;
        }
      }
    }
    return { points, fullWeight, numerator };
  }
  function kernelOrder(cutoff, phase) {
    const denominator = 2 ** (cutoff - 1);
    const terms = Array.from({ length: cutoff }, (_, index) => {
      const n = index + 1;
      const weight = n * 2 ** (cutoff - n);
      const turn = phase === "i" ? index % 4 : phase === "minus" ? 2 * (index % 2) : 0;
      return { n, weight, real: weight * [1, 0, -1, 0][turn], imag: weight * [0, 1, 0, -1][turn] };
    });
    const lifts = [1, -1].map(y => {
      let first = 0, real = 0, imag = 0;
      for (const t of terms) {
        const kernelSign = y ** (t.n - 1);
        first += kernelSign * t.weight;
        real += kernelSign * t.real;
        imag += kernelSign * t.imag;
      }
      return { y, first, real, imag };
    });
    const targetReal = lifts.reduce((total, t) => total + t.first * t.real, 0);
    const targetImag = lifts.reduce((total, t) => total - t.first * t.imag, 0);
    let sourceReal = 0, sourceImag = 0;
    for (const a of terms) {
      for (const b of terms) {
        if ((a.n + b.n) % 2 === 0) {
          sourceReal += a.weight * b.real;
          sourceImag -= a.weight * b.imag;
        }
      }
    }
    const weightSum = lifts[0].first;
    const tail = 16 * denominator ** 2 - weightSum ** 2;
    return { denominator, lifts, targetReal, targetImag, sourceReal, sourceImag, tail };
  }
  function complexFraction(real, imag, denominator) {
    const x = reducedFraction(real, denominator);
    if (imag === 0) return x;
    const abs = Math.abs(imag);
    const y = (abs === denominator ? "" : reducedFraction(abs, denominator)) + "i";
    if (real === 0) return (imag < 0 ? "−" : "") + y;
    return x + (imag < 0 ? " − " : " + ") + y;
  }
  function centralPeriod(start, length) {
    const first = Math.round(8 * start);
    const span = Math.round(8 * length);
    // An even eighth has sine 0 or ±1. An odd eighth has sine ±√2/2.
    // All offered lengths advance an even number of eighths.
    const signs = [0, 1, 1, 1, 0, -1, -1, -1];
    const change = signs[(first + span) % 8] - signs[first];
    const mean = 2 * length;
    const meanExact = reducedFraction(span, 4);
    const turn = (first % 2 === 0) ? 1 : Math.SQRT1_2;
    const original = mean + change * turn / (2 * Math.PI);
    let originalExact = meanExact;
    if (change !== 0) {
      let magnitude = "1/(2π)";
      if (first % 2 === 1) magnitude = "√2/(2π)";
      else if (Math.abs(change) === 2) magnitude = "1/π";
      originalExact += (change > 0 ? " + " : " − ") + magnitude;
    }
    return { original, originalExact, mean, meanExact, equal: change === 0 };
  }

  function primitiveHyperplanes(norm) {
    const coords = [];
    for (let x = -2; x <= 2; x++) for (let y = -2; y <= 2; y++) {
      const size = x*x + y*y;
      if (size <= norm) coords.push({size, divisible:(x+y) % 2 === 0});
    }
    const types = new Map();
    for (const a of coords) for (const b of coords) for (const c of coords) {
      if (a.size + b.size + c.size !== norm || (a.divisible && b.divisible && c.divisible)) continue;
      const pattern = [a.size, b.size, c.size].sort((x,y) => x-y).join(", ");
      types.set(pattern, (types.get(pattern) || 0) + 1);
    }
    return [...types].sort(([a],[b]) => a.localeCompare(b)).map(([pattern, normals]) =>
      ({pattern, lines:normals/4, stabilizer:384/(normals/4)}));
  }

  function binaryLatticeBox(n) {
    const pairs = [0, 0, 0];
    for (let u = 0; u < n; u++) {
      for (let v = 0; v < n; v++) pairs[(u - v + 3*n) % 3]++;
    }
    const first = pairs[(1 + n) % 3]; // 1−2N is congruent to 1+N modulo 3.
    const numerator = first * pairs[0] ** 3, denominator = n ** 8;
    return {numerator, denominator, value:numerator / denominator};
  }

  function stickelbergerFibres(prime, depth, level) {
    const target = prime ** depth, modulus = (prime === 2 ? 3 : 2) * prime ** level;
    const sums = new Map();
    // Running through u makes s = 13u mod M and avoids modular division.
    for (let u = 1; u < modulus; u++) {
      const s = 13 * u % modulus;
      if (s % 2 === 0 || s % 3 === 0 || 2*s >= modulus) continue;
      const rep = Math.min(s % target, target - s % target);
      const character = prime === 3 && s % 3 === 2 ? -1 : 1;
      const weight = Math.floor(13 * u / modulus) - 6;
      sums.set(rep, (sums.get(rep) || 0) + character * weight);
    }
    const rows = [...sums.entries()].sort(([a], [b]) => a-b).map(([rep, sum]) =>
      ({rep, sum, reduced:((sum % prime) + prime) % prime}));
    return {modulus, target, rows};
  }

  function realWhittakerCutoff(shift, quarter) {
    const frequency = quarter / 4, angle = 2 * Math.PI * frequency;
    const density = Math.PI * Math.exp(-angle) / 4;
    const continued = shift === -1 ? 0 : shift === 0 ? density : density * (1 + angle) / 2;
    const points = [[0, 0]];
    const integrand = y => Math.cos(angle * y) / (2 * (1 + y * y) ** (1 + shift));
    let integral = 0;
    for (let tick = 1; tick <= 12 * 32; tick++) {
      const right = tick / 32, left = (tick - 1) / 32;
      if (shift === -1) {
        integral = Math.sin(angle * right) / (2 * angle);
      } else {
        integral += (integrand(left) + 4 * integrand((left + right) / 2) + integrand(right)) / 192;
      }
      points.push([right, integral]);
    }
    return {points, continued};
  }

  function frobeniusOrbits(prime, depth) {
    const modulus = 2 ** depth, visited = new Set(), orbits = [];
    for (let start = 1; start < modulus; start += 2) {
      if (visited.has(start)) continue;
      const orbit = [];
      let x = start;
      do {
        orbit.push(x);
        visited.add(x);
        x = (prime * x) % modulus;
      } while (x !== start);
      orbits.push(orbit);
    }
    return orbits;
  }

  function localizationKernel(depth) {
    const sourceSize = Math.min(27, 3 ** depth), targetSize = Math.min(9, 3 ** depth);
    const kernel = [], image = new Set(), integralResidues = new Set();
    for (let x = 0; x < sourceSize; x++) {
      const value = (3 * x) % targetSize;
      image.add(value);
      if (value === 0) kernel.push(x);
    }
    for (let x = 0; x < 27; x++) {
      if ((3 * x) % 9 === 0) integralResidues.add(x % sourceSize);
    }
    return {sourceSize, targetSize, kernel, integral: Array.from(integralResidues), cokernelSize: targetSize / image.size};
  }

  // A permutation lists the images of 1, 2 and 3 in order.
  function smallGenusClasses() {
    const all = ["123", "132", "213", "231", "312", "321"];
    const subgroup = ["123", "213"];
    const multiply = (p, q) => Array.from(q, digit => p[Number(digit) - 1]).join("");
    const left = p => subgroup.map(h => multiply(h, p)).sort();
    const both = p => [...new Set(left(p).flatMap(x => subgroup.map(k => multiply(x, k))))].sort();
    const distinct = classes => [...new Set(classes.map(c => c.join(" ")))].map(key => key.split(" "));
    return [all.map(p => [p]), distinct(all.map(left)), distinct(all.map(both))];
  }

  function splitGraph(dimension) {
    const limit = 2 ** dimension;
    function pairing(vector, form) {
      let parity = 0;
      for (let mask = 1; mask < limit; mask *= 2) {
        if (vector & form & mask) parity ^= 1;
      }
      return parity;
    }
    const points = [];
    for (let vector = 1; vector < limit; vector++) {
      for (let form = 1; form < limit; form++) {
        if (pairing(vector, form)) points.push({vector, form, adjacent: []});
      }
    }
    let edges = 0;
    points.forEach((a, i) => points.slice(i + 1).forEach((b, offset) => {
      if (pairing(a.vector, b.form) || pairing(b.vector, a.form)) return;
      a.adjacent.push(i + 1 + offset);
      b.adjacent.push(i);
      edges++;
    }));
    const components = [], seen = new Set();
    points.forEach((_, i) => {
      if (seen.has(i)) return;
      const component = [i];
      seen.add(i);
      for (let j = 0; j < component.length; j++) {
        for (const k of points[component[j]].adjacent) {
          if (seen.has(k)) continue;
          seen.add(k);
          component.push(k);
        }
      }
      components.push(component);
    });
    return {points, edges, components};
  }

  function splitDiagram(graph, dimension) {
    const {points, components} = graph;
    const label = point => {
      if (point.vector === 1 && point.form === 1) return "A";
      if (point.vector === 1 && point.form === 3) return "C";
      if (point.vector === 4 && point.form === 4) return "U";
      return "";
    };
    const point = (x, y, name) => '<circle class="ink" cx="' + x + '" cy="' + y + '" r="6"/>' +
      '<text text-anchor="middle" x="' + x + '" y="' + (y - 13) + '">' + name + '</text>';
    const line = (x1, y1, x2, y2) => '<line class="ink" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
    const title = dimension === 2 ? "Three disconnected edges, with A and C on different edges" : "The path from A through U to C in rank three";
    let drawing;
    if (dimension === 2) {
      drawing = components.map((pair, i) => {
        const x = 55 + i * 114;
        return line(x, 41, x, 87) + point(x, 35, label(points[pair[0]])) + point(x, 93, label(points[pair[1]]));
      }).join("");
    } else {
      drawing = line(61, 63, 163, 63) + line(175, 63, 277, 63) +
        point(55, 63, "A") + point(169, 63, "U") + point(283, 63, "C");
    }
    return '<svg class="plot" viewBox="0 -5 338 114" role="img" aria-label="' + title + '"><title>' + title + '</title>' + drawing + '</svg>';
  }

  function gaussianMinorShell(h) {
    const inner = 2 ** h, outer = 2 * inner;
    let count = 0, weight = 0;
    for (let a = 1 - outer; a < outer; a++) {
      for (let b = 1 - outer; b < outer; b++) {
        const norm = a * a + b * b;
        if (inner * inner <= norm && norm < outer * outer) {
          count++;
          weight += norm ** (-1.5);
        }
      }
    }
    return {inner, outer, count, weight};
  }

  function progressionDifference(y, width, chi) {
    const u = y + y / width;
    const rows = [];
    for (let n = 1; n <= u; n++) {
      const residue = n % 3;
      const character = residue === 0 ? 0 : chi === "quadratic" && residue === 2 ? -1 : 1;
      // With δ = 1/width the ramp equals ((width + 1)y − width·n)/n.
      const top = n <= y ? 1 : (width + 1) * y - width * n;
      const bottom = n <= y ? 1 : n;
      rows.push({n, prime: primeBase(n), character, top, bottom});
    }
    return {u, rows};
  }

  function logSum(terms) {
    let result = "";
    for (const {prime, top, bottom} of terms) {
      if (!prime || !top) continue;
      const fraction = reducedFraction(Math.abs(top), bottom);
      const sign = result ? (top < 0 ? " − " : " + ") : (top < 0 ? "−" : "");
      result += sign + (fraction === "1" ? "" : fraction + " ") + "log " + prime;
    }
    return result || "0";
  }

  // A coordinate of F₂[η]/(η²) is encoded by its constant bit plus twice its η bit.
  function ramifiedProduct(x, y) {
    return x.map((coordinate, i) => {
      const h = coordinate % 2, j = Math.floor(coordinate / 2);
      const k = y[i] % 2, m = Math.floor(y[i] / 2);
      return h * k + 2 * ((h * m + j * k) % 2);
    });
  }

  function render(id, v) {
    if (id === "iwahori-translated-slopes") {
      const p = Number(v.prime);
      const m = Number(v.power);
      const d = Number(v.shift);
      const determinant = p ** m;
      const topLeft = determinant + p;
      const trace = topLeft + 1;
      const discriminant = trace * trace - 4 * determinant;
      const scale = m * (1 + d);
      const signed = number => String(number).replace("-", "−");
      const rootValuations = m > 0 ? signed(-scale) + ", " + signed(m - scale) : "No roots in K";
      const conclusion = m > 0
        ? "The two simple residue roots lift to roots in K. The unit root of B has valuation 0. Its companion has valuation " + m + " because their product is " + determinant + "."
        : "The residue root 1 is double. The discriminant " + discriminant + " has valuation 1. The polynomial is separable and its two roots lie in a quadratic extension of K.";
      const row = (label, value) => '<tr><th scope="row">' + label + '</th><td>' + value + '</td></tr>';
      const announcement = "Prime " + p + ". Power " + m + ". Central valuation " + d + ". " +
        (m > 0 ? "Eigenvalue valuations of g: " + rootValuations + "." : "The characteristic polynomial does not split over the local field.");
      return '<table class="carry-table" data-announcement="' + announcement + '"><caption>From the integral matrix to the translated spectrum</caption>' +
        '<thead><tr><th scope="col">Quantity</th><th scope="col">Value</th></tr></thead><tbody>' +
        row('Rows of <var>B</var> = ' + p + '<sup>' + scale + '</sup><var>g</var>', '(' + topLeft + ', 1), (' + p + ', 1)') +
        row('Characteristic polynomial of <var>B</var>', '<var>X</var>² − ' + trace + '<var>X</var> + ' + determinant) +
        row('Roots modulo ' + p, m > 0 ? '0 and 1' : '1 (double)') +
        row('Eigenvalue valuations of <var>g</var> over <var>K</var>', rootValuations) +
        '</tbody></table><p>' + conclusion + '</p>';
    }
    if (id === "filtered-lattice-modification") {
      const degrees = {mixed: [-1, 2], swapped: [2, -1], flat: [0, 0]}[v.degrees];
      const depth = Number(v.height), sign = v.rule === "subtract" ? -1 : 1;
      const forward = degrees.map(h => depth + sign * h), companion = degrees.map(h => depth - sign * h);
      const columnOrders = degrees.map((h, i) => h + forward[i]), rowOrders = degrees.map((h, i) => companion[i] - h);
      const integral = [...forward, ...companion].every(n => n >= 0);
      const deep = [...columnOrders, ...rowOrders].every(n => n >= depth);
      const signed = n => String(n).replace("-", "−");
      const power = n => n === 0 ? "1" : "<var>u</var>" + (n === 1 ? "" : "<sup>" + signed(n) + "</sup>");
      const multiple = (n, vector) => (n === 0 ? "" : power(n) + " ") + vector;
      const pair = numbers => "(" + numbers.map(signed).join(", ") + ")";
      const row = (label, left, right) => '<tr><th scope="row"><span class="math-coordinates">' + label + '</span></th><td>' + left + '</td><td>' + right + '</td></tr>';
      const indices = ["1", "2"], columns = ["(1, 0)", "(1, 1)"], inverseRows = ["(1, −1)", "(0, 1)"];
      const status = "Depth " + depth + ". Column orders " + pair(columnOrders) + ". Inverse row orders " + pair(rowOrders) +
        ". Integral modifiers: " + (integral ? "yes." : "no.") + " Both depth bounds: " + (deep ? "yes." : "no.");
      const conclusion = integral ? "Both modifiers have entries in <var>A</var>." :
        "A negative power in a modifier gives an entry outside <var>A</var>.";
      return '<table class="carry-table" data-announcement="' + status + '"><caption>Diagonal entries of the modifiers</caption><thead><tr>' +
        '<th scope="col">Degree</th><th scope="col"><var>X</var></th><th scope="col"><var>X′</var></th></tr></thead><tbody>' +
        indices.map((index,i) => row('<var>h</var><sub>' + index + '</sub> = ' + signed(degrees[i]), power(forward[i]), power(companion[i]))).join("") +
        '</tbody></table><p>The exponents in each pair add to ' + (2 * depth) + ', so <var>XX′</var> = ' + multiple(2 * depth,"<var>I</var>") +
        '. ' + conclusion + '</p><table class="carry-table"><caption>Testing depth ' + depth + '</caption><thead><tr>' +
        '<th scope="col">Index</th><th scope="col">Column of <var>QX</var></th><th scope="col">Row of <span class="math-coordinates"><var>X′Q</var><sup>−1</sup></span></th></tr></thead><tbody>' +
        indices.map((index,i) => row(index,multiple(columnOrders[i],columns[i]),multiple(rowOrders[i],inverseRows[i]))).join("") +
        '</tbody></table><p>The column orders are ' + pair(columnOrders) + ' and the inverse row orders are ' + pair(rowOrders) + '. ' +
        (deep ? 'Both products reach depth ' + depth + '.' : 'The smallest order is ' + signed(Math.min(...columnOrders,...rowOrders)) + ', below the requested depth ' + depth + '.') + '</p>';
    }
    if (id === "logarithm-zero") {
      const shift = 2 * Number(v.translation), column = Number(v.column) - 1;
      const columns = [[1, 1, 0], [0, 1, 1], [0, 0, 1]], zero = [0, 0, 0];
      const current = columns[column], previous = columns[column - 1] || zero, second = columns[column - 2] || zero;
      const quadratic = shift * shift / 2;
      const combine = (linear, square) => current.map((x, i) => x + linear * previous[i] + square * second[i]);
      const translate = ([x, y, z]) => [x - shift * y + quadratic * z, y - shift * z, z];
      // Evaluate ρ(a) = U E(−s) U⁻¹ on the chosen initial column in ambient coordinates.
      const [x, y, z] = current, inBasis = [x, y - x, z - y + x];
      const [first, middle, last] = translate(inBasis);
      const target = [first, first + middle, middle + last];
      const display = vector => "(" + vector.join(", ").replaceAll("-", "−") + ")";
      const candidates = [
        ["<var>U E</var>(−<var>s</var>)", combine(-shift, quadratic)],
        ["<var>U E</var>(<var>s</var>)", combine(shift, quadratic)],
        ["<var>E</var>(−<var>s</var>)<var> U</var>", translate(current)],
        ["<var>U</var>(<var>I</var> − <var>sJ</var>)", combine(-shift, 0)],
      ];
      const rows = candidates.map(([label, result]) => {
        const agrees = result.every((entry, i) => entry === target[i]);
        return '<tr><th scope="row">' + label + '</th><td>' + display(result) + '</td><td>' + (agrees ? 'Yes' : 'No') + '</td></tr>';
      }).join("");
      const quadraticTerm = second.map(entry => quadratic * entry);
      const explanation = shift === 0 ? "The translation is zero, so all four expressions give the initial column." :
        column === 2 ? "The quadratic term reaches the first initial column through J²e₃ = e₁." :
        "The quadratic term vanishes on this column because its second image under J is zero.";
      const status = "Shift " + shift + ". Column " + (column + 1) + " of the Galois transform is " + display(target) +
        ". Quadratic contribution " + display(quadraticTerm) + ".";
      return '<p>At <var>s</var> = ' + String(shift).replace("-", "−") + ', column ' + (column + 1) +
        ' of the Galois transform ρ(<var>a</var>)<var>U</var> is ' + display(target) + '.</p>' +
        '<table class="carry-table" data-announcement="' + status + '"><caption>Testing column ' + (column + 1) +
        ' against the Galois transform</caption><thead><tr><th scope="col">Product</th><th scope="col">Column ' +
        (column + 1) + '</th><th scope="col">Agrees?</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<p>The contribution from (<var>s</var>²/2)<var>UJ</var>² is ' + display(quadraticTerm) + '. ' + explanation + '</p>';
    }
    if (id === "orbital-unipotent-fibre") {
      const unitSlice = v.slice === "units", zero = v.coset === "zero";
      const depth = zero ? 0 : Number(v.coset);
      const denominator = 5 ** depth;
      const yNumerator = zero ? 0 : unitSlice ? -5 : 24;
      const yDenominator = unitSlice ? denominator : 25 * denominator;
      const y = reducedFraction(yNumerator, yDenominator);
      const upperRight = reducedFraction(yNumerator * (unitSlice ? 1 : 5), yDenominator);
      const least = unitSlice ? Math.min(0, 1 - depth) : -1 - depth;
      const support = least === 0 ? "K" : least === -1 ? "D" : "Outside the support";
      const term = least === 0 ? -4 : least === -1 ? 1 : 0;
      const unitCells = unitSlice ? 5 : 0, outerCells = unitSlice ? 20 : 1;
      const cellSum = -4 * unitCells + outerCells, integral = unitSlice ? cellSum / 5 : 25 * cellSum;
      const cellMass = unitSlice ? "1/5" : "25";
      const status = "Image coordinate " + y + ". Test value " + term + ". Image cell mass " + cellMass +
        ". Fibre sum " + cellSum + ". Integral " + integral + ".";
      const row = (label, value) => '<tr><th scope="row">' + label + '</th><td>' + value + '</td></tr>';
      const supportRow = (name, domain, cells, mass) => '<tr><th scope="row"><var>' + name + '</var></th><td>' +
        domain + '</td><td>' + cells + '</td><td>' + mass + '</td></tr>';
      return '<p>For γ = ' + (unitSlice ? 'diag(1, 6)' : 'diag(5, 1/5)') + ', Φ(<var>X</var>) = ' +
        (unitSlice ? '−5<var>X</var>' : '(24/25)<var>X</var>') +
        '. The cell Φ(Λ) = ' + (unitSlice ? '5ℤ₅' : '(1/25)ℤ₅') + ' and each of its translates have Haar mass ' +
        cellMass + '.</p><table class="carry-table" data-announcement="' + status +
        '"><caption>The conjugate at <var>X</var> = ' + (zero ? '0' : '1/' + denominator) + '</caption><tbody>' +
        row('Image coordinate <var>Y</var>', y) + row('Upper-right entry <var>AY</var>', upperRight) +
        row('Least entry valuation', String(least).replace("-", "−")) +
        row('Support and test value', (least >= -1 ? '<var>' + support + '</var>' : support) + ', ' + String(term).replace("-", "−")) +
        '</tbody></table><table class="carry-table"><caption>All cells in the support</caption>' +
        '<thead><tr><th scope="col">Class</th><th scope="col">Range of <var>Y</var></th><th scope="col">Cells</th><th scope="col">Mass</th></tr></thead><tbody>' +
        supportRow('K', unitSlice ? 'ℤ₅' : 'Empty', unitCells, unitSlice ? 1 : 0) +
        supportRow('D', unitSlice ? '(1/5)ℤ₅ ∖ ℤ₅' : '(1/25)ℤ₅', outerCells, unitSlice ? 4 : 25) +
        '</tbody></table><p>The fibre sum is (−4) × ' + unitCells + ' + ' + outerCells + ' = ' + cellSum +
        '. Multiplication by the cell mass gives an integral of ' + integral + '. ' +
        (unitSlice ? 'This verifies cancellation on this translate.' : 'This nonzero integral rules out cuspidality of the test.') + '</p>';
    }
    if (id === "signed-weil-operator") {
      const alpha = Number(v.degree), n1 = Math.max(-alpha, 0), n2 = Math.max(alpha, 0);
      const input = 2 ** n2, output = 2 ** n1;
      const operator = 4 * input + 3 * output + input;
      const scalar = 6 * input + 2 * output;
      const monomial = exponent => {
        if (exponent === 0) return "1";
        const magnitude = Math.abs(exponent);
        const power = "<var>t</var>" + (magnitude === 1 ? "" : "<sup>" + magnitude + "</sup>");
        return exponent < 0 ? "1/" + power : power;
      };
      const spokenPower = n => n === 1 ? "t" : "t to the power " + n;
      const status = "Signed exponent " + alpha + ". Input " + spokenPower(input) + ". Output " +
        spokenPower(output) + ". Both cleared products are " + spokenPower(operator + input) + ".";
      const row = (label, value) => '<tr><th scope="row">' + label + '</th><td>' + value + '</td></tr>';
      return '<table class="carry-table" data-announcement="' + status + '"><caption>Input and output of multiplication by <var>V</var>/<var>s</var></caption>' +
        '<thead><tr><th scope="col">Column</th><th scope="col">Iterate</th><th scope="col">Value</th></tr></thead><tbody>' +
        '<tr><th scope="row">Input</th><td><var>n</var>₂ = ' + n2 + '</td><td>' + monomial(input) + '</td></tr>' +
        '<tr><th scope="row">Output</th><td><var>n</var>₁ = ' + n1 + '</td><td>' + monomial(output) + '</td></tr></tbody></table>' +
        '<table class="carry-table"><caption>Checking the scalar equation</caption><tbody>' +
        row('Operator <var>V</var>', monomial(operator)) + row('Scalar <var>s</var>', monomial(scalar)) +
        row('Multiplier <var>V</var>/<var>s</var>', monomial(operator - scalar)) +
        row('Input × <var>V</var>', monomial(operator + input)) +
        row('Output × <var>s</var>', monomial(scalar + output)) + '</tbody></table>';
    }
    if (id === "crystalline-invariant-columns") {
      const values = {one:[1, 0], two:[2, 0], i:[0, 1], sum:[1, 1]};
      const w = values[v.scalar], coefficient = values[v.coefficient];
      const multiply = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
      const conjugateW = [w[0], -w[1]], normW = w[0] ** 2 + w[1] ** 2;
      const divideByW = z => multiply(z, conjugateW).map(entry => entry / normW);
      const Q = [1, -1], X = multiply(w, Q), product = multiply(X, Q);
      const U = divideByW(product), multiple = multiply(coefficient, U);
      const display = ([a, b]) => complexFraction(a, b, 1);
      const transform = ([a, b]) => [-a, b];
      const factor = display(divideByW(conjugateW));
      const row = (name, z) => '<tr><th scope="row">' + name + '</th><td>' + display(z) +
        '</td><td>' + display(transform(z)) + '</td></tr>';
      const summary = (product[0] === 0 ? "The product is fixed." : "The product moves.") +
        " The normalized column is fixed. " + (multiple[0] === 0 ? "Its selected multiple is fixed." : "Its selected multiple moves.");
      const announcement = "Scalar factor " + factor + ". The selected multiple goes from " + display(multiple) +
        " to " + display(transform(multiple)) + ". " + summary;
      return '<p>Here <var>X</var> = ' + display(X) + ', <var>Q</var> = 1 − i, and the factor <var>g</var>(<var>w</var>)/<var>w</var> = ' +
        factor + '.</p><table class="carry-table" data-announcement="' + announcement +
        '"><caption>Before and after the twisted action</caption><thead><tr><th scope="col">Column</th>' +
        '<th scope="col">Value</th><th scope="col">After action</th></tr></thead><tbody>' +
        row('Product <var>XQ</var>', product) + row('Normalized <var>U</var>', U) +
        row('Multiple <var>aU</var>', multiple) + '</tbody></table><p>' + summary + '</p>';
    }
    if (id === "integral-lattice-saturation") {
      const a = Number(v.power), r = Number(v.loss), n = Number(v.precision);
      const modulus = 3 ** n, scalar = 3 ** r, target = scalar % modulus;
      const second = v.vector === "e2";
      const exponent = {e1:0, ue1:1, u2e1:2, e2:0}[v.vector] - a;
      const monomial = j => j === 0 ? "1" : "<var>u</var>" + (j === 1 ? "" : "<sup>" + String(j).replace("-", "−") + "</sup>");
      const coordinates = second ? "(0, 1)" : "(" + monomial(exponent) + ", 0)";
      const member = second || exponent >= 0;
      const solution = target === 0 ? "Yes, <var>G</var> = 0" :
        a === 0 ? "Yes, <var>G</var> = " + (scalar === 1 ? "" : scalar) + "<var>I</var>" : "No";
      const announcement = (member ? "The vector belongs to the integral span." : "The vector is outside the integral span.") +
        (a === 0 || target === 0 ? " The matrix congruence has a solution." : " The matrix congruence has no solution.");
      const row = (label, value) => '<tr><th scope="row">' + label + '</th><td>' + value + '</td></tr>';
      return '<table class="carry-table" data-announcement="' + announcement + '"><caption>Coordinates in the column basis</caption><tbody>' +
        row("Over 𝒪", coordinates) + row("<var>x</var> in the <var>S</var>-span?", member ? "Yes" : "No") +
        row("Span equals <var>S</var>²?", a === 0 ? "Yes" : "No") + '</tbody></table>' +
        '<table class="carry-table"><caption>At <var>u</var> = 0, modulo ' + modulus + '</caption><tbody>' +
        row("Possible first entry of <var>VG</var>", a === 0 ? "Every residue" : "0") +
        row("First entry of the target", String(target)) + row("Integral solution?", solution) + '</tbody></table>';
    }
    if (id === "period-witness-compatibility") {
      const tangent = Number(v.tangent), degree = Number(v.degree), scale = 3 ** Number(v.scale);
      const upperDefect = scale * (tangent ** degree - 1);
      const upperValid = degree === 4 || upperDefect === 0;
      const compatible = degree >= 3;
      const monomial = (coefficient, exponent) => coefficient === 0 ? "0" :
        String(coefficient).replace("-", "−") + "<var>t</var><sup>" + exponent + "</sup>";
      const residue = "<var>t</var>" + (compatible ? "" : " + <var>t</var><sup>2</sup>");
      const row = (label, lower, upper) => '<tr><th scope="row">' + label + '</th><td>' + lower + '</td><td>' + upper + '</td></tr>';
      const summary = upperValid
        ? (compatible ? "Both witnesses give the same normalized class modulo t³." :
          "Both witnesses pass. The action fixes t², so their normalized classes can differ modulo t³.")
        : (compatible ? "The normalized classes agree modulo t³, but the second candidate fails at order four." :
          "The normalized classes differ modulo t³. The second candidate fails at order four.");
      return '<table class="carry-table" data-announcement="' + summary + '"><caption>Two tests on the same frame</caption>' +
        '<thead><tr><th scope="col">Test</th><th scope="col" style="white-space:nowrap">Order 3</th>' +
        '<th scope="col" style="white-space:nowrap">Order 4</th></tr></thead><tbody>' +
        row("Scalar at <var>t</var> = 0", "3", String(scale)) +
        row("Normalized entry mod <var>t</var>³", "<var>t</var>", residue) +
        row("Twisted defect, entry (1, 2)", monomial(3 * (tangent ** 3 - 1), 3), monomial(upperDefect, degree)) +
        row("Passes its own test?", "Yes", upperValid ? "Yes" : "No") + '</tbody></table><p>' + summary + '</p>';
    }
    if (id === "period-common-power") {
      const {height, jumps} = periodLayers[v.layer];
      const target = Number(v.target), shift = target - height;
      const exponents = (m, sign) => jumps.map(h => m + sign * h);
      const signed = x => String(x).replace("-", "−");
      const pair = values => "(" + values.map(signed).join(", ") + ")";
      const power = n => n === 0 ? "1" : "<var>t</var>" + (n === 1 ? "" : "<sup>" + n + "</sup>");
      const common = Math.min(...exponents(height, 1), ...exponents(height, -1));
      const integral = common + shift >= 0;
      const operation = shift === 0 ? "Keep both matrices" :
        (shift < 0 ? "Divide by " : "Multiply by ") + power(Math.abs(shift));
      const product = target === 0 ? "<var>I</var>" : power(2 * target) + "<var>I</var>";
      const row = (name, sign) => '<tr><th scope="row"><var>' + name + '</var></th><td>' +
        pair(exponents(height, sign)) + '</td><td>' + pair(exponents(target, sign)) + '</td></tr>';
      const status = "Height " + height + " to " + target + ". Smallest target exponent " +
        signed(common + shift) + ". " + (integral ? "Both matrices are integral." : "The rescaled pair has a pole.");
      return '<table class="carry-table" data-announcement="' + status + '"><caption>Exponents of the diagonal factors</caption>' +
        '<thead><tr><th scope="col">Matrix</th><th scope="col">Start, ' + height + '</th><th scope="col">Target, ' + target +
        '</th></tr></thead><tbody>' + row("A", 1) + row("A′", -1) + '</tbody></table>' +
        metrics([["Largest common power at the start", power(common)], ["Operation on both matrices", operation],
          ["Product after rescaling", product]]) +
        (integral ? '<p>Both rescaled matrices have polynomial entries.</p>' :
          '<p>A negative diagonal exponent gives a pole. The product still has polynomial entries.</p>');
    }
    if (id === "translated-trace-precision") {
      const a = Number(v.a), b = Number(v.b);
      const modulus = 2 ** Number(v.n), stronger = 2 * modulus;
      const diagonal = [a + b, a - b];
      const residue = (value, m) => ((value % m) + m) % m;
      const signed = value => String(value).replace("-", "−");
      const pair = ([x, y]) => "(" + signed(x) + ", " + signed(y) + ")";
      const entriesDivide = diagonal.every(value => value % modulus === 0);
      const inLattice = a % modulus === 0 && b % modulus === 0;
      const lattice = modulus === 1 ? "M" : modulus + "M";
      const row = (label, value) => '<tr><th scope="row">' + label + '</th><td>' + signed(value) +
        '</td><td>' + residue(value, modulus) + '</td><td>' + residue(value, stronger) + '</td></tr>';
      const announcement = "Trace residues modulo " + stronger + " are " + residue(2 * a, stronger) +
        " and " + residue(2 * b, stronger) + ". " + (inLattice ? "X belongs to " : "X is outside ") + lattice + ".";
      return '<table class="carry-table" data-announcement="' + announcement + '"><caption>Ordinary and translated traces</caption>' +
        '<thead><tr><th scope="col">Trace</th><th scope="col">Value</th><th scope="col">Mod ' + modulus +
        '</th><th scope="col">Mod ' + stronger + '</th></tr></thead><tbody>' +
        row("tr(<var>X</var>)", 2 * a) + row("tr(<var>XD</var>)", 2 * b) + '</tbody></table>' +
        metrics([["Entries " + pair(diagonal) + " divisible by " + modulus, entriesDivide ? "Yes" : "No"],
          ["<var>X</var> ∈ " + lattice + " with coordinates " + pair([a, b]), inLattice ? "Yes" : "No"]]);
    }
    if (id === "square-torus-fixed-points") {
      const a = Number(v.real), b = Number(v.imag), y = Number(v.y);
      const degree = (1 - a) ** 2 + b ** 2;
      const theta = complexFraction(a, b, 1);
      const row = (label, value) => '<tr><th scope="row">' + label + '</th><td>' + value + '</td></tr>';
      const table = (announcement, rows) => '<table class="carry-table" data-announcement="' + announcement + '">' +
        '<caption>Multiplication by ' + theta + ' at <var>y</var> = ' + y + '</caption><thead><tr>' +
        '<th scope="col">Quantity</th><th scope="col">Value</th></tr></thead><tbody>' + rows + '</tbody></table>';
      if (degree === 0) {
        return table("Every point is fixed. The isolated-point formula is undefined.",
          row("Fixed points", "All of E") + row("Weight per point", "Undefined") + row("Isolated-point sum", "Undefined")) +
          '<p>The identity fixes the whole curve. The denominator 1 − Θ vanishes, so the isolated-point formula does not apply.</p>';
      }
      const constant = complexFraction(1 - a, b, 1);
      const linear = complexFraction(a * a + b * b - a, -b, 1);
      let weight = "1";
      if (y === 0) {
        weight = b === 0 || degree === 1 ? complexFraction(1 - a, b, degree) : "(" + constant + ")/" + degree;
      }
      const sum = y === 0 ? constant : String(degree);
      const announcement = degree + (degree === 1 ? " fixed point." : " fixed points.") +
        " Weight per point " + weight + ". Sum " + sum + ".";
      return table(announcement, row("Fixed points", String(degree)) + row("Weight per point", weight) + row("Sum of weights", sum)) +
        metrics([["Constant term of the sum", constant], ["Coefficient of <var>y</var>", linear]]);
    }
    if (id === "gaussian-quotient-marking") {
      const label = [Number(v.u), Number(v.v)];
      const [a, b] = {zero: [0, 0], one: [1, 0], i: [0, 1], both: [1, 1]}[v.shift];
      const lift = [label[0] + 7 * a, label[1] + 7 * b];
      const residue = n => ((n % 14) + 14) % 14;
      const sign = v.factor === "F" ? -1 : 1;
      const multiply = ([r, s]) => [residue(r - sign * s), residue(s + sign * r)];
      const point = multiply(lift);
      const shift = multiply([7 * a, 7 * b]);
      const image = [residue(point[0] - point[1]) / 2, residue(point[0] + point[1]) / 2];
      const matches = image[0] === label[0] && image[1] === label[1];
      const pair = p => "(" + p.join(", ") + ")";
      const row = (label, p) => '<tr><th scope="row">' + label + '</th><td>' + pair(p) + '</td></tr>';
      const status = matches ? "Agrees" : "Differs";
      const announce = "Level-7 image " + pair(image) + ". " + (matches ? "Prescribed label recovered." : "Prescribed label differs.");
      return '<table class="carry-table" data-announcement="' + announce + '"><caption>Coordinates on the square elliptic curve</caption>' +
        '<thead><tr><th scope="col">Quantity</th><th scope="col">Pair</th></tr></thead><tbody>' +
        row("Lift <var>x + 7y</var>", lift) + row("Point at level 14", point) + row("Change at level 14", shift) +
        row("Image at level 7", image) + row("Prescribed at level 7", label) + '</tbody></table>' +
        metrics([["Marking", status]]);
    }
    if (id === "ramified-residues") {
      const index = key => ramifiedCoordinates.findIndex(option => option[0] === key);
      const value = pair => "(" + pair.map(i => ramifiedCoordinates[i][1]).join(", ") + ")";
      const x = [index(v.first), index(v.second)];
      const splitting = v.relation === "split";
      const tests = {
        generate: ["ex = au", "x ∈ 𝔴/(2)", "x mod 𝔴"],
        project: ["ex = du", "ax = 0", "ax"],
        split: ["x = au + (1 − e)v", "dx = 0", "dx"],
      };
      const [equation, hypothesis, quantity] = tests[v.relation];
      const product = ramifiedProduct([2, 0], x);
      const atPlace = x[0] % 2;
      const generating = v.relation === "generate";
      const holds = generating ? atPlace === 0 : product[0] === 0;
      const count = holds ? (splitting ? 32 : 8) : 0;
      const u = holds ? value([Math.floor(x[0] / 2), 0]) : "None";
      const row = (key, shown) => '<tr><th scope="row"><var>' + key + '</var></th><td>' + shown + '</td></tr>';
      const announcement = (holds ? "Hypothesis satisfied. " : "Hypothesis fails. ") + count +
        (splitting ? " ordered pairs." : " witnesses.");
      const table = '<table class="carry-table" data-announcement="' + announcement + '">' +
        '<caption>' + equation + ' in S × S</caption><thead><tr><th scope="col">Quantity</th><th scope="col">Value</th></tr></thead><tbody>' +
        row("x", value(x)) + row(quantity, generating ? String(atPlace) : value(product)) +
        row("u", u) + (splitting ? row("v", holds ? value([0, x[1]]) : "None") : "") + '</tbody></table>';
      return table + metrics([["Hypothesis <var>" + hypothesis + "</var>", holds ? "Holds" : "Fails"],
        [splitting ? "Ordered pairs (u, v)" : "Witnesses u", String(count)]]);
    }
    if (id === "polarized-graph") {
      const prime = Number(v.prime);
      const [a, b] = {same: [1, 1], first: [1, 0], opposite: [1, -1], zero: [0, 0]}[v.direction];
      const residue = (b - a + prime) % prime;
      const first = a ? "f₂" : "0";
      const second = b === 0 ? "0" : b === 1 || prime === 2 ? "f₁" : "−f₁";
      let firstCoefficient = first;
      if (v.lift === "unit") firstCoefficient = a ? "e₁ + f₂" : "e₁";
      const isotropic = residue === 0 ? "Yes" : "No";
      const field = {2: "𝔽₂", 3: "𝔽₃", 5: "𝔽₅"}[prime];
      const difference = (b < 0 ? "−1" : b) + " − " + a + " ≡ " + residue;
      const table = '<table class="carry-table" data-announcement="Pairing coefficient ' + residue +
        ' modulo ' + prime + '. ' + (residue ? 'The pairing is nonzero.' : 'The plane is isotropic.') + '">' +
        '<caption>First-order lifts over ' + field + '[ε]/(ε²)</caption>' +
        '<thead><tr><th scope="col">At ε = 0</th><th scope="col">ε term</th><th scope="col">Class modulo Fil</th></tr></thead><tbody>' +
        '<tr><th scope="row"><var>e₁</var></th><td><var>' + firstCoefficient + '</var></td><td>[<var>' + first + '</var>]</td></tr>' +
        '<tr><th scope="row"><var>e₂</var></th><td><var>' + second + '</var></td><td>[<var>' + second + '</var>]</td></tr></tbody></table>';
      return table + metrics([["Pairing coefficient <var>b</var> − <var>a</var> in " + field, difference], ["Isotropic plane", isotropic]]);
    }
    if (id === "ordinary-frobenius-coefficients") {
      const degree = Number(v.degree);
      const [coefficient, cube] = {one: ["1", "1"], omega: ["ω", "−ω"], sum: ["1 + ω", "1 − ω"]}[v.coefficient];
      function term(c, variable) {
        if (!variable) return c;
        if (c === "1") return variable;
        if (c.includes(" ")) return "(" + c + ")" + variable;
        return c + variable;
      }
      const input = term(coefficient, ["", "t", "t²", "t³"][degree]);
      const restriction = degree < 2 ? term(coefficient, degree ? "ε" : "") : "0";
      const image = degree < 2 ? term(cube, degree ? "t³" : "") : "0";
      return '<table class="carry-table" data-announcement="Restriction ' + restriction + '. Cube ' + image + '.">' +
        '<caption>One term under the two ring maps</caption>' +
        '<thead><tr><th scope="col">Step</th><th scope="col">Ring</th><th scope="col">Term</th></tr></thead><tbody>' +
        '<tr><th scope="row">Input</th><td>𝔽₉[t]/(t⁴)</td><td>' + input + '</td></tr>' +
        '<tr><th scope="row">Restrict by τ</th><td>𝔽₉[ε]/(ε²)</td><td>' + restriction + '</td></tr>' +
        '<tr><th scope="row">Apply j</th><td>𝔽₉[t]/(t⁴)</td><td>' + image + '</td></tr></tbody></table>';
    }
    if (id === "ordinary-torsion-reduction") {
      const q = Number(v.q);
      const e = Number(v.e);
      const firstDegree = Math.ceil(e / q);
      const count = q ** (e - firstDegree);
      const form = firstDegree === e ? "0" : "a multiple of ε" +
        (firstDegree === 1 ? "" : "<sup>" + firstDegree + "</sup>");
      return '<table class="carry-table" data-announcement="' + count +
        (count === 1 ? ' solution' : ' solutions') + ' in the test ring. Local length ' + q + '.">' +
        '<caption>First coordinates above the label 1</caption>' +
        '<colgroup><col style="width:28%"><col style="width:47%"><col style="width:25%"></colgroup>' +
        '<thead><tr><th scope="col">Test</th><th scope="col">Condition</th><th scope="col">Count</th></tr></thead><tbody>' +
        '<tr><th scope="row">Generic field</th><td><var>X</var><sup>' + q + '</sup> = 1</td><td>' + q + '</td></tr>' +
        '<tr><th scope="row">Residue field</th><td><var>X</var> = 1</td><td>1</td></tr>' +
        '<tr><th scope="row">Test ring</th><td><var>X</var> = 1 + <var>t</var>, with <var>t</var> ' +
        (form === "0" ? "= 0" : form) + '</td><td>' + count + '</td></tr></tbody></table>' +
        metrics([["Local length", String(q)], ["Free coefficients of t", String(e - firstDegree)]]);
    }
    if (id === "ordinary-line-cancellation") {
      const q = Number(v.q);
      const r = Number(v.r);
      const points = ["P₀", "P₁", "P₂"];
      const lifts = [q ** r, 1];
      const columns = [r, r + 1].map((j, start) => ({
        j, parity: j % 2 ? "Odd" : "Even", count: lifts[start],
        weight: q ** (j * (j - 1) / 2), start: points[start],
        steps: 3 - j, arrival: points[(start + 3 - j) % points.length],
      }));
      const rows = [
        ["Dimension j", "j"], ["Parity", "parity"], ["Number of lifts", "count"],
        ["Weight per lift", "weight"], ["Starting point", "start"],
        ["Remaining steps", "steps"], ["Final point", "arrival"],
      ].map(([label, key]) => '<tr><th scope="row">' + label + '</th>' +
        columns.map(column => '<td>' + column[key] + '</td>').join("") + '</tr>');
      const table = '<table class="carry-table"><caption>Lifts above the chosen subspace</caption>' +
        '<colgroup><col style="width:40%"><col style="width:28%"><col style="width:32%"></colgroup>' +
        '<thead><tr><th scope="col">Property</th><th scope="col">Graphs</th><th scope="col">Full preimage</th></tr></thead>' +
        '<tbody>' + rows.join("") + '</tbody></table>';
      const ordered = r % 2 ? [columns[1], columns[0]] : columns;
      return table + metrics(ordered.map(column =>
        [column.parity + " weight at " + column.arrival, String(column.count * column.weight)]));
    }
    if (id === "clopen-branch-reduction") {
      const distance = v.model === "product" ? 1 : 5;
      const roots = [0, distance];
      const specialRoots = roots.map(x => x % 5);
      const extendsOverR = distance % 5 !== 0;
      const rows = roots.map((root, i) =>
        '<tr><th scope="row">' + (i === 0 ? "Selected" : "Other") +
        '</th><td>' + root + '</td><td>' + specialRoots[i] + '</td></tr>');
      const table = '<table class="carry-table"><caption>Specialization of the two branches</caption>' +
        '<thead><tr><th scope="col">Branch</th><th scope="col"><var>X</var> over ℚ</th>' +
        '<th scope="col"><var>X</var> modulo 5</th></tr></thead><tbody>' + rows.join("") + '</tbody></table>';
      const specialFibre = new Set(specialRoots).size === 2
        ? "Two reduced points" : "One double point";
      return table + metrics([
        ["Projector over ℚ", "1 − <var>X</var>" + (distance === 1 ? "" : "/" + distance)],
        ["Extends over <var>R</var>?", extendsOverR ? "Yes" : "No"],
        ["Special fibre", specialFibre],
      ]) + (extendsOverR
        ? "<p>Modulo 5 the projector still has values (1, 0) on the two points.</p>"
        : "<p>In the special fibre, <var>X</var> is nonzero and <var>X</var>² = 0. The two generic points specialize to the same point.</p>");
    }
    if (id === "quadratic-place-restrictions") {
      const root = Number(v.root);
      const square = (root * root) % 17;
      const real = ((root - root ** 3) % 17 + 17) % 17;
      const sameQuadratic = square === 4;
      const sameReal = real === 11;
      const table = '<table class="carry-table"><caption>Generator residues modulo 17</caption>' +
        '<thead><tr><th scope="col">Place</th><th scope="col">ζ</th><th scope="col">ζ²</th><th scope="col">ζ + ζ⁻¹</th></tr></thead>' +
        '<tbody><tr><th scope="row">Type</th><td>2</td><td>4</td><td>11</td></tr>' +
        '<tr><th scope="row">Candidate</th><td>' + root + '</td><td>' + square + '</td><td>' + real + '</td></tr></tbody></table>';
      return table + metrics([
        ["Imaginary quadratic prime", sameQuadratic ? "Same" : "Different"],
        ["Real prime", sameReal ? "Same" : "Different"],
        ["Both field conditions", sameQuadratic && !sameReal ? "Satisfied" : "Fail"],
      ]);
    }
    if (id === "weight-circle-spectrum") {
      const monomials = ["e₂³", "e₁e₂²", "e₁²e₂", "e₁³"];
      const coefficients = {sum: [1, 1, 1, 1], highest: [0, 0, 0, 1], lowest: [1, 0, 0, 0]}[v.vector];
      const secondCoordinate = v.circle === "t2" ? 1 : 0;
      const determinantExponent = 1 + secondCoordinate;
      const exponents = monomials.map((_, j) => j + (3 - j) * secondCoordinate - determinantExponent);
      const present = new Set();
      const rows = monomials.map((monomial, j) => {
        if (coefficients[j]) present.add(exponents[j]);
        return '<tr><th scope="row"><var>' + monomial + '</var></th><td>' + String(exponents[j]).replace("-", "−") +
          '</td><td>' + coefficients[j] + '</td></tr>';
      });
      const table = '<table class="carry-table"><caption>Monomial coordinates of the selected vector</caption>' +
        '<thead><tr><th scope="col">Monomial</th><th scope="col">Exponent</th><th scope="col">Coefficient</th></tr></thead><tbody>' +
        rows.join("") + '</tbody></table>';
      const bound = 2 - secondCoordinate;
      return table + metrics([
        ["Exponents present", "{" + [...present].join(", ").replace("-", "−") + "}"],
        ["Upper bound <var>s</var><sub>" + (v.circle === "t1" ? "1" : "2") + "</sub>(κ)", String(bound)],
        ["Exponent of the highest vector", String(exponents[3])],
      ]);
    }
    if (id === "hecke-four-point-approximation") {
      const powers = [[1, 0], [0, 1], [-1, 0], [0, -1]];
      const normText = new Map([[0, "0"], [1/4, "1/2"], [1/2, "1/√2"]]);
      let maxSquaredError = 0;
      const rows = powers.map(([real, imaginary], h) => {
        // If χ(h) = a + bi, the specified linear combination has value a + b.
        let x = real, y = imaginary;
        if (v.witness === "inverse") y = -imaginary;
        if (v.witness === "combination") {
          x = real + imaginary;
          y = 0;
        }
        const fieldNorm = (1 - x) ** 2 + y ** 2;
        // Here every nonzero field norm is a power of two, so |N|₂ = 1/N.
        const squaredError = fieldNorm === 0 ? 0 : 1 / fieldNorm;
        maxSquaredError = Math.max(maxSquaredError, squaredError);
        return '<tr><th scope="row">' + h + '</th><td>' + complexFraction(x, y, 1) +
          '</td><td>' + complexFraction(1 - x, -y, 1) + '</td><td>' + normText.get(squaredError) + '</td></tr>';
      });
      const table = '<table class="carry-table"><caption>Distance from 1 at each element of C₄</caption>' +
        '<thead><tr><th scope="col"><var>h</var></th><th scope="col">φ(<var>h</var>)</th>' +
        '<th scope="col">1 − φ(<var>h</var>)</th><th scope="col">|1 − φ(<var>h</var>)|₂</th></tr></thead><tbody>' +
        rows.join("") + '</tbody></table>';
      return table + metrics([["Largest 2-adic error", normText.get(maxSquaredError)], ["Radius of the closed ball", "1/√2"],
        ["Comparison with the radius", maxSquaredError === 1/2 ? "Equal" : "Strictly smaller"]]);
    }
    if (id === "rank-weight-projectors") {
      const weights = [0, 1, v.weights === "separated" ? 4 : 2];
      const repeated = {low: 0, middle: 1, high: 2}[v.repeated];
      const diagonal = weights.flatMap((h, i) => i === repeated ? [h, h] : [h]);
      const projectors = weights.map(h => {
        const other = weights.filter(k => k !== h);
        const denominator = other.reduce((p, k) => p * (h - k), 1);
        return diagonal.map(x => other.reduce((p, k) => p * (x - k), 1) / denominator);
      });
      const ranks = projectors.map(entries => entries.reduce((s, x) => s + x, 0));
      const total = diagonal.map((_, i) => projectors.reduce((s, entries) => s + entries[i], 0));
      const row = (label, entries, rank) => '<tr><th scope="row">' + label + '</th><td>(' +
        entries.join(', ') + ')</td><td>' + rank + '</td></tr>';
      const table = '<table class="carry-table"><caption>Projectors for <var>D</var> = diag(' + diagonal.join(', ') +
        ')</caption><thead><tr><th scope="col">Operator</th><th scope="col">Diagonal</th>' +
        '<th scope="col">Rank</th></tr></thead><tbody>' +
        projectors.map((p, i) => row('<var>P<sub>' + weights[i] + '</sub></var>', p, ranks[i])).join('') +
        row('Sum', total, total.reduce((s, x) => s + x, 0)) + '</tbody></table>';
      const blocks = [];
      let dimension = 0;
      for (const [source, k] of weights.entries()) {
        const target = weights.indexOf(k + 1);
        if (target < 0) continue;
        blocks.push(k + ' → ' + weights[target]);
        dimension += ranks[source] * ranks[target];
      }
      return table + metrics([
        ["Distinct projectors", String(projectors.length)],
        ["Weight blocks with difference +1", blocks.join(' and ')],
        ["Dimension of the +1 commutator eigenspace", String(dimension)],
      ]);
    }
    if (id === "polynomial-cut") {
      const degree = Number(v.power), cut = v.filter === "cut";
      const atZero = degree === 0 ? 1 : 0;
      const target = 5 ** degree;
      const sum = cut ? 10 ** degree : (atZero + 10 ** degree) / 2;
      let magnitude = Math.abs(target - sum), denominator = 1;
      while (magnitude > 0 && magnitude % 5 === 0) {
        magnitude /= 5;
        denominator *= 5;
      }
      const table = '<table class="carry-table"><caption>Evaluation at each point</caption>' +
        '<thead><tr><th scope="col">Point</th><th scope="col">Weight</th><th scope="col">Value of <var>P</var></th></tr></thead><tbody>' +
        '<tr><th scope="row">0</th><td>' + (cut ? "0" : "1/2") + '</td><td>' + atZero + '</td></tr>' +
        '<tr><th scope="row">10</th><td>' + (cut ? "1" : "1/2") + '</td><td>' + 10 ** degree + '</td></tr></tbody></table>';
      return table + metrics([["Target P(5)", String(target)], ["Weighted sum", String(sum)],
        ["5-adic error", magnitude === 0 ? "0" : reducedFraction(1, denominator)]]);
    }
    if (id === "satake-multiplicities") {
      const roots = v.roots === "primes" ? [2, 3, 5] : [1, 2, 4];
      const mult = {middle: [0, 3, 0], simple: [1, 1, 1], first: [2, 1, 0]}[v.candidate];
      const product = counts => roots.reduce((value, root, i) => value * root ** counts[i], 1);
      const target = product([1, 1, 1]), passing = [];
      for (let a = 0; a <= 3; a++) for (let b = 0; b <= 3 - a; b++) {
        const candidate = [a, b, 3 - a - b];
        if (product(candidate) === target) passing.push("(" + candidate.join(",") + ")");
      }
      const trace = roots.reduce((value, root, i) => value + root * mult[i], 0);
      const table = '<table class="carry-table"><caption>Local data for the three eigenvalues</caption>' +
        '<thead><tr><th scope="col">Quantity</th><th scope="col">Prescribed</th><th scope="col">Candidate</th></tr></thead><tbody>' +
        '<tr><th scope="row">Multiplicities</th><td>(1,1,1)</td><td>(' + mult.join(",") + ')</td></tr>' +
        '<tr><th scope="row">Determinant</th><td>' + target + '</td><td>' + product(mult) + '</td></tr>' +
        '<tr><th scope="row">Trace</th><td>' + roots.reduce((s, r) => s + r, 0) + '</td><td>' + trace + '</td></tr></tbody></table>';
      return table + metrics([["All triples with the prescribed determinant", passing.join(" or ")],
        ["Candidate has prescribed polynomial", mult.every(count => count === 1) ? "Yes" : "No"]]);
    }
    if (id === "column-degree-defect") {
      const modes = Number(v.modes), mass = Number(v.mass);
      const elements = [[0, 0], [0, 1], [1, 0], [1, 1]];
      const numerators = elements.map(([a, b]) =>
        [1, (-1) ** a, (-1) ** b].slice(0, modes).reduce((sum, character) => sum + character, 0));
      const mean = numerators.reduce((sum, z) => sum + z, 0) / elements.length;
      const rows = elements.map(([a, b], i) => '<tr><th scope="row" class="math-coordinates">(' + a + ',' + b + ')</th><td>' +
        reducedFraction(numerators[i], mass) + '</td><td>' + reducedFraction(mean, mass) +
        '</td><td>' + reducedFraction(numerators[i] - mean, mass) + '</td></tr>');
      const table = '<table class="carry-table"><caption>Evaluation at the identity and its projection</caption>' +
        '<thead><tr><th scope="col">(<var>a</var>,<var>b</var>)</th><th scope="col"><var>w</var></th><th scope="col"><var>Ew</var></th><th scope="col"><var>w − Ew</var></th></tr></thead>' +
        '<tbody>' + rows.join("") + '</tbody></table>';
      const norm = center => reducedFraction(numerators.reduce((sum, z) => sum + (z - center) ** 2, 0), 4 * mass);
      return table + metrics([["Squared norm of <var>w</var>", norm(0)], ["Formal degree of the constants", reducedFraction(1, mass)],
        ["Excess squared norm", norm(mean)]]);
    }
    if (id === "frobenius-good-places") {
      const prime = Number(v.prime);
      const residues = new Set(Array.from({length: prime}, (_, r) => r * r % prime));
      const realSplits = residues.has(5 % prime);
      const squareMinusOne = residues.has(prime - 1);
      const degree = realSplits && squareMinusOne ? 1 : 2;
      const relativeSplit = !realSplits || squareMinusOne;
      const good = relativeSplit && squareMinusOne;
      const norm = prime ** degree;
      const inverse = [1, 2, 3, 4, 5, 6].find(k => (k * norm) % 7 === 1);
      const excluded = v.omit === "61" && prime === 61;
      const rows = [
        ["Split over the real subfield?", relativeSplit ? "Yes" : "No"],
        ["Is −1 a square in ℚ<sub>" + prime + "</sub>?", squareMinusOne ? "Yes" : "No"],
        ["Absolute norm", String(norm)],
        ["Arithmetic exponent mod 7", String(norm % 7)],
        ["Inverse exponent mod 7", String(inverse)],
      ];
      const table = '<table class="carry-table"><caption>A place above ' + prime +
        '</caption><thead><tr><th scope="col">Local test</th><th scope="col">Value</th></tr></thead><tbody>' +
        rows.map(([label, value]) => '<tr><th scope="row">' + label + '</th><td>' + value + '</td></tr>').join("") +
        '</tbody></table>';
      const outcome = excluded ? "Excluded" : !good ? "Outside the good set" :
        inverse === 3 ? "Witness" : "Different exponent";
      return table + metrics([["Absolute residue degree", String(degree)], ["Test after exclusions", outcome]]);
    }
    if (id === "casimir-cutoff") {
      const a = Number(v.amplitude), b = Number(v.outer);
      const denominators = [1, 2, 1 + b * b];
      const trial = [a, 1, 1];
      const rows = [
        ["<var>U/R</var>", [0, 1, b]],
        ["<var>T</var>", denominators.map(d => reducedFraction(1, d))],
        ["<var>P</var>", denominators.map(d => reducedFraction(Math.max(2 - d, 0), 2 * d))],
        ["<var>N</var>", denominators.map(d => reducedFraction(Math.max(d - 2, 0), 2 * d))],
        ["Axis in ker <var>N</var>?", denominators.map(d => d <= 2 ? "Yes" : "No")],
        ["Trial <var>y</var>", trial],
        ["Witness <var>Py</var>", denominators.map((d, i) => reducedFraction(trial[i] * Math.max(2 - d, 0), 2 * d))],
      ];
      const table = '<table class="carry-table"><caption>Diagonal actions and vector coordinates</caption>' +
        '<thead><tr><th scope="col">On each axis</th><th scope="col"><var>e₁</var></th><th scope="col"><var>e₂</var></th><th scope="col"><var>e₃</var></th></tr></thead><tbody>' +
        rows.map(([name, entries]) => '<tr><th scope="row">' + name + '</th>' +
          entries.map(entry => "<td>" + entry + "</td>").join("") + "</tr>").join("") + "</tbody></table>";
      const normSquared = a * a + 2;
      const commonDenominator = 2 * denominators[2];
      const meanT = reducedFraction(a * a * commonDenominator + denominators[2] + 2, normSquared * commonDenominator);
      return table + metrics([["Mean of <var>U/R</var> (≤ 1/2)", reducedFraction(1 + b, normSquared)], ["Mean of <var>T</var> (≥ 3/4)", meanT]]);
    }
    if (id === "galois-character-peeling") {
      const [a, b] = v.element.split("").map(Number);
      const alpha = (-1) ** a, beta = (-1) ** b;
      const betaComponent = v.candidate === "mixed" ? 1 : 0;
      const formatVector = (x, y) => "(" + String(x).replace("-", "−") + ", " + String(y).replace("-", "−") + ")";
      const actual = formatVector(alpha, beta * betaComponent);
      const target = formatVector(alpha, alpha * betaComponent);
      const elements = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const passed = elements.filter(([u, w]) => (-1) ** u * betaComponent === (-1) ** w * betaComponent).length;
      return '<table class="carry-table"><caption>Coordinates on the α-line and the added β-line</caption><tbody>' +
        '<tr><th scope="row">Test vector <var>v</var></th><td>' + formatVector(1, betaComponent) + '</td></tr>' +
        '<tr><th scope="row">Actual image <var>ρ(g)v</var></th><td>' + actual + '</td></tr>' +
        '<tr><th scope="row">Required image <var>α(g)v</var></th><td>' + target + '</td></tr></tbody></table>' +
        metrics([["At the selected element", actual === target ? "Equal" : "Different"], ["Elements satisfying the test", passed + " of 4"]]);
    }
    if (id === "regular-unit-shift") {
      const original = [6000 + Number(v.gap), 6000, 0];
      const selected = Number(v.position) - 1;
      const shifted = original.map((weight, i) => weight - Number(i === selected));
      const regular = shifted.every((weight, i) => i === 0 || shifted[i - 1] > weight);
      let numerator = 1, denominator = 1;
      for (let i = 0; i < original.length; i++) {
        if (i === selected) continue;
        const difference = original[selected] - original[i];
        numerator *= difference - 1;
        denominator *= difference;
      }
      const residue = reducedFraction(numerator * Math.sign(denominator), Math.abs(denominator));
      const cells = weights => weights.map(weight => "<td>" + weight + "</td>").join("");
      const table = '<table class="carry-table"><caption>Weights in decreasing position order</caption><thead><tr><th scope="col">Parameter</th><th scope="col">1 (+)</th><th scope="col">2 (+)</th><th scope="col">3 (−)</th></tr></thead><tbody>' +
        '<tr><th scope="row">Original</th>' + cells(original) + '</tr><tr><th scope="row">After lowering</th>' + cells(shifted) + '</tr></tbody></table>';
      return table + metrics([["Shifted model", regular ? "Regular" : "Two equal entries"], ["Differential eigenvalue", regular ? String(original[selected] + 1) : "No summand"], ["Partial-trace scalar", residue]]);
    }
    if (id === "hyperplane-mass-stratum") {
      const prime = Number(v.prime);
      const [a, b] = {11: [3, 1], 59: [3, 5], 83: [9, 1]}[prime];
      const d = prime * prime;
      const tilted = v.plane === "defect";
      const m = tilted ? d : 1;
      const secondVector = tilted ? a + "e₂ + " + (b === 1 ? "" : b) + "(1+i)e₃" : "e₂";
      return '<table class="carry-table"><caption>One plane in the standard three-dimensional space</caption><tbody>' +
        '<tr><th scope="row">Second spanning vector</th><td>' + secondVector + '</td></tr>' +
        '<tr><th scope="row">Discriminant order <var>d</var>²</th><td>' + d * d + '</td></tr>' +
        '<tr><th scope="row">Bad-place product <var>m</var></th><td>' + m + '</td></tr>' +
        '<tr><th scope="row">Index <var>d/m</var></th><td>' + d / m + '</td></tr></tbody></table>' +
        metrics([["Mass bound per label, divided by B", reducedFraction(1, m * m)], ["Upper bound on label count", String(m * m)]]);
    }
    if (id === "gluing-residues") {
      const T = Number(v.weight), s = Number(v.first), t = Number(v.second);
      const denominator = T + 1;
      const residue = value => ((value % denominator) + denominator) % denominator;
      const values = [["On <var>u</var>", s + T * t], ["On <var>w</var>", t - s]];
      const rows = values.map(([label, value]) =>
        '<tr><th scope="row">' + label + '</th><td>' + reducedFraction(value, denominator) + '</td>' +
        '<td>' + reducedFraction(residue(value), denominator) + '</td></tr>').join("");
      return '<table class="carry-table"><caption>The two line coordinates</caption><thead><tr><th scope="col">Line</th>' +
        '<th scope="col">Coefficient</th><th scope="col">Residue</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        metrics([["Glue classes on the integer slice", String(denominator)], ["Sum of the coefficients", String(t)]]);
    }
    if (id === "rational-line-orbit") {
      const triples = {axis: [1, 0, 1], thirds: [3, 4, 5], fifths: [5, 12, 13], eighths: [8, 15, 17]};
      const [a, b, q] = triples[v.line];
      const origin = [48, 148], radius = 106;
      const x = origin[0] + radius, y = origin[1];
      const endX = origin[0] + radius * a / q, endY = y - radius * b / q;
      const chosen = v.line === "axis" ? "x = y" : "y";
      const plot = '<svg class="plot" viewBox="0 0 222 175" role="img" aria-label="Unit vectors x and y in the rational coordinate plane">' +
        '<path d="M48 21 V148 H189 M48 42 A106 106 0 0 1 154 148" fill="none" stroke="currentColor" opacity=".3"/>' +
        '<path d="M48 148 H154" fill="none" stroke="currentColor" stroke-width="2"/>' +
        '<path d="M' + x + ' ' + y + ' L' + endX + ' ' + endY + '" fill="none" stroke="currentColor" stroke-dasharray="3 4"/>' +
        '<path d="M48 148 L' + endX + ' ' + endY + '" fill="none" stroke="#976342" stroke-width="2"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="3" fill="currentColor"/><circle cx="' + endX + '" cy="' + endY + '" r="4" fill="#976342"/>' +
        '<text x="34" y="163">0</text>' + (v.line === "axis" ? "" : '<text x="160" y="164">x</text>') +
        '<text x="' + (endX + 7) + '" y="' + (endY - 5) + '">' + chosen + '</text></svg>';
      return plot + metrics([
        ["Integral generator on this line", "(" + a + ", " + b + ")"],
        ["Squared length of that generator", String(a * a + b * b)],
        ["Index inside the unit-vector lattice", q === 1 ? "1" : q + "<sup>D</sup>"],
      ]);
    }
    if (id === "parabolic-shell") {
      const places = Number(v.degree), rank = Number(v.rank), step = Number(v.stretch);
      const horizontal = 2 * places * rank * step;
      const central = 2 * places * step;
      const power = exponent => exponent < 0 ? "1/" + 2 ** -exponent : String(2 ** exponent);
      const additive = power(horizontal + central);
      const density = power(-horizontal - central);
      return '<table class="carry-table"><caption>Factors relative to the original box</caption>' +
        '<thead><tr><th scope="col">Move</th><th scope="col">Additive</th><th scope="col">Density</th><th scope="col">Mass</th></tr></thead>' +
        '<tbody><tr><th scope="row">Scalar only</th><td>1</td><td>' + density + '</td><td>' + density + '</td></tr>' +
        '<tr><th scope="row">Left translate</th><td>' + additive + '</td><td>' + density + '</td><td>1</td></tr></tbody></table>' +
        metrics([["Horizontal volume in the translate", power(horizontal)], ["Central volume in the translate", power(central)]]);
    }
    if (id === "cartan-power") {
      const s = Number(v.scale) * Math.LN2;
      const squareDistance = 2 * s * s;
      const logFrobenius = 0.5 * Math.log(2 + Math.exp(2 * s) + Math.exp(-2 * s));
      const logCartanBound = -8000 * Math.min(squareDistance, s);
      const logPowerBound = 6400 - 640 * logFrobenius;
      const formatLog = value => value.toFixed(2).replace(/^-/, "−");
      const plotX = exponent => 49 + 8 * exponent;
      const plotY = bound => 54 - 0.006 * bound;
      const curve = Array.from({length: 65}, (_, index) => {
        const exponent = index / 2;
        const stretch = 2 ** exponent;
        const bound = 6400 - 640 * Math.log(stretch + 1 / stretch);
        return (index ? "L" : "M") + plotX(exponent) + " " + plotY(bound);
      }).join(" ");
      const ticks = [0, 8, 16, 24, 32].map(exponent =>
        '<text text-anchor="middle" x="' + plotX(exponent) + '" y="116">' + exponent + '</text>').join("");
      const plot = '<svg class="plot" viewBox="-3 -5 336 149" role="img" aria-label="Log of the Frobenius power bound by exponent of the largest singular value">' +
        '<text x="4" y="22">6000</text><text x="26" y="58">0</text><text x="0" y="95">−6000</text>' +
        '<path d="M49 12 V102 H305 M49 54 H305" fill="none" stroke="currentColor" opacity=".4"/>' +
        '<path d="' + curve + '" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<circle cx="' + plotX(Number(v.scale)) + '" cy="' + plotY(logPowerBound) + '" r="4" fill="#976342"/>' +
        ticks + '<text text-anchor="middle" x="177" y="134">Exponent of 2</text></svg>';
      return plot + metrics([
        ["Unitarity", "0.00"],
        ["From the weighted minors", formatLog(logCartanBound)],
        ["From the Frobenius power", formatLog(logPowerBound)],
      ]);
    }
    if (id === "convex-nerve-cut") {
      const cut = Number(v.cut);
      const intervals = [["A", 0, 1], ["B", 1, 3], ["C", 3, 4]];
      const faces = [...intervals];
      for (const [index, [name, low, high]] of intervals.entries()) {
        for (const [other, start, end] of intervals.slice(index + 1)) {
          if (Math.max(low, start) <= Math.min(high, end)) {
            faces.push([name + other, Math.max(low, start), Math.min(high, end)]);
          }
        }
      }
      const touching = (low, high) => faces.filter(([, a, b]) => a <= high && low <= b)
        .map(([label]) => label).join(", ");
      const x = t => 38 + 65 * t;
      const lines = intervals.map(([label, start, end], index) => {
        const y = 23 + index * 27;
        return '<text x="10" y="' + (y + 4) + '">' + label + '</text>' +
          '<path d="M' + x(start) + ' ' + y + ' H' + x(end) + '" stroke="currentColor" stroke-width="2"/>' +
          [start, end].map(t => '<circle cx="' + x(t) + '" cy="' + y + '" r="3" fill="currentColor"/>').join('');
      }).join('');
      const ticks = [0, 1, 2, 3, 4].map(t =>
        '<text text-anchor="middle" x="' + x(t) + '" y="105">' + t + '</text>').join('');
      return '<svg class="plot" viewBox="0 0 330 112" role="img" aria-label="Three closed intervals with a cut at ' + cut + '">' +
        lines + '<path d="M' + x(cut) + ' 8 V89" stroke="#976342" stroke-dasharray="4 3"/>' + ticks + '</svg>' +
        metrics([["Left half", touching(0, cut)], ["On the slice", touching(cut, cut)], ["Right half", touching(cut, 4)]]);
    }
    if (id === "split-gram-phases") {
      const a = Number(v.first), b = Number(v.second);
      const phases = [["1", 1, 1], ["−1", 4, 4], ["i", 2, 3], ["−i", 3, 2]];
      const mod5 = value => ((value % 5) + 5) % 5;
      const usable = [];
      const rows = phases.map(([label, first, second]) => {
        const left = mod5(1 - second * a), right = mod5(1 - first * b);
        const norm = mod5(left * right);
        if (norm !== 0) usable.push(label);
        return '<tr><th scope="row">' + label + '</th><td>(' + left + ', ' + right +
          ')</td><td>' + norm + '</td></tr>';
      });
      return '<table class="carry-table"><caption>Residues at <var>t</var> = (' + a + ', ' + b +
        ')</caption><thead><tr><th scope="col">Phase</th><th scope="col">Denominator <var>δ</var></th>' +
        '<th scope="col">Norm</th></tr></thead><tbody>' + rows.join("") + '</tbody></table>' +
        metrics([["Usable phases", usable.join(", ")], ["Total", usable.length + " of 4"]]);
    }
    if (id === "marked-ideal-weight") {
      const rank = Number(v.rank);
      const norm = Number(v.norm);
      const scale = Number(v.scale);
      const quotientArea = scale ** 2;
      const fullArea = reducedFraction(quotientArea, norm);
      const rowDenominator = norm ** (rank - 1) * quotientArea;
      const quantities = [
        ["Marked line", reducedFraction(1, norm)],
        ["Quotient lattice", String(quotientArea)],
        ["Full lattice", fullArea],
        ["Integral rows", reducedFraction(1, rowDenominator)],
      ];
      const rows = quantities.map(([label, area]) =>
        '<tr><th scope="row">' + label + '</th><td>' + area + '</td></tr>'
      ).join("");
      return '<table class="carry-table"><caption>Gaussian covolumes in rank ' + rank +
        '</caption><thead><tr><th scope="col">Lattice</th><th scope="col">Covolume</th></tr></thead><tbody>' +
        rows + '</tbody></table>' + metrics([
          ["Ideal norm N", String(norm)],
          ["Rows × full lattice", reducedFraction(quotientArea, rowDenominator * norm)],
        ]);
    }
    if (id === "progression-difference") {
      const y = Number(v.y);
      const {u, rows} = progressionDifference(y, Number(v.width), v.chi);
      const sharp = new Map();
      const tail = [];
      let difference = 0;
      const body = rows.map(({n, prime, character, top, bottom}) => {
        const term = {prime, top: character * top, bottom};
        if (prime && n <= y) sharp.set(prime, (sharp.get(prime) || 0) + character);
        if (n > y) tail.push(term);
        if (prime) difference += term.top / bottom * Math.log(prime);
        const weight = reducedFraction(top, bottom);
        return '<tr><th scope="row">' + n + '</th><td>' + (prime ? 'log ' + prime : '0') +
          '</td><td>' + (character < 0 ? "−1" : character) + '</td><td>' + weight +
          '<meter aria-hidden="true" min="0" max="1" value="' + top / bottom +
          '" style="display:block;width:3em;max-width:100%;margin-left:auto"></meter></td><td>' +
          logSum([term]) + '</td></tr>';
      }).join("");
      const sharpTerms = Array.from(sharp, ([prime, top]) => ({prime, top, bottom: 1}));
      return '<table class="carry-table"><caption>Integer weights for y = ' + y + ', u = ' + u +
        '</caption><thead><tr><th scope="col"><var>n</var></th><th scope="col"><var>Λ(n)</var></th>' +
        '<th scope="col"><var>χ(n)</var></th><th scope="col">Weight</th><th scope="col">Signed term</th>' +
        '</tr></thead><tbody>' + body + '</tbody></table>' + metrics([
          ["Sharp sum", logSum(sharpTerms)], ["Short interval", logSum(tail)],
          ["Scaled difference ≈", difference.toFixed(4).replace("-", "−")],
        ]);
    }
    if (id === "flag-layer-exponents") {
      const n = Number(v.n);
      const jumps = v.jumps.split(",").map(Number);
      const depth = Number(v.depth);
      const totalRank = jumps.reduce((sum, rank) => sum + rank, 0);
      const sizeExponents = jumps.map((_, i) => (jumps.length - i) * depth);
      const shortBlocks = jumps.map((rank, i) => ({rank, heightExponent: 2 * rank * sizeExponents[i]}));
      const opposite = [...shortBlocks].reverse().map(block => ({
        rank: block.rank, heightExponent: -block.heightExponent,
      }));
      const blocks = [...shortBlocks, {rank: n - 2 * totalRank, heightExponent: 0}, ...opposite];
      let directions = 0, totalExponent = 0, rows = "";
      for (let layer = 1; layer < blocks.length; layer++) {
        let layerDirections = 0;
        const terms = [];
        for (let b = 0; b + layer < blocks.length; b++) {
          const left = blocks[b], right = blocks[b + layer];
          layerDirections += left.rank * right.rank;
          terms.push(left.heightExponent * right.rank - right.heightExponent * left.rank);
        }
        const exponent = terms.reduce((sum, term) => sum + term, 0);
        directions += layerDirections;
        totalExponent += exponent;
        rows += '<tr><th scope="row">' + layer + '</th><td>' + layerDirections +
          '</td><td>' + terms.join(' + ') + '</td><td>' + exponent + '</td></tr>';
      }
      const sizeLabels = sizeExponents.map(exponent => '1/' + (2 ** exponent));
      const half = totalExponent / 2;
      const product = half <= 12 ? '1/' + (2 ** half) : '2<sup>−' + half + '</sup>';
      return '<table class="carry-table"><caption>Sizes (' + sizeLabels.join(', ') +
        '), completed ranks (' + blocks.map(block => block.rank).join(', ') + ')</caption>' +
        '<thead><tr><th scope="col">Layer</th><th scope="col">Entries</th>' +
        '<th scope="col">Terms</th><th scope="col">Sum</th></tr></thead><tbody>' +
        rows + '</tbody></table>' + metrics([["Total directions d", directions],
          ["Exponent after the square root", totalExponent + '/2 = ' + half], ["Volume factor P", product]]);
    }
    if (id === "central-rounding") {
      const quarters = Number(v.quarters);
      const roundedHalf = Math.round(quarters / 8);
      const constructed = 2 * roundedHalf;
      const nearest = Math.round(quarters / 4);
      const distance = (point) => reducedFraction(Math.abs(quarters - 4 * point), 4);
      const pointX = (coefficient) => 85 + 165 * coefficient;
      const targetX = pointX(quarters / 4);
      const rows = [
        { y: 50, label: "After subtracting the adjoint", allowed: [0, 2], chosen: constructed },
        { y: 124, label: "All integral central coefficients", allowed: [0, 1, 2], chosen: nearest },
      ];
      const chart = rows.map(({ y, label, allowed, chosen }) => {
        const markers = allowed.map(point => '<circle cx="' + pointX(point) + '" cy="' + y +
          '" r="5" fill="var(--paper)" stroke="currentColor" stroke-width="2"/>').join("");
        return '<text x="12" y="' + (y - 20) + '">' + label + '</text>' +
          '<path d="M85 ' + y + 'H415" stroke="currentColor" fill="none"/>' + markers +
          '<path d="M' + targetX + ' ' + (y + 8) + 'v9H' + pointX(chosen) +
          '" stroke="var(--copper)" stroke-width="2" fill="none"/>' +
          '<path d="M' + (targetX - 4) + ' ' + (y - 10) + 'h8l-4 6z" fill="currentColor"/>';
      }).join("");
      const axis = [0, 1, 2].map(n => '<text x="' + pointX(n) + '" y="159" text-anchor="middle">' + n + '</text>').join("");
      const target = reducedFraction(quarters, 4);
      return '<svg class="chart" role="img" aria-label="The target coefficient ' + target +
        ' with the constructed point ' + constructed + ' and the nearest central point ' + nearest +
        '" viewBox="0 0 500 170"><title>Two choices of an integral central coefficient</title>' +
        chart + axis + '</svg>' + metrics([
          ["Constructed coefficient", String(constructed)], ["Its distance to t", distance(constructed)],
          ["Closest coefficient", String(nearest)], ["Minimum distance", distance(nearest)],
        ]);
    }
    if (id === "cusp-trace-mass") {
      const denom = Number(v.denom);
      const [a,b] = {flat:[1,1], tilted:[1,4], deep:[0,1]}[v.profile];
      const squared = (denom - 1) * a * a + b * b;
      const rows = [["Moderate",denom - 1,a], ["Deep",1,b]].map(([name,mass,value]) => {
        const power = value * value;
        return '<tr><th scope="row">' + name + '</th><td>' + reducedFraction(mass,denom) +
          '</td><td>' + reducedFraction(denom * power,squared) + '</td><td>' +
          reducedFraction(mass * power,squared) + '</td></tr>';
      }).join("");
      return '<table class="carry-table"><caption>Integrating a rank-one projection</caption><thead><tr>' +
        '<th scope="col">Region</th><th scope="col">Measure</th><th scope="col">Diagonal</th><th scope="col">Trace share</th>' +
        '</tr></thead><tbody>' + rows + '</tbody></table>' +
        metrics([["Total trace", "1"], ["Trace on the deep point", reducedFraction(b * b,squared)]]);
    }
    if (id === "minor-shells") {
      const last = Number(v.last);
      const rows = Array.from({length: last + 1}, (_, h) => {
        const {inner, outer, count, weight} = gaussianMinorShell(h);
        return '<tr><th scope="row">[' + inner + ', ' + outer + ')</th><td>' + count +
          '</td><td>' + weight.toFixed(3) + '</td><td>' + reducedFraction(count, inner ** 3) + '</td></tr>';
      }).join("");
      return '<table class="carry-table"><caption>Candidate minors and their cubic weights</caption>' +
        '<thead><tr><th scope="col">Size |<var>z</var>|</th><th scope="col">Count</th><th scope="col">Weight ≈</th>' +
        '<th scope="col">Bound</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        metrics([["First omitted size", 2 ** (last + 1)], ["All omitted weight ≤", reducedFraction(32, 2 ** (last + 1))]]);
    }
    if (id === "primitive-hyperplanes") {
      const types = primitiveHyperplanes(Number(v.norm));
      const total = types.reduce((sum, t) => sum+t.lines, 0);
      const body = types.map(t => '<tr><th scope="row" class="math-coordinates">' + t.pattern + '</th><td>' + t.lines +
        '</td><td>' + t.stabilizer + '</td></tr>').join("");
      return '<table class="carry-table"><caption>Normal lines grouped by lattice symmetries</caption>' +
        '<thead><tr><th scope="col">Coordinate norms</th><th scope="col">Lines</th><th scope="col">Stabilizer order</th></tr></thead><tbody>' +
        body + '</tbody></table>' + metrics([["By lines", total + '/384'], ["By orbits", types.map(t => '1/' + t.stabilizer).join(' + ')]]) +
        '<p>Both counts give <strong>' + reducedFraction(total,384) + '</strong> for this lattice.</p>';
    }
    if (id === "dyadic-unit-signs") {
      const shift = Number(v.shift), include = Number(v.unit), negative = Number(v.negative);
      const places = [1, 5, 7, 11];
      const values = places.map(t => {
        const residue = t * shift % 24;
        const translated = Math.floor(13 * residue / 24) % 2;
        return {t, pair:Math.min(residue, 24-residue), bit:(include*translated+negative) % 2};
      });
      const word = values.map(x => x.bit).join("");
      const body = values.map(x => '<tr><th scope="row">±' + x.t + '</th><td>±' + x.pair +
        '</td><td>' + (x.bit ? '−' : '+') + '</td></tr>').join("");
      return '<table class="carry-table"><caption>Signs at the four real embeddings</caption>' +
        '<thead><tr><th scope="col">Place</th><th scope="col">Translated place</th><th scope="col">Sign</th></tr></thead><tbody>' +
        body + '</tbody></table>' + metrics([["Signature", word], ["Patterns generated", "4 of 16"]]);
    }
    if (id === "binary-lattice-limit") {
      const n = Number(v.scale), selected = binaryLatticeBox(n);
      const points = Array.from({length:13}, (_, i) => [i+3, binaryLatticeBox(i+3).value]);
      const graph = chart({
        xMin:3, xMax:15, yMin:.01, yMax:.018, xt:"Scale N", yt:"Normalized sum",
        title:"Lattice sums for scales 3 to 15, with the limiting volume and the selected scale",
        paint: (X, Y, line) => line([[3,1/81],[15,1/81]], "dash") +
          points.map(([k, mass]) => '<circle cx="' + X(k) + '" cy="' + Y(mass) +
            '" r="' + (k === n ? '6' : '3') + '" fill="' + (k === n ? '#9b4427' : 'currentColor') + '"/>').join(""),
      });
      return graph + metrics([["Sum at N = " + n, reducedFraction(selected.numerator, selected.denominator)], ["Volume", "1/81"]]);
    }
    if (id === "stickelberger-fibres") {
      const prime = Number(v.prime);
      const {modulus, target, rows} = stickelbergerFibres(prime, Number(v.depth), Number(v.level));
      const nonzero = rows.filter(row => row.reduced !== 0).length;
      const body = rows.map(row => '<tr><th scope="row">±' + row.rep + '</th><td>' +
        String(row.sum).replace('-', '−') + '</td><td>' + row.reduced + '</td></tr>').join("");
      return '<table class="carry-table"><caption>Projection to unit pairs modulo ' + target +
        '</caption><thead><tr><th scope="col">Pair</th><th scope="col">Weighted sum</th><th scope="col">Mod ' +
        prime + '</th></tr></thead><tbody>' + body + '</tbody></table>' +
        metrics([["Source modulus", modulus], ["Nonzero coefficients", nonzero]]) +
        (prime === 2 && nonzero === 2 ?
          '<p>The image is 1 + [3] in the group algebra of a group of order two. Its square is zero in characteristic two, although both coefficients are one.</p>' :
          nonzero ? '<p>One nonzero row suffices to detect this projected element.</p>' :
          '<p>The projection vanishes at this depth. Increase d to separate the two target pairs.</p>');
    }
    if (id === "one-vector-density") {
      const k = Number(v.depth), commonDenominator = 243 * 81 ** k;
      let total = 0;
      const rows = [];
      for (let j = 0; j <= k; j++) {
        const residues = j === k ? 252 : 224;
        const contribution = residues * 81 ** (k - j);
        total += contribution;
        rows.push('<tr><th scope="row">' + 3 ** j + '</th><td>' + residues +
          '</td><td>' + reducedFraction(contribution, commonDenominator) + '</td></tr>');
      }
      return '<table class="carry-table"><caption>Contributions to the integral-lattice density</caption>' +
        '<thead><tr><th scope="col">Common 3-part</th><th scope="col">Primitive residues</th><th scope="col">Density</th></tr></thead><tbody>' +
        rows.join("") + '</tbody></table>' +
        metrics([["Density at " + 9 ** k, reducedFraction(total, commonDenominator)],
          ["Enlarged lattice at 1", reducedFraction(total * 81 ** k, commonDenominator)]]);
    }
    if (id === "quadratic-character") {
      const a = Number(v.value), square = Number(v.square);
      const phi = (x, y, k) => (a * (x + y) + square * (k / 2)) % 2;
      const theta = (x, y, k) => (a * (x + y) + square * (k % 2)) % 2;
      const rows = [["<var>e₁</var>",1,0,0],["<var>e₂</var>",0,1,0],["<var>σ</var>²",0,0,2]].map(([name,x,y,k]) =>
        '<tr><th scope="row">' + name + '</th><td>' + phi(x,y,k) + '</td><td>' + theta(x,y,k) + '</td></tr>').join("");
      return '<table class="carry-table"><caption>Values inside the subgroup <var>U</var></caption><thead><tr><th scope="col">Generator</th><th scope="col"><var>φ</var></th><th scope="col"><var>Θ</var> restricted to <var>U</var></th></tr></thead><tbody>' + rows + '</tbody></table>' +
        metrics([["Θ on σ outside U", theta(0,0,1)], ["Θ on σ²", theta(0,0,2)]]) +
        (square === 1 ? '<p>Every additive character of V sends σ² to twice its value on σ, hence to zero. The encoding records the missing bit at σ itself.</p>' :
          '<p>Here φ(σ²) is already zero. The character with Θ(σ) = 0 restricts to φ on every generator of U.</p>');
    }
    if (id === "whittaker-cutoff") {
      const shift = Number(v.shift), quarter = Number(v.quarter);
      const {points, continued} = realWhittakerCutoff(shift, quarter);
      const values = [continued, ...points.map(p => p[1])];
      const bound = Math.ceil(20 * Math.max(...values.map(Math.abs))) / 20;
      const graph = chart({
        xMax: 12, yMin: -bound, yMax: bound, xt: "Cutoff R", yt: "Integral",
        title: "Truncated Fourier integral and its continued value",
        paint: (X, Y, line) => line(points) + line([[0, continued], [12, continued]], "dash"),
      });
      const conclusion = shift === -1 ?
        'The cutoff integral returns to zero along some sequences of radii and stays away from zero along others.' :
        'The integrand is absolutely integrable. The tails tend to zero as the cutoff increases.';
      return graph + metrics([["Target B", reducedFraction(quarter, 4)], ["Continued value", fmt(continued, 5)]]) +
        '<p>' + conclusion + '</p>';
    }
    if (id === "inertia-orbits") {
      const prime = Number(v.prime), depth = Number(v.depth);
      const orbits = frobeniusOrbits(prime, depth);
      const rows = orbits.map(orbit => '<tr><th scope="row">' + orbit[0] + '</th><td>' + orbit.join(", ") + '</td></tr>').join("");
      return '<table class="carry-table"><caption>Multiplication by ' + prime + ' on the units modulo ' + (2 ** depth) + '</caption>' +
        '<thead><tr><th scope="col">Start</th><th scope="col">Successive residues</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        metrics([["Residue degree", orbits[0].length], ["Number of primes", orbits.length]]) +
        '<p>Each row has ' + orbits[0].length + ' entries. Together the rows account for all ' + (2 ** (depth - 1)) + ' units.</p>';
    }
    if (id === "localization-kernel") {
      const {sourceSize, targetSize, kernel, integral, cokernelSize} = localizationKernel(Number(v.depth));
      const row = (name, entries) => '<tr><th scope="row">' + name + '</th><td>' + entries.join(", ") + '</td><td>' + entries.length + '</td></tr>';
      return '<table class="carry-table"><caption>Multiplication by 3 from ℤ/' + sourceSize + ' to ℤ/' + targetSize + '</caption>' +
        '<thead><tr><th scope="col">Kernel</th><th scope="col">Residues</th><th scope="col">Count</th></tr></thead><tbody>' +
        row('After reduction', kernel) + row('From integral kernel', integral) + '</tbody></table>' +
        metrics([["Index between kernels", kernel.length / integral.length], ["Cokernel order", cokernelSize]]) +
        (integral.length === kernel.length ? '<p>At this depth each reduced kernel class lifts to an element of the original kernel.</p>' :
          '<p>The residues 1 and 2 are killed after reduction. Their lifts have nonzero image in ℤ/9.</p>');
    }
    if (id === "genus-mass") {
      const second = Number(v.second);
      const partitions = smallGenusClasses();
      const firstClass = partitions[2][0];
      const names = ["Elements", "Left cosets", "Double classes"];
      const rows = partitions.map((partition, i) => {
        const terms = partition.map(group => (firstClass.includes(group[0]) ? 2 : second) * group.length);
        return '<tr><th scope="row">' + names[i] + '</th><td>' + partition.length + '</td><td>(' + terms.join(" + ") + ')/6</td></tr>';
      }).join("");
      const mass = reducedFraction(4 + 4 * second, 6);
      return '<table class="carry-table"><caption>One average on the permutations of three letters</caption><thead><tr><th scope="col">Terms</th><th scope="col">Count</th><th scope="col">Weighted sum</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        metrics([["Haar average", mass], ["Equal weight per double class", reducedFraction(2 + second, 2)]]) +
        '<p>The two double classes have masses 2/6 and 4/6. Each left coset accounts for two permutations.</p>';
    }
    if (id === "split-graph") {
      const dimension = Number(v.dimension), graph = splitGraph(dimension);
      const conclusion = dimension === 2 ? "A and C are in different components. No integral edge chain has boundary [C] − [A]." :
        "The two ordered edges [A,U] and [U,C] have cancelling contributions at U. Their sum has boundary [C] − [A].";
      return splitDiagram(graph, dimension) + metrics([["Vertices", graph.points.length], ["Undirected edges", graph.edges], ["Components", graph.components.length]]) + '<p>' + conclusion + '</p>';
    }
    if (id === "hermitian-density") {
      const pair = v.frame === "pair", level = Number(v.level);
      const state = hermitianDensity(pair, level);
      const second = pair ? '<tr><th scope="row">Second column, orthogonal to the first</th><td>' +
        (state.frames / state.first) + '</td></tr>' : '';
      return '<table class="carry-table density-table"><caption>Level one over the field with 9 elements</caption><thead><tr>' +
        '<th scope="col">Choice</th><th scope="col">Count</th></tr></thead><tbody><tr><th scope="row">Unit first column</th><td>' +
        state.first + '</td></tr>' + second + '</tbody></table>' +
        metrics([["Frames at level " + level, state.count.toLocaleString("en-US")], ["Normalized density", state.density]]) +
        '<p>Each frame has ' + state.lift.toLocaleString("en-US") + ' lifts at the next level. ' +
        (level === 1 ? 'At level one, divide the frame count by this same number.' :
          'At level ' + level + ', divide by its ' + (level === 2 ? 'square' : 'cube') + '.') + ' At the special point the local factor is ' +
        (pair ? '(1 + 1/27)(1 − 1/9) = 224/243.' : '1 − 1/9 = 8/9.') + '</p>';
    }
    if (id === "orbit-weights") {
      const height = Number(v.height), stabilizer = 2 * 6 ** 2;
      const total = stabilizer * (1 + height);
      function row(name, raw) {
        return '<tr><th scope="row">' + name + '</th><td>' + stabilizer + '</td><td>' +
          reducedFraction(raw, total) + '</td><td>' + reducedFraction(stabilizer * raw, total) + '</td></tr>';
      }
      return '<table class="carry-table"><caption>Weights at the two orbit points</caption>' +
        '<thead><tr><th scope="col">Centre</th><th scope="col">Labels</th><th scope="col">Per label</th><th scope="col">Per centre</th></tr></thead>' +
        '<tbody>' + row('<var>h₀</var>', 1) + row('<var>h₁</var>', height) + '</tbody></table>' +
        metrics([["Raw sum", total], ["Partition sum", "1"]]) +
        '<p>The denominator is ' + stabilizer + ' × 1 + ' + stabilizer + ' × ' + height + ' = ' + total + '.</p>';
    }
    if (id === "height-grid") {
      const u = Number(v.u), second = Number(v.v);
      const { depths, counts, candidates, bound } = heightGrid(u, second);
      const entry = i => '<td>' + counts[i] + ' (k = ' + depths[i] + ')</td>';
      return '<table class="carry-table"><caption>Choices by ordered pair of coordinates</caption>' +
        '<thead><tr><th scope="col">Row</th><th scope="col">Column 1</th><th scope="col">Column 2</th></tr></thead>' +
        '<tbody><tr><th scope="row">1</th>' + entry(0) + entry(1) + '</tr><tr><th scope="row">2</th>' + entry(2) + entry(3) + '</tr></tbody></table>' +
        metrics([["Candidate tuples", candidates.toLocaleString("en-US")], ["Uniform bound", bound.toLocaleString("en-US")]]) +
        '<p>For μ = (' + u + ', ' + second + '), the four list sizes multiply to ' + counts.join(' × ') + '.</p>';
    }
    if (id === "trace-cycles") {
      const copies = Number(v.copies), same = v.place === "same";
      const t = traceCycles(copies, same);
      const readings = [1, 2, 3].map(d => {
        const values = traceCycles(d, same);
        return '<tr><th scope="row">' + d + (d === copies ? ' · selected' : '') + '</th><td>' + values.identity + '</td><td>' + values.swap + '</td></tr>';
      }).join("");
      return '<table class="carry-table"><caption>Contractions after repeating the two matrices</caption><thead><tr><th scope="col">Blocks</th>' +
        '<th scope="col">Identity (1)(2)</th><th scope="col">Swap (12)</th></tr></thead><tbody>' + readings + '</tbody></table>' +
        metrics([["Two cycles · tr(A) tr(B)", t.identity], ["One cycle · tr(AB)", t.swap]]) +
        '<p>' + (same ? 'The identity can choose its two blocks independently. The swap needs both indices in the same block.' :
          'The identity still has one trace at each place. In the swap contraction every term connects disjoint matrix blocks and vanishes.') + '</p>';
    }
    if (id === "fourier-rank") {
      const a = Number(v.a), b = Number(v.b), c = Number(v.c);
      const counts = fourierRank(a, b, c);
      const x = (panel, column) => 35 + 110 * panel + 26 * column;
      const y = row => 54 + 26 * row;
      const panels = [0, 1, 2].map(panel => {
        const markers = [0, 1, 2].map(row => [0, 1, 2].map(column => {
          const isFull = (column * row - panel * panel) % 3 !== 0;
          return '<circle cx="' + x(panel, column) + '" cy="' + y(row) + '" r="4.2" stroke="#12685f" fill="' +
            (isFull ? '#12685f' : 'none') + '"/>';
        }).join("")).join("");
        const ticks = [0, 1, 2].map(i => '<text x="' + x(panel, i) + '" y="133" text-anchor="middle">' +
          i + '</text><text x="' + (x(panel, 0) - 13) + '" y="' + (y(i) + 4) + '" text-anchor="end">' + i + '</text>').join("");
        return '<text x="' + x(panel, 1) + '" y="24" text-anchor="middle">b = ' + panel + '</text>' + markers + ticks;
      }).join("");
      const determinant = ((a * c - b * b) % 3 + 3) % 3;
      const average = reducedFraction(counts[0] - counts[1], 27);
      const svg = '<svg class="plot" viewBox="0 0 342 147" role="img" aria-label="Frequency grid for all 27 symmetric matrices">' +
        '<title>Invertible and singular frequencies over the field of three elements</title>' + panels +
        '<rect x="' + (x(b, a) - 8) + '" y="' + (y(c) - 8) + '" width="16" height="16" fill="none" stroke="#9b4427" stroke-width="2"/></svg>';
      return svg + metrics([["det β mod 3", determinant + (determinant ? " · invertible" : " · singular")],
        ["Terms of phase 1, ζ, ζ²", counts.join(", ")], ["Normalized coefficient", average]]) +
        '<p>At (a,b,c) = (' + [a,b,c].join(",") + '), ' +
        (average === '0' ? 'the three phases cancel exactly.' : 'all 27 terms have phase 1, so their average is 1.') + '</p>';
    }
    if (id === "shear-rounding") {
      const first = Number(v.first), second = Number(v.second);
      const { direct, corrected } = shearRounding(first, second);
      const column = value => 58 + 112 * value;
      const row = value => 157 - 112 * value;
      const point = [column((first + second) / 5), row(second / 5)];
      const xy = item => [column(item.m + item.n), row(item.n)];
      const [dx, dy] = xy(direct), [cx, cy] = xy(corrected);
      const grid = [0, 1, 2].map(i =>
        '<path class="grid" d="M' + column(i) + ' 28 V171"/><text x="' + column(i) +
        '" y="191" text-anchor="middle">' + i + '</text>').join("") +
        [0, 1].map(j => '<path class="grid" d="M43 ' + row(j) + ' H299"/><text x="36" y="' +
          (row(j) + 4) + '" text-anchor="end">' + j + '</text>').join("");
      const dots = [0, 1, 2].flatMap(i => [0, 1].map(j =>
        '<circle cx="' + column(i) + '" cy="' + row(j) + '" r="2.8" fill="currentColor"/>')).join("");
      const coord = item => '(' + item.m + ', ' + item.n + ')';
      const basisPoint = '(' + reducedFraction(first, 5) + ', ' + reducedFraction(second, 5) + ')';
      const label = 'Target p with basis coordinates ' + basisPoint;
      const svg = '<svg class="plot" viewBox="0 -8 348 231" role="img" aria-label="' + label +
        '"><title>' + label + '</title><text x="43" y="19">Imaginary part</text>' + grid + dots +
        '<text x="299" y="211" text-anchor="end">Real part</text>' +
        '<path d="M' + dx + ' ' + dy + ' L' + point.join(" ") + ' L' + cx + ' ' + cy +
        '" fill="none" stroke="#5d6264" stroke-dasharray="3 3"/>' +
        '<rect x="' + (dx - 8) + '" y="' + (dy - 8) + '" width="16" height="16" fill="none" stroke="#9b4427" stroke-width="2"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="5.5" fill="none" stroke="#12685f" stroke-width="2.2"/>' +
        '<path d="M' + (point[0] - 3) + ' ' + (point[1] - 3) + ' l6 6 m0 -6 l-6 6" stroke="#111" stroke-width="2"/></svg>';
      return svg + metrics([["Target p in basis coordinates", basisPoint],
        ["Direct rounding " + coord(direct), reducedFraction(direct.squaredNumerator, 25)],
        ["Corrected rounding " + coord(corrected), reducedFraction(corrected.squaredNumerator, 25)]]) +
        '<p>The last two readings give squared distances. ' + (direct.m === corrected.m
          ? 'Both choices pick the same lattice point.' : 'Correcting the first coordinate gives a shorter vector from p to the lattice.') + '</p>';
    }
    if (id === "minimum-scale") {
      const d = Number(v.scale), radius = Math.sqrt(4 * d);
      const { points, fullWeight, numerator } = minimumScale(d);
      const spacing = 84 / radius;
      const cx = 174, cy = 105;
      const dots = points.map(({ a, b, full }) => {
        const x = cx + spacing * a, y = cy - spacing * b;
        if (full) return '<circle cx="' + x + '" cy="' + y + '" r="2.7" fill="#12685f"/>';
        return '<path d="M' + x + ' ' + (y - 2.6) + 'l2.6 2.6 -2.6 2.6 -2.6 -2.6Z" fill="none" stroke="#9b4427" stroke-width="1"/>';
      }).join("");
      const boundary = '<circle cx="' + cx + '" cy="' + cy + '" r="84" fill="none" class="dash"/>';
      const ticks = [-radius, 0, radius].map(a => '<text x="' + (cx + spacing * a) +
        '" y="214" text-anchor="middle">' + fmt(a) + '</text>').join("");
      const vertical = [-radius, 0, radius].map(b => '<text x="75" y="' + (cy - spacing * b + 4) +
        '" text-anchor="end">' + fmt(b) + '</text>').join("");
      const svg = '<svg class="plot" viewBox="0 0 348 249" role="img" aria-label="Gaussian integers in the open disk of squared radius ' +
        (4 * d) + '"><title>Short Gaussian integers at scale ' + d +
        '</title><desc>' + fullWeight + ' full-weight points among ' + points.length + ' candidates. The second coordinate is zero throughout.</desc>' +
        '<path class="grid" d="M90 105H258 M174 21V189"/>' + boundary + dots + ticks + vertical +
        '<text x="174" y="238" text-anchor="middle">Real part of z</text>' +
        '<text transform="translate(39 105) rotate(-90)" text-anchor="middle">Imaginary part of z</text></svg>';
      const isDual = v.direction === "dual";
      const result = isDual ? "T<sub>d</sub>[e₂ / 64] = 0. The vector pairs only with the second coordinate, which vanishes at every plotted point." :
        "T<sub>d</sub>[e₁] ≥ " + reducedFraction(numerator, d * d * points.length) +
        ". The full-weight points contribute " + numerator + " to the numerator. Each remaining term is nonnegative.";
      return svg + metrics([["Possible vectors", points.length], ["Full weight", fullWeight], ["Test direction", isDual ? "e₂ / 64" : "e₁"]]) +
        "<p>" + result + "</p>";
    }
    if (id === "kernel-order") {
      const result = kernelOrder(v.cutoff, v.phase);
      const d = result.denominator;
      const rows = result.lifts.map(t =>
        '<tr><th scope="row">' + (t.y === 1 ? "+1" : "−1") + "</th><td>" +
        reducedFraction(t.first, d) + "</td><td>" + complexFraction(t.real, t.imag, d) + "</td></tr>"
      ).join("");
      return '<table class="carry-table"><caption>Two target points at <var>M</var> = ' + v.cutoff +
        '</caption><thead><tr><th scope="col"><var>y</var></th><th scope="col">First lift</th><th scope="col">Second lift</th></tr></thead><tbody>' +
        rows + "</tbody></table>" +
        metrics([["Pair on the target", complexFraction(result.targetReal, result.targetImag, 2 * d ** 2)],
          ["Sum over source pairs", complexFraction(result.sourceReal, result.sourceImag, d ** 2)]]) +
        "<p>Absolute error from truncating the infinite pairing ≤ <strong>" + reducedFraction(result.tail, d ** 2) + "</strong>.</p>";
    }
    if (id === "central-period") {
      const start = Number(v.start), length = Number(v.length);
      const result = centralPeriod(start, length);
      const left = 38, right = 346, low = 126, high = 46;
      const x = t => left + t * (right - left);
      const y = value => low - (value - 1) * (low - high) / 2;
      const points = Array.from({length: 97}, (_, i) => {
        const t = i / 96;
        return x(t).toFixed(2) + " " + y(2 + Math.cos(2 * Math.PI * (start + length * t))).toFixed(2);
      });
      const interval = "[" + reducedFraction(8 * start, 8) + ", " + reducedFraction(8 * (start + length), 8) + "]";
      const title = "Original and centrally averaged coefficients on " + interval;
      let axes = "";
      for (const value of [1, 2, 3]) {
        axes += '<path class="grid" d="M' + left + ' ' + y(value) + 'H' + right + '"/>' +
          '<text x="28" y="' + (y(value) + 5) + '" text-anchor="end">' + value + '</text>';
      }
      for (const t of [0, 0.5, 1]) {
        axes += '<path class="faint" d="M' + x(t) + ' ' + high + 'V' + low + '"/>' +
          '<text x="' + x(t) + '" y="150" text-anchor="middle">' + reducedFraction(16 * (start + t * length), 16) + '</text>';
      }
      const svg = '<svg class="plot" role="img" aria-label="' + title + '" viewBox="0 -5 386 191">' +
        '<title>' + title + '</title><desc>Solid curve, original form. Dashed horizontal line, averaged form. ' +
        'The integral of each form is given below.</desc>' + axes +
        '<text x="38" y="22">Coefficient</text><text x="192" y="176" text-anchor="middle">Unit coordinate x</text>' +
        '<path class="ink" d="M' + points.join(" L") + '"/><path class="dash" d="M' + left + ' ' + y(2) + 'H' + right + '"/></svg>';
      let equality = "The integrals differ on this open arc.";
      if (length === 1) equality = "A full unit cycle has integral 2 for every starting point.";
      else if (result.equal) equality = "The integrals coincide on this open arc because its endpoint sines agree. Moving the starting point can change the equality.";
      const originalText = result.originalExact + (result.equal ? "" : " ≈ " + result.original.toFixed(4));
      return svg + metrics([["Interval", interval], ["Original integral", originalText], ["Averaged integral", result.meanExact]]) +
        "<p>" + equality + "</p>";
    }
    if (id === "mobius-product") {
      const [Y, N] = v.cuts.split("-").map(Number);
      let rows = "", retained = 0, truncated = 0, full = 0;
      for (let d = 1; d <= v.n; d++) {
        if (v.n % d !== 0) continue;
        const b = v.n / d, value = mobius(d);
        const include = d <= Y && b <= N;
        const excluded = d > Y && b > N ? "d > Y, b > N" : d > Y ? "d > Y" : "b > N";
        full += value;
        if (include) {
          retained++;
          truncated += value;
        }
        rows += '<tr><th scope="row">' + d + "</th><td>" + b + "</td><td>" + fmt(value) +
          "</td><td>" + (include ? "Retained" : excluded) + "</td><td>" + fmt(include ? value : 0) + "</td></tr>";
      }
      let explanation;
      if (v.n === 1) explanation = "The pair (1, 1) supplies the constant coefficient in the product identity.";
      else if (v.n <= Y) explanation = "All divisor pairs fit both cutoffs. Their Möbius weights sum to zero.";
      else if (retained === 0) explanation = "No factor pair fits both lengths, so the product has no term at this index.";
      else if (truncated === 0) explanation = "The retained weights still sum to zero beyond the initial cancellation range.";
      else explanation = "The full divisor sum is zero. Omitting factor pairs at the cutoffs leaves a nonzero coefficient.";
      return '<table class="carry-table"><caption>Factor pairs for n = ' + v.n +
        '</caption><thead><tr><th scope="col"><var>d</var></th><th scope="col"><var>b</var></th><th scope="col"><var>μ(d)</var></th>' +
        '<th scope="col">Cutoffs</th><th scope="col">Term</th></tr></thead><tbody>' + rows + "</tbody></table>" +
        metrics([["Pairs retained", retained], ["Full divisor sum", fmt(full)], ["Coefficient a(n)", fmt(truncated)]]) +
        "<p>" + explanation + "</p>";
    }
    if (id === "satake-average") {
      const [p, q = 1] = v.alpha.split("/").map(Number);
      const sign = Math.sign(p);
      // Keep positive denominators for the exact labels, including negative parameters.
      const groups = [
        {exponent: 1, count: 9, top: p, bottom: 3 * q},
        {exponent: 0, count: 2, top: 1, bottom: 1},
        {exponent: -1, count: 1, top: 3 * q * sign, bottom: Math.abs(p)},
      ];
      const sumTop = sign * (3 * p * p + 2 * p * q + 3 * q * q);
      const sumBottom = Math.abs(p) * q;
      const mean = reducedFraction(sumTop, 12 * sumBottom);
      const values = groups.map(group => group.top / group.bottom);
      const low = Math.min(0, ...values), high = Math.max(...values);
      const y = value => (109 - 83 * (value - low) / (high - low)).toFixed(2);
      const axis = n => groups.find(group => group.top / group.bottom === n);
      const tick = n => axis(n) ? reducedFraction(axis(n).top, axis(n).bottom) : "0";
      let dots = "", index = 0;
      for (const group of groups) {
        for (let j = 0; j < group.count; j++) {
          dots += '<circle cx="' + (43 + 28 * index++) + '" cy="' + y(group.top / group.bottom) +
            '" r="4.4" fill="var(--math-green)"/>';
        }
      }
      const title = "Twelve induced values at α = " + reducedFraction(p, q) + ", with zonal mean " + mean;
      const meanY = y(sumTop / (12 * sumBottom));
      const chart = '<svg class="plot" role="img" aria-label="' + title + '" viewBox="-8 0 393 137">' +
        '<title>' + title + '</title><desc>The three groups contain nine, two and one cosets. Exact values follow the chart.</desc>' +
        '<path class="grid" d="M34 26H368 M34 109H368"/><path class="faint" d="M281 18V114 M337 18V114"/>' +
        '<text x="29" y="30" text-anchor="end">' + tick(high) + '</text><text x="29" y="113" text-anchor="end">' +
        tick(low) + '</text><path class="dash" d="M34 ' + meanY + 'H368"/>' + dots +
        '<text x="155" y="130" text-anchor="middle">a = +1</text><text x="309" y="130" text-anchor="middle">0</text>' +
        '<text x="351" y="130" text-anchor="middle">−1</text></svg>';
      return chart + metrics(groups.map(group => [
        group.count + (group.count === 1 ? " coset" : " cosets") + " at a = " + fmt(group.exponent),
        reducedFraction(group.top, group.bottom),
      ])) + '<p>Hecke sum <strong>' + reducedFraction(sumTop, sumBottom) + '</strong>. ' +
        'Zonal mean on this double class <strong>' + mean + '</strong>.</p>';
    }
    if (id === "inert-length") {
      const s = Number(v.s), t = Number(v.t);
      const imaginary = ["0", "i", "2i"][t];
      const corner = (3 - s) + (t ? " + " + imaginary : "");
      const subtract = s === 1 ? "R₁ − R₃" : "R₁ − 2R₃";
      const rank = t === 0 ? 1 : 2;
      const rows = [["R₁", s, corner], ["R₃", 1, 2], [subtract, 0, imaginary]];
      const body = rows.map(([label, third, fourth]) => '<tr><th scope="row"><var>' + label +
        '</var></th><td>0</td><td>0</td><td>' + third + '</td><td>' + fourth + '</td></tr>').join("");
      return '<table class="carry-table"><caption>Rows of 3<var>G</var> modulo 3 at <var>s</var> = ' + s + ', t = ' + t +
        '</caption><thead><tr><th scope="col">Row</th><th scope="col">Col 1</th><th scope="col">Col 2</th>' +
        '<th scope="col">Col 3</th><th scope="col">Col 4</th></tr></thead><tbody>' + body + '</tbody></table>' +
        '<p>In 𝔽₉, 2 represents −1. Rows 2 and 4 reduce to zero. Row 3 supplies a pivot in column 3. ' +
        (rank === 1 ? 'The subtraction clears row 1.' : 'The surviving ' + imaginary + ' supplies a pivot in column 4.') +
        ' All denominators divide 3, so the quotient by the standard lattice is this residue-field row span.</p>' +
        metrics([["Row rank over 𝔽₉", rank], ["Lattice length", rank], ["Quotient size", 9 ** rank]]);
    }
    if (id === "inert-cell") {
      const q = Number(v.q), a = Number(v.diagonal), base = Math.max(a, 0);
      let previous = 0, body = "", calculation = "";
      for (let j = 0; j <= v.excess; j++) {
        const e = base + Math.floor(j / 2), f = 2 * base + j;
        const rows = (q*q) ** e, corners = q ** f, ball = rows * corners;
        const length = Math.abs(a) + j, shell = ball - previous;
        body += '<tr><th scope="row">' + length + "</th><td>" + rows + "</td><td>" + corners +
          "</td><td>" + shell + "</td></tr>";
        if (j === v.excess) {
          calculation = "<p>At excess " + j + " the row level is " + e + " and the corner level is " + f +
            ". The ball contains " + rows + " × " + corners + " = " + ball +
            " cosets. Exactly " + shell + " have length " + length + ", since " + previous +
            " already have smaller length.</p>";
        }
        previous = ball;
      }
      return '<table class="carry-table"><caption>One inert cell at q = ' + q + ', a = ' + fmt(a) +
        '</caption><thead><tr><th scope="col">Length</th><th scope="col">Rows</th>' +
        '<th scope="col">Corners per row</th><th scope="col">New cosets</th></tr></thead><tbody>' + body +
        "</tbody></table>" + calculation;
    }
    if (id === "flag-average") {
      const q = Number(v.q), counts = flagAverages(q, v.points);
      const pointSquares = v.points === "pair" ? 2 : 6;
      const lineSquares = counts.reduce((total, [sum, n]) => total + n * sum * sum, 0);
      const body = counts.map(([sum, n]) => '<tr><th scope="row">' + fmt(sum) + '</th><td>' + n +
        '</td><td>' + (sum === 0 ? "0" : fmt(sum) + "/" + (q + 1)) + '</td></tr>').join("");
      const setup = { pair: "Two points carry +1 and −1.", collinear: "Three points on one line carry +1, +1 and −2.",
        triangle: "The vertices of a triangle carry +1, +1 and −2." }[v.points];
      return "<p>" + setup + " Every other point carries 0. Each line averages its " + (q + 1) + " points.</p>" +
        '<table class="carry-table"><caption>Line averages over 𝔽' +
        ({2:"₂",3:"₃",5:"₅",25:"₂₅"})[q] + '</caption><thead><tr><th scope="col">Line sum</th>' +
        '<th scope="col">Lines</th><th scope="col">Average</th></tr></thead><tbody>' + body + '</tbody></table>' +
        "<p>The squared point values sum to " + pointSquares + ". The squared line averages sum to " +
        lineSquares + "/" + (q + 1) ** 2 + ". Dividing and taking the square root gives a norm ratio of " +
        (q === 25 ? "5/26" : "√" + q + "/" + (q + 1)) + " ≈ " + fmt(Math.sqrt(q)/(q + 1)) + ".</p>" +
        (q === 25 ? "<p>At this field size the Hecke estimate uses 1/5.</p>" :
          "<p>This small plane illustrates the count. The Hecke estimate uses fields of size at least 25.</p>");
    }
    if (id === "jacobi-primes") {
      const p = Number(v.p);
      const { root, h, counts, a, b, partner, norm, reductions } = cubicJacobi(p, v.root);
      const integer = n => String(n).replace("-", "−");
      const element = (u, v) => integer(u) + (v < 0 ? " − " : " + ") + Math.abs(v) + "<var>ω</var>";
      const rows = reductions.map(test =>
        '<tr><th scope="row"><var>ω</var> ↦ ' + test.root + "</th><td>" + test.value + "</td><td>" +
        test.conjugate + "</td><td>" + test.order + ", " + test.partnerOrder + "</td></tr>"
      ).join("");
      return "<p>The reduction ω ↦ " + root + " defines χ. Here h = " + h +
        ", so χ(x) reduces to x<sup>" + h + "</sup> modulo " + p + ". The terms at x = 0 and 1 vanish.</p>" +
        metrics([["Terms equal to 1", counts[0]], ["Terms equal to ω", counts[1]], ["Terms equal to ω²", counts[2]]]) +
        "<p>J = <strong>" + element(a, b) + "</strong>. Its inverse-character partner is J̄ = <strong>" +
        element(...partner) + "</strong>. Their product is the norm A² − AB + B² = (" + integer(a) + ")² − (" +
        integer(a) + ")(" + integer(b) + ") + (" + integer(b) + ")² = <strong>" + norm + "</strong>.</p>" +
        '<table class="carry-table"><caption>Two primes above ' + p + '</caption><thead><tr>' +
        '<th scope="col">Test root</th><th scope="col"><var>J</var> mod <var>p</var></th><th scope="col"><var>J̄</var> mod <var>p</var></th>' +
        '<th scope="col">Orders (<var>J</var>, <var>J̄</var>)</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        "<p>At each prime the orders of J and J̄ add to one, the order of p there. A zero residue picks the factor of order one.</p>";
    }
    if (id === "split-endpoint") {
      const q = Number(v.q), degree = Number(v.degree);
      const rows = splitEndpointCoefficients(q, degree);
      const selected = rows[degree];
      const body = rows.map(row =>
        '<tr><th scope="row">' + row.xDegree + "</th><td>" + row.before +
        "</td><td>" + row.hermite + "</td><td>" + row.after + "</td></tr>"
      ).join("");
      const previous = rows[degree - 1]?.before ?? 0;
      const twoBack = rows[degree - 2]?.before ?? 0;
      return '<table class="carry-table"><caption>Endpoint coefficients through degree ' +
        selected.xDegree + ' in X (q = ' + q + ')</caption><thead><tr><th scope="col">Degree in <var>X</var></th>' +
        '<th scope="col">Before</th><th scope="col">Hermite count</th><th scope="col">After</th>' +
        '</tr></thead><tbody>' + body + '</tbody></table>' +
        "<p>At degree " + selected.xDegree + " the corrected coefficient is " +
        selected.before + " − " + (q + 1) + " × " + previous + " + " + q + " × " + twoBack +
        " = <strong>" + selected.after + "</strong>.</p>";
    }
    if (id === "gram-pair") {
      const a = Number(v.a), h = Number(v.h);
      const result = gramPair(a, h, v.column);
      const which = v.column === "first" ? "First" : "Second";
      const blocks = ["K₁₁ − I", "K₂₂ − I", "K₁₂"];
      const rows = blocks.map((block, i) =>
        '<tr><th scope="row"><var>' + block + "</var></th><td>" + fmt(result.full[i], 8) +
        "</td><td>" + fmt(result.retained[i], 8) + "</td></tr>"
      ).join("");
      return "<p>Dividing the period matrices by 2 and 3 gives the normalized columns " +
        "[a e₁, e₂] and [h e₁ + √(1−h²) e₃, e₄]. Their first columns have inner product " +
        fmt(result.overlap, 8) + ". Their second columns are orthogonal.</p>" +
        '<table class="carry-table"><caption>Squared Gram errors with ' + which.toLowerCase() +
        ' columns retained</caption><thead><tr><th scope="col">Block</th>' +
        '<th scope="col">Full <var>Q</var></th><th scope="col">Retained <var>Q</var></th></tr></thead><tbody>' +
        rows + "</tbody></table>" +
        metrics([["Retained inner product", fmt(result.retainedOverlap, 8)],
          ["Full mean <var>Q(K₁₁ − I)</var> / 2", fmt(result.full[0] / 2, 8)],
          ["Retained mean <var>Q(K₁₁ − I)</var> / 1", fmt(result.retained[0], 8)]]);
    }
    if (id === "prism") {
      const twist = Number(v.twist), weight = Number(v.weight), gluingLog = Number(v.gluing);
      const positions = prismInsertions(twist, weight, gluingLog);
      let total = 0;
      const rows = positions.map((sum, i) => {
        total += (i % 2 === 0 ? sum : -sum);
        return '<tr><th scope="row">' + i + '</th><td>' + (i % 2 === 0 ? "+" : "−") + '</td><td>' + sum + '</td></tr>';
      }).join("");
      const carries = [0, 1, 2, 3, 4].map(j => Math.floor(((2 * weight * j) % 10 + (2 * weight) % 10) / 10));
      return '<p>For j = 0, 1, 2, 3, 4 the five carries are ' + carries.join(", ") + '.</p>' +
        '<table class="carry-table"><caption>Insertion sums in degree ' + (2 * twist + 1) + '</caption>' +
        '<thead><tr><th scope="col">Position</th><th scope="col">Sign</th><th scope="col">Sum before sign</th></tr></thead><tbody>' +
        rows + '</tbody></table>' + metrics([["Words evaluated", 5 ** twist], ["Signed sum", total],
          ["Residue modulo 5", total % 5]]) +
        "<p>The block formula gives " + weight + "<sup>" + twist + "</sup> × " + (gluingLog % 5) + " ≡ " +
        ((weight ** twist * gluingLog) % 5) + " modulo 5.</p>";
    }
    if (id === "floor-sum") {
      const multiplier = Number(v.multiplier);
      const { level, groups, sum, cleared, valuation } = bernoulliCarries(Number(v.depth), multiplier);
      const rows = groups.map(({ quotient, carry, representatives }) =>
        "<tr><th scope=\"row\">" + quotient + "</th><td>" + carry + "</td><td>" + representatives +
        "</td><td>" + carry * representatives + "</td></tr>"
      ).join("");
      const unitTest = (multiplier ** 2 - 1) % 5 === 0
        ? "Here 5 divides b² − 1. The congruence holds, and S is divisible by 5 although T is a 5-adic unit."
        : "Here b² − 1 is a 5-adic unit. Both S and T have 5-adic valuation zero.";
      return '<table class="carry-table"><caption>Signed contributions at level ' + level + '</caption><thead><tr>' +
        '<th scope="col">Quotient <var>j</var></th><th scope="col">Carry <var>θ</var></th><th scope="col">Sum of <var>u</var></th>' +
        '<th scope="col">Contribution</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        metrics([["Sum S", String(sum)], ["Cleared difference", cleared + " = " + (cleared / level) + " × " + level],
          ["Valuation of S", String(valuation)]]) + "<p>" + unitTest + "</p>";
    }
    if (id === "rank-grid") {
      const row = Number(v.row);
      const column = Number(v.column);
      const grid = rankGrid(row, column);
      const sum = values => values.reduce((total, entry) => total + entry, 0);
      const signed = ["−1", "0", "+1"];
      const cellKind = ["negative", "zero", "positive"];
      const rows = grid.map((entries, i) =>
        '<tr><th scope="row">' + residueUnits[i] + '</th>' +
        entries.map(value => '<td class="rank-' + cellKind[value + 1] + '">' + signed[value + 1] + '</td>').join('') +
        '<td class="rank-sum">' + sum(entries) + '</td></tr>',
      ).join('');
      const columnSums = residueUnits.map((_, j) => sum(grid.map(entries => entries[j])));
      return '<table class="rank-grid"><caption>Basis vector at (' + row + ', ' + column + ')</caption>' +
        '<thead><tr><th scope="col">Residue</th>' + residueUnits.map(unit => '<th scope="col">' + unit + '</th>').join('') +
        '<th scope="col" class="rank-sum">Row sum</th></tr></thead><tbody>' + rows + '</tbody>' +
        '<tfoot><tr><th scope="row">Col. sum</th>' + columnSums.map(value => '<td>' + value + '</td>').join('') +
        '<td class="rank-sum">' + sum(columnSums) + '</td></tr></tfoot></table>' +
        metrics([["Full dimension", "16"], ["Retained dimension", "9"], ["Lost fraction", "7/16"]]);
    }
    if (id === "marks") {
      const exponents = [v.first, v.second];
      const [lower, upper] = selectWindow(exponents);
      const log = Math.log2;
      return chart({
        xMin: -3, xMax: 5, yMin: 0, yMax: 4,
        xt: "log₂(log₂ x)", yt: "row",
        title: "Two forbidden ranges and a window entirely clear of both",
        paint: (X, Y, line) => {
          const segments = exponents.map((k, i) => {
            if (k === 0) return "";
            const a = log(k / 2), b = log(2 * k), row = i + 1;
            return line([[a, row], [b, row]], i === 0 ? "faint" : "dash") +
              '<circle fill="currentColor" cx="' + X(a) + '" cy="' + Y(row) + '" r="3"/>' +
              '<circle cx="' + X(b) + '" cy="' + Y(row) + '" r="3" fill="white" stroke="currentColor"/>';
          });
          return segments.join("") + line([[log(lower), 3], [log(upper), 3]]);
        },
      }) + metrics([
        ["Marked twists", exponents.map(k => fmt(2 ** k, 7)).join(", ")],
        ["Chosen log₂ x interval", "[" + fmt(lower) + ", " + fmt(upper) + "]"],
        ["Chosen x interval", "[" + fmt(2 ** lower, 5) + ", " + fmt(2 ** upper, 5) + "]"],
      ]);
    }
    if (id === "euler") {
      const q = Number(v.q);
      const selected = eulerQuotients(q, v.s);
      const split = Array.from({ length: 141 }, (_, i) => {
        const s = 0.5 + i / 40;
        return [s, eulerQuotients(q, s).split];
      });
      return chart({
        xMin: 0.5, xMax: 4, yMin: 0.92, yMax: split[0][1] + 0.08,
        xt: "real argument s", yt: "local quotient",
        title: "Split and inert local zeta quotients with one trivial parameter above each place",
        paint: (X, Y, line) =>
          line(split) + line([[0.5, 1], [4, 1]], "dash") +
          [selected.split, selected.inert].map(value =>
            `<circle class="dots" cx="${X(v.s)}" cy="${Y(value)}" r="4"/>`
          ).join(""),
      }) + metrics([
        ["Split · solid", fmt(selected.split, 6)],
        ["Inert · dashed", "1"],
        ["Normalizer", fmt(selected.normalizer, 6)],
      ]);
    }
    if (id === "ramp") {
      const rows = contributions(v.x, v.chi),
        sum = rows.reduce((s, r) => s + r.y, 0);
      const main =
        v.chi === "one"
          ? v.x * Math.log(v.x) - (1 + 0.5772156649015329) * v.x
          : -v.x * centeringRatio();
      return (
        chart({
          xMax: v.x,
          yMin: Math.min(0, ...rows.map((r) => r.y)),
          yMax: Math.max(1, ...rows.map((r) => r.y)),
          xt: "integer n",
          yt: "weighted contribution",
          title: "Signed prime-power contributions",
          paint: (X, Y, line) =>
            line(
              [
                [0, 0],
                [v.x, 0],
              ],
              "axis",
            ) +
            rows
              .map(
                (r) =>
                  line(
                    [
                      [r.n, 0],
                      [r.n, r.y],
                    ],
                    r.y < 0 ? "rust" : "ink",
                  ) +
                  '<circle cx="' +
                  X(r.n) +
                  '" cy="' +
                  Y(r.y) +
                  '" r="3.2" fill="' +
                  (r.y < 0 ? "#9c4121" : "#116c65") +
                  '"/>',
              )
              .join(""),
        }) +
        metrics([
          ["Smoothed sum", fmt(sum, 6)],
          ["Main term", fmt(main, 6)],
          ["Centered Gχ", fmt(sum - main, 6)],
        ]) +
        '<details><summary>Inspect individual terms</summary><div class="tablewrap"><table><thead><tr><th><var>n</var></th><th><var>Λ(n)</var></th><th><var>χ(n)</var></th><th><var>x/n</var> − 1</th><th>Contribution</th></tr></thead><tbody>' +
        rows
          .map(
            (r) =>
              "<tr><td>" +
              r.n +
              "</td><td>log " +
              r.p +
              "</td><td>" +
              r.sign +
              "</td><td>" +
              fmt(r.weight) +
              "</td><td>" +
              fmt(r.y) +
              "</td></tr>",
          )
          .join("") +
        "</tbody></table></div></details>"
      );
    }
    if (id === "center") {
      const { x, chi } = v;
      const pts = Array.from({ length: 201 }, (_, j) => {
          const z = 1 + ((x - 1) * j) / 200,
            raw = contributions(z, chi).reduce((acc, r) => acc + r.y, 0),
            main =
              chi === "one"
                ? z * Math.log(z) - (1 + 0.5772156649015329) * z
                : -z * centeringRatio();
          return [z, raw, main, raw - main];
        }),
        vals = pts.flatMap((a) => a.slice(1)),
        last = pts[pts.length - 1];
      return (
        chart({
          xMin: 1,
          xMax: x,
          yMin: Math.min(...vals),
          yMax: Math.max(...vals),
          xt: "cutoff x",
          yt: "sum or main term",
          title: "Raw sum, main term and centered difference",
          paint: (X, Y, line) =>
            [1, 2, 3]
              .map((j, i) =>
                line(
                  pts.map((r) => [r[0], r[j]]),
                  ["ink", "dash", "dots"][i],
                ),
              )
              .join(""),
        }) +
        metrics([
          ["Sχ", fmt(last[1], 6)],
          ["Main term M", fmt(last[2], 6)],
          ["Gχ = Sχ − M", fmt(last[3], 6)],
        ])
      );
    }
    if (id === "mellin") {
      const { n, s, u } = v,
        f = (w) => n ** -s * Math.exp(-(s - 1) * w) * -Math.expm1(-w);
      const stop = Math.max(6, u + 1),
        peak = Math.log(s / (s - 1)),
        r = mellin(n, s, u);
      return (
        chart({
          xMax: stop,
          yMax: f(peak) * 1.12,
          xt: "u = log(x/n)",
          yt: "Mellin density",
          title: "Real Mellin density and partial integral",
          paint: (X, Y, line) =>
            '<path fill="#dce8e5" d="M' +
            X(0) +
            " " +
            Y(0) +
            " L" +
            sample(u, 100, f)
              .map(([a, b]) => X(a) + " " + Y(b))
              .join(" L") +
            " L" +
            X(u) +
            " " +
            Y(0) +
            ' Z"/>' +
            line(sample(stop, 200, f)) +
            line(
              [
                [u, 0],
                [u, f(u)],
              ],
              "dash",
            ),
        }) +
        metrics([
          ["Integral to U", fmt(r.area, 6)],
          ["Remaining tail", fmt(r.tail, 6)],
          ["Full integral", fmt(r.total, 6)],
        ])
      );
    }
    if (id === "padic") {
      const p = +v.p,
        d = v.d,
        parts = factorial(p, d),
        val = parts.reduce((s, r) => s + r[1], 0),
        denominator = p * p - 1;
      return (
        chart({
          xMax: Math.max(2, parts.length + 1),
          yMax: Math.max(1, Math.floor(d / p)),
          xt: "prime-power exponent j",
          yt: "⌊d / pʲ⌋",
          title: "Number of multiples in the factorial",
          paint: (X, Y) =>
            parts
              .map(
                (r, i) =>
                  '<rect x="' +
                  (X(i + 1) - 12) +
                  '" y="' +
                  Y(r[1]) +
                  '" width="24" height="' +
                  (Y(0) - Y(r[1])) +
                  '" fill="#116c65"/>',
              )
              .join(""),
        }) +
        metrics([
          ["vₚ(d!)", val],
          ["Loss ceiling", reducedFraction(d - 1, denominator)],
          ["Gain lower bound", reducedFraction(val * denominator - d + 1, denominator)],
        ]) +
        "<p>Leading slope " +
        p +
        "/" +
        (p * p - 1) +
        ". After 1/p + 1/p³ + 1/p⁵ the remainder is " +
        reducedFraction(1, p ** 5 * denominator) +
        ".</p>"
      );
    }
    if (id === "window") {
      const end = (1 + v.delta) * v.u;
      return (
        chart({
          xMax: 22,
          yMax: 1,
          xt: "logarithmic coordinate u",
          yt: "indicator of the selected window",
          title: "One interval with uncontrolled gaps on either side",
          paint: (X, Y, line) =>
            '<rect x="' +
            X(v.u) +
            '" width="' +
            (X(end) - X(v.u)) +
            '" y="' +
            Y(1) +
            '" height="' +
            (Y(0) - Y(1)) +
            '" fill="#e4ebe7"/>' +
            line([
              [v.u, 0],
              [v.u, 1],
              [end, 1],
              [end, 0],
            ]),
        }) +
        metrics([
          ["Log interval", "[" + fmt(v.u) + ", " + fmt(end) + "]"],
          [
            "Original interval",
            "[" + fmt(Math.exp(v.u)) + ", " + fmt(Math.exp(end)) + "]",
          ],
        ])
      );
    }
    if (id === "kernel") {
      const { k, s, width } = v,
        stop = (2 * k) / (s - 2),
        U = k / s / (1 + width / 2),
        V = (1 + width) * U;
      const mass = (a) => gammaWindowMass(k, a * U, a * (V - U));
      return (
        chart({
          xMax: stop,
          yMax: 1.05,
          xt: "logarithmic coordinate u",
          yt: "height relative to own peak",
          title: "Kernel and growth envelope on a selected window",
          paint: (X, Y, line) =>
            '<rect x="' +
            X(U) +
            '" y="' +
            Y(1.05) +
            '" width="' +
            (X(V) - X(U)) +
            '" height="' +
            (Y(0) - Y(1.05)) +
            '" fill="#efede6"/>' +
            line(sample(stop, 240, (u) => profile(k, s, u))) +
            line(
              sample(stop, 240, (u) => profile(k, s - 2, u)),
              "dash",
            ),
        }) +
        metrics([
          ["Kernel peak", fmt(k / s)],
          ["Envelope peak", fmt(k / (s - 2))],
          ["Kernel mass", fmt(100 * mass(s)) + "%"],
          ["Envelope mass", fmt(100 * mass(s - 2)) + "%"],
        ])
      );
    }
    if (id === "orthogonal") {
      const j = +v.j,
        selected = j % 3 === 0;
      const groups = new Map();
      for (const h of [0, 2, 4]) {
        const exponent = (j * h) % 6;
        if (!groups.has(exponent)) groups.set(exponent, []);
        groups.get(exponent).push(h);
      }
      const cx = 282,
        cy = 110,
        r = 79;
      const arrows = [...groups]
        .map(([q, inputs]) => {
          const x = cx + r * Math.cos((q * Math.PI) / 3),
            y = cy - r * Math.sin((q * Math.PI) / 3);
          const right = x >= cx,
            offset = right ? 8 : -8;
          return (
            '<line class="ink" x1="' +
            cx +
            '" y1="' +
            cy +
            '" x2="' +
            x +
            '" y2="' +
            y +
            '"/><circle cx="' +
            x +
            '" cy="' +
            y +
            '" r="4" fill="#116c65"/><text x="' +
            (x + offset) +
            '" y="' +
            (y + 4) +
            '" text-anchor="' +
            (right ? "start" : "end") +
            '">h = ' +
            inputs.join(", ") +
            "</text>"
          );
        })
        .join("");
      return (
        '<svg class="plot" role="img" aria-label="Character values on the complex unit circle" viewBox="0 0 580 222"><title>Character values on the complex unit circle</title><circle cx="' +
        cx +
        '" cy="' +
        cy +
        '" r="' +
        r +
        '" fill="none" stroke="#b9b4a8"/><path class="axis" d="M155 110H400 M282 16V200"/>' +
        arrows +
        '<text x="410" y="116">Re</text><text x="289" y="27">Im</text></svg>' +
        metrics([
          ["Distinct values", groups.size],
          ["Average", selected ? 1 : 0],
          ["Terms at 1", selected ? 3 : 1],
        ])
      );
    }
    if (id === "residue") {
      const { b, t, m, a } = v,
        re = b * (b - 1) - t * t,
        im = (2 * b - 1) * t,
        norm = re * re + im * im;
      const x = -re / norm,
        y = im / norm,
        Xt = (m + a) * x,
        Yt = (m + a) * y,
        ySpan = 1.35 * Math.max(Math.abs(Yt), Xt * 122 / 482),
        xSpan = ySpan * 482 / 122;
      const xMin = (Xt - xSpan) / 2, xMax = (Xt + xSpan) / 2,
        yMin = (Yt - ySpan) / 2, yMax = (Yt + ySpan) / 2;
      const markerRadius = Math.min(4, 0.2 * Math.min(m, a) * Math.hypot(x, y) * 122 / ySpan);
      return (
        chart({
          xMin, xMax, yMin, yMax,
          equal: true,
          xt: "real part",
          yt: "imaginary part",
          title: "Two positively weighted residues on the same ray",
          paint: (X, Y, line) =>
            line([[xMin, 0], [xMax, 0]], "axis") +
            line([[0, yMin], [0, yMax]], "axis") +
            line([
              [0, 0],
              [m * x, m * y],
            ]) +
            line(
              [
                [m * x, m * y],
                [Xt, Yt],
              ],
              "dash",
            ) +
            [0, m, m + a]
              .map(
                (q) =>
                  '<circle cx="' +
                  X(q * x) +
                  '" cy="' +
                  Y(q * y) +
                  '" r="' + markerRadius + '" fill="#116c65"/>',
              )
              .join(""),
        }) +
        metrics([
          ["Total real part", fmt(Xt)],
          ["Total imaginary part", fmt(Yt)],
          ["Scalar weight", fmt(m + a)],
        ])
      );
    }
    if (id === "reflection") {
      const beta = v.b,
        theta = 0.5 + v.fraction * (beta - 0.5),
        eps = (v.epsfrac * (theta - 0.5)) / 9,
        left = v.side === "left",
        start = left ? 1 - beta : beta, reflected = 1 - start;
      return (
        chart({
          xMax: 1,
          yMin: -1.4,
          yMax: 1.4,
          xt: "real part",
          yt: "imaginary part",
          title: "Zeros of the primitive character and its inverse under reflection and conjugation",
          paint: (X, Y, line) =>
            line(
              [
                [0.5, -1.4],
                [0.5, 1.4],
              ],
              "axis",
            ) +
            line(
              [
                [theta, -1.4],
                [theta, 1.4],
              ],
              "dash",
            ) +
            line(
              [
                [start, 1],
                [reflected, -1],
              ],
              "faint",
            ) +
            line([[reflected, -1], [reflected, 1]], "dots") +
            '<circle cx="' + X(start) + '" cy="' + Y(1) + '" r="4" fill="#116c65"/>' +
            '<rect x="' + (X(reflected)-4) + '" y="' + (Y(-1)-4) + '" width="8" height="8" fill="#9c4121"/>' +
            '<circle cx="' + X(reflected) + '" cy="' + Y(1) + '" r="4" fill="white" stroke="#116c65" stroke-width="2"/>',
        }) +
        metrics([
          ["θ", fmt(theta)],
          ["ε", fmt(eps)],
          ["½ + 9ε", fmt(0.5 + 9 * eps)],
        ]) +
        "<p>The starting zero of ψ is at " + fmt(start) + " + i. The functional equation gives a zero of ψ⁻¹ at " +
        fmt(reflected) + " − i. Its conjugate is a zero of ψ at " + fmt(reflected) + " + i.</p>" +
        (left ? "<p>Starting on the left puts the inverse character’s zero to the right of θ. The window bound for ψ⁻¹ excludes it.</p>" :
          "<p>Starting on the right puts the original character’s zero to the right of θ. The window bound for ψ excludes it directly.</p>")
      );
    }
    if (id === "cost") {
      const x = 2 ** v.power,
        e = v.e,
        m = x ** (0.5 - e + 1.5 * e * v.mfrac),
        n = Math.ceil(v.nscale * Math.sqrt((x * m) / x ** (0.5 - e))),
        lo = x * m,
        hi = n * n * x ** (0.5 - e),
        k = lo * (hi / lo) ** v.kfrac,
        vs = [x / m, (x * m) / k, m, k / (n * n)],
        ex = vs.map(Math.log2),
        lb = Math.floor(Math.min(0, ...ex)) - 1,
        ub = Math.ceil(Math.max(...ex)) + 1;
      return (
        chart({
          xMax: 4,
          yMin: lb,
          yMax: ub,
          xt: "costs in the order shown below",
          yt: "log₂(cost)",
          title: "Four costs on a logarithmic scale",
          paint: (X, Y, line) =>
            line(
              [
                [0, 0],
                [4, 0],
              ],
              "axis",
            ) +
            ex
              .map(
                (z, i) =>
                  '<rect x="' +
                  (X(i + 0.5) - 16) +
                  '" y="' +
                  Math.min(Y(0), Y(z)) +
                  '" width="32" height="' +
                  Math.max(1, Math.abs(Y(z) - Y(0))) +
                  '" fill="#116c65"/>',
              )
              .join(""),
        }) +
        metrics(
          ["x / m", "xm / k", "m", "k / n²"].map((s, i) => [s, fmt(vs[i])]),
        ) +
        "<p>x = " +
        x +
        ", m ≈ " +
        fmt(m) +
        ", k ≈ " +
        fmt(k) +
        ", n = " +
        n +
        ".</p>"
      );
    }
    if (id === "lattice") {
      const { a, b, h } = v;
      return (
        chart({
          xMin: -1,
          xMax: 10,
          yMin: -1,
          yMax: 6,
          xt: "first coordinate",
          yt: "second coordinate",
          title: "Fundamental parallelogram in the integer lattice",
          paint: (X, Y, line) => {
            let dots = "";
            for (let x = 0; x < 10; x++) {
              for (let y = 0; y < 6; y++) {
                dots +=
                  '<circle cx="' +
                  X(x) +
                  '" cy="' +
                  Y(y) +
                  '" r="2" fill="#8b8f90"/>';
              }
            }
            return (
              dots +
              '<polygon fill="#8ebdb4" opacity=".6" points="' +
              [
                [0, 0],
                [a, 0],
                [a + h, b],
                [h, b],
              ]
                .map(([x, y]) => X(x) + "," + Y(y))
                .join(" ") +
              '"/>' +
              line([
                [0, 0],
                [a, 0],
                [a + h, b],
                [h, b],
                [0, 0],
              ])
            );
          },
        }) +
        metrics([
          ["Determinant", a * b],
          ["Index", a * b],
          ["Area", a * b],
        ])
      );
    }
    if (id === "theta") {
      let l = 1,
        r = v.sign === "minus" ? -1 : 0;
      const q = v.mix === "mix" ? 0.75 : 0.5,
        pt = [[0, l, r]];
      for (let k = 1; k <= v.len; k++) {
        [l, r] = [q * l + (1 - q) * r, (1 - q) * l + q * r];
        pt.push([k, l, r]);
      }
      return (
        chart({
          xMax: v.len,
          yMin: -1,
          yMax: 1,
          xt: "step in the chain",
          yt: "value at each point",
          title: "Two coordinates of a repeatedly transformed function",
          paint: (X, Y, line) =>
            line(pt.map(([k, x]) => [k, x])) +
            line(
              pt.map(([k, , y]) => [k, y]),
              "dash",
            ),
        }) +
        metrics([
          ["Point A · solid", fmt(l, 7)],
          ["Point B · dashed", fmt(r, 7)],
        ])
      );
    }
    if (id === "rates") {
      const s = 40,
        theta = 0.55,
        t = v.f * Math.sqrt((s - theta) ** 2 - (s - v.b) ** 2),
        d = Math.hypot(s - v.b, t),
        R = (d + s - theta) / 2;
      return (
        chart({
          xMax: v.k,
          yMax: 1.1 * (v.k + 1) * Math.log(R / d),
          xt: "derivative order j",
          yt: "logarithm of the rate ratio",
          title: "Slope of the exponential separation between d and R",
          paint: (X, Y, line) =>
            line([
              [0, Math.log(R / d)],
              [v.k, (v.k + 1) * Math.log(R / d)],
            ]),
        }) +
        metrics([
          ["Distance d", fmt(d, 6)],
          ["Disk radius R", fmt(R, 6)],
          ["Rate ratio at k", fmt((R / d) ** (v.k + 1), 6)],
        ])
      );
    }
    if (id === "zero") {
      const { m, h: a, b, t } = v;
      return (
        chart({
          xMin: -0.5,
          xMax: 0.5,
          yMin: m - 1.15,
          yMax: m + 1.15,
          xt: "horizontal displacement u from ρ",
          yt: "scaled logarithmic derivative",
          title:
            "Multiplicity is the limit of u times the logarithmic derivative",
          paint: (X, Y, line) =>
            line([
              [-0.5, m - a / 2],
              [0.5, m + a / 2],
            ]) +
            line(
              [
                [-0.5, m],
                [0.5, m],
              ],
              "dots",
            ) +
            '<circle cx="' +
            X(0) +
            '" cy="' +
            Y(m) +
            '" r="4" fill="#9c4121"/>',
        }) +
        metrics([
          ["Hypothetical zero", fmt(b) + (t ? " + " + fmt(t) + "i" : "")],
          ["Limit of uD", m],
          ["Regular term a", fmt(a)],
        ])
      );
    }
    throw Error("Unknown figure");
  }
  function defaults(id) {
    return Object.fromEntries(configs[id].params.map((p) => [p.key, p.value]));
  }
  function normal(p, value) {
    if (p.options)
      return p.options.some(([v]) => v === value) ? value : p.value;
    if (value === "" || value === null || !Number.isFinite(+value))
      return p.value;
    const snap = p.min + Math.round((Number(value) - p.min) / p.step) * p.step;
    return Number(Math.max(p.min, Math.min(p.max, snap)).toFixed(8));
  }
  const api = {
    configs,
    progressionDifference,
    centralPeriod,
    kernelOrder,
    minimumScale,
    shearRounding,
    fourierRank,
    countHermitianFrames,
    hermitianDensity,
    heightGrid,
    traceCycles,
    render,
    ramifiedProduct,
    defaults,
    normal,
    contributions,
    primeBase,
    mellin,
    factorial,
    profile,
    gaussianMinorShell,
    primitiveHyperplanes,
    binaryLatticeBox,
    stickelbergerFibres,
    realWhittakerCutoff,
    frobeniusOrbits,
    localizationKernel,
    smallGenusClasses,
    splitGraph,
    gammaWindowMass,
    eulerQuotients,
    rankGrid,
    splitEndpointCoefficients,
    cubicJacobi,
    gramPair,
    bernoulliCarries,
    prismInsertions,
    selectWindow,
    centeringRatio,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BookLabs = api;
})(globalThis);
