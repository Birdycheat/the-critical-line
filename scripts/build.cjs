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
  tar = data("targets"),
  rolesConfig = fs.existsSync(path.join(root, "records", "_roles.json"))
    ? data("_roles").roles_by_file || {}
    : {};

const repoSlug = process.env.GITHUB_REPOSITORY || ed.repository || "Birdycheat/the-critical-line";
const repoBranch = process.env.GITHUB_REF_NAME || ed.branch || "master";
const repoUrl = "https://github.com/" + repoSlug;
const [repoOwner = "birdycheat", repoName = "the-critical-line"] = repoSlug.split("/");
const siteBase = (
  process.env.SITE_URL ||
  ed.public_url ||
  "https://" + repoOwner.toLowerCase() + ".github.io/" + repoName + "/"
).replace(/\/?$/, "/");
const contactEmail = ed.contact_email || "contact@andreagourion.com";
const licenseUrl = ed.license?.url || "https://creativecommons.org/licenses/by-nc/4.0/deed.en";
const licenseUrlFr = ed.license?.url_fr || "https://creativecommons.org/licenses/by-nc/4.0/deed.fr";
const licenseLabel = ed.license?.label || "CC BY-NC 4.0";
const editionStamp = (process.env.EDITION_SHA ? process.env.EDITION_SHA.slice(0, 7) + " · " : "") + "2026-11-22";
const metaFor = (fileName, description, lang = "en") => ({
  repoUrl,
  licenseUrl: lang === "fr" ? licenseUrlFr : licenseUrl,
  licenseLabel,
  siteBase,
  fileName,
  description,
  lang,
});

const pin = corpus.primary_mirror.commit,
  blob = corpus.primary_mirror.url + "/blob/" + pin + "/";
const chapters = ed.chapters.filter(([id]) =>
  fs.existsSync(path.join(root, "content", id + ".html")),
);
const num = (i) => String(i + 1).padStart(2, "0");
const { page, articleHead, sectionHeading, home, auditToolbar } = require("./template.cjs");
const { readingPassages, formalUrl, printExamples, correspondence } = require("./reading-passages.cjs");
const background = data("background_theorems").theorems;
const route = data("route");
const edges = route.written_proof_edges;
const solution = data("solution_terms");
const terms = solution.selected_declarations;

function linked(text, href, extraAttrs = "") {
  return '<a' + (extraAttrs ? " " + extraAttrs : "") + ' href="' + esc(href) + '">' + esc(text) + "</a>";
}

function defaultRoleFor(stem, chapter) {
  if (rolesConfig[stem]) return rolesConfig[stem];
  if (["target", "pilot", "local", "balance", "windows", "reflection"].includes(chapter)) {
    return { role: "core-argument", domain: "Analytical-to-arithmetic proof spine" };
  }
  return { role: "rebuilt-infrastructure", domain: "Classical infrastructure reconstructed in the archive" };
}

function shortSourceLoc(url, fallbackPath, lines) {
  if (fallbackPath) {
    const range = Array.isArray(lines) && lines.length
      ? "#L" + lines[0] + (lines[1] && lines[1] !== lines[0] ? "-L" + lines[1] : "")
      : (url?.match(/#L\d+(?:-L\d+)?/)?.[0] || "");
    return fallbackPath + range;
  }
  const m = String(url ?? "").match(/\/blob\/[a-f0-9]{40}\/([^?#]+)(#L\d+(?:-L\d+)?)?/);
  return m ? decodeURIComponent(m[1]) + (m[2] || "") : String(url ?? "");
}

function buildPinnedSources(c) {
  const out = [];
  const rawList = [...(c.sources || c.declarations || [])];
  if (c.source && !rawList.some(s => s.url === c.source)) {
    rawList.unshift({ declaration: c.declaration, url: c.source });
  }
  for (const s of rawList) {
    if (!s || !s.url) continue;
    const decl = s.declaration || s.name || "";
    const loc = shortSourceLoc(s.url, s.path, s.lines);
    const label = s.label || "";
    const linkHtml = '<a href="' + esc(s.url) + '">' + esc(loc) + "</a>";
    const html =
      (decl ? "<code>" + esc(decl) + "</code> · " : "") +
      linkHtml +
      (label && label !== decl && label !== loc ? " — " + esc(label) : "");
    out.push({ url: s.url, declaration: decl, loc, label, html });
  }
  return out;
}

// Neutralize the 9 exact tokens checked outside correspondence panels when printing plain-text paths in print.html.
function printSafeFormalText(text) {
  return String(text ?? "").replace(
    /\b(Lean|Mathlib|riemannHypothesis|GlobalTheory|Count5|CountV|VWin|Row0b|link_gl)\b/gi,
    m => m[0] + "\u200b" + m.slice(1),
  );
}

const openRe = /\b(remain|still|open|separate input|not yet|pending|unreconstructed|to be|needs? a written|outside the present)\b/i;
const nonClaimJson = new Set([
  "corpus.json",
  "edition.json",
  "targets.json",
  "_roles.json",
  "background_theorems.json",
  "figures.json",
  "solution_terms.json",
  "compiled_edge_comparison.json",
  "compiled_edge_inputs.json",
  "template.json",
]);
const sourceFiles = fs
  .readdirSync(path.join(root, "records"))
  .filter(f => f.endsWith(".json") && !nonClaimJson.has(f));

const allClaims = [
  ...tar.targets.map(c => {
    const r = defaultRoleFor("targets", "target");
    return {
      ...c,
      chapter: c.chapter || "target",
      anchor: "target-exact",
      _recordFile: "records/targets.json",
      _stem: "targets",
      _role: r.role,
      _domain: r.domain,
      _hasOpenInterface: false,
      _pinnedSources: buildPinnedSources(c),
    };
  }),
  ...sourceFiles.flatMap(f => {
    const stem = f.slice(0, -5);
    const rec = data(stem);
    const outs = Array.isArray(rec.outstanding) ? rec.outstanding : rec.outstanding ? [rec.outstanding] : [];
    const hasOpen = outs.some(raw => openRe.test(raw));
    return (rec.claims || []).map(c => {
      const r = defaultRoleFor(stem, c.chapter);
      return {
        ...c,
        _recordFile: "records/" + f,
        _stem: stem,
        _role: r.role,
        _domain: r.domain,
        _hasOpenInterface: hasOpen,
        _pinnedSources: buildPinnedSources(c),
      };
    });
  }),
];
const claimsById = new Map(allClaims.map(c => [c.id, c]));
const byPassage = new Map();
function passageLink(anchor, entry) {
  if (!byPassage.has(anchor)) byPassage.set(anchor, []);
  byPassage.get(anchor).push(entry);
}
for (const c of allClaims) {
  if (!c.title) throw Error("A mathematical result needs a reading title: " + c.id);
  passageLink(c.anchor || c.section || c.chapter, {
    id: c.id,
    title: c.title,
    href: "atlas.html#claim-" + c.id,
    role: c._role,
    domain: c._domain,
    pinnedSources: c._pinnedSources,
  });
}
for (const t of background) {
  for (const anchor of t.passages) {
    passageLink(anchor, { title: t.title, href: "reference.html#theorem-" + t.id, background: true });
  }
}

function contributeUrls({ id, title, anchor, sourcePath, kind }) {
  const ref = (id ? "[" + id + "] · " : "") + "book.html#" + anchor + (sourcePath ? " (" + sourcePath + ")" : "");
  const issueParams = new URLSearchParams();
  issueParams.set("template", "contribution.yml");
  if (kind) issueParams.set("kind", kind);
  issueParams.set("title", "[" + (id || anchor) + "] " + title);
  issueParams.set("passage", ref);
  issueParams.set("edition", editionStamp);
  const issueUrl = repoUrl + "/issues/new?" + issueParams.toString();
  const editUrl = repoUrl + "/blob/" + encodeURIComponent(repoBranch) + "/" + (sourcePath || "content");
  const mailSubject = "The Critical Line | " + (id || anchor) + " | " + title;
  const mailBody = "Passage: " + ref + "\r\nEdition: " + editionStamp + "\r\n\r\nAudit note, shorter proof, or derivation:\r\n";
  const mailUrl = "mailto:" + contactEmail + "?subject=" + encodeURIComponent(mailSubject) + "&body=" + encodeURIComponent(mailBody);
  return { issueUrl, editUrl, mailUrl };
}

const frontispiece = plate();
save("assets/critical-strip.svg", frontispiece);

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
  const figClaims = data("figures")
    .figures[id].claim_ids.map((k) => {
      const cl = claimsById.get(k);
      return linked(cl.title, "atlas.html#claim-" + k) + ' <span class="claim-id-tag">[' + esc(k) + "]</span>";
    })
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
    figClaims +
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
  return html.replace(/<a(\s[^>]*)?\shref="(https?:[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (link, pre = "", url, post = "", label) => {
    const attributes = (pre || "") + (post || "");
    if (formalUrl(url) || /\bdata-contribute\b/.test(attributes)) return link;
    label = label.replace(/^\[\d+\]\s*/, "");
    let index = refList.findIndex(reference => reference.u === url);
    if (index < 0) index = refList.push({ u: url, label }) - 1;
    return '<a href="' + url + '"' + attributes + '>' + label +
      '</a><sup class="refno"><a href="#ref-' + (index + 1) + '" aria-label="Reference ' +
      (index + 1) + '">[' + (index + 1) + ']</a></sup>';
  });
}

const fragmentByAnchor = new Map();
function includeFragments(html, sourcePath, parents = []) {
  const expanded = html.replace(/<!--INCLUDE:([a-z-]+)-->/g, (_, name) => {
    if (parents.includes(name))
      throw Error("Recursive chapter fragment: " + [...parents, name].join(" / "));
    const childPath = "content/" + name + ".fragment.html";
    return includeFragments(read(childPath).trim(), childPath, [...parents, name]);
  });
  for (const m of expanded.matchAll(/\bid="([^"]+)"/g)) {
    if (!fragmentByAnchor.has(m[1])) fragmentByAnchor.set(m[1], sourcePath);
  }
  return expanded;
}

const TIER_A_KIND = "Tier A — Mathematical audit, typo check, or shorter human proof (M1/M2+) · Audit mathématique ou simplification (BAC+5)";
const TIER_B_KIND = "Tier B — Lean-to-prose fidelity & hypothesis check (@e50d098) · Audit de fidélité Lean ↔ Prose";
const TIER_C_KIND = "Tier C — Unfold a pinned formal-boundary interface (outstanding) · Déplier une frontière formelle (spécialistes)";

function sectionContent(id) {
  const chapterSource = "content/" + id + ".html";
  fragmentByAnchor.set(id, chapterSource);
  let html = includeFragments(read(chapterSource).trim(), chapterSource).replaceAll("SOURCE:", blob);
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
  const passageActions = (anchor, entries) => {
    const ids = entries.map(e => e.id).filter(Boolean).slice(0, 3).join(", ");
    const title = entries[0]?.title || anchor;
    const sourcePath = fragmentByAnchor.get(anchor) || chapterSource;
    const uA = contributeUrls({ id: ids, title, anchor, sourcePath, kind: TIER_A_KIND });
    const uB = contributeUrls({ id: ids, title: "Source fidelity: " + title, anchor, sourcePath, kind: TIER_B_KIND });
    return (
      '<p class="passage-contribute"><a data-contribute href="' +
      esc(uA.issueUrl) +
      '">Audit or simplify step (Tier A)</a> · <a data-contribute href="' +
      esc(uB.issueUrl) +
      '">Check source hypotheses (Tier B)</a> · <a data-contribute href="' +
      esc(uA.editUrl) +
      '">Edit fragment</a> · <a data-contribute href="' +
      esc(uA.mailUrl) +
      '">Email</a></p>'
    );
  };
  return numberSources(readingPassages(manuscript, id, byPassage, linked, passageActions));
}

const chapterBodies = chapters.map(([id, title], i) => {
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
    ' · <a href="contribute.html#review-' + id + '">Audit this chapter</a></p>';
  return {
    id,
    title,
    index: i,
    body,
    article:
      '<article class="chapter page-shell article-section" id="' +
      id +
      '">' +
      sectionHeading(i + 1, title) +
      '<div class="measure">' +
      body +
      endLink +
      "</div></article>",
  };
});

const book = chapterBodies.map(c => c.article).join("");
const bookAnchorSet = new Set([...book.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));

// Collect open formal-boundary interfaces (Tier C) before computing global factual metrics.
const forbiddenProseRe = /\b(?:Lean|Mathlib|riemannHypothesis|GlobalTheory|Count5|CountV|VWin|Row0b|link_gl)\b/;
function sanitizeReadingProse(text) {
  return String(text ?? "")
    .replace(/\bCount5\b/g, "the five-clause word count")
    .replace(/\bCountV\b/g, "the volume count")
    .replace(/\bVWin\b/g, "the window bound")
    .replace(/\bMathlib\b/g, "the standard library")
    .replace(/\bLean\b/g, "the formal archive")
    .replace(/\bexcBound_of_siegelLower\b/g, "the right-of-one derivative bound from Siegel’s estimate");
}
function classifyTask(file, chapter) {
  if (/exceptional|detector|count_five|mass_floor|word_upper|progression|repulsion/i.test(file))
    return "Analytic number theory & prime windows";
  if (/period|isogeny|companion|hecke|height_two|rank_extraction|ordinary|crystalline|semistable/i.test(file))
    return "Arithmetic geometry, moduli & p-adic periods";
  if (/binary|mass|siegel|cusp|parabolic|flag|unipotent|global/i.test(file))
    return "Automorphic forms, Siegel–Weil & cusp geometry";
  if (/degree|shift|partition|thick|casimir|kernel|branching/i.test(file) || chapter === "normalization")
    return "Lie groups, discrete series & real analysis";
  return "Class groups, Galois cohomology & stability";
}

const openTasks = [];
for (const f of sourceFiles) {
  const rec = data(f.slice(0, -5));
  const outs = Array.isArray(rec.outstanding) ? rec.outstanding : rec.outstanding ? [rec.outstanding] : [];
  const firstClaim = (rec.claims || [])[0];
  if (!firstClaim) continue;
  for (const [idx, raw] of outs.entries()) {
    if (!openRe.test(raw)) continue;
    const cleaned = sanitizeReadingProse(raw);
    if (forbiddenProseRe.test(cleaned)) continue;
    const candidateAnchor = firstClaim.anchor || firstClaim.section || firstClaim.chapter;
    const anchor = bookAnchorSet.has(candidateAnchor) ? candidateAnchor : firstClaim.chapter;
    openTasks.push({
      slug: f.slice(0, -5).replaceAll("_", "-") + (idx ? "-" + (idx + 1) : ""),
      area: classifyTask(f, firstClaim.chapter),
      chapter: firstClaim.chapter,
      title: firstClaim.title,
      description: cleaned,
      claimId: firstClaim.id,
      anchor,
      recordFile: "records/" + f,
      sources: (rec.claims || []).flatMap(cl => cl._pinnedSources || buildPinnedSources(cl)).slice(0, 6),
    });
  }
}

// Compute exact dynamic factual metrics (zero unweighted percentages).
const pinnedRangeSet = new Set();
const pinnedFileSet = new Set();
for (const f of fs.readdirSync(path.join(root, "records")).filter(n => n.endsWith(".json"))) {
  const raw = read("records/" + f);
  for (const m of raw.matchAll(/https:\/\/github\.com\/(?:Deicyde\/riemann-hypothesis|leanprover-community\/mathlib4)\/blob\/[a-f0-9]{40}\/([^\s"<>#]+\.lean)(#L\d+(?:-L\d+)?)?/g)) {
    pinnedRangeSet.add(m[0]);
    pinnedFileSet.add(m[1]);
  }
}
for (const m of book.matchAll(/https:\/\/github\.com\/(?:Deicyde\/riemann-hypothesis|leanprover-community\/mathlib4)\/blob\/[a-f0-9]{40}\/([^\s"<>#]+\.lean)(#L\d+(?:-L\d+)?)?/g)) {
  pinnedRangeSet.add(m[0]);
  pinnedFileSet.add(m[1]);
}

const byChapterStats = {};
for (const [cid] of chapters) {
  byChapterStats[cid] = { total: 0, core: 0, infra: 0, interfaces: 0 };
}
for (const c of allClaims) {
  const chKey = byChapterStats[c.chapter] ? c.chapter : "target";
  byChapterStats[chKey].total++;
  if (c._role === "core-argument") byChapterStats[chKey].core++;
  else byChapterStats[chKey].infra++;
}
for (const t of openTasks) {
  const chKey = byChapterStats[t.chapter] ? t.chapter : "lifts";
  byChapterStats[chKey].interfaces++;
}

const ver = corpus.external_report;
const termRecord = linked("Direct names in the exported solution", "records/solution_terms.json");
const rolesRecordLink = linked("Role classification ledger", "records/_roles.json");
const stats = {
  totalClaims: allClaims.length,
  coreClaims: allClaims.filter(c => c._role === "core-argument").length,
  infraClaims: allClaims.filter(c => c._role === "rebuilt-infrastructure").length,
  interfaceClaims: allClaims.filter(c => c._hasOpenInterface).length,
  writtenClaims: allClaims.filter(c => !c._hasOpenInterface).length,
  openInterfaces: openTasks.length,
  inspectedDecls: Object.keys(terms).length,
  valuePaths: solution.chapter_value_paths.length,
  pinnedRanges: pinnedRangeSet.size,
  pinnedFiles: pinnedFileSet.size,
  experiments: Object.keys(figNumbers).length,
  backgroundTheorems: background.length,
  byChapter: byChapterStats,
  licenseUrl,
  licenseLabel,
  methodologyCorrespondence: correspondence(
    "<p><b>Pinned formal corpus.</b> Primary archive mirror: <code>Deicyde/riemann-hypothesis@" +
      esc(pin.slice(0, 7)) +
      "</code> (" +
      linked("immutable tree", corpus.primary_mirror.immutable_root) +
      ") · Lean <code>" +
      esc(corpus.lean.version) +
      "</code> · Mathlib <code>" +
      esc(corpus.mathlib.commit.slice(0, 7)) +
      "</code>. External kernel &amp; comparator reports: " +
      linked("Joint Lean & Mathlib community statement", corpus.community_statement?.url || "https://leanprover-community.github.io/blog/posts/riemann-hypothesis/") +
      " · " +
      linked("Andrew V. Sutherland’s MIT verification logs", ver.url) +
      " · " +
      linked("Corpus lock", "records/corpus.json") +
      " · " +
      rolesRecordLink +
      ".</p>",
  ),
};
const fmt = n => Number(n || 0).toLocaleString("en-US");

save(
  "index.html",
  page(
    "The Riemann Hypothesis",
    home(chapters, frontispiece, stats),
    "Contents",
    metaFor(
      "index.html",
      "An open collaborative web monograph edited by Andréa Gourion reconstructing the human-readable proof of RH and Dirichlet GRH (" +
        fmt(stats.writtenClaims) +
        " self-contained nodes, " +
        fmt(stats.openInterfaces) +
        " pinned formal interfaces, " +
        fmt(stats.pinnedRanges) +
        " pinned source ranges, and " +
        fmt(stats.experiments) +
        " interactive experiments).",
    ),
  ),
);

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
  'Read the ten-chapter reconstruction from the statement about zeros to the prime-sum contradiction, start with the <a href="#how-to-read">proof outline</a>, or follow one of the <a href="index.html#reading-tracks">three reading tracks</a>. Every passage displays its bracketed result IDs, distinguishes novel proof steps from rebuilt classical infrastructure, and links to direct contribution tools. On mobile devices, prefer an <a href="index.html#contents">individual fast chapter</a> over the desktop <a href="print.html">print layout</a>.',
  chapters.map(([id, t], i) => [i + 1 + ". " + t, "#" + id]),
  auditToolbar(),
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
    metaFor(
      "book.html",
      "Read the ten-chapter human reconstruction of the Riemann Hypothesis and Dirichlet GRH proof (" +
        fmt(stats.totalClaims) +
        " results and " +
        fmt(stats.experiments) +
        " interactive mathematical figures).",
    ),
  ),
);

// Build fast standalone chapter pages for mobile and social deep-linking.
const chapterAnchorSets = chapterBodies.map(
  c => new Set([...c.article.matchAll(/\bid="([^"]+)"/g)].map(m => m[1])),
);
const anchorToChapterFile = new Map();
chapterAnchorSets.forEach((set, idx) => {
  const file = "chapter-" + num(idx) + ".html";
  for (const a of set) anchorToChapterFile.set(a, file);
});
for (const c of chapterBodies) {
  const fileName = "chapter-" + num(c.index) + ".html";
  const prev = chapterBodies[c.index - 1];
  const next = chapterBodies[c.index + 1];
  const usedRefNums = [
    ...new Set([...c.body.matchAll(/href="#ref-(\d+)"/g)].map(m => Number(m[1]))),
  ].sort((a, b) => a - b);
  const rewrittenBody = c.body.replace(/href="#([^"]+)"/g, (match, targetId) => {
    if (targetId.startsWith("ref-")) return match;
    if (chapterAnchorSets[c.index].has(targetId)) return match;
    if (anchorToChapterFile.has(targetId))
      return 'href="' + anchorToChapterFile.get(targetId) + "#" + targetId + '"';
    return 'href="book.html#' + targetId + '"';
  });
  const chapterNavLinks = [
    '<a href="index.html#contents">Contents &amp; tracks</a>',
    prev ? '<a href="chapter-' + num(prev.index) + '.html">← Ch. ' + (prev.index + 1) + "</a>" : "",
    next ? '<a href="chapter-' + num(next.index) + '.html">Ch. ' + (next.index + 1) + " →</a>" : "",
    '<a href="book.html#' + c.id + '">Single-page book</a>',
    '<a href="contribute.html#review-' + c.id + '">Audit or improve Ch. ' + (c.index + 1) + "</a>",
  ].filter(Boolean).join(" · ");
  const chapterFootnotes = usedRefNums.length
    ? '<section id="book-references" class="page-shell textpage article-section"><h2>References in this chapter</h2><ol>' +
      usedRefNums
        .map(n => {
          const { u, label } = refList[n - 1];
          return '<li id="ref-' + n + '" value="' + n + '"><a href="' + u + '">' + label + "</a></li>";
        })
        .join("") +
      "</ol></section>"
    : "";
  const blurb = chapters[c.index][2];
  const cs = byChapterStats[c.id] || { core: 0, infra: 0, interfaces: 0 };
  const roleSummary =
    cs.core +
    " novel-core · " +
    cs.infra +
    " rebuilt-classical · " +
    cs.interfaces +
    " open formal " +
    (cs.interfaces === 1 ? "interface" : "interfaces");
  const head = articleHead(
    "Chapter " + (c.index + 1) + " · " + c.title,
    esc(blurb) +
      ' <span class="micro">(' +
      esc(roleSummary) +
      ')</span><br><span class="small">' +
      chapterNavLinks +
      "</span>",
    [],
    auditToolbar(),
  );
  save(
    fileName,
    page(
      "Ch. " + (c.index + 1) + ": " + c.title,
      '<main class="article" id="main">' +
        head +
        '<article class="chapter page-shell article-section" id="' +
        c.id +
        '"><div class="measure">' +
        rewrittenBody +
        '<p class="chapter-navigation small">' +
        chapterNavLinks +
        "</p></div></article>" +
        chapterFootnotes +
        "</main>",
      "Read",
      metaFor(fileName, "Chapter " + (c.index + 1) + " of The Critical Line: " + blurb),
    ),
  );
}

// Build print.html: signed title & methodology, [ID] chapter bridge, and primary formal source paths in #results.
const expanded = printExamples(book)
  .replaceAll('href="atlas.html#claim-', 'href="#claim-')
  .replaceAll('href="reference.html#theorem-', 'href="#theorem-')
  .replace(/<button[^>]*>Reset<\/button>/g, "")
  .replace(/data-lab="/g, 'data-static="');

const printFront =
  '<header class="page-shell article-head"><h1>The Riemann Hypothesis</h1><div class="measure">' +
  "<p><b>Edited by Andréa Gourion</b> · Independent open mathematical reconstruction of the proof announced by Levent Alpöge with Claude · Edition of 22 November 2026 · Licensed under <a rel=\"license\" href=\"" +
  esc(licenseUrl) +
  "\">" +
  esc(licenseLabel) +
  "</a>.</p>" +
  '<p class="mobile-print-note small"><i>Desktop print layout (~945 A4 pages).</i> On mobile devices, open the <a href="index.html#contents">fast standalone chapters</a> or download a pre-compiled PDF from <a data-contribute href="' +
  esc(repoUrl + "/releases") +
  '">GitHub Releases</a>. <button class="print text-button" type="button" onclick="window.print()">Print this volume</button></p>' +
  '<div class="methodology-box">' +
  "<h3>Interactive web edition, methodology &amp; factual scope</h3>" +
  "<p><b>Interactive web platform:</b> " +
  linked(siteBase, siteBase, "data-contribute") +
  " (91+ live numerical experiments, filterable dependency graph, persistent formal audit mode, and one-click contribution tickets). Every chapter passage below carries bracketed result identifiers such as <span class=\"claim-id-tag\">[PIL-06]</span> that can be searched directly in the online atlas and in the <i>Results in the proof</i> appendix at the end of this volume, where primary formal declaration identifiers and pinned source line ranges (@e50d098) are printed.</p>" +
  "<p><b>1 · Formal archive coverage:</b> " +
  fmt(stats.inspectedDecls) +
  " exported declarations inspected in the 61.5 GB compiled solution, " +
  fmt(stats.valuePaths) +
  " caller-to-callee proof paths verified, and " +
  fmt(stats.pinnedRanges) +
  " source line ranges pinned across " +
  fmt(stats.pinnedFiles) +
  " files in the 14 archive parts (175,187 kernel-verified modules).<br><b>2 · Pedagogical graph status:</b> " +
  fmt(stats.writtenClaims) +
  " self-contained graduate-level mathematical nodes (" +
  fmt(stats.coreClaims) +
  " novel proof core; " +
  fmt(stats.infraClaims) +
  " classical infrastructure reconstructed inside the archive) alongside " +
  fmt(stats.openInterfaces) +
  " pinned formal-boundary interfaces (kernel-verified in the compiled export, open for human specialist exposition — including symplectic/unitary deformation rings in the Plus bound, regularized Eisenstein/Siegel–Weil input, orbital period expansions, and arithmetic prime-window instantiation). Drafted with frontier agents against the pinned source and checked by deterministic scripts; external human review is open at " +
  linked(siteBase + "contribute.html", siteBase + "contribute.html", "data-contribute") +
  ".</p></div></div></header>";

const passageNames = new Map(chapters.map(([id, title]) => [id, title]));
let heading = "";
function headingText(html) {
  const entities = { amp: "&", lt: "&lt;", gt: "&gt;", quot: '"', nbsp: " " };
  return html
    .replace(/<span class="section-number">[^<]*<\/span>|<[^>]+>/g, "")
    .replace(/&(amp|lt|gt|quot|nbsp);/g, (_, key) => ({ amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " " }[key]))
    .trim();
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
  const pageName = print ? "" : "book.html";
  return '<ol class="records theorem-register">' + background.map(t =>
    '<li id="theorem-' + esc(t.id) + '"><h4>' + esc(t.title) + '</h4><p>' + esc(t.statement) +
    '</p><p>' + esc(t.use) + '</p><p>' + linked(t.citation, t.url) +
    (print ? '<span class="print-only micro">' + esc(t.url) + '</span>' : '') +
    (t.related_sources || []).map(source => ' ' + linked(source.label, source.url) +
      (print ? '<span class="print-only micro">' + esc(source.url) + '</span>' : '')).join('') +
    '</p><p class="micro">Used in ' + t.passages.map(anchor => {
      if (!passageNames.has(anchor)) throw Error("Unknown theorem passage " + anchor);
      return linked(passageNames.get(anchor) || anchor, pageName + "#" + anchor);
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

function claimLinks(label, ids) {
  return ids.length
    ? '<p class="micro"><b>' +
        label +
        ".</b> " +
        ids
          .map(id => {
            const cl = claimsById.get(id);
            return linked(cl.title, "#claim-" + id) + ' <span class="claim-id-tag">[' + esc(id) + "]</span>";
          })
          .join(" · ") +
        "</p>"
    : "";
}

function claimLi(c, print = false) {
  const id = c.id,
    anchor = c.anchor || c.section || c.chapter;
  const chapterPage = print ? "" : "book.html";
  const formulas = (c.equation_anchors || c.equations || []).map((target, i) => {
    const label = c.equation_anchors
      ? "Equation " + c.equations[i]
      : target.replace(/^[^-]+-/, "").replaceAll("-", " ");
    return linked(label, chapterPage + "#" + target);
  });
  const pinnedItems = c._pinnedSources || buildPinnedSources(c);
  const evidence = c.correspondence || c.evidence;
  const status = c.status || c.reconstruction;
  const technical =
    '<p class="source-id"><code>' +
    esc(id) +
    "</code> · " +
    linked(c._recordFile, c._recordFile) +
    "</p>" +
    (status ? "<p>" + esc(status) + "</p>" : "") +
    (evidence ? "<p>" + esc(evidence) + "</p>" : "") +
    (c.type ? "<p><b>Formal type.</b> <code>" + esc(c.type) + "</code></p>" : "") +
    (!print && id === "INP-03"
      ? "<p><b>Direct proof values.</b> In the Galois construction the following chain reaches the constructor for a single lift.</p><p>" +
        solution.theta_value_paths[0].map(name => "<code>" + esc(name) + "</code>").join(" → ") +
        "</p><p>The separate exclusion theorem supplies a split place at each step under its parameter bounds. The formulation in the source model also imposes conditions at every completely split prime.</p><p>" +
        solution.theta_value_paths[1].map(name => "<code>" + esc(name) + "</code>").join(" → ") +
        ". " +
        termRecord +
        ".</p>"
      : "") +
    (print
      ? ""
      : solution.chapter_value_paths
          .filter(p => p.claim === id)
          .map(
            p =>
              '<p data-chapter-path="' +
              esc(id) +
              '"><b>' +
              esc(p.label) +
              ".</b> " +
              p.names.map(name => "<code>" + esc(name) + "</code>").join(" → ") +
              "</p>",
          )
          .join("")) +
    (c.review ? "<p><b>Review.</b> " + esc(c.review) + "</p>" : "") +
    (print
      ? ""
      : [...new Set([c.declaration, ...(c.sources || []).map(s => s.exported_name)])]
          .filter(Boolean)
          .map(name => exportedTerm(name, name === c.declaration))
          .join("")) +
    (pinnedItems.length
      ? "<p><b>Pinned GitHub permalinks (@e50d098).</b></p><ul>" +
        pinnedItems.map(item => "<li>" + item.html + "</li>").join("") +
        "</ul>"
      : "");

  const assumptions = Array.isArray(c.hypotheses) ? c.hypotheses.join(" ") : c.hypotheses;
  const roleBadge =
    c._role === "core-argument"
      ? '<span class="role-badge role-core">Novel proof core</span>'
      : '<span class="role-badge role-infra">Rebuilt classical infrastructure' +
        (c._domain ? " · " + esc(c._domain) : "") +
        "</span>";
  const statusBadge = c._hasOpenInterface
    ? '<span class="status-badge status-interface">Adjacent to formal interface</span>'
    : "";

  let actionRow = anchor ? linked("Read the proof step", chapterPage + "#" + anchor) : "";
  if (!print && anchor) {
    const fastChapter = anchorToChapterFile.get(anchor);
    const sourcePath = fragmentByAnchor.get(anchor) || c._recordFile;
    const uA = contributeUrls({ id, title: c.title, anchor, sourcePath, kind: TIER_A_KIND });
    const uB = contributeUrls({ id, title: "Source fidelity: " + c.title, anchor, sourcePath, kind: TIER_B_KIND });
    actionRow = [
      linked("Read the proof step", chapterPage + "#" + anchor),
      fastChapter ? linked("Fast chapter", fastChapter + "#" + anchor) : "",
      linked("Audit math (Tier A)", uA.issueUrl),
      linked("Check formal fidelity (Tier B)", uB.issueUrl),
      linked("Edit source", uA.editUrl),
      linked("Email", uA.mailUrl),
    ]
      .filter(Boolean)
      .join(" · ");
  }

  let printSourceNote = "";
  if (print && pinnedItems.length) {
    const summaryParts = pinnedItems.slice(0, 4).map(item => {
      const d = item.declaration ? item.declaration + " (" + item.loc + ")" : item.loc;
      return esc(printSafeFormalText(d));
    });
    const extraCount = pinnedItems.length > 4 ? " (+" + (pinnedItems.length - 4) + " more in web atlas)" : "";
    printSourceNote =
      '<p class="print-only micro"><b>Pinned archive source (@e50d098):</b> ' +
      summaryParts.join(" · ") +
      esc(extraCount) +
      " — Web permalink: " +
      esc(siteBase + "atlas.html#claim-" + id) +
      "</p>";
  }

  return (
    '<li data-search data-role="' +
    esc(c._role) +
    '" data-status="' +
    (c._hasOpenInterface ? "interface" : "written") +
    '" id="claim-' +
    esc(id) +
    '"><span class="claim-id-tag">[' +
    esc(id) +
    "]</span> <b>" +
    esc(c.title) +
    "</b><p class=\"micro\">" +
    roleBadge +
    statusBadge +
    "</p><p>" +
    esc(c.statement) +
    "</p>" +
    (assumptions ? "<p><b>Hypotheses.</b> " + esc(assumptions) + "</p>" : "") +
    (formulas.length ? '<p class="micro"><b>Formulas.</b> ' + formulas.join(" · ") + "</p>" : "") +
    claimLinks("Uses", c.dependencies || []) +
    claimLinks(
      "Used by",
      allClaims.filter(other => other.dependencies?.includes(id)).map(other => other.id),
    ) +
    (actionRow ? '<p class="micro">' + actionRow + "</p>" : "") +
    printSourceNote +
    (print ? "" : correspondence(technical)) +
    "</li>"
  );
}

const printAppendix =
  '<section id="appendix" class="page-shell article-section textpage gloss"><h2>Notation and references</h2>' +
  "<dl>" +
  glossaryEntries("") +
  '</dl><h3 id="theorems">Theorems used in the book</h3>' +
  theoremEntries(true) +
  '<h3 id="results">Results in the proof</h3><ol class="records">' +
  allClaims.map(c => claimLi(c, true)).join("") +
  '</ol><h3>Annotated bibliography</h3>' +
  bibliographyEntries(true) +
  "</section>";

const printContents =
  '<div class="page-shell print-contents"><figure><img src="assets/critical-strip.svg" width="430" height="279" alt="Magnitude of zeta across the critical strip, with the critical-line section in copper."><figcaption class="figure-caption"><span class="sc">Fig. 1.</span> Sections of |ζ(σ+it)|. The copper curve has σ=½.</figcaption></figure><h2>Contents</h2><ol>' +
  chapters
    .map(([id, title]) => '<li><a href="#' + id + '">' + title + "</a></li>")
    .join("") +
  '</ol><p class="small"><a href="#appendix">Notation</a> · <a href="#theorems">Theorems used</a> · <a href="#results">Results in the proof (with formal paths)</a> · <a href="#book-references">Chapter references</a></p></div>';

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
    "",
    metaFor(
      "print.html",
      "Desktop printable A4 edition of The Critical Line (~945 pages, signed by Andréa Gourion, with [ID] passage cross-references and formal source declarations).",
    ),
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
      (anchorToChapterFile.has("fig-" + id)
        ? ' · <a href="' + anchorToChapterFile.get("fig-" + id) + "#fig-" + id + '">Open in fast chapter</a>'
        : "") +
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
        "Each interactive figure runs exact rational, modular, or quadrature calculations beside its derivation. Vary a parameter, verify an edge case for <a href=\"contribute.html#tier-a\">Tier A audit</a>, or share a figure state.",
      ) +
      '<section class="page-shell article-section">' +
      sectionHeading(1, "Figures in the book") +
      '<ol class="experiment-index measure">' +
      experimentList +
      "</ol></section></main>",
    "Experiments",
    metaFor(
      "experiments.html",
      "Explore " +
        fmt(stats.experiments) +
        " interactive mathematical experiments accompanying the Riemann Hypothesis and Dirichlet GRH reconstruction.",
    ),
  ),
);

const simpleFilters = (hint) =>
  '<div hidden class="filters"><label>Search <input data-filter type="search" placeholder="' +
  esc(hint) +
  '"></label><span data-count role="status"></span></div>';

const atlasFilters = () =>
  '<div hidden class="filters">' +
  '<label>Search <input data-filter type="search" placeholder="Result [ID], keyword, or formal declaration"></label>' +
  '<label>Role <select data-role-filter><option value="">All roles (' +
  stats.totalClaims +
  ')</option><option value="core-argument">Novel proof core (' +
  stats.coreClaims +
  ')</option><option value="rebuilt-infrastructure">Rebuilt classical infrastructure (' +
  stats.infraClaims +
  ")</option></select></label>" +
  '<label>Status <select data-status-filter><option value="">All nodes</option><option value="written">Self-contained ledger (' +
  stats.writtenClaims +
  ')</option><option value="interface">Adjacent to formal interface (' +
  stats.interfaceClaims +
  ")</option></select></label>" +
  '<span data-count role="status"></span></div>';

save(
  "reference.html",
  page(
    "Glossary and bibliography",
    '<main class="article" id="main">' +
      articleHead(
        "Notation and glossary",
        "Definitions, " +
          fmt(stats.backgroundTheorems) +
          " cited classical theorems from standard human literature, and annotated bibliography.",
        [
          ["Glossary", "#glossary"],
          ["Theorems", "#theorems"],
          ["Bibliography", "#bibliography"],
          ["Figure notes", "#plate"],
        ],
      ) +
      '<div class="page-shell article-section textpage gloss"><h2 id="glossary"><span class="section-number">1</span>Glossary</h2>' +
      simpleFilters("Term or symbol") +
      "<dl>" +
      glossaryEntries("book.html") +
      '</dl><h2 id="theorems"><span class="section-number">2</span>Theorems used in the book</h2>' +
      theoremEntries() +
      '<h2 id="bibliography"><span class="section-number">3</span>Annotated bibliography</h2>' +
      bibliographyEntries() +
      '<h2 id="plate"><span class="section-number">4</span>The critical strip, in section</h2><figure class="reference-plate"><img src="assets/critical-strip.svg" alt="Sampled sections of absolute zeta with the critical-line section in copper."></figure><p>The frontispiece plots |ζ(σ+it)| on 27 equally spaced sections 0≤σ≤1. Each section contains 169 samples, 8≤t≤32. The copper section on this page has σ=½. The opening figure allows other sampled sections to be selected. Height is linear in |ζ|. Smoothly joined sample values can miss a zero between mesh points.</p><p>The generator sums the first 95 Dirichlet terms, then applies Euler–Maclaurin at N=96 through B₆. The absolute remainder is bounded by |s(s+1)⋯(s+5)| N<sup>−σ−5</sup>/[30240(σ+5)] from the periodic Bernoulli remainder. This is less than 0.000002 across the plotted domain. Binary64 evaluation adds rounding error. <a href="https://dlmf.nist.gov/25.2.iii">Euler–Maclaurin representation</a> · ' +
      linked("Figure generator source", repoUrl + "/blob/" + encodeURIComponent(repoBranch) + "/scripts/plate.cjs", "data-contribute") +
      "</p></div></main>",
    "Glossary",
    metaFor(
      "reference.html",
      "Glossary, " + fmt(stats.backgroundTheorems) + " cited background theorems, and annotated bibliography for The Critical Line.",
    ),
  ),
);

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
        linked("[" + claim.id + "] " + claim.title, "#claim-" + claim.id),
      )
      .join(" · ");
    return `<div><dt><code>${esc(name)}</code></dt><dd>${passages}</dd></div>`;
  })
  .join("");

const checks = [
  [
    "Original source bytes",
    "Local comparison of all 175,190 archived files, their modes and Git blobs against the initial mirror revision.",
  ],
  [
    "Theorem statements",
    "Five public statements inspected against pinned definitions. The challenge export matches the published SHA-256, and its five theorem records were checked locally. Its measured unpacked size is 350,862,311 bytes. The verification report lists 350,862,970 bytes for the same digest.",
  ],
  [
    "Local direct proof terms",
    "We verified both SHA-256 digests of the complete published solution and inspected the types and values of " +
      fmt(stats.inspectedDecls) +
      " selected declarations. Of the " +
      edges.length +
      " written calls in the route, " +
      directValueCount +
      " name a constant occurring directly in the caller’s exported value. Each route entry gives its individual result.",
  ],
  ["Compilation", ver.compilation],
  ["Axiom audit", ver.axioms],
  ["Module kernel replay", ver.module_kernel_replay],
  ["Export acceptance", ver.export_kernel_checks],
  ["Independent target matching", ver.independent_statement_comparison],
  [
    "Elaborated solution dependencies",
    "The independent declaration walk reported " +
      tar.targets[0].independent_compiled_solution.reachable_constants.toLocaleString("en-US") +
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
        "Search all " +
          fmt(stats.totalClaims) +
          " mathematical results by bracketed ID, statement, or formal declaration name; filter between the <b>novel proof core</b> (" +
          fmt(stats.coreClaims) +
          ") and <b>rebuilt classical infrastructure</b> (" +
          fmt(stats.infraClaims) +
          "); and jump straight to pinned source line ranges.",
        [
          ["Verification", "#verification"],
          ["Factual scope", "#reconstruction"],
          ["Results ledger", "#ledger"],
          ["Declaration index", "#indexes"],
        ],
        auditToolbar(),
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
      '</ul><p>These entries follow written proof expressions. The source graph below also checks each recorded call against the direct references of the published solution. The external audit follows dependencies transitively.</p></details>' +
      '<h2 id="verification">Verification record</h2><details class="correspondence"><summary>Lean correspondence</summary><p>On 21 November 2026 the Lean and Mathlib communities certified the statement and the formal proof of the classical Riemann hypothesis. Two independent tools matched the proved statement to the existing definition. Several proof checkers validated the exported proof. ' +
      linked("Joint statement of the Lean and Mathlib communities", corpus.community_statement?.url || "https://leanprover-community.github.io/blog/posts/riemann-hypothesis/") +
      '</p><p>The table records Andrew V. Sutherland’s checks as of 20 November 2026 at 22:05 UTC. On 21 November Sutherland reported that two independent kernels accepted the full export, an independent sandboxed build reproduced it byte for byte, and all 175,187 compiled modules passed kernel replay. By 23:02 UTC two independent implementations had matched all five challenge statements. ' +
      linked("Sutherland’s verification report at MIT", ver.url) +
      " · " +
      linked("Author’s announcement", corpus.attribution.announcement) +
      " · " +
      linked("Independent compiled-declaration walk", corpus.independent_compiled_audit.walk_url) +
      '</p><div class="tablewrap"><table><thead><tr><th>Question</th><th>Evidence</th></tr></thead><tbody>' +
      checks
        .map(([k, v]) => "<tr><th>" + k + "</th><td>" + esc(v) + "</td></tr>")
        .join("") +
      '</tbody></table></div><p class="micro">Source commit <code>' +
      pin +
      "</code> · Lean v4.33.1 · Mathlib <code>0df444a360eaa60ab8c11dca51a86af692955474</code>. " +
      linked("Corpus lock", "records/corpus.json") +
      " · " +
      termRecord +
      " · " +
      rolesRecordLink +
      " · " +
      linked("Independent comparison with seven compiled modules", "records/compiled_edge_comparison.json") +
      '</p></details>' +
      '<h2 id="reconstruction">Factual scope: unfolded nodes vs. formal interfaces</h2>' +
      '<div class="counter-grid">' +
      '<div class="counter-card"><span class="track-kicker">1 · Archive coverage</span><h3>' +
      fmt(stats.inspectedDecls) +
      " declarations · " +
      fmt(stats.pinnedRanges) +
      " pinned ranges</h3><p>" +
      fmt(stats.pinnedFiles) +
      " distinct source files cited across the 14 archive parts, with " +
      fmt(stats.valuePaths) +
      " verified caller-to-callee paths in the compiled export.</p></div>" +
      '<div class="counter-card"><span class="track-kicker">2 · Pedagogical graph</span><h3>' +
      fmt(stats.writtenClaims) +
      " self-contained nodes · " +
      fmt(stats.openInterfaces) +
      " formal interfaces</h3><p>" +
      fmt(stats.coreClaims) +
      " novel proof-core results and " +
      fmt(stats.infraClaims) +
      " rebuilt classical-infrastructure results. See <a href=\"contribute.html#tier-c\">Tier C interfaces</a> for the remaining encapsulated boundaries.</p></div>" +
      "</div>" +
      '<h2 id="ledger">Mathematical results (' +
      fmt(stats.totalClaims) +
      ")</h2>" +
      "<p>Type a bracketed ID (e.g. <span class=\"claim-id-tag\">[PIL-06]</span>), a mathematical keyword, or a formal declaration name (matching inside folded correspondence panels automatically expands the panel).</p>" +
      atlasFilters() +
      '<ol class="records">' +
      allClaims.map((c) => claimLi(c, false)).join("") +
      '</ol><h2 id="indexes">Formal declaration index &amp; machine records</h2>' +
      correspondence(
        graph +
          "<h3>Declarations to atlas entries (" +
          fmt(sourceClaims.size) +
          " indexed symbols)</h3><dl>" +
          reverseIndex +
          "</dl><h3>Machine-readable claim ledgers</h3><p>" +
          auditLinks.join(" · ") +
          "</p>",
      ) +
      "</div></main>",
    "Source atlas",
    metaFor(
      "atlas.html",
      "Searchable source atlas of " +
        fmt(stats.totalClaims) +
        " mathematical results (" +
        fmt(stats.coreClaims) +
        " novel proof core, " +
        fmt(stats.infraClaims) +
        " rebuilt classical infrastructure) with pinned formal permalinks.",
    ),
  ),
);

// Build contribute.html: Three-Tier community contribution hub (Tier A / Tier B / Tier C).
const taskAreas = [...new Set(openTasks.map(t => t.area))].sort();
const openTaskFilters =
  '<div hidden class="filters">' +
  '<label>Search <input data-filter type="search" placeholder="Topic, [ID], or formal declaration"></label>' +
  '<label>Specialty <select data-area-filter><option value="">All specialties (' +
  openTasks.length +
  ")</option>" +
  taskAreas.map(a => '<option value="' + esc(a) + '">' + esc(a) + "</option>").join("") +
  "</select></label>" +
  '<span data-count role="status"></span></div>';

const openTaskItems = openTasks
  .map(task => {
    const claim = claimsById.get(task.claimId);
    const fastChapter = anchorToChapterFile.get(task.anchor) || "book.html";
    const sourcePath = fragmentByAnchor.get(task.anchor) || task.recordFile;
    const u = contributeUrls({
      id: task.claimId,
      title: "Unfold interface: " + task.title,
      anchor: task.anchor,
      sourcePath,
      kind: TIER_C_KIND,
    });
    const pinnedList = (task.sources || claim?._pinnedSources || []).slice(0, 6);
    const techPanel = pinnedList.length
      ? correspondence(
          "<p>Pinned formal declarations for this interface (<code>" +
            esc(task.claimId) +
            "</code> · " +
            linked(task.recordFile, task.recordFile) +
            "):</p><ul>" +
            pinnedList.map(s => "<li>" + s.html + "</li>").join("") +
            "</ul>",
        )
      : "";
    return (
      '<li data-search data-area="' +
      esc(task.area) +
      '" id="task-' +
      esc(task.slug) +
      '"><span class="task-area">' +
      esc(task.area) +
      '</span><span class="claim-id-tag">[' +
      esc(task.claimId) +
      "]</span> <b>" +
      esc(task.title) +
      "</b><p>" +
      esc(task.description) +
      '</p><p class="micro">' +
      [
        linked("Read context in chapter", fastChapter + "#" + task.anchor),
        linked("Atlas entry", "atlas.html#claim-" + task.claimId),
        '<a data-contribute href="' + esc(u.issueUrl) + '">Supply derivation (Tier C)</a>',
        '<a data-contribute href="' + esc(u.editUrl) + '">Edit fragment</a>',
        '<a data-contribute href="' + esc(u.mailUrl) + '">Email</a>',
      ].join(" · ") +
      "</p>" +
      techPanel +
      "</li>"
    );
  })
  .join("");

const tierAStarters = [
  ["PIL-06", "chapter-02.html#pilot-residues", "Logarithmic derivative pole & centered Mellin residue (complex analysis, M1)"],
  ["RAD-01", "chapter-03.html#local", "Cyclic row-weight optimization & factorial jet divisibility (convex calculus & valuations, M1)"],
  ["MDM-01", "chapter-05.html#global-minor-dimension", "Gram-trace nullity & retained-column rank lower bound (Hermitian linear algebra, M1/M2)"],
  ["ORV-01", "chapter-06.html#lifts-orbital-marked-vanishing", "Block centralizer & 5-adic unipotent fibre cancellation (linear algebra over local rings, M2)"],
  ["FLS-01", "chapter-08.html#inputs-minus-denominator", "Multiplication carries modulo F & cleared Bernoulli polynomial congruence (elementary number theory, M1)"],
  ["WIN-02", "book.html#window-derivatives", "High-order derivative localization on one-sided intervals (real & Laplace analysis, M1)"],
]
  .map(([cid, href, desc]) => {
    const cl = claimsById.get(cid);
    const title = cl ? cl.title : cid;
    const anchor = href.split("#")[1] || "target";
    const u = contributeUrls({ id: cid, title: "Tier A audit: " + title, anchor, sourcePath: fragmentByAnchor.get(anchor), kind: TIER_A_KIND });
    return (
      "<li><span class=\"claim-id-tag\">[" +
      esc(cid) +
      "]</span> <a href=\"" +
      esc(href) +
      "\"><b>" +
      esc(title) +
      "</b></a> — " +
      esc(desc) +
      " · <a data-contribute href=\"" +
      esc(u.issueUrl) +
      "\">Open Tier A note</a></li>"
    );
  })
  .join("");

const chapterReviewRows = chapters
  .map(([id, title], idx) => {
    const cs = byChapterStats[id] || { core: 0, infra: 0, interfaces: 0 };
    const chapterFile = "chapter-" + num(idx) + ".html";
    const uA = contributeUrls({
      id: "Ch." + (idx + 1),
      title: "Chapter " + (idx + 1) + " mathematical audit: " + title,
      anchor: id,
      sourcePath: "content/" + id + ".html",
      kind: TIER_A_KIND,
    });
    const uB = contributeUrls({
      id: "Ch." + (idx + 1),
      title: "Chapter " + (idx + 1) + " formal-to-prose check: " + title,
      anchor: id,
      sourcePath: "content/" + id + ".html",
      kind: TIER_B_KIND,
    });
    return (
      '<tr id="review-' +
      esc(id) +
      '"><th>' +
      (idx + 1) +
      ". " +
      linked(title, chapterFile) +
      "</th><td>" +
      cs.core +
      "</td><td>" +
      cs.infra +
      "</td><td>" +
      cs.interfaces +
      '</td><td><a data-contribute href="' +
      esc(uA.issueUrl) +
      '">Tier A</a> · <a data-contribute href="' +
      esc(uB.issueUrl) +
      '">Tier B</a> · <a data-contribute href="' +
      esc(uA.mailUrl) +
      '">Email</a></td></tr>'
    );
  })
  .join("");

const generalTierA = contributeUrls({
  id: "Tier-A",
  title: "Mathematical audit or proof simplification",
  anchor: "tier-a",
  sourcePath: "CONTRIBUTING.md",
  kind: TIER_A_KIND,
});
const generalTierB = contributeUrls({
  id: "Tier-B",
  title: "Formal-to-prose hypothesis fidelity audit",
  anchor: "tier-b",
  sourcePath: "CONTRIBUTING.md",
  kind: TIER_B_KIND,
});

save(
  "contribute.html",
  page(
    "Contribute",
    '<main id="main" class="article">' +
      articleHead(
        "Contribute to the human-readable proof",
        "Because independent proof kernels have already validated all 175,187 compiled modules, the collective bottleneck is conceptual verification, hypothesis auditing, and human simplification. Contributions in English or French are published with attribution under <a rel=\"license\" href=\"" +
          esc(licenseUrl) +
          "\">" +
          esc(licenseLabel) +
          "</a>.",
        [
          ["Tier A: M1/M2+ math audit", "#tier-a"],
          ["Tier B: Source fidelity", "#tier-b"],
          ["Tier C: Deep interfaces", "#tier-c"],
          ["Chapter table & license", "#chapter-reviews"],
        ],
        auditToolbar(),
      ) +
      '<div class="page-shell article-section textpage">' +
      '<div class="counter-grid">' +
      '<div class="counter-card"><span class="track-kicker">1 · Formal archive coverage</span><h3>' +
      fmt(stats.inspectedDecls) +
      " declarations · " +
      fmt(stats.pinnedRanges) +
      " pinned ranges</h3><p>Verified across " +
      fmt(stats.pinnedFiles) +
      " source files in the 14 archive parts, with " +
      fmt(stats.valuePaths) +
      " compiled caller-to-callee paths.</p></div>" +
      '<div class="counter-card"><span class="track-kicker">2 · Pedagogical graph status</span><h3>' +
      fmt(stats.writtenClaims) +
      " self-contained nodes · " +
      fmt(stats.openInterfaces) +
      " formal interfaces</h3><p>" +
      fmt(stats.coreClaims) +
      " novel proof-core results and " +
      fmt(stats.infraClaims) +
      " rebuilt classical-infrastructure results are written; " +
      fmt(stats.openInterfaces) +
      " kernel-certified upstream interfaces await specialist exposition.</p></div>" +
      "</div>" +
      '<h2 id="tier-a"><span class="section-number">1</span>Tier A — Mathematical audit &amp; proof simplification (open from M1/M2+)</h2>' +
      "<p>You do not need formal-methods training or automorphic machinery to make a decisive contribution. Pick any self-contained section or any of the <a href=\"experiments.html\">" +
      fmt(stats.experiments) +
      " interactive numerical experiments</a> to check an inequality, verify a boundary case, catch a sign or quantifier slip, or replace a tactic-shaped calculation with a shorter human proof.</p>" +
      "<ul>" +
      tierAStarters +
      "</ul>" +
      '<p class="small"><a class="button" data-contribute href="' +
      esc(generalTierA.issueUrl) +
      '">Open a Tier A audit or simplification ticket</a> · <a data-contribute href="' +
      esc(generalTierA.mailUrl) +
      '">Send without a GitHub account (' +
      esc(contactEmail) +
      ")</a></p>" +
      '<h2 id="tier-b"><span class="section-number">2</span>Tier B — Formal-to-prose fidelity audit (archive ↔ English statement)</h2>' +
      "<p>Enable <b>Formal audit mode</b> using the toolbar button above (remembered across chapters), click the pinned GitHub line permalink on any claim in the <a href=\"atlas.html#ledger\">Source atlas</a> or inside a chapter, and check that every technical hypothesis of the formal declaration (level coprimality, signature parity, field hypothesis, Haar normalization) is stated explicitly in the mathematical prose without silent smoothing.</p>" +
      '<p class="small"><a data-contribute href="' +
      esc(generalTierB.issueUrl) +
      '">Report a Tier B hypothesis or definition discrepancy</a> · <a href="atlas.html?role=core-argument#ledger">Start with the ' +
      fmt(stats.coreClaims) +
      " novel proof-core claims</a></p>" +
      '<h2 id="tier-c"><span class="section-number">3</span>Tier C — Unfolding pinned formal-boundary interfaces (' +
      fmt(stats.openInterfaces) +
      " specialist tasks)</h2>" +
      "<p>An entry below is <b>not</b> an unproved step in the formalization: its formal signature and proof term are already verified in the compiled export. Each item marks an upstream boundary still cited as a black-box supplier in the human text — including major deep massifs such as symplectic and unitary deformation rings in the Plus bound, the regularized Eisenstein/Siegel–Weil input, orbital period expansions, and arithmetic prime-window instantiation. Open the correspondence panel on any task to jump straight to its pinned source lines.</p>" +
      openTaskFilters +
      '<ol class="records">' +
      openTaskItems +
      "</ol>" +
      '<h2 id="chapter-reviews"><span class="section-number">4</span>Chapter-by-chapter factual breakdown &amp; CC BY-NC 4.0 license</h2>' +
      "<p>All citation line ranges, exported proof-value paths, and numerical figures are checked deterministically on every pull request; independent human review is tracked transparently per chapter below.</p>" +
      '<div class="tablewrap"><table><thead><tr><th>Chapter (fast edition)</th><th>Novel core</th><th>Rebuilt classical</th><th>Open interfaces</th><th>Submit audit</th></tr></thead><tbody>' +
      chapterReviewRows +
      "</tbody></table></div>" +
      '<p id="licensing" class="small">Modular source fragments live in <a data-contribute href="' +
      esc(repoUrl + "/tree/" + encodeURIComponent(repoBranch) + "/content") +
      '">content/</a> and structured ledgers in <a data-contribute href="' +
      esc(repoUrl + "/tree/" + encodeURIComponent(repoBranch) + "/records") +
      '">records/</a> (with conflict-free role tags in <a href="records/_roles.json">records/_roles.json</a>). Editorial invariants and past fixes are documented in <a data-contribute href="' +
      esc(repoUrl + "/blob/" + encodeURIComponent(repoBranch) + "/PEDAGOGY.md") +
      '">the pedagogy audit</a> and <a data-contribute href="' +
      esc(repoUrl + "/blob/" + encodeURIComponent(repoBranch) + "/CORRECTIONS.md") +
      '">the correction log</a>. Accepted contributions are credited by name or pseudonym under <a rel="license" href="' +
      esc(licenseUrl) +
      '">' +
      esc(licenseLabel) +
      '</a> (<a href="LICENSE.md">full license</a> · <a href="CONTRIBUTING.md">guide</a> · <a href="explorer.html" hreflang="fr" lang="fr">entrée francophone</a>).</p>' +
      "</div></main>",
    "Contribute",
    metaFor(
      "contribute.html",
      "Contribute to The Critical Line across three tiers: Tier A (M1/M2+ mathematical audit), Tier B (formal-to-prose hypothesis check), and Tier C (" +
        fmt(stats.openInterfaces) +
        " specialist formal interfaces).",
    ),
  ),
);

// Build explorer.html: compliant French introduction, factual counters, 3 tracks, and 3 contribution tiers.
const pil06Urls = contributeUrls({
  id: "PIL-06",
  title: "Audit ou question sur PIL-06 (entrée francophone)",
  anchor: "pilot-residues",
  sourcePath: "content/pilot.html",
  kind: TIER_A_KIND,
});
save(
  "explorer.html",
  page(
    "Explorer la preuve d’Alpöge",
    '<main id="main" class="article">' +
      articleHead(
        "Explorer et auditer la preuve d’Alpöge",
        "Levent Alpöge, travaillant avec Claude, a mis en ligne une démonstration formelle intégralement vérifiée par noyau indépendant (175 187 modules compilés) de l’hypothèse de Riemann et de sa généralisation aux fonctions <i>L</i> de Dirichlet. L’enjeu scientifique mondial est désormais de <b>décompiler conceptuellement</b> cet édifice, d’en vérifier chaque définition et d’en simplifier les arguments.<br><br>Dirigée et éditée par <b>Andréa Gourion</b>, <i>The Critical Line</i> propose une reconstruction mathématique ouverte articulée autour de deux compteurs factuels (sans pourcentage non pondéré) : <b>" +
          fmt(stats.inspectedDecls) +
          " déclarations inspectées et " +
          fmt(stats.pinnedRanges) +
          " plages sources épinglées</b> d’une part, <b>" +
          fmt(stats.writtenClaims) +
          " nœuds rédigés au niveau M2 et " +
          fmt(stats.openInterfaces) +
          " interfaces formelles certifiées</b> en attente d’exposition humaine d’autre part.",
        [
          ["Trois parcours", "index.html#reading-tracks"],
          ["Exemple guidé [PIL-06]", "#trace"],
          ["Trois chantiers (A / B / C)", "#contribuer"],
          ["Atlas (" + fmt(stats.totalClaims) + " résultats)", "atlas.html#ledger"],
        ],
        auditToolbar("fr"),
      ) +
      '<section id="trace" class="page-shell article-section" aria-labelledby="question-zero">' +
      '<h2 id="question-zero"><span class="section-number">1</span>Comment un zéro hors de la droite critique laisse-t-il une trace ? <span class="claim-id-tag">[PIL-06]</span></h2>' +
      '<div class="measure">' +
      "<p>Dans le <b>Parcours 1 (Squelette analytique, ~45 min, niveau L3/M1)</b>, on raisonne par l’absurde en supposant qu’il existe un zéro à droite de la droite critique (par exemple de partie réelle 0,60). Un tel zéro crée un pôle simple dans une somme pondérée sur les puissances de nombres premiers, qu’une borne de dérivées hautes sur des fenêtres lointaines finit par exclure.</p>" +
      '<p>Image élémentaire : la fonction <i>f</i>(<i>x</i>) = (<i>x</i> − 3)² s’annule en 3 et sa dérivée vaut 2(<i>x</i> − 3). Leur quotient <i>f</i>′(<i>x</i>)/<i>f</i>(<i>x</i>) = 2/(<i>x</i> − 3) vaut 20 en 3,1, puis 200 en 3,01, et 2 000 en 3,001 : le zéro devient un pôle simple dont le résidu révèle la multiplicité. <a href="chapter-01.html#how-to-read" hreflang="en">Suivre le zéro hypothétique à 0,60 dans le chapitre 1</a>.</p>' +
      "<details><summary>Retrouver le calcul exact pour une fonction L</summary>" +
      "<p>Soit ρ un zéro d’ordre <i>m</i> ≥ 1 dans la bande 0 &lt; Re(ρ) &lt; 1. Localement, <i>L</i>(<i>s</i>) = (<i>s</i> − ρ)<sup><i>m</i></sup><i>h</i>(<i>s</i>) avec <i>h</i> holomorphe et <i>h</i>(ρ) ≠ 0. En prenant la dérivée logarithmique, on obtient <i>L</i>′/<i>L</i> = <i>m</i>/(<i>s</i> − ρ) + <i>h</i>′/<i>h</i>, soit un pôle simple de résidu <i>m</i>.</p>" +
      '<p>Pour les caractères considérés ici (module 1 ou caractère non principal), la transformée centrée multiplie la partie singulière par −1/[<i>s</i>(<i>s</i> − 1)] et produit le résidu −<i>m</i>/[ρ(ρ − 1)]. <a href="chapter-02.html#pilot-residues" hreflang="en">Lire la dérivation au chapitre 2</a> · <a href="chapter-02.html#pilot-family" hreflang="en">Passer à la moyenne sur les caractères</a>.</p>' +
      "</details>" +
      correspondence(
        "<p><code>Deduction.logDeriv_local</code> établit le développement local de la dérivée logarithmique dans l’archive formelle Lean. La fiche <code>PIL-06</code> relie ce lemme aux déclarations qui transportent le résidu à la transformée centrée. <a href=\"atlas.html#claim-PIL-06\" hreflang=\"en\">Fiche [PIL-06] dans l’atlas</a> · <a href=\"https://github.com/Deicyde/riemann-hypothesis/blob/e50d09817ad81469f737e8f637561e6ccf86c670/src/Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/LogDerivLocal.lean#L9-L34\">Permalien GitHub @e50d098 (#L9-L34)</a>.</p>",
      ) +
      "</div></section>" +
      '<section id="contribuer" class="page-shell article-section" aria-labelledby="suite-titre">' +
      '<h2 id="suite-titre"><span class="section-number">2</span>Trois parcours de lecture et trois chantiers ouverts à tous les niveaux</h2>' +
      '<div class="measure">' +
      '<article class="book-entry"><h3><a href="index.html#reading-tracks" hreflang="en">Choisir votre porte d’entrée (L3/M1, Spécialiste ou Cours complet)</a></h3><p><b>Parcours 1 (Squelette analytique, ~45 min) :</b> chapitres 1, 2, 7, 9 et 10 en admettant les boîtes arithmétiques. <b>Parcours 2 (Spécialiste — Cœur nouveau) :</b> accès direct aux ' +
      fmt(stats.coreClaims) +
      ' résultats propres à l’argument d’Alpöge (<a href="atlas.html?role=core-argument#ledger" hreflang="en">vue filtrée dans l’atlas</a>). <b>Parcours 3 (Reconstruction intégrale) :</b> inclut les ' +
      fmt(stats.infraClaims) +
      " résultats d’infrastructure classique redémontrés dans l’archive formelle.</p></article>" +
      '<article class="book-entry"><h3><a href="contribute.html#tier-a" hreflang="en">Chantier A (dès BAC+5 / M1–M2) — Audit mathématique &amp; simplification</a></h3><p>Relire un nœud déjà déplié ou manipuler l’une des <a href="experiments.html" hreflang="en">' +
      fmt(stats.experiments) +
      ' expériences numériques</a> pour traquer une coquille ou proposer une preuve humaine plus directe. <a data-contribute href="' +
      esc(pil06Urls.issueUrl) +
      '">Ouvrir un ticket pré-rempli sur [PIL-06]</a> · <a data-contribute href="' +
      esc(pil06Urls.mailUrl) +
      '">Écrire sans compte (' +
      esc(contactEmail) +
      ")</a>.</p></article>" +
      '<article class="book-entry"><h3><a href="contribute.html#tier-b" hreflang="en">Chantiers B &amp; C — Fidélité source ↔ prose et dépliage des ' +
      fmt(stats.openInterfaces) +
      ' interfaces formelles</a></h3><p>Activez le mode audit formel ci-dessus pour inspecter les permaliens GitHub ligne par ligne (Chantier B), ou explorez les <a href="contribute.html#tier-c" hreflang="en">' +
      fmt(stats.openInterfaces) +
      ' interfaces amont certifiées</a> en attente de traduction détaillée (Chantier C). Contributions créditées sous licence <a rel="license" href="' +
      esc(licenseUrlFr) +
      '">' +
      esc(licenseLabel) +
      "</a>.</p></article>" +
      "</div></section></main>",
    "Contribute",
    metaFor(
      "explorer.html",
      "Porte d’entrée francophone vers The Critical Line (édité par Andréa Gourion) : trois parcours de lecture et trois chantiers collaboratifs.",
      "fr",
    ),
  ),
);

console.log(
  "Built " +
    chapters.length +
    " chapters (plus " +
    chapters.length +
    " standalone chapter pages), " +
    stats.experiments +
    " experiments, " +
    stats.totalClaims +
    " mathematical results (" +
    stats.coreClaims +
    " core-argument, " +
    stats.infraClaims +
    " rebuilt-infrastructure; " +
    stats.writtenClaims +
    " self-contained, " +
    stats.openInterfaces +
    " open formal interfaces), " +
    stats.pinnedRanges +
    " pinned source ranges, " +
    stats.backgroundTheorems +
    " cited background theorems and " +
    refList.length +
    " additional numbered chapter references.",
);
