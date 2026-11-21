"use strict";
// Static counterparts of the running head, article opening and colophon of andreagourion.com.
const navItems = [
  ["Contents", "index.html#contents"],
  ["Read", "book.html"],
  ["Experiments", "experiments.html"],
  ["Source atlas", "atlas.html"],
  ["Glossary", "reference.html"],
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
        <a class="brand" href="https://andreagourion.com/" aria-label="Andréa Gourion home">
          <img class="brand-symbol" src="assets/simplex-header.svg" width="42" height="42" alt="">
          <span class="brand-copy"><strong>Andréa Gourion</strong></span>
        </a>
        <span class="contents-title" id="menu-heading" hidden>Contents</span>
        <nav class="desktop-nav" aria-label="Book navigation">${navLinks(current)}</nav>
        <button class="mobile-menu-button" type="button" aria-expanded="false" aria-controls="book-menu" hidden>Menu</button>
        <div class="mobile-navigation-panel" id="book-menu" hidden><nav aria-label="Mobile contents">${navLinks(current, true)}</nav></div>
        <noscript><nav class="page-contents" aria-label="Book links">${navLinks(current)}</nav></noscript>
      </div>
    </header>`;
}
function colophon() {
  return `
    <footer class="site-footer"><div class="page-shell colophon">
      <div class="colophon-main">
        <p class="colophon-title"><span class="footer-name sc">Andréa Gourion</span> <i>Mathematical monographs</i></p>
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="index.html">The Riemann Hypothesis</a><a href="reference.html#bibliography">Bibliography</a><a href="print.html">Print edition</a>
        </nav>
      </div>
      <div class="colophon-contact">Independent reconstruction of the argument by Levent Alpöge with Claude.<br><a href="atlas.html#verification">Sources and verification</a></div>
    </div></footer>`;
}
function page(title, body, current = "") {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#fefdfa"><title>${esc(title)} · The Critical Line</title>
<link rel="icon" href="assets/icon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/LibertinusSerif-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/book.css">
<noscript><style>@media screen and (max-width:60rem){.header-inner{flex-wrap:wrap}.desktop-nav{display:flex;flex:1 0 100%;margin:0;gap:.45em 1.15em;padding-bottom:.55em;font-size:.83em}}</style></noscript>
<script defer src="assets/navigation.js"></script><script defer src="assets/reader.js"></script></head>
<body><a class="skip-link" href="#main">Skip to content</a>${runningHead(current)}${body}${colophon()}</body></html>`;
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
function articleHead(title, lead, links = []) {
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
    "</p></div>" +
    nav +
    "</header>"
  );
}
function sectionHeading(n, title) {
  return (
    '<h2><span class="section-number">' + n + "</span>" + esc(title) + "</h2>"
  );
}
function home(chapters, plot) {
  const summary = [
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
  const body = parts
    .map(([id, keys, title, intro], i) => {
      const items = chapters
        .filter(([k]) => keys.includes(k))
        .map(([k, t, d]) => {
          const n = chapters.findIndex((c) => c[0] === k) + 1;
          return (
            '<article class="book-entry"><h3><span class="section-number">' +
            n +
            '</span><a href="book.html#' +
            k +
            '">' +
            esc(t) +
            "</a></h3><p>" +
            esc(d) +
            "</p></article>"
          );
        })
        .join("");
      return (
        '<section id="' +
        id +
        '" class="page-shell article-section">' +
        sectionHeading(i + 1, title) +
        '<p class="section-lead">' +
        intro +
        '</p><div class="measure">' +
        items +
        "</div></section>"
      );
    })
    .join("");
  return `<main id="main" class="article home-article">
    <section class="page-shell opening" aria-labelledby="hero-title">
      <div class="opening-hero">
        <div class="opening-title"><h1 id="hero-title">The Riemann Hypothesis</h1>
          <p class="byline"><span class="sc">An independent reconstruction</span></p>
          <p><a class="button" href="book.html#target">Begin reading</a></p>
        </div>
        ${plot.replace("<svg ", '<svg class="opening-figure" id="opening-plot" ')}
        <p class="opening-caption"><span class="sc">Fig. 1.</span> The height of |ζ(σ + <i>it</i>)| across the critical strip, for 8 ≤ <i>t</i> ≤ 32. In <span class="copper">copper</span>, the section at <span id="slice-label">σ = ½</span>.
        <span class="figure-actions"><span id="slice-controls" hidden><button type="button" id="slice-change" class="text-button">Change section</button> · <button type="button" id="slice-reset" class="text-button">Reset</button> · </span><a href="reference.html#plate">Figure notes</a></span></p>
      </div>
      <div class="abstract" id="contents"><p><b>Where do the zeros lie?</b> The proof published by Levent Alpöge, working with Claude, places every nontrivial zero of the Riemann zeta function on the line of real part one half. This book reconstructs the argument. Several estimates still need a written derivation. <a href="atlas.html#reconstruction">What remains to be explained</a>.</p>
        <nav aria-label="Parts of the monograph">${contents(summary)}</nav>
      </div>
    </section>${body}
  </main>`;
}
module.exports = { page, articleHead, sectionHeading, home, esc };
