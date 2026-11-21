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
  const configs = {
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
        range("b", "Proposed real part β", 0.52, 0.98, 0.02, 0.76),
        range("fraction", "Fraction of gap for θ", 0.1, 0.9, 0.1, 0.5),
        range("epsfrac", "Fraction of ε ceiling", 0.1, 0.9, 0.1, 0.5),
      ],
      caption:
        "The model places θ strictly between ½ and β. Reducing ε keeps the window exponent below θ. Reflecting ρ takes the inverse primitive character to the opposite side of the critical line.",
      method:
        "For the specialized exponent ½+9ε, take θ=½+f(β−½), then ε=g(θ−½)/9, with 0<f,g<1. Any additional theorem-specific upper bound on ε must also be enforced by taking a smaller value. The diagram fixes Im ρ=1.",
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
    let axes = "";
    for (let j = 0; j <= 4; j++) {
      const y = yMin + ((yMax - yMin) * j) / 4;
      axes +=
        '<path class="grid" d="M68 ' +
        Y(y) +
        'H550"/><text x="59" y="' +
        (Y(y) + 4) +
        '" text-anchor="end">' +
        fmt(y, 3) +
        "</text>";
    }
    for (let j = 0; j <= 4; j++) {
      const x = xMin + ((xMax - xMin) * j) / 4;
      axes +=
        '<text x="' +
        X(x) +
        '" y="192" text-anchor="middle">' +
        fmt(x, 3) +
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
      '" viewBox="0 0 580 222"><title>' +
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
  function render(id, v) {
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
      const element = (u, v) => integer(u) + (v < 0 ? " − " : " + ") + Math.abs(v) + "ω";
      const rows = reductions.map(test =>
        '<tr><th scope="row">ω ↦ ' + test.root + "</th><td>" + test.value + "</td><td>" +
        test.conjugate + "</td><td>" + test.order + ", " + test.partnerOrder + "</td></tr>"
      ).join("");
      return "<p>The reduction ω ↦ " + root + " defines χ. Here h = " + h +
        ", so χ(x) reduces to x<sup>" + h + "</sup> modulo " + p + ". The terms at x = 0 and 1 vanish.</p>" +
        metrics([["Terms equal to 1", counts[0]], ["Terms equal to ω", counts[1]], ["Terms equal to ω²", counts[2]]]) +
        "<p>J = <strong>" + element(a, b) + "</strong>. Its inverse-character partner is J̄ = <strong>" +
        element(...partner) + "</strong>. Their product is the norm A² − AB + B² = (" + integer(a) + ")² − (" +
        integer(a) + ")(" + integer(b) + ") + (" + integer(b) + ")² = <strong>" + norm + "</strong>.</p>" +
        '<table class="carry-table"><caption>Two primes above ' + p + '</caption><thead><tr>' +
        '<th scope="col">Test root</th><th scope="col">J mod p</th><th scope="col">J̄ mod p</th>' +
        '<th scope="col">Orders (J, J̄)</th></tr></thead><tbody>' + rows + '</tbody></table>' +
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
        selected.xDegree + ' in X (q = ' + q + ')</caption><thead><tr><th scope="col">Degree in X</th>' +
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
        '<tr><th scope="row">' + block + "</th><td>" + fmt(result.full[i], 8) +
        "</td><td>" + fmt(result.retained[i], 8) + "</td></tr>"
      ).join("");
      return "<p>Dividing the period matrices by 2 and 3 gives the normalized columns " +
        "[a e₁, e₂] and [h e₁ + √(1−h²) e₃, e₄]. Their first columns have inner product " +
        fmt(result.overlap, 8) + ". Their second columns are orthogonal.</p>" +
        '<table class="carry-table"><caption>Squared Gram errors with ' + which.toLowerCase() +
        ' columns retained</caption><thead><tr><th scope="col">Block</th>' +
        '<th scope="col">Full Q</th><th scope="col">Retained Q</th></tr></thead><tbody>' +
        rows + "</tbody></table>" +
        metrics([["Retained inner product", fmt(result.retainedOverlap, 8)],
          ["Full mean Q(K₁₁ − I) / 2", fmt(result.full[0] / 2, 8)],
          ["Retained mean Q(K₁₁ − I) / 1", fmt(result.retained[0], 8)]]);
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
        '<th scope="col">Quotient j</th><th scope="col">Carry θ</th><th scope="col">Sum of u</th>' +
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
        '<details><summary>Inspect individual terms</summary><div class="tablewrap"><table><thead><tr><th>n</th><th>Λ(n)</th><th>χ(n)</th><th>x/n − 1</th><th>Contribution</th></tr></thead><tbody>' +
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
        loss = (d - 1) / (p * p - 1);
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
          ["Loss ceiling", fmt(loss)],
          ["Gain lower bound", fmt(val - loss)],
        ]) +
        "<p>Leading slope " +
        p +
        "/" +
        (p * p - 1) +
        ". After 1/p + 1/p³ + 1/p⁵ the remainder is " +
        fmt(p ** -7 / (1 - p ** -2)) +
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
        '<text x="410" y="116">Re</text><text x="289" y="23">Im</text></svg>' +
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
        eps = (v.epsfrac * (theta - 0.5)) / 9;
      return (
        chart({
          xMax: 1,
          yMin: -1.4,
          yMax: 1.4,
          xt: "real part",
          yt: "imaginary part",
          title: "Proposed zero and its reflection through s ↦ 1−s",
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
                [beta, 1],
                [1 - beta, -1],
              ],
              "faint",
            ) +
            [
              [beta, 1],
              [1 - beta, -1],
            ]
              .map(
                ([x, y]) =>
                  '<circle cx="' +
                  X(x) +
                  '" cy="' +
                  Y(y) +
                  '" r="4" fill="#9c4121"/>',
              )
              .join(""),
        }) +
        metrics([
          ["θ", fmt(theta)],
          ["ε", fmt(eps)],
          ["½ + 9ε", fmt(0.5 + 9 * eps)],
        ])
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
    render,
    defaults,
    normal,
    contributions,
    primeBase,
    mellin,
    factorial,
    profile,
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
