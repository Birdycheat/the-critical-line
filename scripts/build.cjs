"use strict";
const fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = (p) =>
  fs.readFileSync(path.join(root, p), "utf8").replace(/^\uFEFF/, "");
const data = (p) => JSON.parse(read("records/" + p + ".json"));
const save = (p, s) => fs.writeFileSync(path.join(root, p), s + "\n", "utf8");
const esc = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const { configs, render, defaults } = require("../assets/labs.js"),
  { plate } = require("./plate.cjs");
const ed = data("edition"),
  corpus = data("corpus"),
  tar = data("targets");
const pin = corpus.primary_mirror.commit,
  blob = corpus.primary_mirror.url + "/blob/" + pin + "/";
const chapters = ed.chapters.filter(([id]) =>
  fs.existsSync(path.join(root, "content", id + ".html")),
);
const num = (i) => String(i + 1).padStart(2, "0");
const { page, articleHead, sectionHeading, home } = require("./template.cjs");
const { readingPassages, formalUrl, printExamples, correspondence } = require("./reading-passages.cjs");
const background = data("background_theorems").theorems;
const sourceFiles = fs.readdirSync(path.join(root, "records"))
  .filter(f => f.endsWith(".json") && !["corpus.json", "edition.json", "targets.json"].includes(f));
const allClaims = [
  ...tar.targets.map(c => ({ ...c, anchor: "target-exact" })),
  ...sourceFiles.flatMap(f => data(f.slice(0, -5)).claims || []),
];
const claimsById = new Map(allClaims.map(c => [c.id, c]));
const byPassage = new Map();
function passageLink(anchor, entry) {
  if (!byPassage.has(anchor)) byPassage.set(anchor, []);
  byPassage.get(anchor).push(entry);
}
for (const c of allClaims) {
  if (!c.title) throw Error("A mathematical result needs a reading title: " + c.id);
  passageLink(c.anchor || c.section || c.chapter, { title: c.title, href: "atlas.html#claim-" + c.id });
}
for (const t of background) {
  for (const anchor of t.passages) {
    passageLink(anchor, { title: t.title, href: "reference.html#theorem-" + t.id, background: true });
  }
}
const frontispiece = plate();
save("assets/critical-strip.svg", frontispiece);
save(
  "index.html",
  page("The Riemann Hypothesis", home(chapters, frontispiece), "Contents"),
);
let figureNumber = 1;
const figNumbers = {};
function figure(id) {
  const c = configs[id];
  const params = c.params
    .map((p) => {
      const attr = ' name="' + p.key + '" id="field-' + id + "-" + p.key + '"';
      return (
        '<label for="field-' +
        id +
        "-" +
        p.key +
        '"><span>' +
        esc(p.label) +
        (p.options
          ? ""
          : ' <output data-value="' + p.key + '">' + p.value + "</output>") +
        "</span>" +
        (p.options
          ? "<select" +
            attr +
            ">" +
            p.options
              .map(
                ([k, v]) =>
                  '<option value="' +
                  k +
                  '" ' +
                  (k === p.value ? "selected" : "") +
                  ">" +
                  esc(v) +
                  "</option>",
              )
              .join("") +
            "</select>"
          : '<input type="range"' +
            attr +
            ' min="' +
            p.min +
            '" max="' +
            p.max +
            '" step="' +
            p.step +
            '" value="' +
            p.value +
            '">') +
        "</label>"
      );
    })
    .join("");
  const fn = ++figureNumber;
  figNumbers[id] = fn;
  const sourceClaims = data("figures")
    .figures[id].claim_ids.map(
      (k) => linked(claimsById.get(k).title, "atlas.html#claim-" + k),
    )
    .join(" · ");
  return (
    '<figure class="lab" id="fig-' +
    id +
    '" data-lab="' +
    id +
    '"><div class="labhead"><div><span class="sc figure-label">Fig. ' +
    fn +
    " &nbsp;/&nbsp; " +
    esc(c.kind) +
    "</span><h4>" +
    esc(c.title) +
    '</h4></div><button type="button" class="reset">Reset</button></div><div class="controls" data-controls>' +
    params +
    "</div><div data-result>" +
    render(id, defaults(id)) +
    "</div><figcaption>" +
    esc(c.caption) +
    "</figcaption><details><summary>Method and parameters</summary><p>" +
    esc(c.method) +
    "</p><p>Related results. " +
    sourceClaims +
    ".</p><p>Displayed defaults: " +
    c.params
      .map(
        (p) =>
          esc(p.label) +
          " = " +
          esc(p.options ? p.options.find((a) => a[0] === p.value)[1] : p.value),
      )
      .join(", ") +
    '.</p><a data-share href="book.html#fig-' +
    id +
    '">Link to this figure state</a></details></figure>'
  );
}
const refList = [];
function numberSources(html) {
  return html.replace(/<a href="(https?:[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (link, url, attributes, label) => {
    if (formalUrl(url)) return link;
    label = label.replace(/^\[\d+\]\s*/, "");
    let index = refList.findIndex(reference => reference.u === url);
    if (index < 0) index = refList.push({ u: url, label }) - 1;
    return '<a href="' + url + '"' + attributes + '>' + label +
      '</a><sup class="refno"><a href="#ref-' + (index + 1) + '" aria-label="Reference ' +
      (index + 1) + '">[' + (index + 1) + ']</a></sup>';
  });
}
function includeFragments(html, parents = []) {
  return html.replace(/<!--INCLUDE:([a-z-]+)-->/g, (_, name) => {
    if (parents.includes(name))
      throw Error("Recursive chapter fragment: " + [...parents, name].join(" / "));
    return includeFragments(read("content/" + name + ".fragment.html").trim(), [...parents, name]);
  });
}
function sectionContent(id) {
  let html = includeFragments(read("content/" + id + ".html").trim()).replaceAll("SOURCE:", blob);
  if (html.startsWith("<article")) {
    html = html
      .replace(/^<article[^>]*>/, "")
      .replace(/<\/article>\s*$/, "")
      .replace(/<h1[^>]*>.*?<\/h1>/s, "");
  }
  html = html.replace(/<(\/?)h2\b/g, "<$1h3");
  const insert = (needle, fig) => {
    if (!html.includes(needle))
      throw Error("Missing figure position " + needle);
    html = html.replace(needle, "<!--FIG:" + fig + "-->\n" + needle);
  };
  if (id === "pilot") {
    insert('<section id="pilot-residues">', "center");
    insert('<section id="pilot-family">', "zero");
    insert('<section id="pilot-handoff">', "residue");
  }
  if (id === "balance") {
    insert('<h3 id="balance-costs"', "orthogonal");
    html += "<!--FIG:cost-->";
  }
  if (id === "windows") {
    insert('<h3 id="window-derivatives"', "window");
    insert('<h3 id="window-geometry"', "kernel");
    insert('<h3 id="window-epsilon"', "rates");
  }
  const manuscript = html.replace(/<!--FIG:([a-z][a-z-]*)-->/g, (_, k) => figure(k));
  return numberSources(readingPassages(manuscript, id, byPassage, linked));
}
const book = chapters
  .map(([id, title], i) => {
    let sub = 0;
    const body = sectionContent(id).replace(
      /<h3([^>]*)>/g,
      (_, a) =>
        "<h3" +
        a +
        '><span class="section-number">' +
        (i + 1) +
        "." +
        ++sub +
        "</span>",
    );
    const next = chapters[i + 1];
    const endLink =
      '<p class="chapter-navigation small"><a href="index.html#contents">Contents</a>' +
      (next
        ? ' · <a href="#' + next[0] + '">Next chapter</a>'
        : ' · <a href="#book-references">Chapter references</a>') +
      "</p>";
    return (
      '<article class="chapter page-shell article-section" id="' +
      id +
      '">' +
      sectionHeading(i + 1, title) +
      '<div class="measure">' +
      body +
      endLink +
      "</div></article>"
    );
  })
  .join("");
const footnotes =
  '<section id="book-references" class="page-shell textpage article-section"><h2>Chapter references</h2><ol>' +
  refList
    .map(
      ({ u, label }, i) =>
        '<li id="ref-' +
        (i + 1) +
        '"><a href="' +
        u +
        '">' +
        label +
        '</a><span class="print-only micro">' +
        esc(u) +
        "</span></li>",
    )
    .join("") +
  "</ol></section>";
const bookHead = articleHead(
  "The Riemann Hypothesis",
  'Read the proof from the statement about zeros to the estimates on prime sums, or start with the <a href="#how-to-read">proof outline</a>. Each section links to its mathematical results and references. <a href="print.html">Print edition</a>.',
  chapters.map(([id, t], i) => [i + 1 + ". " + t, "#" + id]),
);
save(
  "book.html",
  page(
    "Read the monograph",
    '<main class="article" id="main">' +
      bookHead +
      book +
      footnotes +
      "</main>",
    "Read",
  ),
);
const expanded = printExamples(book)
  .replaceAll('href="atlas.html#claim-', 'href="#claim-')
  .replaceAll('href="reference.html#theorem-', 'href="#theorem-')
  .replace(/<button[^>]*>Reset<\/button>/g, "")
  .replace(/data-lab="/g, 'data-static="');
const printFront = articleHead(
  "The Riemann Hypothesis",
  'An independent reconstruction of the argument by Levent Alpöge with Claude. Working edition, 21 November 2026. <button class="print text-button" type="button" onclick="window.print()">Print this volume</button>',
);
const passageNames = new Map(chapters.map(([id, title]) => [id, title]));
let heading = "";
function headingText(html) {
  const entities = { amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " " };
  return html.replace(/<span class="section-number">[^<]*<\/span>|<[^>]+>/g, "")
    .replace(/&(amp|lt|gt|quot|nbsp);/g, (_, key) => entities[key]).trim();
}
for (const m of book.matchAll(/<h[2-6]\b[^>]*>[\s\S]*?<\/h[2-6]>|<\w+\b[^>]*\bid="[^"]+"[^>]*>/g)) {
  const id = m[0].match(/\bid="([^"]+)"/)?.[1];
  if (/^<h[2-6]\b/.test(m[0])) heading = headingText(m[0]);
  if (id && !passageNames.has(id)) passageNames.set(id, heading);
}
for (const m of book.matchAll(/<(?:section|p|details)\b[^>]*\bid="([^"]+)"[^>]*>\s*<(h[2-6]|strong|summary)\b[^>]*>([\s\S]*?)<\/\2>/g)) {
  passageNames.set(m[1], headingText(m[3]));
}
function theoremEntries(print = false) {
  const page = print ? "" : "book.html";
  return '<ol class="records theorem-register">' + background.map(t =>
    '<li id="theorem-' + esc(t.id) + '"><h4>' + esc(t.title) + '</h4><p>' + esc(t.statement) +
    '</p><p>' + esc(t.use) + '</p><p>' + linked(t.citation, t.url) +
    (print ? '<span class="print-only micro">' + esc(t.url) + '</span>' : '') +
    '</p><p class="micro">Used in ' + t.passages.map(anchor => {
      if (!passageNames.has(anchor)) throw Error("Unknown theorem passage " + anchor);
      return linked(passageNames.get(anchor) || anchor, page + "#" + anchor);
    }).join(" · ") + '</p></li>').join("") + '</ol>';
}
function glossaryEntries(chapterPage) {
  return ed.glossary
    .map(
      ([term, meaning, anchor]) =>
        `<div data-search><dt>${esc(term)}</dt><dd>${esc(meaning)} <a href="${chapterPage}#${anchor}">Read in context</a></dd></div>`,
    )
    .join("");
}
function bibliographyEntries(print = false) {
  const visible = [], technical = [];
  for (const [title, description, url] of ed.references) {
    const list = formalUrl(url) || url === corpus.external_report.url ? technical : visible;
    list.push(`<li><b>${esc(title)}</b>. ${esc(description)} ${linked("Source", url)}${print ? '<span class="print-only micro">' + esc(url) + "</span>" : ""}</li>`);
  }
  return '<ol>' + visible.join("") + '</ol>' + (technical.length ? correspondence('<ol>' + technical.join("") + '</ol>') : '');
}
const printAppendix =
  '<section id="appendix" class="page-shell article-section textpage gloss"><h2>Notation and references</h2>' +
  "<dl>" +
  glossaryEntries("") +
  '</dl><h3 id="theorems">Theorems used in the book</h3>' + theoremEntries(true) +
  '<h3 id="results">Results in the proof</h3><ol class="records">' +
  allClaims.map(c => claimLi(c, true)).join("") + '</ol><h3>Annotated bibliography</h3>' +
  bibliographyEntries(true) +
  "</section>";
const printContents =
  '<div class="page-shell print-contents"><figure><img src="assets/critical-strip.svg" width="430" height="279" alt="Magnitude of zeta across the critical strip, with the critical-line section in copper."><figcaption class="figure-caption"><span class="sc">Fig. 1.</span> Sections of |ζ(σ+it)|. The copper curve has σ=½.</figcaption></figure><h2>Contents</h2><ol>' +
  chapters
    .map(([id, title]) => '<li><a href="#' + id + '">' + title + "</a></li>")
    .join("") +
  '</ol><p class="small"><a href="#appendix">Notation</a> · <a href="#theorems">Theorems used</a> · <a href="#results">Results in the proof</a> · <a href="#book-references">Chapter references</a></p></div>';
save(
  "print.html",
  page(
    "Print edition",
    '<main id="main" class="article">' +
      printFront +
      printContents +
      expanded +
      printAppendix +
      footnotes +
      "</main>",
  ),
);
const experimentList = Object.entries(figNumbers)
  .map(
    ([id, n]) =>
      '<li class="book-entry"><h3><a href="book.html#fig-' +
      id +
      '"><span class="section-number">Fig. ' +
      n +
      ".</span>" +
      esc(configs[id].title) +
      '</a></h3><p class="small">' +
      esc(configs[id].kind) +
      "</p></li>",
  )
  .join("");
save(
  "experiments.html",
  page(
    "Experiments",
    '<main class="article" id="main">' +
      articleHead(
        "Mathematical experiments",
        "Each figure opens beside its derivation. Change a parameter, inspect the calculation, or share the resulting figure.",
      ) +
      '<section class="page-shell article-section">' +
      sectionHeading(1, "Figures in the book") +
      '<ol class="experiment-index measure">' +
      experimentList +
      "</ol></section></main>",
    "Experiments",
  ),
);
const filters = (hint) =>
  '<label hidden class="filters">Search <input data-filter type="search" placeholder="' +
  hint +
  '"><span data-count role="status"></span></label>';
save(
  "reference.html",
  page(
    "Glossary and bibliography",
    '<main class="article" id="main">' +
      articleHead(
        "Notation and glossary",
        "Definitions used in the book, with a route back to the proof.",
        [
          ["Glossary", "#glossary"],
          ["Theorems", "#theorems"],
          ["Bibliography", "#bibliography"],
          ["Figure notes", "#plate"],
        ],
      ) +
      '<div class="page-shell article-section textpage gloss"><h2 id="glossary"><span class="section-number">1</span>Glossary</h2>' +
      filters("Term or symbol") +
      "<dl>" +
      glossaryEntries("book.html") +
      '</dl><h2 id="theorems"><span class="section-number">2</span>Theorems used in the book</h2>' + theoremEntries() +
      '<h2 id="bibliography"><span class="section-number">3</span>Annotated bibliography</h2>' +
      bibliographyEntries() +
      '<h2 id="plate"><span class="section-number">4</span>The critical strip, in section</h2><figure class="reference-plate"><img src="assets/critical-strip.svg" alt="Sampled sections of absolute zeta with the critical-line section in copper."></figure><p>The frontispiece plots |ζ(σ+it)| on 27 equally spaced sections 0≤σ≤1. Each section contains 169 samples, 8≤t≤32. The copper section on this page has σ=½. The opening figure allows other sampled sections to be selected. Height is linear in |ζ|. Smoothly joined sample values can miss a zero between mesh points.</p><p>The generator sums the first 95 Dirichlet terms, then applies Euler–Maclaurin at N=96 through B₆. The absolute remainder is bounded by |s(s+1)⋯(s+5)| N<sup>−σ−5</sup>/[30240(σ+5)] from the periodic Bernoulli remainder. This is less than 0.000002 across the plotted domain. Binary64 evaluation adds rounding error. <a href="https://dlmf.nist.gov/25.2.iii">Euler–Maclaurin representation</a> · <a href="scripts/plate.cjs">Figure source</a></p></div></main>',
    "Glossary",
  ),
);
const route = data("route");
const edges = route.written_proof_edges;
const solution = data("solution_terms");
const terms = solution.selected_declarations;
const termRecord = linked("Direct names in the exported solution", "records/solution_terms.json");
function edgeEvidence(edge) {
  const caller = terms[route.declarations[edge.from].declaration];
  const target = route.declarations[edge.to].declaration;
  if (!caller) return "caller outside the selection";
  if (caller.value?.constants.includes(target)) return "direct in value";
  if (caller.type.constants.includes(target)) return "direct in type only";
  return "not found directly in the value or type";
}
const directValueCount = edges.filter(e => edgeEvidence(e) === "direct in value").length;
function exportedTerm(name, spellOut) {
  const term = terms[name];
  if (!term || !term.value) return "";
  const names = term.value.constants;
  const body = spellOut ? names.map(n => "<code>" + esc(n) + "</code>").join(", ") :
    names.length + " distinct names in the value";
  return '<p class="micro" data-solution-term="' + esc(name) + '"><b>Exported solution.</b> ' +
    '<code>' + esc(name) + '</code>, record ' + term.line.toLocaleString("en-US") +
    '. ' + body + '. ' + termRecord + '.</p>';
}
function depNode(key) {
  const e = route.declarations[key];
  const list = (matches, other) =>
    matches.length
      ? matches
          .map((edge) => {
            const k = edge[other];
            return linked(route.declarations[k].declaration, "#decl-" + k) + " (" + edgeEvidence(edge) + ")";
          })
          .join(" · ")
      : "No further edge recorded here.";
  return (
    '<div class="proofnode" id="decl-' +
    key +
    '"><code>' +
    linked(e.declaration, e.url) + "</code>" +
    (solution.missing_names.includes(e.declaration) ?
      '<p class="micro">This definition occurs in the pinned source. The local search of the full solution export found no declaration under this name. No recorded call in this graph relies on it.</p>' : '') +
    '<p class="micro">Uses ' +
    list(edges.filter((v) => v.from === key), "to") +
    '</p><p class="micro">Used by ' +
    list(edges.filter((v) => v.to === key), "from") +
    "</p></div>"
  );
}
const graph =
  '<h2 id="source-graph">Written proof dependencies</h2><p>Each entry links to the declaration it uses and to its recorded callers. Follow the proof of ' +
  linked("riemannHypothesis", "#decl-main") +
  " back to the geometric suppliers. An endpoint marks the boundary of this selection. Each edge reports whether the named supplier occurs directly in the exported proof value or its type. Three isolated source definitions for a theta chain are marked separately.</p>" +
  Object.keys(route.declarations).map(depNode).join("");
const paths = tar.source_proof_applications
  .map(
    (e) =>
      "<li><code>" +
      esc(e.conclusion) +
      "</code> uses <code>" +
      esc(e.uses) +
      '</code>. <a href="' +
      e.source +
      '">Proof body</a></li>',
  )
  .join("");
function linked(text, href) {
  return '<a href="' + esc(href) + '">' + esc(text) + "</a>";
}
function claimLinks(label, ids) {
  return ids.length ? '<p class="micro"><b>' + label + '.</b> ' +
    ids.map(id => linked(claimsById.get(id).title, "#claim-" + id)).join(" · ") + '</p>' : "";
}
function claimLi(c, print = false) {
  const id = c.id, anchor = c.anchor || c.section || c.chapter;
  const chapterPage = print ? "" : "book.html";
  const formulas = (c.equation_anchors || c.equations || []).map((target, i) => {
    const label = c.equation_anchors ? "Equation " + c.equations[i] :
      target.replace(/^[^-]+-/, "").replaceAll("-", " ");
    return linked(label, chapterPage + "#" + target);
  });
  const sourceLinks = (c.sources || c.declarations || []).filter(s => s.url).map(s =>
    linked(s.label && s.declaration ? s.label + " (" + s.declaration + ")" : s.label || s.declaration || s.name || s.path, s.url));
  if (c.source) sourceLinks.push(linked(c.declaration || "Pinned source", c.source));
  const evidence = c.correspondence || c.evidence;
  const status = c.status || c.reconstruction;
  const technical = '<p class="source-id">' + esc(id) + '</p>' +
    (status ? '<p>' + esc(status) + '</p>' : '') +
    (evidence ? '<p>' + esc(evidence) + '</p>' : '') +
    (c.type ? '<p><b>Formal type.</b> <code>' + esc(c.type) + '</code></p>' : '') +
    (!print && id === "INP-03" ? '<p><b>Direct proof values.</b> In the Galois construction the following chain reaches the constructor for a single lift.</p><p>' +
      solution.theta_value_paths[0].map(name => "<code>" + esc(name) + "</code>").join(" → ") +
      '</p><p>The separate exclusion theorem supplies a split place at each step under its parameter bounds. The formulation in the source model also imposes conditions at every completely split prime.</p><p>' +
      solution.theta_value_paths[1].map(name => "<code>" + esc(name) + "</code>").join(" → ") + '. ' + termRecord + '.</p>' : '') +
    (print ? '' : solution.chapter_value_paths.filter(path => path.claim === id)
      .map(path => '<p data-chapter-path="' + esc(id) + '"><b>' + esc(path.label) + '.</b> ' +
        path.names.map(name => '<code>' + esc(name) + '</code>').join(' → ') + '</p>').join('')) +
    (c.review ? '<p><b>Review.</b> ' + esc(c.review) + '</p>' : '') +
    (print ? '' : [...new Set([c.declaration, ...(c.sources || []).map(s => s.exported_name)])]
      .filter(Boolean).map(name => exportedTerm(name, name === c.declaration)).join('')) +
    (sourceLinks.length ? '<p>' + sourceLinks.join(" · ") + '</p>' : '');
  const assumptions = Array.isArray(c.hypotheses) ? c.hypotheses.join(" ") : c.hypotheses;
  return '<li data-search id="claim-' + esc(id) + '"><b>' + esc(c.title) + '</b><p>' + esc(c.statement) +
    '</p>' + (assumptions ? '<p><b>Hypotheses.</b> ' + esc(assumptions) + '</p>' : '') +
    (formulas.length ? '<p class="micro"><b>Formulas.</b> ' + formulas.join(" · ") + '</p>' : '') +
    claimLinks("Uses", c.dependencies || []) +
    claimLinks("Used by", allClaims.filter(other => other.dependencies?.includes(id)).map(other => other.id)) +
    (anchor ? linked("Read the proof step", chapterPage + "#" + anchor) : '') +
    (print ? '' : correspondence(technical)) + '</li>';
}
const sourceClaims = new Map();
for (const claim of allClaims) {
  for (const entry of claim.sources || []) {
    const name = entry.declaration || entry.name;
    if (!name || !entry.url) continue;
    for (const symbol of [name, ...(entry.related_declarations || [])]) {
      if (!sourceClaims.has(symbol)) sourceClaims.set(symbol, new Map());
      sourceClaims.get(symbol).set(claim.id, claim);
    }
  }
}
const reverseIndex = [...sourceClaims.keys()]
  .sort()
  .map((name) => {
    const claims = [...sourceClaims.get(name).values()];
    const passages = claims
      .map((claim) =>
        linked(claim.id, "book.html#" + (claim.anchor || claim.chapter)),
      )
      .join(" · ");
    return `<div><dt><code>${esc(name)}</code></dt><dd>${passages}</dd></div>`;
  })
  .join("");
const ver = corpus.external_report;
const checks = [
  [
    "Original source bytes",
    "Local comparison of all 175,190 archived files, their modes and Git blobs against the initial mirror revision.",
  ],
  [
    "Theorem statements",
    "Five public statements inspected against pinned definitions. The challenge export matches the published SHA-256, and its five theorem records were checked locally. Its measured unpacked size is 350,862,311 bytes. The verification report lists 350,862,970 bytes for the same digest.",
  ],
  ["Local direct proof terms", "We verified both SHA-256 digests of the complete published solution and inspected the types and values of " +
    Object.keys(terms).length + " selected declarations. Of the " + edges.length + " written calls in the route, " +
    directValueCount + " name a constant occurring directly in the caller’s exported value. Each route entry gives its individual result."],
  ["Compilation", ver.compilation],
  ["Axiom audit", ver.axioms],
  ["Module kernel replay", ver.module_kernel_replay],
  ["Export acceptance", ver.export_kernel_checks],
  ["Independent target matching", ver.independent_statement_comparison],
  [
    "Elaborated solution dependencies",
    "The independent declaration walk reported " +
      tar.targets[0].independent_compiled_solution.reachable_constants.toLocaleString(
        "en-US",
      ) +
      " reachable declarations for the public classical theorem. See the linked audit below.",
  ],
  [
    "Local replay",
    "The proof was not built or kernel-replayed on this machine. The recorded host has 31.4 GiB of RAM.",
  ],
];
const auditLinks = fs
  .readdirSync(path.join(root, "records"))
  .filter((f) => f.endsWith(".json") && f !== "edition.json")
  .map((f) => linked(f, "records/" + f));
save(
  "atlas.html",
  page(
    "Source atlas",
    '<main id="main" class="article">' +
      articleHead(
        "Source atlas",
        "Read the hypotheses and conclusion of each result, then follow the results it uses or the passage that explains its proof.",
        [
          ["Verification", "#verification"],
          ["Reconstruction", "#reconstruction"],
          ["Results", "#ledger"],
          ["Indexes", "#indexes"],
        ],
      ) +
      '<div class="page-shell article-section textpage"><h2>Reading the dependency chain</h2><p>Start at the conclusion and follow the required inputs. Each arrow points from an input toward the conclusion it supports.</p><div class="pathlist">' +
      [
        ["Classical RH", "target"],
        ["Nonvanishing", "reflection"],
        ["Window criterion", "windows"],
        ["Arithmetic balance", "balance"],
        ["Geometric inputs", "local"],
      ]
        .map(([t, id]) => linked(t, "book.html#" + id))
        .join("<span>←</span>") +
      '</div><details class="correspondence"><summary>Lean correspondence</summary><ul>' +
      paths +
      '</ul><p>These entries follow written proof expressions. The source graph below also checks each recorded call against the direct references of the published solution. The external audit follows dependencies transitively.</p></details><h2 id="verification">Verification record</h2><details class="correspondence"><summary>Lean correspondence</summary><p>On 21 November 2026 the Lean and Mathlib communities certified the statement and the formal proof of the classical Riemann hypothesis. Two independent tools matched the proved statement to the existing definition. Several proof checkers validated the exported proof. ' +
      linked("Joint statement of the Lean and Mathlib communities", corpus.community_statement.url) +
      '</p><p>The table records Andrew V. Sutherland’s checks as of 20 November 2026 at 22:05 UTC. In his update of 21 November at 12:55 UTC, Sutherland reports that two independent kernels accepted the full exported proof and that all five statements matched the challenge. The end-to-end Comparator run and the Lean kernels’ replay of the export were still in progress. ' +
      linked("Sutherland’s verification report at MIT, updated 21 November 2026 at 12:55 UTC", ver.url) +
      " · " +
      linked("Author’s announcement", corpus.attribution.announcement) +
      " · " +
      linked(
        "Independent compiled-declaration walk",
        corpus.independent_compiled_audit.walk_url,
      ) +
      '</p><div class="tablewrap"><table><thead><tr><th>Question</th><th>Evidence</th></tr></thead><tbody>' +
      checks
        .map(([k, v]) => "<tr><th>" + k + "</th><td>" + esc(v) + "</td></tr>")
        .join("") +
      '</tbody></table></div><p class="micro">Source commit <code>' +
      pin +
      "</code> · Lean v4.33.1 · Mathlib <code>0df444a360eaa60ab8c11dca51a86af692955474</code>. " +
      linked("Corpus lock", "records/corpus.json") + " · " + termRecord + " · " +
      linked("Independent comparison with seven compiled modules", "records/compiled_edge_comparison.json") +
      '</p></details><h2 id="reconstruction">Reconstruction record</h2><p>The book follows the argument to the critical line. As of 21 November 2026, we estimate that about 86% of the explanatory work is written (roughly 80–91%). The estimate weights six parts by the writing each requires.</p><p>The real period chapter now follows a derivative through the finite layers and proves invariance under translation. The Galois chapter now derives the <a href="book.html#lifts-rank-cocharacter">tangent matrix</a> from the local jumps and constructs the <a href="book.html#lifts-rank-matrix-units">extracted representation</a> using the <a href="book.html#lifts-rank-envelope-products">scalar diagonal blocks</a> and the <a href="book.html#lifts-rank-component-row">action of each component</a>.</p><p>The Hecke chapter now derives the <a href="book.html#lifts-hecke-tower-count">one-place dimension bound</a> and the <a href="book.html#lifts-hecke-finite-group-approximation">ℓ-adic correction on a finite group</a>. It derives the <a href="book.html#lifts-hecke-weight-translates">common bound on the translated forms</a>, the <a href="book.html#lifts-hecke-weight-projections">finite decomposition</a> of their weight family and the <a href="book.html#lifts-hecke-weight-partial-sums">two estimates on each weight</a>. It also explains how the <a href="book.html#lifts-hecke-weight-variation">weight gaps</a> are chosen and why the <a href="book.html#lifts-hecke-conjugate-forms">conjugate eigenforms</a> fit in one finite-dimensional space.</p><p>For geometric approximation, the <a href="book.html#lifts-isogeny-gaussian-marking">square elliptic curve</a> shows why the kernel and the target marking must both be checked. The <a href="book.html#lifts-isogeny-marked-quotient">quotient by marked translations</a> and the <a href="book.html#lifts-isogeny-elementary-descent">two descents for an elementary isogeny</a> give the integral maps used in good reduction. A <a href="book.html#lifts-geometric-level-integer">common integer level</a> supports the <a href="book.html#lifts-geometric-level-spectral-test">spectral trace test</a>. The <a href="book.html#lifts-geometric-level-witnesses">choice of test places</a> determines which conclusions hold on one tower. The <a href="book.html#lifts-geometric-tower-degree">source degree</a> counts the lifts of a point. The <a href="book.html#lifts-geometric-hodge-holomorphic-test">weighted trace</a> selects a form degree, and a <a href="book.html#lifts-geometric-hodge-trace-extraction">joint eigenclass</a> survives there. The <a href="book.html#lifts-integral-cover-splitting">generic cover</a> records the possible level markings. The <a href="book.html#lifts-ordinary-ideal-torsion-degree">total rank of ideal torsion</a> and its <a href="book.html#lifts-ordinary-local-length">length at the identity</a> give two cases. In a <a href="book.html#fig-ramified-residues">ring with sixteen residue classes</a> one can calculate the local coefficient kernels directly. Their <a href="book.html#lifts-ordinary-cohomology-annihilator">passage to cohomology</a> and the <a href="book.html#lifts-ordinary-frobenius-multiplicities">character multiplicities</a> enter the longer case. In the longer case the <a href="book.html#fig-ordinary-frobenius-coefficients">lift of a tangent</a> produces a <a href="book.html#lifts-ordinary-deep-frobenius-image">Frobenius preimage</a> for every projected Hodge class. A <a href="book.html#lifts-ordinary-separating-eigenvector">separating eigenvector</a> then gives a functional vanishing on that image. A <a href="book.html#fig-polarized-graph">moving Hodge plane</a> illustrates the first-order constraint. On the <a href="book.html#lifts-ordinary-graph-level">marked abelian scheme realizing that motion</a>, the <a href="book.html#lifts-ordinary-variation-contradiction">two calculations of the same coefficient</a> exclude the longer case and give the ordinary torsion count. Its <a href="book.html#fig-ordinary-torsion-reduction">kernel of reduction</a> is a line. The two <a href="book.html#lifts-ordinary-residue-target">marked quotient targets</a> then give the residue identity point by point. For <a href="book.html#lifts-integral-good-witness">good reduction</a>, two subgroup indices give the degree of the integral source and the number of tower lifts above a compatible pair. A separate <a href="book.html#lifts-odd-fixed-weight-closure">period calculation</a> recovers the jumps of the limit from its moments.</p><ul><li>On restriction to the smaller unitary group a bound on one trial vector becomes an inequality on an entire invariant space. A three-coordinate example illustrates which directions and which test vector survive. The <a href="book.html#normalization-derivative-negative-slice">negative derivative</a> can land in an earlier layer, and a <a href="book.html#normalization-derivative-closure">uniform Taylor step</a> passes from those layers to the group. A separate <a href="book.html#fig-column-degree-defect">formal-degree calculation</a> tests whether one copy fills a space of coefficients. <a href="book.html#normalization-casimir-window">The invariant space</a> · <a href="book.html#fig-casimir-cutoff">A threshold coordinate</a> · <a href="book.html#normalization-terminal-branching-inclusion">The isometric copy</a>.</li><li>A specified set of good split primes realizes every finite Galois test after finitely many exclusions. The trace-limit argument constructs an odd-rank representation, and the two lifts give the same remaining polynomial after character subtraction. The construction from a cohomological eigenspace uses a <a href="book.html#lifts-geometric-rank">rank-extraction theorem</a>. The <a href="book.html#lifts-hecke-congruence-tests">simultaneous congruence argument</a> uses density of automorphic forms, integral coordinates, auxiliary types and change of weight. <a href="book.html#fig-frobenius-good-places">Two primes for one test</a> · <a href="book.html#lifts-odd-companion-trace">Recovering a representation from its traces</a> · <a href="book.html#lifts-galois-character-complement">Removing one line</a>.</li><li>The <a href="book.html#global-minor-ideal-height">norm of the final minor</a> includes the different of the real field. The <a href="book.html#global-diagonal-paired-label-estimate">joint estimate for two lists</a> counts their shared row once. The two-field calculation shows where the discriminant enters the <a href="book.html#global-minor-dimension">dimension argument</a>.</li><li>At fixed determinant, the number of possible sets of bad places and the allowed mass per set have reciprocal factors. The mass on the perpendicular line enters separately. <a href="book.html#fig-hyperplane-mass-stratum">Two hyperplanes at the same order</a> · <a href="book.html#global-line-mass-cutoff">The line cutoff</a> · <a href="book.html#global-hyperplane-summed-mass">Summing the masses</a>.</li><li>A regular unit shift supplies a model of the discrete series. Averaging matrix coefficients and contracting a double tensor explain why each such model occurs exactly once. <a href="book.html#fig-regular-unit-shift">A shift at a wall</a> · <a href="book.html#normalization-regular-shift-averaging">The averaging maps</a> · <a href="book.html#normalization-regular-shift-multiplicity">Multiplicity one</a>.</li><li>For fixed discriminant order, an ideal records which rational subspaces can lie in the same orbit. Two projections then identify the common residue classes that govern the integral intersections. <a href="book.html#global-rational-subspace-orbit-count">Counting the ideals</a> · <a href="book.html#fig-rational-line-orbit">One orbit, different intersections</a> · <a href="book.html#global-primitive-perpendicular-order">The discriminant bound</a>.</li><li>The real period needs an ordered differential minor and an estimate for a translated vector. One calculation recovers a projector from a simple polynomial root. A different estimate controls the cost of taking two real derivatives after translation. <a href="book.html#normalization-quantum-projector-specialization">Isolating the projector</a> · <a href="book.html#normalization-branching-translated-derivative">Bounding the translated derivative</a>.</li><li>The smaller unitary quotient has finite volume. In an isotropic shell this contributes a constant factor, while the scalar variable contributes an exponential in height. <a href="book.html#lifts-unitary-quotient-covolume">The quotient and a circle example</a> · <a href="book.html#lifts-parabolic-shell-mass">The volume identity</a>.</li><li>For the global dimension estimate, marking a maximal lattice bounds the mass at a given discriminant. Separately, arithmetic congruences control matrices whose singular values are close to one. <a href="book.html#global-discriminant-order-mass">The two mass bounds</a> · <a href="book.html#global-near-unipotent-distance">The distance to the identity</a>.</li><li>The real period uses two estimates for different purposes. The lowest compact type gives decay away from the compact subgroup. A second representation on the stabilizer gives a vector with positive period. <a href="book.html#normalization-leading-minor-decay">The product of minors</a> · <a href="book.html#normalization-branching-period-eigenvalue">The positive eigenvalue</a>.</li><li>A term in the bottom period is an integral over the stabilizer of a vector. Its decay depends on how far the translating isometry moves that vector. The comparison with the identity term carries the same Haar factors through the local and adelic integrals. <a href="book.html#normalization-transverse-period-decay">The coefficient estimate</a> · <a href="book.html#normalization-transverse-period-class">One class in the period</a>.</li><li>In an isotropic shell the remaining rational variable is a single scalar. Finite-place conditions put it in a lattice. At the real places a volume comparison bounds the number of its points in a growing box. <a href="book.html#lifts-adelic-box-count">The first nonzero points</a>.</li><li>The cohomological bound uses an exact integral complex of arithmetic faces. Cutting a convex set explains how to fill a cycle whose vertices have no common witness. A determinant calculation then bounds the number of faces up to symmetry, and the order of a stabilizer controls its positive-degree homology. <a href="book.html#inputs-face-nerve-cut">Filling the cycle</a> · <a href="book.html#inputs-nearby-vector-coordinates">Bounding the coordinates</a> · <a href="book.html#inputs-stabilizer-homology-transfer">The stabilizer calculation</a>.</li></ul><p>The analytic chapters follow a possible zero from its residue to the one-sided window estimate and reflection. The theta chapters reconstruct an integral expansion at the selected primes, the local zeta quotients, the <a href="book.html#lifts-siegel-weil">two Siegel–Weil ranges</a> and the <a href="book.html#lifts-kernel-majorant">absolute bound for pairing two lifts</a>. The arithmetic chapter derives the marked-window selection, degree-two estimate and separate character counts. Each chapter records its remaining inputs.</p><p>The chapter on normalization follows the six prime classes and the nonzero base tuple. The arithmetic chapter constructs the finite cycles and their determinant evaluations. The book follows the <a href="book.html#lifts-inert-length">length of an inert lattice</a> into the local zeta sum. At a real place the <a href="book.html#lifts-fock-projection">projection of a joint polynomial</a> gives the positive factor. The <a href="book.html#lifts-schrodinger-fourier">Fourier comparison</a> recovers the lower-range value after treating singular frequencies. The <a href="book.html#lifts-height-fibres">count of rational classes at fixed height</a> supplies the convergence estimate. Counting <a href="book.html#lifts-whittaker-density">integral Hermitian frames</a> gives the full-rank Whittaker factor at the good finite places. At an <a href="book.html#lifts-exceptional-whittaker">exceptional place</a> shell cancellation supplies the continued value. At infinity <a href="book.html#lifts-archimedean-whittaker">determinant differentiation</a> continues the nonsingular coefficient and recovers its density. The <a href="book.html#lifts-global-gram-density">global Gram-fibre mean</a> explains how the local densities fit together.</p><p>In cohomology, <a href="book.html#inputs-lattice-transference">transference</a> bounds the distance to the lattice, and <a href="book.html#inputs-additive-cups">products of translation classes</a> determine the weights in the stabilizer. The <a href="book.html#inputs-common-invariants">common invariant functions</a> explain why a spectral gap bounds the period of a mean-zero form. A <a href="book.html#inputs-compact-unfolding-jacobian">change of volume on Hermitian matrices</a> explains how to bound the integral on the compact set. Averaging the vertices transfers that bound to the <a href="book.html#inputs-period-transfer">period of a fixed cycle</a>. A <a href="book.html#inputs-hecke-transfer">second Hecke estimate</a> forces the remaining periods to vanish, and <a href="book.html#inputs-invariant-forms">alternating traces</a> bound the number of independent tests. The <a href="book.html#inputs-split-connectivity">split-sequence calculation</a> supplies integral stability, while the <a href="book.html#inputs-field-cycle-quotient">cyclotomic quotient map</a> bounds the length at the base field.</p><p>In the dyadic tower the <a href="book.html#inputs-inertia-orbits">indices of Frobenius subgroups</a> bound the number of inertia evaluations. The choice of primes uses a <a href="book.html#inputs-zero-density">count of characters with a zero</a> and a <a href="book.html#inputs-twist-mean-square">mean square for quadratic twists</a>. Further inputs include local representation densities and the volume estimates for the period maps. An end-to-end review of the exposition is still in progress. ' +
      linked("Current project state", "STATE.md") +
      '</p><h2 id="ledger">Results in the proof</h2>' +
      filters("Result, theorem, or mathematical term") +
      '<ol class="records">' +
      allClaims.map(c => claimLi(c)).join("") +
      "</ol>" +
      '<h2 id="indexes">Source indexes</h2>' +
      correspondence('<h3 id="declaration-index">Find a passage by declaration</h3><dl class="declaration-index">' +
        reverseIndex + "</dl>" + graph + "<h3>Machine-readable records</h3><p>" + auditLinks.join(" · ") + "</p>") +
      "</div></main>",
    "Source atlas",
  ),
);
console.log(
  "Built " +
    chapters.length +
    " chapters, " +
    Object.keys(figNumbers).length +
    " experiments, " +
    allClaims.length +
    " mathematical results, " +
    background.length +
    " cited background theorems and " +
    refList.length +
    " additional numbered chapter references.",
);
