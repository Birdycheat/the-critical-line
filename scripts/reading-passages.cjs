"use strict";

// The manuscript consists of HTML fragments. Only sections and disclosures
// introduce nested reading scopes; retain equations and other markup verbatim.
function readingScopes(html) {
  const root = { tag: "", start: "", parts: [] };
  const stack = [root];
  const boundary = /<\/?(details|section)\b[^>]*>|<h[2-6]\b[^>]*>[\s\S]*?<\/h[2-6]>/gi;
  let previous = 0;
  for (const match of html.matchAll(boundary)) {
    const scope = stack.at(-1);
    scope.parts.push(html.slice(previous, match.index));
    previous = match.index + match[0].length;
    if (!match[1]) {
      scope.parts.push({ heading: match[0] });
    } else if (match[0].startsWith("</")) {
      if (scope.tag !== match[1]) throw Error("Unbalanced manuscript scope " + match[0]);
      stack.pop();
    } else {
      const child = { tag: match[1], start: match[0], parts: [] };
      scope.parts.push(child);
      stack.push(child);
    }
  }
  if (stack.length !== 1) throw Error("Unclosed manuscript scope " + stack.at(-1).tag);
  root.parts.push(html.slice(previous));
  return root;
}

function original(scope) {
  return scope.start + scope.parts.map(part => typeof part === "string" ? part : part.heading || original(part)).join("") +
    (scope.tag ? "</" + scope.tag + ">" : "");
}
const formalUrl = url => /^https?:\/\/github\.com\/(?:Deicyde\/riemann-hypothesis|leanprover-community\/mathlib4)(?:\/|$)/i.test(url);
const linkPattern = /<a\b[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
const citationSeparator = /^\s*(?:[·,;]\s*)?(?:and\s*)?$/;

function paragraph(body, sources, beforeDisplay) {
  const links = [...body.matchAll(linkPattern)];
  if (!links.some(match => formalUrl(match[1]))) return body;
  for (const match of links) {
    if (formalUrl(match[1])) sources.set(match[1], match[0].replace(/>\[\d+\]\s*/, ">"));
  }
  // The manuscripts put their evidence after a sentence, or immediately
  // before a displayed formula. Remove a trailing run without disturbing
  // an ordinary citation or a link which contributes a word to the sentence.
  const last = links.at(-1);
  if (formalUrl(last[1]) && /^[\s.]*$/.test(body.slice(last.index + last[0].length))) {
    let i = links.length - 1;
    while (i > 0 && formalUrl(links[i - 1][1]) &&
        citationSeparator.test(body.slice(links[i - 1].index + links[i - 1][0].length, links[i].index))) i--;
    const prefix = body.slice(0, links[i].index);
    const textBefore = prefix.replace(/<[^>]+>/g, "").trimEnd();
    if (!textBefore || /[.!?·]$/.test(textBefore) || beforeDisplay) {
      body = prefix.replace(/\s+[·,]\s*$/, "").trimEnd();
    }
  }
  return body.replace(linkPattern, (anchor, url, label) => formalUrl(url) ? label : anchor);
}

function correspondence(inner, start = "<details>") {
  if (!/\bclass="[^"]*\bcorrespondence\b/.test(start)) {
    start = start.includes('class="') ? start.replace('class="', 'class="correspondence ') :
      start.replace("<details", '<details class="correspondence"');
  }
  return start.replace(/\sopen(?:="[^"]*")?(?=[\s>])/g, "") +
    "<summary>Lean correspondence</summary>" + inner + "</details>";
}

function readingPassages(html, chapter, byPassage, linked) {
  function render(scope, inheritedId) {
    const inner = scope.parts;
    if (scope.tag === "details") {
      const raw = original(scope).slice(scope.start.length, -"</details>".length);
      const summary = raw.match(/^\s*<summary>([\s\S]*?)<\/summary>/);
      if (!summary) throw Error("Manuscript disclosure is missing its summary");
      if (/\bcorrespondence\b/.test(scope.start) ||
          /\b(?:Lean|source correspondence|source statements|proof calls)\b/i.test(summary[1])) {
        return correspondence(raw.slice(summary[0].length), scope.start);
      }
    }
    const scopeId = scope.start.match(/\bid="([^"]+)"/)?.[1] || inheritedId;
    let result = scope.start, prose = "", sources = new Map(), results = new Set(), background = new Set();
    function register(anchor) {
      for (const entry of byPassage.get(anchor) || []) {
        (entry.background ? background : results).add(entry);
      }
    }
    function flush() {
      result += prose;
      const references = (entries, label) => entries.size ?
        '<p class="passage-references"><b>' + label + '.</b> ' +
        [...entries].map(entry => linked(entry.title, entry.href)).join(" · ") + "</p>" : "";
      result += references(results, "Results in this passage") + references(background, "Theorems used");
      if (sources.size) result += correspondence("<ul>" + [...sources.values()].map(a => "<li>" + a + "</li>").join("") + "</ul>");
      sources = new Map(); results = new Set(); background = new Set(); prose = "";
    }
    register(scopeId);
    for (const part of inner) {
      if (typeof part === "string" || part.heading) {
        if (part.heading && prose.trim()) flush();
        const text = part.heading || part;
        for (const m of text.matchAll(/\bid="([^"]+)"/g)) register(m[1]);
        prose += text.replace(/<(p|li)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (match, tag, attributes, body, offset) => {
          const following = text.slice(offset + match.length).trimStart();
          const beforeDisplay = /^<(?:math\b|div class="(?:equation|eq|formula)\b)/.test(following);
          return "<" + tag + (attributes || "") + ">" + paragraph(body, sources, beforeDisplay) + "</" + tag + ">";
        });
      } else {
        if (part.tag === "section") flush();
        prose += render(part);
      }
    }
    flush();
    return result + (scope.tag ? "</" + scope.tag + ">" : "");
  }
  return render(readingScopes(html), chapter);
}

// Expand worked examples in the printable volume. Technical disclosures stay
// usable when this page is read on screen and are omitted by the print styles.
function printExamples(html) {
  const stack = [];
  return html.replace(/<\/?(?:details|summary)\b[^>]*>/g, tag => {
    if (tag.startsWith("<details")) {
      const technical = /\bcorrespondence\b/.test(tag) || stack.at(-1);
      stack.push(technical);
      if (technical) return tag;
      return tag.includes('class="') ? tag.replace("<details", "<section").replace('class="', 'class="printed-detail ') :
        tag.replace("<details", '<section class="printed-detail"');
    }
    if (tag.startsWith("</details")) return stack.pop() ? tag : "</section>";
    return stack.at(-1) ? tag : tag.replace("summary", "h4");
  });
}
module.exports = { readingPassages, formalUrl, printExamples, correspondence };
