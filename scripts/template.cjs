"use strict";
// Static counterparts of the running head, article opening and colophon of andreagourion.com.
const navItems = [
  ["Contents", "index.html#contents"],
  ["Read", "book.html"],
  ["Experiments", "experiments.html"],
  ["Source atlas", "atlas.html"],
  ["Glossary", "reference.html"],
  ["Contribute", "contribute.html"],
];
function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
function navLinks(current, mobile = false) {
  return navItems
    .map(([name, url], i) => {
      const active = name === current;
      const label = mobile
        ? '<span class="contents-number" aria-hidden="true">' +
          (i + 1) +
          "</span><span>" +
          name +
          '</span><span class="contents-leader" aria-hidden="true"></span>' +
          (active ? '<span class="contents-here">here</span>' : "")
        : name;
      return (
        '<a href="' +
        url +
        '"' +
        (active ? ' aria-current="page"' : "") +
        ">" +
        label +
        "</a>"
      );
    })
    .join("");
}
function runningHead(current) {
  return `
    <header class="site-header">
      <div class="page-shell header-inner">
        <span class="contents-title" id="menu-heading" hidden>Contents</span>
        <nav class="desktop-nav" aria-label="Book navigation">${navLinks(current)}</nav>
        <button class="mobile-menu-button" type="button" aria-expanded="false" aria-controls="book-menu" hidden>Menu</button>
        <div class="mobile-navigation-panel" id="book-menu" hidden><nav aria-label="Mobile contents">${navLinks(current, true)}</nav></div>
        <noscript><nav class="page-contents" aria-label="Book links">${navLinks(current)}</nav></noscript>
      </div>
    </header>`;
}
function colophon(meta = {}) {
  const repoUrl = meta.repoUrl || "https://github.com/Birdycheat/the-critical-line";
  const licenseUrl = meta.licenseUrl || "https://creativecommons.org/licenses/by-nc/4.0/deed.en";
  const licenseLabel = meta.licenseLabel || "CC BY-NC 4.0";
  return `
    <footer class="site-footer"><div class="page-shell colophon">
      <div class="colophon-main">
        <p class="colophon-title"><span class="footer-name sc">Andréa Gourion</span> <i>Mathematical monographs</i></p>
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="index.html">The Riemann Hypothesis</a><a href="contribute.html">Contribute</a><a href="explorer.html" hreflang="fr" lang="fr">Français</a><a href="reference.html#bibliography">Bibliography</a><a data-contribute href="${esc(repoUrl + "/releases")}">PDF releases</a><a href="print.html">Print layout (desktop)</a>
        </nav>
      </div>
      <div class="colophon-contact">Independent human-readable reconstruction of the argument announced by Levent Alpöge with Claude.<br><a href="atlas.html#verification">Sources and verification</a> · <a data-contribute href="${esc(repoUrl)}">Git repository</a><br><span class="colophon-rights">Original text, reconstructions and figures © 2026 Andréa Gourion and contributors, licensed under <a rel="license" href="${esc(licenseUrl)}">${esc(licenseLabel)}</a>.</span></div>
    </div></footer>`;
}
function page(title, body, current = "", meta = {}) {
  const lang = meta.lang || "en";
  const siteBase = (meta.siteBase || "https://birdycheat.github.io/the-critical-line/").replace(/\/?$/, "/");
  const fileName = meta.fileName || "index.html";
  const canonical = siteBase + (fileName === "index.html" ? "" : fileName);
  const description =
    meta.description ||
    "An open, source-linked mathematical reconstruction of the Riemann Hypothesis and Dirichlet GRH formalization, with interactive experiments and pinned formal-archive correspondence.";
  const socialImage = siteBase + "assets/social-card.png";
  const fullTitle = title + " · The Critical Line";
  return `<!doctype html>
<html lang="${esc(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#fefdfa"><title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="The Critical Line">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(socialImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The Critical Line: magnitude of the Riemann zeta function across the critical strip, with the critical-line section at sigma = 1/2 in copper.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(socialImage)}">
<link rel="icon" href="assets/icon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/lmroman10-regular.otf" as="font" type="font/otf" crossorigin>
<link rel="stylesheet" href="assets/book.css">
<noscript><style>@media screen and (max-width:60rem){.header-inner{flex-wrap:wrap}.desktop-nav{display:flex;flex:1 0 100%;margin:0;gap:.45em 1.05em;padding-bottom:.55em;font-size:.83em}}</style></noscript>
<script defer src="assets/navigation.js"></script><script defer src="assets/reader.js"></script></head>
<body><a class="skip-link" href="#main">Skip to content</a>${runningHead(current)}${body}${colophon(meta)}</body></html>`;
}
function contents(items) {
  return (
    '<ol class="contents">' +
    items
      .map(
        ([text, href], i) =>
          '<li><a href="' +
          href +
          '"><span class="section-number">' +
          (i + 1) +
          "</span>" +
          esc(text) +
          "</a></li>",
      )
      .join("") +
    "</ol>"
  );
}
function auditToolbar(lang = "en") {
  const isFr = lang === "fr";
  const note = isFr
    ? "Les identifiants formels et permaliens GitHub restent repliés par défaut pour préserver la lecture mathématique."
    : "Formal identifiers and pinned GitHub line links stay folded by default; enable audit mode to keep all correspondences open across pages.";
  const label = isFr
    ? "Mode audit formel : afficher toutes les correspondances"
    : "Formal audit mode: show all correspondences";
  return (
    '<div class="audit-toolbar"><span>' +
    esc(note) +
    '</span><button type="button" class="correspondence-btn" data-correspondence-toggle aria-pressed="false"' +
    (isFr ? ' data-lang="fr"' : "") +
    " hidden>" +
    esc(label) +
    "</button></div>"
  );
}
function articleHead(title, lead, links = [], extraToolbar = "") {
  const nav = links.length
    ? '<nav class="page-contents" aria-label="On this page"><span class="page-contents-label sc">Contents</span><ol>' +
      links
        .map(([t, u]) => '<li><a href="' + u + '">' + esc(t) + "</a></li>")
        .join("") +
      "</ol></nav>"
    : "";
  return (
    '<header class="page-shell article-head"><h1>' +
    esc(title) +
    '</h1><div class="measure"><p>' +
    lead +
    "</p>" +
    extraToolbar +
    "</div>" +
    nav +
    "</header>"
  );
}
function sectionHeading(n, title) {
  return (
    '<h2><span class="section-number">' + n + "</span>" + esc(title) + "</h2>"
  );
}
function home(chapters, plot, stats = {}) {
  const fmt = n => Number(n || 0).toLocaleString("en-US");
  const summary = [
    ["Choose a reading track", "#reading-tracks"],
    ["The analytic language", "#part-analysis"],
    ["Constructing the arithmetic inputs", "#part-arithmetic"],
    ["From estimates to zeros", "#part-conclusion"],
  ];
  const parts = [
    [
      "part-analysis",
      ["target", "pilot"],
      "The analytic language",
      "How a sum over prime powers carries information about a zero.",
    ],
    [
      "part-arithmetic",
      ["local", "normalization", "global", "lifts", "balance", "inputs"],
      "Constructing the arithmetic inputs",
      "How local divisibility, lattice sizes and character averages enter one estimate.",
    ],
    [
      "part-conclusion",
      ["windows", "reflection"],
      "From estimates to zeros",
      "How a bound on distant intervals excludes poles and yields classical RH.",
    ],
  ];
  const chapterStats = stats.byChapter || {};
  const body = parts
    .map(([id, keys, title, intro], i) => {
      const items = chapters
        .filter(([k]) => keys.includes(k))
        .map(([k, t, d]) => {
          const idx = chapters.findIndex(c => c[0] === k);
          const n = idx + 1;
          const chapterFile = "chapter-" + String(n).padStart(2, "0") + ".html";
          const cs = chapterStats[k] || { core: 0, infra: 0, interfaces: 0 };
          const breakdown = [
            cs.core ? cs.core + " novel-core" : "",
            cs.infra ? cs.infra + " rebuilt-classical" : "",
            cs.interfaces
              ? cs.interfaces + " formal " + (cs.interfaces === 1 ? "interface" : "interfaces")
              : "0 open interfaces",
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            '<article class="book-entry"><h3><span class="section-number">' +
            n +
            '</span><a href="book.html#' +
            k +
            '">' +
            esc(t) +
            "</a></h3><p>" +
            esc(d) +
            '</p><p class="micro">' +
            esc(breakdown) +
            " — " +
            '<a href="' +
            chapterFile +
            '">Fast chapter</a> · <a href="book.html#' +
            k +
            '">In full monograph</a> · <a href="contribute.html#review-' +
            k +
            '">Audit or contribute</a></p></article>'
          );
        })
        .join("");
      return (
        '<section id="' +
        id +
        '" class="page-shell article-section">' +
        sectionHeading(i + 2, title) +
        '<p class="section-lead">' +
        intro +
        '</p><div class="measure">' +
        items +
        "</div></section>"
      );
    })
    .join("");

  const tracksSection = `
    <section id="reading-tracks" class="page-shell article-section">
      ${sectionHeading(1, "Three reading tracks")}
      <p class="section-lead">Enter at graduate-student pace, jump directly to the proof’s new arithmetic ideas, or read the complete self-contained reconstruction.</p>
      <div class="tracks-grid">
        <article class="track-card">
          <span class="track-kicker">Track 1 · ~45 min · Advanced undergraduate / M1</span>
          <h3>Analytical skeleton</h3>
          <p>Follow a hypothetical off-line zero (for instance at real part 0.60) to contradiction across five concise chapters while treating the geometric and arithmetic boxes as stated inputs.</p>
          <p class="micro"><a href="chapter-01.html">Ch. 1 Statement</a> → <a href="chapter-02.html">Ch. 2 Mellin &amp; residues</a> → <a href="chapter-07.html">Ch. 7 Balance</a> → <a href="chapter-09.html">Ch. 9 Window</a> → <a href="chapter-10.html">Ch. 10 Reflection</a></p>
        </article>
        <article class="track-card track-card--primary">
          <span class="track-kicker">Track 2 · Domain specialists · ${fmt(stats.coreClaims)} core results</span>
          <h3>Specialist route — Novel proof core</h3>
          <p>Bypass standard theory rebuilt inside the archive and inspect the proof’s genuinely new mechanisms directly, with one-click formal correspondence.</p>
          <p class="micro"><a href="chapter-04.html#normalization-height-two-coordinate">Ch. 3–4 Height-2 CM logarithm</a> · <a href="chapter-05.html#global-cm-class-product">Ch. 5 Chowla–Selberg cancellation</a> · <a href="chapter-05.html#global-gram-frame">5.16 Gram-trace rank bound</a> · <a href="chapter-06.html#lifts-chain">Ch. 6 Paired odd-rank lifts</a> · <a href="chapter-08.html#inputs-degree-two-local">Ch. 8 Window dodge &amp; prime pair</a> · <a href="atlas.html?role=core-argument#ledger"><b>Filter novel core in Atlas</b></a></p>
        </article>
        <article class="track-card">
          <span class="track-kicker">Track 3 · Complete course · ${fmt(stats.totalClaims)} results &amp; ${fmt(stats.experiments)} labs</span>
          <h3>Full self-contained reconstruction</h3>
          <p>Includes all ${fmt(stats.infraClaims)} results of classical infrastructure reconstructed from scratch inside the formal archive (Harish-Chandra discrete series, Capelli minors, PEL integral models, crystalline period frames, Harder–Narasimhan slopes, Stickelberger towers, face complexes), explicitly badged so experts check normalizations and skip ahead.</p>
          <p class="micro"><a href="book.html#target">Read single-page book</a> · <a href="experiments.html">Explore ${fmt(stats.experiments)} interactive labs</a> · <a href="atlas.html?role=rebuilt-infrastructure#ledger">Browse rebuilt infrastructure</a></p>
        </article>
      </div>
    </section>`;

  const correspondenceBlock = stats.methodologyCorrespondence || "";

  return `<main id="main" class="article home-article">
    <section class="page-shell opening" aria-labelledby="hero-title">
      <div class="opening-hero">
        <div class="opening-title"><h1 id="hero-title">The Riemann Hypothesis</h1>
          <p class="byline"><span class="sc">Open collaborative reconstruction</span></p>
          <p><a class="button" href="book.html#target">Begin reading</a></p>
          <p class="hero-secondary"><a href="#reading-tracks">Three reading tracks</a> · <a href="chapter-01.html">Fast chapter 1</a> · <a href="contribute.html">Contribute (Tiers A / B / C)</a> · <a href="explorer.html" hreflang="fr" lang="fr">Lire en français</a></p>
        </div>
        ${plot.replace("<svg ", '<svg class="opening-figure" id="opening-plot" ')}
        <p class="opening-caption"><span class="sc">Fig. 1.</span> The height of |ζ(σ + <i>it</i>)| across the critical strip, for 8 ≤ <i>t</i> ≤ 32. In <span class="copper">copper</span>, the section at <span id="slice-label">σ = ½</span>.
        <span class="figure-actions"><span id="slice-controls" hidden><button type="button" id="slice-change" class="text-button">Change section</button> · <button type="button" id="slice-reset" class="text-button">Reset</button> · </span><a href="reference.html#plate">Figure notes</a></span></p>
      </div>
      <div class="abstract" id="contents">
        <p><b>Decompiling the formal proof for human readers.</b> The formalization published by Levent Alpöge, working with Claude, proves that every nontrivial zero of the Riemann zeta function and of every Dirichlet <i>L</i>-function lies on the critical line σ = ½. Because all 175,187 modules have already been verified by independent proof kernels, the central scientific task is conceptual: reconstructing the human argument, checking exact definitions and hypotheses against the pinned source, and simplifying machine-generated chains.</p>
        <div class="counter-grid">
          <div class="counter-card">
            <span class="track-kicker">1 · Formal archive coverage</span>
            <h3>${fmt(stats.inspectedDecls)} declarations inspected · ${fmt(stats.pinnedRanges)} pinned source ranges</h3>
            <p>Pinned line-by-line across ${fmt(stats.pinnedFiles)} source files in the 14 archive parts (175,187 compiled modules; 1,478,219 reachable constants), with ${fmt(stats.valuePaths)} caller-to-callee proof paths verified directly in the compiled export.</p>
          </div>
          <div class="counter-card">
            <span class="track-kicker">2 · Pedagogical graph status</span>
            <h3>${fmt(stats.writtenClaims)} self-contained nodes · ${fmt(stats.openInterfaces)} pinned formal interfaces</h3>
            <p>${fmt(stats.writtenClaims)} results are derived in self-contained graduate-level prose (${fmt(stats.coreClaims)} novel proof core, ${fmt(stats.infraClaims)} rebuilt classical infrastructure; ${fmt(stats.interfaceClaims)} results sit in ledgers adjacent to an upstream boundary). An open interface is <b>not</b> a logical gap: its formal signature and proof term are already kernel-certified, awaiting detailed human exposition.</p>
          </div>
        </div>
        <div class="methodology-box">
          <h3>Methodology, deterministic guardrails &amp; open human review</h3>
          <p>Directed and edited by <b>Andréa Gourion</b> under <a rel="license" href="${esc(stats.licenseUrl || "https://creativecommons.org/licenses/by-nc/4.0/deed.en")}">${esc(stats.licenseLabel || "CC BY-NC 4.0")}</a>, this edition combines frontier agentic reconstruction directly from the pinned formal archive and its 61.5 GB uncompressed proof export with deterministic verification scripts that check every pinned line range, acyclic dependency edge, exported constant reference, and all ${fmt(stats.experiments)} numerical experiments.</p>
          <p><b>Remaining encapsulated frontiers &amp; human audit:</b> Major upstream blocks still cited as verified formal interfaces include symplectic/unitary deformation rings in the Plus bound, the regularized Eisenstein/Siegel–Weil input, orbital period expansions, and arithmetic prime-window instantiation. External human review is open across three tiers: <a href="contribute.html#tier-a">Tier A (M1/M2+ mathematical audit)</a> · <a href="contribute.html#tier-b">Tier B (source-to-prose fidelity)</a> · <a href="contribute.html#tier-c">Tier C (specialist interface unfolding)</a>.</p>
          ${correspondenceBlock}
        </div>
        <nav aria-label="Parts of the monograph">${contents(summary)}</nav>
      </div>
    </section>${tracksSection}${body}
  </main>`;
}
module.exports = { page, articleHead, sectionHeading, home, auditToolbar, esc };
