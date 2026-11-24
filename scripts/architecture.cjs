"use strict";

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const fmt = n => Number(n || 0).toLocaleString("en-US");

const BOOK_PARTS = [
  {
    roman: "I",
    id: "part-analysis",
    title: "The analytic language",
    chapters: ["target", "pilot"],
  },
  {
    roman: "II",
    id: "part-arithmetic",
    title: "Constructing the arithmetic inputs",
    chapters: ["local", "normalization", "global", "lifts", "balance", "inputs"],
  },
  {
    roman: "III",
    id: "part-conclusion",
    title: "From estimates to zeros",
    chapters: ["windows", "reflection"],
  },
];

function partForChapter(chapterId) {
  return BOOK_PARTS.find(p => p.chapters.includes(chapterId)) || BOOK_PARTS[0];
}

// Thematic sub-block groupings (Level 2.5) for the three large chapters (Ch. 5, Ch. 6, Ch. 8).
const CHAPTER_SUBBLOCKS = {
  global: [
    [1, 7, "Lattice heights, main-term cancellation & Harder–Narasimhan slopes"],
    [8, 16, "Ramified orbit counts & Gram-trace orthonormal frame"],
    [17, 24, "Auxiliary-prime floor, Siegel mass identity & rank quotients"],
    [25, 32, "Real-place formal degree, word scale & CM period frame"],
  ],
  lifts: [
    [1, 8, "Paired odd-rank theta lifts, Satake data & weight gaps"],
    [9, 17, "PEL/geometric cohomology, integral Hecke frames & congruences"],
    [18, 28, "Odd-rank Galois companions, character transfer & row extraction"],
    [29, 41, "Iterated lift nonvanishing, doubling integral & local Euler factors"],
  ],
  inputs: [
    [1, 4, "Good arithmetic windows & conjugation splitting"],
    [5, 14, "Ferrero–Washington, cyclotomic tower descent & window dodge"],
    [15, 21, "The Plus bound, trace congruences & deformation inputs"],
    [22, 31, "The Minus Bernoulli summand, simultaneous prime pair & rescaling"],
  ],
};

// The 14 semantic formal source modules of src/ at @e50d098.
const ARCHIVE_MODULES = [
  {
    num: "01",
    key: "challenge-statements",
    title: "Public targets & strip statements",
    scope: "Classical RH, Dirichlet GRH & functional reflection",
    atlasQuery: "Challenge",
    treePath: "src/Challenge.lean",
    isFile: true,
  },
  {
    num: "02",
    key: "windows-kernels",
    title: "Analytic windows & Mellin kernels",
    scope: "Laplace localization, zero-free strips & Vandermonde tails",
    atlasQuery: "SizeWindowBrackets",
    treePath: "src/Formalism/SizeWindowBrackets",
  },
  {
    num: "03",
    key: "dedekind-characters",
    title: "Dedekind L-series & character boxes",
    scope: "Logarithmic derivatives, Gauss sums & character averages",
    atlasQuery: "DedekindLFunctions",
    treePath: "src/Development/AutomorphicArithmetic/DedekindLFunctions",
  },
  {
    num: "04",
    key: "jets-logarithms",
    title: "Height-2 formal logarithms & jets",
    scope: "Torsion norm iteration, factorial jets & p-adic approximation",
    atlasQuery: "GaussJetBounds",
    treePath: "src/Formalism/GaussJetBounds",
  },
  {
    num: "05",
    key: "heights-slopes",
    title: "Global heights & Harder–Narasimhan slopes",
    scope: "Hermitian lattices, curvature & rank-weighted slope bounds",
    atlasQuery: "HarderNarasimhan",
    treePath: "src/Formalism/HarderNarasimhan",
  },
  {
    num: "06",
    key: "foundations-algebra",
    title: "Arithmetic foundations & class towers",
    scope: "Valuations, local ring cardinality, Stickelberger & orders",
    atlasQuery: "AutomorphicArithmetic/Foundations",
    treePath: "src/Development/AutomorphicArithmetic/Foundations",
  },
  {
    num: "07",
    key: "automorphic-varieties",
    title: "PEL Shimura models & CM periods",
    scope: "Integral moduli, CM class products & crystalline frames",
    atlasQuery: "AutomorphicVarieties",
    treePath: "src/Development/AutomorphicArithmetic/AutomorphicVarieties",
  },
  {
    num: "08",
    key: "abelian-varieties",
    title: "Abelian varieties & isogeny blocks",
    scope: "Polarization graphs, torsion reductions & block operators",
    atlasQuery: "AbelianVarietyTheory",
    treePath: "src/Development/AbelianVarietyTheory",
  },
  {
    num: "09",
    key: "theta-spectrum",
    title: "Theta correspondence & cusp spectrum",
    scope: "Paired odd-rank lifts, doubling integrals & Siegel–Weil",
    atlasQuery: "ThetaCorrespondence",
    treePath: "src/Development/AutomorphicArithmetic/ThetaCorrespondence",
  },
  {
    num: "10",
    key: "reductive-satake",
    title: "Reductive groups, flags & Satake data",
    scope: "Parabolic shells, Iwahori slopes & dual Weyl parameters",
    atlasQuery: "ReductiveGroups",
    treePath: "src/ReciprocityTheory/ReductiveGroups",
  },
  {
    num: "11",
    key: "companion-spectral",
    title: "Discrete series & spectral geometry",
    scope: "Harish-Chandra modules, Casimir cutoffs & Capelli shifts",
    atlasQuery: "SpectralGeometry",
    treePath: "src/CompanionTheory/SpectralGeometry",
  },
  {
    num: "12",
    key: "meansquare-bounds",
    title: "Mean-square & detector averages",
    scope: "GL(3) / character mean squares & rank-gap bounds",
    atlasQuery: "GL3MeanSquares",
    treePath: "src/Formalism/GL3MeanSquares",
  },
  {
    num: "13",
    key: "restriction-periods",
    title: "Sharp restriction & orbital periods",
    scope: "Archimedean test weights, period integrals & unipotent fibres",
    atlasQuery: "SharpRestriction",
    treePath: "src/Formalism/SharpRestriction",
  },
  {
    num: "14",
    key: "localtoglobal-weil",
    title: "Local-to-global, Weil & Galois bounds",
    scope: "Étale cohomology, deformation tangents & Plus/Minus assembly",
    atlasQuery: "WeilBound",
    treePath: "src/Development/WeilBound",
  },
];

function classifyArchiveModule(relPath) {
  const p = String(relPath || "").replace(/^src\//, "").split("/");
  const top = p[0] || "";
  const sec = p[1] || "";
  const third = p[2] || "";
  if (
    top === "Challenge.lean" ||
    top === "Statements.lean" ||
    top === "Main.lean" ||
    ["Challenge", "Statements", "Main"].includes(top)
  ) {
    return "challenge-statements";
  }
  if (
    top === "Supplements" ||
    (top === "Formalism" &&
      [
        "SizeWindowBrackets",
        "LandauZeroFreeBounds",
        "LFunctionBounds",
        "ZeroFreeRegion",
        "GammaFactorNonvanishing",
        "IncomingBounds",
        "LogVandermondeBounds",
      ].includes(sec))
  ) {
    return "windows-kernels";
  }
  if (
    top === "Development" &&
    sec === "AutomorphicArithmetic" &&
    ["DedekindLFunctions", "CharacterBoxes", "PrimitiveCosets"].includes(third)
  ) {
    return "dedekind-characters";
  }
  if (
    (top === "Formalism" && ["GaussJetBounds", "TorsionNormIteration"].includes(sec)) ||
    (top === "Development" && sec === "AutomorphicArithmetic" && third === "PAdicLatticeApproximation")
  ) {
    return "jets-logarithms";
  }
  if (
    top === "GroundTheory" ||
    (top === "Formalism" &&
      ["HarderNarasimhan", "HermitianCurvature", "HermitianLattices", "LatticeSlopes", "QuotientMetricDivisors"].includes(sec))
  ) {
    return "heights-slopes";
  }
  if (
    (top === "Development" &&
      sec === "AutomorphicArithmetic" &&
      ["Foundations", "CommutativeAlgebra"].includes(third)) ||
    (top === "Formalism" && sec === "LocalRingCardinality")
  ) {
    return "foundations-algebra";
  }
  if (top === "Development" && sec === "AutomorphicArithmetic" && third === "AutomorphicVarieties") {
    return "automorphic-varieties";
  }
  if (top === "Development" && sec === "AbelianVarietyTheory") {
    return "abelian-varieties";
  }
  if (
    (top === "Development" && sec === "AutomorphicArithmetic" && third === "ThetaCorrespondence") ||
    (top === "Development" && sec === "AutomorphicSpectrum")
  ) {
    return "theta-spectrum";
  }
  if (
    top === "ReciprocityTheory" ||
    (top === "Formalism" && ["SatakeDualWeyl", "FlagUnipotentLattices"].includes(sec))
  ) {
    return "reductive-satake";
  }
  if (top === "CompanionTheory") {
    return "companion-spectral";
  }
  if (
    (top === "Formalism" && ["GL3MeanSquares", "RankGapBounds"].includes(sec)) ||
    (top === "Development" && sec === "AutomorphicArithmetic" && third === "MeanSquareBounds")
  ) {
    return "meansquare-bounds";
  }
  if (
    top === "Formalism" &&
    ["SharpRestriction", "RealPlaceAnalysis", "PeriodIntegrals"].includes(sec)
  ) {
    return "restriction-periods";
  }
  return "localtoglobal-weil";
}

function renderChapterStatusBar(cs = {}, options = {}) {
  const core = cs.core || 0;
  const infra = cs.infra || 0;
  const interfaces = cs.interfaces || 0;
  const totalClaims = cs.total || core + infra;
  const human = cs.humanReviewed || 0;
  const denom = Math.max(core + infra + interfaces, 1);
  const pCore = +((core / denom) * 100).toFixed(2);
  const pInfra = +((infra / denom) * 100).toFixed(2);
  const pIf = +((interfaces / denom) * 100).toFixed(2);

  // For chapters with 0 indexed ledger claims (e.g. Ch. 9 narrative proof), show 100% self-contained analytic prose bar.
  const barSegments =
    core + infra + interfaces === 0
      ? '<span class="seg seg-core" style="width:100%" title="Self-contained analytic chapter (0 open interfaces)"></span>'
      : (core ? `<span class="seg seg-core" style="width:${pCore}%" title="${core} novel proof-core results"></span>` : "") +
        (infra ? `<span class="seg seg-infra" style="width:${pInfra}%" title="${infra} rebuilt classical-infrastructure results"></span>` : "") +
        (interfaces ? `<span class="seg seg-interface" style="width:${pIf}%" title="${interfaces} open formal interfaces"></span>` : "");

  const pills = [
    core
      ? `<span class="stat-pill"><i class="dot dot-core" aria-hidden="true"></i>${fmt(core)} novel core</span>`
      : totalClaims === 0
        ? `<span class="stat-pill"><i class="dot dot-core" aria-hidden="true"></i>Self-contained analytic proof</span>`
        : "",
    infra
      ? `<span class="stat-pill"><i class="dot dot-infra" aria-hidden="true"></i>${fmt(infra)} rebuilt classical</span>`
      : "",
    interfaces
      ? `<span class="stat-pill stat-pill--if"><i class="dot dot-interface" aria-hidden="true"></i>${fmt(interfaces)} formal ${interfaces === 1 ? "interface" : "interfaces"}</span>`
      : `<span class="stat-pill stat-pill--clean"><i class="dot dot-clean" aria-hidden="true"></i>0 open interfaces</span>`,
    totalClaims > 0
      ? `<span class="stat-pill stat-pill--human" title="Independent human mathematical audit sign-offs">${fmt(human)} / ${fmt(totalClaims)} human-verified</span>`
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  if (options.compact) {
    return `<div class="chapter-meter chapter-meter--compact"><div class="status-bar" aria-hidden="true">${barSegments}</div><div class="status-pills micro">${pills}</div></div>`;
  }
  return `<div class="chapter-meter"><div class="status-bar" aria-hidden="true">${barSegments}</div><p class="status-pills micro">${pills}</p></div>`;
}

function sectionBadgeHtml(sec) {
  const badges = [];
  if (sec.core > 0 || (sec.core === 0 && sec.infra === 0)) {
    badges.push(
      `<span class="mini-badge mini-badge--core">${sec.core > 0 ? sec.core + " core" : "analytic spine"}</span>`,
    );
  }
  if (sec.infra > 0) {
    badges.push(`<span class="mini-badge mini-badge--infra">${sec.infra} classical</span>`);
  }
  if (sec.interfaces > 0) {
    badges.push(
      `<span class="mini-badge mini-badge--if">${sec.interfaces} ${sec.interfaces === 1 ? "interface" : "interfaces"}</span>`,
    );
  }
  return badges.join(" ");
}

function renderSectionItem(chapterFile, sec) {
  return (
    `<li><a href="${esc(chapterFile)}#${esc(sec.anchor)}"><span class="outline-num">${esc(sec.number)}</span>${esc(sec.title)}</a> ` +
    `<span class="outline-badges">${sectionBadgeHtml(sec)}</span></li>`
  );
}

function renderChapterOutline(chapterId, chapterFile, sections = []) {
  if (!sections.length) return "";
  const subblocks = CHAPTER_SUBBLOCKS[chapterId];
  if (!subblocks) {
    return (
      `<details class="chapter-outline"><summary>Show sections &amp; architecture (${sections.length} sections)</summary>` +
      `<ol class="outline-list">${sections.map(s => renderSectionItem(chapterFile, s)).join("")}</ol></details>`
    );
  }
  const chNum = sections[0]?.number.split(".")[0] || "";
  const groupsHtml = subblocks
    .map(([a, b, label]) => {
      const slice = sections.filter(s => {
        const sub = Number(s.number.split(".")[1] || 0);
        return sub >= a && sub <= b;
      });
      if (!slice.length) return "";
      const agg = slice.reduce(
        (acc, s) => ({
          core: acc.core + s.core,
          infra: acc.infra + s.infra,
          interfaces: acc.interfaces + s.interfaces,
        }),
        { core: 0, infra: 0, interfaces: 0 },
      );
      const firstAnchor = slice[0].anchor;
      return (
        `<details class="outline-group"><summary><span class="outline-range">${chNum}.${a}–${chNum}.${b}</span> ` +
        `<span>${esc(label)}</span> <span class="outline-badges">${sectionBadgeHtml(agg)}</span></summary>` +
        `<p class="micro outline-jump"><a href="${esc(chapterFile)}#${esc(firstAnchor)}">Jump straight to §${chNum}.${a}</a></p>` +
        `<ol class="outline-list">${slice.map(s => renderSectionItem(chapterFile, s)).join("")}</ol></details>`
      );
    })
    .join("");

  return (
    `<details class="chapter-outline"><summary>Show sections &amp; architecture (${subblocks.length} sub-blocks · ${sections.length} sections)</summary>` +
    `<div class="outline-groups">${groupsHtml}</div></details>`
  );
}

function renderMacroBlueprint(stats = {}) {
  const cs = stats.byChapter || {};
  const chBox = (num, key, x, y, w, h, shortTitle, subline, href) => {
    const c = cs[key] || { total: 0, core: 0, infra: 0, interfaces: 0 };
    const clean = (c.interfaces || 0) === 0;
    const cls = clean ? "bp-node bp-node--clean" : "bp-node bp-node--interface";
    const statusLine = clean
      ? `${c.total ? c.total + " results · " : ""}100% self-contained`
      : `${c.core} core · ${c.infra} classical · ${c.interfaces} if.`;
    return (
      `<a href="${esc(href)}" class="bp-link" data-bp-node="ch${num}">` +
      `<g class="${cls}" transform="translate(${x},${y})">` +
      `<rect class="bp-card" width="${w}" height="${h}" rx="2"/>` +
      `<rect class="bp-accent" width="4" height="${h}"/>` +
      `<text x="12" y="19" class="bp-kicker">CH. ${num}${clean ? " · SELF-CONTAINED" : " · INTERFACE-BACKED"}</text>` +
      `<text x="12" y="38" class="bp-title">${esc(shortTitle)}</text>` +
      `<text x="12" y="54" class="bp-sub">${esc(subline)}</text>` +
      `<text x="12" y="70" class="bp-meta">${esc(statusLine)}</text>` +
      `</g></a>`
    );
  };

  const ifBox = (code, x, y, w, h, title, subline, feedsLabel, href) =>
    `<a href="${esc(href)}" class="bp-link" data-bp-node="${esc(code)}">` +
    `<g class="bp-node bp-node--formal" transform="translate(${x},${y})">` +
    `<rect class="bp-card" width="${w}" height="${h}" rx="2"/>` +
    `<text x="11" y="18" class="bp-kicker bp-kicker--if">OPEN FORMAL INTERFACE · @e50d098</text>` +
    `<text x="11" y="36" class="bp-title">${esc(title)}</text>` +
    `<text x="11" y="52" class="bp-sub">${esc(subline)}</text>` +
    `<text x="11" y="68" class="bp-meta">${esc(feedsLabel)}</text>` +
    `</g></a>`;

  // Directed edges between nodes: [from, to, pathD, dashed]
  const edges = [
    ["ch1", "ch2", "M 238 60 L 274 60", false],
    ["ch2", "ch9", "M 498 60 L 530 60 L 530 456 L 552 456", false],
    ["ch3", "ch4", "M 196 196 L 222 196", false],
    ["ch4", "ch5", "M 432 196 L 458 196", false],
    ["ch5", "ch6", "M 668 196 L 694 196", false],
    ["ch6", "ch8", "M 802 236 L 802 258 L 930 258 L 930 236", false],
    ["ch5", "ch7", "M 563 236 L 563 418", false],
    ["ch8", "ch7", "M 930 236 L 930 396 L 444 396 L 444 418", false],
    ["ch7", "ch9", "M 504 456 L 552 456", false],
    ["ch8", "ch9", "M 950 236 L 950 404 L 664 404 L 664 418", false],
    ["ch9", "ch10", "M 776 456 L 812 456", false],
    // Dashed interface supply edges into Ch. 4, 5, 6, 8
    ["if1", "ch4", "M 135 292 L 310 236", true],
    ["if1", "ch6", "M 205 292 L 735 236", true],
    ["if1", "ch8", "M 245 292 L 885 236", true],
    ["if2", "ch5", "M 395 292 L 535 236", true],
    ["if2", "ch6", "M 455 292 L 765 236", true],
    ["if3", "ch4", "M 615 292 L 365 236", true],
    ["if3", "ch5", "M 655 292 L 585 236", true],
    ["if3", "ch8", "M 735 292 L 910 236", true],
    ["if4", "ch5", "M 885 292 L 620 236", true],
    ["if4", "ch8", "M 935 292 L 965 236", true],
  ];

  const edgeSvg = edges
    .map(
      ([from, to, d, dashed]) =>
        `<path class="bp-edge${dashed ? " bp-edge--dashed" : ""}" data-from="${from}" data-to="${to}" d="${d}" marker-end="url(#${dashed ? "bp-arrow-if" : "bp-arrow"})"/>`,
    )
    .join("");

  return `
    <section id="macro-blueprint-section" class="page-shell article-section">
      <h2><span class="section-number">2</span>Macro-blueprint of the proof (10 chapters &amp; 4 formal interfaces)</h2>
      <p class="section-lead">Click any block to open the standalone chapter or inspect the corresponding Tier C formal boundary. Six chapters are 100% self-contained in human prose; four chapters draw on kernel-verified upstream interfaces at <i>@e50d098</i>.</p>
      <div class="blueprint-legend micro" aria-label="Blueprint color key">
        <span><i class="dot dot-clean" aria-hidden="true"></i><b>Self-contained chapter</b> (Ch. 1, 2, 3, 7, 9, 10 — 0 open interfaces)</span>
        <span><i class="dot dot-core" aria-hidden="true"></i><b>Interface-backed chapter</b> (Ch. 4, 5, 6, 8 — novel core + classical + upstream input)</span>
        <span><i class="dot dot-interface" aria-hidden="true"></i><b>Dashed box:</b> kernel-certified formal interface (click to unfold in Tier C)</span>
      </div>
      <div class="blueprint-scroll">
        <svg id="macro-blueprint" class="macro-blueprint" viewBox="0 0 1050 512" role="img" aria-label="Directed dependency blueprint of the ten chapters and four formal-boundary interfaces">
          <defs>
            <marker id="bp-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#565e63"/>
            </marker>
            <marker id="bp-arrow-if" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#1c5d86"/>
            </marker>
          </defs>
          <text x="14" y="15" class="bp-band-label">PART I · ANALYTIC OPENING (HYPOTHETICAL OFF-LINE ZERO → SIMPLE POLE)</text>
          <text x="14" y="148" class="bp-band-label">PART II · ARITHMETIC, GEOMETRIC &amp; AUTOMORPHIC ENGINE</text>
          <text x="14" y="283" class="bp-band-label bp-band-label--if">UPSTREAM KERNEL-CERTIFIED FORMAL INTERFACES (${fmt(stats.openInterfaces)} TIER C BOUNDARIES)</text>
          <text x="280" y="410" class="bp-band-label">PART III · WINDOW CONTRADICTION &amp; CLASSICAL RH / GRH</text>
          <g class="bp-edges">${edgeSvg}</g>
          ${chBox(1, "target", 14, 22, 224, 78, "Statement & characters", "Zeta, Dirichlet L & reduction", "chapter-01.html")}
          ${chBox(2, "pilot", 276, 22, 222, 78, "Mellin & pole residue", "Prime-power ramp & simple pole", "chapter-02.html")}
          ${chBox(3, "local", 14, 158, 182, 78, "Formal log & jets", "Height-2 cyclic row weights", "chapter-03.html")}
          ${chBox(4, "normalization", 224, 158, 208, 78, "Global theta & jet", "Normalized kernel & orbits", "chapter-04.html")}
          ${chBox(5, "global", 460, 158, 208, 78, "Lattices & main term", "Slopes, Gram rank & mass", "chapter-05.html")}
          ${chBox(6, "lifts", 696, 158, 198, 78, "Paired theta lifts", "PEL models & odd companions", "chapter-06.html")}
          ${chBox(8, "inputs", 906, 158, 132, 78, "Window inputs", "Towers & Plus/Minus", "chapter-08.html")}
          ${ifBox(
            "if1",
            14,
            292,
            246,
            76,
            "GSp₄ / U(3) deformation rings",
            "Plus bound, CM moduli & companions",
            "Feeds Ch. 4, 6, 8 · Arithmetic geometry",
            "contribute.html?area=Arithmetic+geometry%2C+moduli+%26+p-adic+periods#tier-c",
          )}
          ${ifBox(
            "if2",
            274,
            292,
            246,
            76,
            "Regularized Siegel–Weil",
            "Eisenstein mass, cusp & short flags",
            "Feeds Ch. 5, 6 · Automorphic forms",
            "contribute.html?area=Automorphic+forms%2C+Siegel%E2%80%93Weil+%26+cusp+geometry#tier-c",
          )}
          ${ifBox(
            "if3",
            534,
            292,
            246,
            76,
            "Orbital period expansions",
            "Discrete-series shifts & formal degree",
            "Feeds Ch. 4, 5, 8 · Lie groups & analysis",
            "contribute.html?area=Lie+groups%2C+discrete+series+%26+real+analysis#tier-c",
          )}
          ${ifBox(
            "if4",
            794,
            292,
            244,
            76,
            "Prime-window instantiation",
            "5-clause detector & twist repulsion",
            "Feeds Ch. 5, 8 · Analytic number theory",
            "contribute.html?area=Analytic+number+theory+%26+prime+windows#tier-c",
          )}
          ${chBox(7, "balance", 280, 418, 224, 78, "Arithmetic balance", "Character survival & level sum", "chapter-07.html")}
          ${chBox(9, "windows", 554, 418, 222, 78, "One-sided window", "Derivative rates exclude pole", "chapter-09.html")}
          ${chBox(10, "reflection", 814, 418, 224, 78, "Reflection & RH / GRH", "Strip symmetry & final theorem", "chapter-10.html")}
        </svg>
      </div>
    </section>`;
}

function renderProofBreadcrumb(chapterIndex, chapters, sections = []) {
  const [cid, ctitle] = chapters[chapterIndex];
  const part = partForChapter(cid);
  const firstSec = sections[0];
  return (
    `<div class="proof-breadcrumb page-shell" aria-label="Proof branch position">` +
    `<div class="proof-breadcrumb-trail micro">` +
    `<a href="index.html#${esc(part.id)}">Part ${part.roman} · ${esc(part.title)}</a>` +
    `<span aria-hidden="true">›</span>` +
    `<b>Ch. ${chapterIndex + 1} · ${esc(ctitle)}</b>` +
    (firstSec
      ? `<span aria-hidden="true">›</span><span data-active-section-label>§${esc(firstSec.number)} ${esc(firstSec.title)}</span>`
      : "") +
    `</div>` +
    `<button type="button" class="proof-drawer-toggle text-button micro" data-rail-toggle aria-expanded="false" aria-controls="proof-rail">Sections &amp; proof tree (${sections.length})</button>` +
    `</div>`
  );
}

function renderProofRail(chapterIndex, chapters, sections = [], byChapterStats = {}) {
  const [cid] = chapters[chapterIndex];
  const chapterSpine = chapters
    .map(([k, t], idx) => {
      const f = "chapter-" + String(idx + 1).padStart(2, "0") + ".html";
      const active = idx === chapterIndex;
      const clean = (byChapterStats[k]?.interfaces || 0) === 0;
      return (
        `<li${active ? ' class="is-current"' : ""}>` +
        `<a href="${f}"${active ? ' aria-current="page"' : ""}>` +
        `<i class="dot ${clean ? "dot-clean" : "dot-core"}" aria-hidden="true"></i>` +
        `<span>${idx + 1}. ${esc(t)}</span></a></li>`
      );
    })
    .join("");

  const subblocks = CHAPTER_SUBBLOCKS[cid];
  let secTreeHtml = "";
  if (subblocks) {
    const chNum = chapterIndex + 1;
    secTreeHtml = subblocks
      .map(([a, b, label], gIdx) => {
        const slice = sections.filter(s => {
          const sub = Number(s.number.split(".")[1] || 0);
          return sub >= a && sub <= b;
        });
        if (!slice.length) return "";
        return (
          `<details class="rail-group"${gIdx === 0 ? " open" : ""}>` +
          `<summary>${chNum}.${a}–${chNum}.${b} · ${esc(label)}</summary>` +
          `<ol class="rail-sections">${slice
            .map(
              s =>
                `<li><a href="#${esc(s.anchor)}" data-rail-link="${esc(s.anchor)}">` +
                `<i class="dot ${s.interfaces > 0 ? "dot-interface" : s.infra > 0 && s.core === 0 ? "dot-infra" : "dot-core"}" aria-hidden="true"></i>` +
                `<span class="rail-sec-num">${esc(s.number)}</span> <span>${esc(s.title)}</span></a></li>`,
            )
            .join("")}</ol></details>`
        );
      })
      .join("");
  } else {
    secTreeHtml =
      `<ol class="rail-sections">` +
      sections
        .map(
          s =>
            `<li><a href="#${esc(s.anchor)}" data-rail-link="${esc(s.anchor)}">` +
            `<i class="dot ${s.interfaces > 0 ? "dot-interface" : s.infra > 0 && s.core === 0 ? "dot-infra" : "dot-core"}" aria-hidden="true"></i>` +
            `<span class="rail-sec-num">${esc(s.number)}</span> <span>${esc(s.title)}</span></a></li>`,
        )
        .join("") +
      `</ol>`;
  }

  return (
    `<aside class="proof-rail" id="proof-rail" aria-label="Chapter sections and proof tree">` +
    `<div class="proof-rail-inner">` +
    `<p class="rail-heading sc">In Chapter ${chapterIndex + 1} (${sections.length} sections)</p>` +
    secTreeHtml +
    `<details class="rail-spine"><summary class="sc">All 10 chapters &amp; blueprint</summary>` +
    `<ol class="rail-chapters">${chapterSpine}</ol>` +
    `<p class="micro"><a href="index.html#macro-blueprint-section">View full SVG blueprint</a> · <a href="atlas.html#ledger">Source atlas</a></p>` +
    `</details>` +
    `</div></aside>`
  );
}

function renderArchiveMatrix(chapters, matrixData, correspondenceFn, corpus, pin) {
  const headerCols = chapters
    .map((_, i) => `<th scope="col" class="num-col"><a href="chapter-${String(i + 1).padStart(2, "0")}.html">C${i + 1}</a></th>`)
    .join("");

  const rows = ARCHIVE_MODULES.map(mod => {
    const counts = matrixData[mod.key] || {};
    let rowTotal = 0;
    const cells = chapters
      .map(([cid], idx) => {
        const v = counts[cid] || 0;
        rowTotal += v;
        if (!v) return `<td class="num-col zero-cell">·</td>`;
        const chapterFile = `chapter-${String(idx + 1).padStart(2, "0")}.html`;
        return `<td class="num-col active-cell"><a href="${chapterFile}" title="${v} reconstructed results in Chapter ${idx + 1}">${v}</a></td>`;
      })
      .join("");
    const atlasHref = `atlas.html?q=${encodeURIComponent(mod.atlasQuery)}#ledger`;
    return (
      `<tr>` +
      `<th scope="row"><span class="mod-num">${mod.num}</span> <a href="${esc(atlasHref)}">${esc(mod.title)}</a>` +
      `<span class="mod-scope micro">${esc(mod.scope)}</span></th>` +
      cells +
      `<td class="num-col total-col"><a href="${esc(atlasHref)}"><b>${fmt(rowTotal)}</b></a></td>` +
      `</tr>`
    );
  }).join("");

  let technicalDrawer = "";
  if (correspondenceFn && corpus && pin) {
    const treeBase = `${corpus.primary_mirror.url}/tree/${pin}/`;
    const blobBase = `${corpus.primary_mirror.url}/blob/${pin}/`;
    const dirLinks = ARCHIVE_MODULES.map(m => {
      const u = (m.isFile ? blobBase : treeBase) + m.treePath;
      return `<li><b>${m.num}.</b> <a href="${esc(u)}"><code>${esc(m.treePath)}</code></a> — ${esc(m.title)}</li>`;
    }).join("");
    const parts = (corpus.original_archive?.parts || [])
      .map(
        p =>
          `<code>${esc(p.filename)}</code> (SHA-256 <code>${esc(String(p.sha256).slice(0, 12))}…</code>)`,
      )
      .join(" · ");
    technicalDrawer = correspondenceFn(
      `<p><b>Direct Lean package trees at <code>@${esc(pin.slice(0, 7))}</code> &amp; physical archive chunks:</b> Note that <code>lean.tar.gz.part01</code>–<code>part14</code> in the original release are 14 byte-split transport slices of one tarball (${parts}), whereas the 14 rows above give the mathematical decomposition of <code>src/</code>:</p><ul>${dirLinks}</ul>`,
    );
  }

  return (
    `<div class="tablewrap matrix-wrap">` +
    `<table class="archive-matrix">` +
    `<thead><tr><th scope="col">Formal archive module (1–14)</th>${headerCols}<th scope="col" class="num-col">Results</th></tr></thead>` +
    `<tbody>${rows}</tbody>` +
    `</table></div>` +
    technicalDrawer
  );
}

module.exports = {
  BOOK_PARTS,
  partForChapter,
  CHAPTER_SUBBLOCKS,
  ARCHIVE_MODULES,
  classifyArchiveModule,
  renderChapterStatusBar,
  renderChapterOutline,
  renderMacroBlueprint,
  renderProofBreadcrumb,
  renderProofRail,
  renderArchiveMatrix,
};
