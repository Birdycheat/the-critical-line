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
        "Both arrows lie on the ray determined by −1/[ρ(ρ−1)]. At τ = 0 this ray points along the positive real axis. Solid and dashed segments mark the two contributions.",
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
    " For this illustration U=(k/σ)/(1+δ/2). At a boundary v the normalized upper tail is exp(−av) times the sum of (av)ʲ/j! for j=0,…,k. We add these positive terms in log scale and difference the two tails. The proof chooses σ as a function of δ before selecting the window and k.";
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
  function upperTail(k, v) {
    if (v === 0) return 1;
    const values = [-v];
    for (let j = 1; j <= k; j++) values.push(values[j - 1] + Math.log(v / j));
    const max = Math.max(...values);
    return Math.min(
      1,
      Math.exp(max) * values.reduce((sum, x) => sum + Math.exp(x - max), 0),
    );
  }
  function eulerQuotients(q, s) {
    const x = q ** (-s - 0.5);
    return { split: (1 + x) / (1 - x), inert: 1, normalizer: 1 / (1 - x * x) };
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
  function render(id, v) {
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
      const mass = (a) =>
        Math.max(0, upperTail(k, a * U) - upperTail(k, a * V));
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
        L = Math.hypot(Xt, Yt);
      return (
        chart({
          xMin: -0.1 * L,
          xMax: 1.12 * L,
          yMin: -1.05 * L,
          yMax: 1.05 * L,
          xt: "real part",
          yt: "imaginary part",
          title: "Two positively weighted residues on the same ray",
          paint: (X, Y, line) =>
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
                  '" r="4" fill="#116c65"/>',
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
    upperTail,
    eulerQuotients,
    selectWindow,
    centeringRatio,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BookLabs = api;
})(globalThis);
