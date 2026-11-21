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
      (k) => '<a href="atlas.html#claim-' + k + '">' + k + "</a>",
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
    c.kind +
    "</span><h4>" +
    c.title +
    '</h4></div><button type="button" class="reset">Reset</button></div><div class="controls" data-controls>' +
    params +
    "</div><div data-result>" +
    render(id, defaults(id)) +
    "</div><figcaption>" +
    c.caption +
    "</figcaption><details><summary>Method and parameters</summary><p>" +
    c.method +
    "</p><p>Source claims " +
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
// Keep links that carry part of a sentence in the prose. Only shorten a
// trailing list of source citations after a complete sentence.
function markCitationGroups(html) {
  return html.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/g, (paragraph, body) => {
    const links = [...body.matchAll(/<a href="https:\/\/github\.com\/[^"]+\/blob\/[^"]+"[^>]*>[\s\S]*?<\/a>/g)];
    if (!links.length) return paragraph;
    const last = links[links.length - 1];
    if (!/^[\s.]*$/.test(body.slice(last.index + last[0].length))) return paragraph;
    let i = links.length - 1;
    while (i > 0) {
      const previous = links[i - 1];
      const gap = body.slice(previous.index + previous[0].length, links[i].index);
      if (!/^\s*[,·]?\s*(?:and\s*)?$/.test(gap)) break;
      i--;
    }
    const start = links[i].index;
    if (!/[.!?]\s*$/.test(body.slice(0, start))) return paragraph;
    const group = links.slice(i).map(m => m[0].replace('<a href=', '<a data-citation href=')).join(' ');
    return paragraph.slice(0, paragraph.indexOf('>') + 1) + body.slice(0, start) + group + '</p>';
  });
}
function numberSources(html) {
  return markCitationGroups(html).replace(
    /<a (data-citation )?href="(https?:[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g,
    (_, citation, u, a, label) => {
      label = label.replace(/^\[\d+\]\s*/, "");
      let n = refList.findIndex((v) => v.u === u) + 1;
      if (!n) {
        refList.push({ u, label });
        n = refList.length;
      }
      if (citation) {
        const name = esc(label.replace(/<[^>]*>/g, ""));
        return '<span class="source-citation"><a class="source-title" href="' + u + '">' +
          label + '</a><sup class="refno"><a href="#ref-' + n + '" title="' + name +
          '" aria-label="Reference ' + n + '. ' + name + '">[' + n + ']</a></sup></span>';
      }
      return (
        '<a href="' +
        u +
        '"' +
        a +
        ">" +
        label +
        '</a><sup class="refno"><a href="#ref-' +
        n +
        '" aria-label="Reference ' +
        n +
        '">[' +
        n +
        "]</a></sup>"
      );
    },
  );
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
  return numberSources(html.replace(/<!--FIG:([a-z][a-z-]*)-->/g, (_, k) => figure(k)));
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
  'Read the proof from the statement about zeros to the estimates on prime sums, or start with the <a href="#how-to-read">proof outline</a>. Numbered notes lead to the formal sources. <button class="text-button" id="source-mode" type="button" aria-pressed="false" hidden>Show source titles</button> · <a href="print.html">Print edition</a>.',
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
const expanded = book
  .replace(/<details\b([^>]*)>/g, (_, attributes) => {
    const id = attributes.match(/\s+id="[^"]*"/);
    return '<section class="printed-detail"' + (id ? id[0] : "") + ">";
  })
  .replaceAll("</details>", "</section>")
  .replace(/<summary>/g, "<h4>")
  .replaceAll("</summary>", "</h4>")
  .replace(/<button[^>]*>Reset<\/button>/g, "")
  .replace(/data-lab="/g, 'data-static="');
const printFront = articleHead(
  "The Riemann Hypothesis",
  'An independent reconstruction of the formalization by Levent Alpöge with Claude. Working edition, 21 November 2026. <button class="print text-button" type="button" onclick="window.print()">Print this volume</button>',
);
function glossaryEntries(chapterPage) {
  return ed.glossary
    .map(
      ([term, meaning, anchor]) =>
        `<div data-search><dt>${esc(term)}</dt><dd>${esc(meaning)} <a href="${chapterPage}#${anchor}">Read in context</a></dd></div>`,
    )
    .join("");
}
function bibliographyEntries(print = false) {
  return ed.references
    .map(
      ([title, description, url]) =>
        `<li><b>${esc(title)}</b>. ${esc(description)} ${linked("Source", url)}${print ? '<span class="print-only micro">' + esc(url) + "</span>" : ""}</li>`,
    )
    .join("");
}
const printAppendix =
  '<section id="appendix" class="page-shell article-section textpage gloss"><h2>Notation and references</h2>' +
  "<dl>" +
  glossaryEntries("") +
  "</dl><h3>Annotated bibliography</h3><ol>" +
  bibliographyEntries(true) +
  "</ol></section>";
const printContents =
  '<div class="page-shell print-contents"><figure><img src="assets/critical-strip.svg" width="430" height="279" alt="Magnitude of zeta across the critical strip, with the critical-line section in copper."><figcaption class="figure-caption"><span class="sc">Fig. 1.</span> Sections of |ζ(σ+it)|. The copper curve has σ=½.</figcaption></figure><h2>Contents</h2><ol>' +
  chapters
    .map(([id, title]) => '<li><a href="#' + id + '">' + title + "</a></li>")
    .join("") +
  '</ol><p class="small"><a href="#appendix">Notation and bibliography</a> · <a href="#book-references">Numbered chapter references</a></p></div>';
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
          ["Bibliography", "#bibliography"],
          ["Figure notes", "#plate"],
        ],
      ) +
      '<div class="page-shell article-section textpage gloss"><h2 id="glossary"><span class="section-number">1</span>Glossary</h2>' +
      filters("Term or symbol") +
      "<dl>" +
      glossaryEntries("book.html") +
      '</dl><h2 id="bibliography"><span class="section-number">2</span>Annotated bibliography</h2><ol>' +
      bibliographyEntries() +
      '</ol><h2 id="plate"><span class="section-number">3</span>The critical strip, in section</h2><figure class="reference-plate"><img src="assets/critical-strip.svg" alt="Sampled sections of absolute zeta with the critical-line section in copper."></figure><p>The frontispiece plots |ζ(σ+it)| on 27 equally spaced sections 0≤σ≤1. Each section contains 169 samples, 8≤t≤32. The copper section on this page has σ=½. The opening figure allows other sampled sections to be selected. Height is linear in |ζ|. Smoothly joined sample values can miss a zero between mesh points.</p><p>The generator sums the first 95 Dirichlet terms, then applies Euler–Maclaurin at N=96 through B₆. The absolute remainder is bounded by |s(s+1)⋯(s+5)| N<sup>−σ−5</sup>/[30240(σ+5)] from the periodic Bernoulli remainder. This is less than 0.000002 across the plotted domain. Binary64 evaluation adds rounding error. <a href="https://dlmf.nist.gov/25.2.iii">Euler–Maclaurin representation</a> · <a href="scripts/plate.cjs">Figure source</a></p></div></main>',
    "Glossary",
  ),
);
const route = data("route");
const edges = route.written_proof_edges;
function depNode(key) {
  const e = route.declarations[key];
  const list = (keys) =>
    keys.length
      ? keys
          .map((k) => linked(route.declarations[k].declaration, "#decl-" + k))
          .join(" · ")
      : "No further edge recorded here.";
  return (
    '<div class="proofnode" id="decl-' +
    key +
    '"><code>' +
    linked(e.declaration, e.url) +
    '</code><p class="micro">Uses ' +
    list(edges.filter((v) => v.from === key).map((v) => v.to)) +
    '</p><p class="micro">Used by ' +
    list(edges.filter((v) => v.to === key).map((v) => v.from)) +
    "</p></div>"
  );
}
const graph =
  '<h2 id="source-graph">Written proof dependencies</h2><p>Each entry links to the declaration it uses and to its recorded callers. Follow the proof of ' +
  linked("riemannHypothesis", "#decl-main") +
  " back to the geometric suppliers. An endpoint marks the boundary of this extraction.</p>" +
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
const sourceFiles = fs
  .readdirSync(path.join(root, "records"))
  .filter(
    (f) =>
      !["corpus.json", "edition.json", "targets.json"].includes(f) &&
      f.endsWith(".json"),
  );
function linked(text, href) {
  return '<a href="' + esc(href) + '">' + esc(text) + "</a>";
}
function claimLinks(label, claims) {
  if (!claims.length) return "";
  return `<p><b>${label}.</b> ${claims.map((id) => linked(id, "#claim-" + id)).join(" · ")}</p>`;
}
function claimLi(c) {
  const ss = c.sources || c.declarations || [],
    id = c.id || c.claim_id,
    anchor = c.anchor || c.section || c.chapter;
  const equations = (c.equation_anchors || c.equations || []).map((target, i) => {
    const label = c.equation_anchors ? "Equation " + c.equations[i] : target
      .replace(/^[^-]+-/, "").replaceAll("-", " ");
    return linked(label, "book.html#" + target);
  });
  return (
    '<li data-search id="claim-' +
    esc(id) +
    '"><span class="source-id">' +
    esc(id) +
    "</span><b>" +
    esc(c.title || c.declaration || id) +
    "</b><p>" +
    esc(c.statement) +
    '</p><div class="micro">' +
    esc(c.status || c.reconstruction || "See record") +
    "</div><details><summary>Declaration and correspondence</summary><p>" +
    esc(
      c.correspondence ||
        c.evidence ||
        "Consult the structured claim record for its hypotheses and evidence.",
    ) +
    "</p>" +
    (c.hypotheses
      ? "<p><b>Hypotheses.</b> " + esc(c.hypotheses) + "</p>"
      : "") +
    (c.type
      ? "<p><b>Formal type.</b> <code>" + esc(c.type) + "</code></p>"
      : "") +
    (c.review ? "<p><b>Review.</b> " + esc(c.review) + "</p>" : "") +
    (equations.length ? "<p><b>Formulas in the book.</b> " + equations.join(" · ") + "</p>" : "") +
    claimLinks("Uses in this exposition", c.dependencies || []) +
    claimLinks(
      "Used by",
      allClaims
        .filter((other) => other.dependencies?.includes(id))
        .map((other) => other.id),
    ) +
    ss
      .map((s) =>
        s.url ? linked(s.declaration || s.name || s.path, s.url) : "",
      )
      .join(" · ") +
    (c.source ? " " + linked(c.declaration || "Pinned source", c.source) : "") +
    "</details>" +
    (anchor ? linked("Read the proof step", "book.html#" + anchor) : "") +
    "</li>"
  );
}
const allClaims = [
  ...tar.targets.map((c) => ({ ...c, anchor: "target-exact" })),
  ...sourceFiles.flatMap((f) => {
    const d = data(f.slice(0, -5));
    return d.claims || [];
  }),
];
const sourceClaims = new Map();
for (const claim of allClaims) {
  for (const entry of claim.sources || []) {
    const name = entry.declaration || entry.name;
    if (!name || !entry.url) continue;
    if (!sourceClaims.has(name)) sourceClaims.set(name, new Map());
    sourceClaims.get(name).set(claim.id, claim);
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
    "Five public statements inspected against pinned definitions. The challenge export was hashed and its theorem records located locally.",
  ],
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
        "Trace a mathematical claim to its pinned declaration and the paragraph that explains it.",
        [
          ["Verification", "#verification"],
          ["Reconstruction", "#reconstruction"],
          ["Claims", "#ledger"],
          ["Declaration index", "#declaration-index"],
          ["Dependencies", "#source-graph"],
        ],
      ) +
      '<div class="page-shell article-section textpage"><h2>Reading the dependency chain</h2><p>Start at the conclusion and follow the required inputs. This first diagram groups mathematical ideas. The individual proof applications below identify direct uses visible in the pinned source text.</p><div class="pathlist">' +
      [
        ["Classical RH", "target"],
        ["Nonvanishing", "reflection"],
        ["Window criterion", "windows"],
        ["Arithmetic balance", "balance"],
        ["Geometric inputs", "local"],
      ]
        .map(([t, id]) => linked(t, "book.html#" + id))
        .join("<span>←</span>") +
      "</div><details><summary>Direct applications in the formal source</summary><ul>" +
      paths +
      '</ul><p>These entries follow written proof expressions. The transitive constant-dependency graph of the elaborated solution has not been extracted locally.</p></details><h2 id="verification">Verification record</h2><p>External checks are attributed to Andrew V. Sutherland and dated 20 November 2026 at 22:05 UTC. The source attribution is Levent Alpöge working with Claude. This edition is independently written. ' +
      linked("Published report", ver.url) +
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
      linked("Corpus lock", "records/corpus.json") +
      '</p><h2 id="reconstruction">Reconstruction record</h2><p>The analytic chapters follow a possible zero from its residue to the one-sided window estimate and reflection. The theta chapters reconstruct an integral expansion at the selected primes, the local zeta quotients and the continued norm formula. The arithmetic chapter derives the marked-window selection, degree-two estimate and separate character counts. Each chapter records its remaining inputs. The chapter on normalization follows the six prime classes and the nonzero base tuple. The arithmetic chapter constructs the finite cycles and their determinant evaluations. Further inputs include integral gluing of lattices, representation densities and the estimates for quadratic twists. An end-to-end review of the exposition is still in progress. ' +
      linked("Current project state", "STATE.md") +
      '</p><p><a href="#source-graph">Explore individual declarations and their callers</a></p><h2 id="ledger">Claim ledger</h2>' +
      filters("Claim, theorem, or mathematical term") +
      '<ol class="records">' +
      allClaims.map(claimLi).join("") +
      "</ol>" +
      '<h2 id="declaration-index">Declaration index</h2><details><summary>Find a passage by its Lean declaration</summary><dl class="declaration-index">' +
      reverseIndex +
      "</dl></details>" +
      graph +
      "<h2>Machine-readable records</h2><p>" +
      auditLinks.join(" · ") +
      "</p></div></main>",
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
    " claims and " +
    refList.length +
    " distinct chapter sources.",
);
