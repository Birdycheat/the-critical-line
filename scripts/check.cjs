"use strict";
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "..");
const lib = require("../assets/labs.js");
const { zeta } = require("./plate.cjs");
const names = ["index", "book", "experiments", "atlas", "reference", "print"];
const ledger = new Map();
for (const name of fs
  .readdirSync(path.join(root, "records"))
  .filter((n) => n.endsWith(".json"))) {
  const record = JSON.parse(
    fs.readFileSync(path.join(root, "records", name), "utf8"),
  );
  for (const c of record.claims || record.targets || []) {
    assert.ok(!ledger.has(c.id), "Duplicate claim " + c.id);
    assert.ok(c.title?.trim() && c.statement?.trim(), "Missing mathematical statement for " + c.id);
    const sources = [c.source, ...(c.sources || c.declarations || []).map(s => s.url)];
    assert.ok(sources.some(u => u && /^https?:/.test(u)), "Missing primary source for " + c.id);
    ledger.set(c.id, c.dependencies || []);
  }
}
// A backward reading route must end at a supplied input.
const finished = new Set();
function checkRoute(id, path) {
  if (finished.has(id)) return;
  assert.ok(ledger.has(id), "Unknown claim on route " + [...path, id].join(" → "));
  assert.ok(!path.includes(id), "Cycle in claim dependencies: " + [...path, id].join(" → "));
  for (const input of ledger.get(id)) checkRoute(input, [...path, id]);
  finished.add(id);
}
for (const id of ledger.keys()) checkRoute(id, []);
for (const [f, s] of Object.entries(
  require("../records/figures.json").figures,
)) {
  assert.ok(lib.configs[f]);
  for (const c of s.claim_ids)
    assert.ok(ledger.has(c), "Missing source claim " + c);
}
const html = Object.fromEntries(
  names.map((n) => [
    n + ".html",
    fs.readFileSync(path.join(root, n + ".html"), "utf8"),
  ]),
);
const ids = {};
for (const [n, s] of Object.entries(html)) {
  const all = [...s.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  ids[n] = new Set(all);
  assert.equal(all.length, ids[n].size, "Duplicate anchors in " + n);
}
for (const id of ledger.keys()) {
  assert.ok(html["book.html"].includes('href="atlas.html#claim-' + id + '"'), "Result unreachable from the book: " + id);
  assert.ok(ids["print.html"].has("claim-" + id), "Result missing in the print appendix: " + id);
}
const background = require("../records/background_theorems.json").theorems;
for (const theorem of background) {
  const anchor = "theorem-" + theorem.id;
  assert.ok(theorem.title && theorem.statement && theorem.use && theorem.citation && /^https:\/\//.test(theorem.url),
    "Incomplete mathematical reference: " + theorem.id);
  assert.ok(ids["reference.html"].has(anchor) && ids["print.html"].has(anchor));
  assert.ok(theorem.passages.length && theorem.passages.every(id => ids["book.html"].has(id)));
  assert.ok(html["book.html"].includes('href="reference.html#' + anchor + '"'));
  assert.ok(html["print.html"].includes('href="#' + anchor + '"'));
}
for (const match of html["book.html"].matchAll(/<details\b[^>]*\sid="([^"]+)"/g)) {
  assert.ok(ids["print.html"].has(match[1]), "Missing printed example anchor " + match[1]);
}
for (const [figure] of html["book.html"].matchAll(/<figure class="lab"[^>]*>[\s\S]*?<\/figure>/g)) {
  assert.ok(!figure.includes('class="passage-references"') && !figure.includes('class="correspondence"'),
    "References belonging to the proof must precede the experiment");
}
for (const [n, s] of Object.entries(html)) {
  for (const m of s.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const val = m[1];
    if (/^(https?:|data:)/.test(val)) continue;
    const [f, id] = val.split("#");
    const dest = f || n;
    assert.ok(fs.existsSync(path.join(root, dest)), n + " missing file " + val);
    if (id) assert.ok(ids[dest]?.has(id), n + " missing anchor " + val);
  }
}
assert.ok(!html["atlas.html"].includes("(undefined)"), "An atlas source label has a missing declaration name");
const route = require("../records/route.json");
const solution = require("../records/solution_terms.json");
const comparison = require("../records/compiled_edge_comparison.json");
const { createHash } = require("node:crypto");
assert.equal(solution.uncompressed_sha256, comparison.solution.uncompressed_sha256);
assert.equal(solution.uncompressed_bytes, comparison.solution.uncompressed_bytes);
for (const target of require("../records/targets.json").targets) {
  const term = solution.selected_declarations[target.declaration];
  assert.deepEqual(term.type.constants, [target.type]);
  assert.ok(term.value.constants.length && !term.value.constants.includes("sorryAx"));
  assert.ok(html["atlas.html"].includes('data-solution-term="' + target.declaration + '"'));
}
for (const edge of route.written_proof_edges) {
  const caller = route.declarations[edge.from].declaration;
  const callee = route.declarations[edge.to].declaration;
  assert.ok(solution.selected_declarations[caller]?.value?.constants.includes(callee),
    "Recorded call missing in exported value: " + caller + " -> " + callee);
}
for (const [key, node] of Object.entries(route.declarations)) {
  if (solution.selected_declarations[node.declaration]) continue;
  assert.ok(solution.missing_names.includes(node.declaration));
  assert.ok(!route.written_proof_edges.some(e => e.from === key || e.to === key));
}
for (const chain of solution.theta_value_paths) {
  for (let i = 1; i < chain.length; i++) {
    assert.ok(solution.selected_declarations[chain[i - 1]].value.constants.includes(chain[i]),
      "Missing direct theta reference " + chain[i]);
  }
}
for (const path of solution.chapter_value_paths) {
  assert.ok(ledger.has(path.claim) && path.names.length >= 2);
  assert.ok(html["atlas.html"].includes('data-chapter-path="' + path.claim + '"'));
  for (const [index, name] of path.names.entries()) {
    assert.ok(solution.selected_declarations[name], "Uninspected chapter declaration " + name);
    if (index > 0) {
      const caller = solution.selected_declarations[path.names[index - 1]];
      assert.ok(caller.value.constants.includes(name), "Missing chapter call to " + name);
    }
  }
}
assert.ok(!html["print.html"].includes("data-chapter-path="));
let comparedFields = 0;
for (const mod of Object.values(comparison.modules)) {
  for (const [name, fields] of Object.entries(mod.declarations)) {
    const term = solution.selected_declarations[name];
    assert.equal(term.line, fields.line);
    for (const field of ["type", "value"]) {
      const names = term[field].constants;
      assert.equal(names.length, fields[field].count);
      assert.equal(createHash("sha256").update(JSON.stringify(names)).digest("hex"), fields[field].sha256);
      comparedFields++;
    }
  }
}
assert.equal(comparedFields, comparison.result.equal_fields);
assert.ok(!html["print.html"].includes("data-solution-term="));
function close(x, y, tol) {
  assert.ok(Math.abs(x - y) <= tol, x + " versus " + y);
}
// Enumerate the points of every subspace in dimension three. Each normalized
// nonzero vector gives one line and, as a linear functional, one plane.
for (const q of [2, 3, 5]) {
  const field = Array.from({length: q}, (_, i) => i);
  const space = field.flatMap(x => field.flatMap(y => field.map(z => [x, y, z])));
  const subspaces = [{j: 0, vectors: [[0, 0, 0]]}, {j: 3, vectors: space}];
  for (const direction of space.filter(v => v.find(a => a !== 0) === 1)) {
    subspaces.push({j: 1, vectors: field.map(a => direction.map(x => a * x % q))});
    subspaces.push({j: 2, vectors: space.filter(v =>
      v.reduce((dot, x, i) => dot + x * direction[i], 0) % q === 0)});
  }
  for (const r of [0, 1, 2]) {
    // U is spanned by the first r coordinate vectors in the quotient plane.
    const quotient = new Set(space.filter(([x, y]) =>
      (r > 0 || x === 0) && (r > 1 || y === 0)).map(([x, y]) => x + "," + y));
    const groups = [[], []];
    const totals = [[0, 0, 0], [0, 0, 0]];
    for (const {j, vectors} of subspaces) {
      const image = new Set(vectors.map(([x, y]) => x + "," + y));
      if (image.size !== quotient.size || [...image].some(p => !quotient.has(p))) continue;
      const start = Number(vectors.some(([x, y, z]) => x === 0 && y === 0 && z === 1));
      let end = start, weight = 1;
      for (let step = 0; step < 3 - j; step++) end = [1, 2, 0][end];
      for (let i = 1; i < j; i++) weight *= q ** i;
      groups[start].push({j, start, end, weight});
      totals[j % 2][end] += weight;
    }
    const [graphs, full] = groups;
    assert.ok(graphs.length);
    assert.equal(full.length, 1);
    assert.deepEqual(totals[0], totals[1]);
    const points = ["P₀", "P₁", "P₂"];
    const expected = group => {
      const {j, start, end, weight} = group[0];
      assert.ok(group.every(x => x.j === j && x.end === end && x.weight === weight));
      return [j, j % 2 ? "Odd" : "Even", group.length, weight, points[start], 3 - j, points[end]];
    };
    const left = expected(graphs), right = expected(full);
    const display = lib.render("ordinary-line-cancellation", {q: String(q), r: String(r)});
    const cells = [...display.matchAll(/<td>(.*?)<\/td>/g)].map(m => m[1]);
    assert.deepEqual(cells, left.flatMap((v, i) => [String(v), String(right[i])]));
    const arrival = graphs[0].end;
    const metricText = [...display.matchAll(/<(dt|dd)>(.*?)<\/\1>/g)].map(m => m[2]);
    assert.deepEqual(metricText, ["Even weight at " + points[arrival], String(totals[0][arrival]),
      "Odd weight at " + points[arrival], String(totals[1][arrival])]);
  }
}
for (const page of ["book.html", "print.html"]) {
  const figure = html[page].match(/<figure\b[^>]*\bid="fig-ordinary-line-cancellation"[^>]*>[\s\S]*?<\/figure>/);
  assert.ok(figure && figure[0].includes(lib.render("ordinary-line-cancellation", {q: "3", r: "1"})),
    "Missing the static ordinary-line multiplicities in " + page);
}
// In the special fibre, (a + bX)² = a² + (2ab + db²)X. Enumerate its 25 elements.
for (const [model, d] of [["glued", 5], ["product", 1]]) {
  const residues = [0, 1, 2, 3, 4];
  const specialRoots = residues.filter(x => (x * (x - d)) % 5 === 0);
  const idempotents = residues.flatMap(a => residues.filter(b =>
    (a * a - a) % 5 === 0 && (2 * a * b + d * b * b - b) % 5 === 0
  ).map(b => [a, b]));
  const reducedProjector = idempotents.find(([a, b]) => a === 1 && (a + d * b) % 5 === 0);
  assert.equal(idempotents.length, d === 5 ? 2 : 4);
  assert.deepEqual(reducedProjector, d === 5 ? undefined : [1, 4]);
  const display = lib.render("clopen-branch-reduction", {model});
  assert.deepEqual([...display.matchAll(/<td>(\d+)<\/td>/g)].map(m => +m[1]),
    [0, 0, d, specialRoots[specialRoots.length - 1]]);
  const metrics = [...display.matchAll(/<dd>(.*?)<\/dd>/g)].map(m => m[1].replace(/<\/?var>/g, ""));
  assert.deepEqual(metrics, [
    d === 1 ? "1 − X" : "1 − X/5",
    reducedProjector ? "Yes" : "No",
    specialRoots.length === 1 ? "One double point" : "Two reduced points",
  ]);
}
for (const page of ["book.html", "print.html"]) {
  const figure = html[page].match(/<figure\b[^>]*\bid="fig-clopen-branch-reduction"[^>]*>[\s\S]*?<\/figure>/);
  assert.ok(figure && figure[0].includes(lib.render("clopen-branch-reduction", {model: "glued"})),
    "Missing the static specialization of the two branches in " + page);
}
// Compare restrictions using a direct inverse search in the field of 17 elements.
const residues17 = Array.from({ length: 17 }, (_, n) => n);
const eighthRoots = residues17.filter(x => x ** 4 % 17 === 16);
assert.deepEqual(eighthRoots, [2, 8, 9, 15]);
for (const root of eighthRoots) {
  const inverse = residues17.find(y => root * y % 17 === 1);
  const square = root * root % 17;
  const real = (root + inverse) % 17;
  const display = lib.render("quadratic-place-restrictions", {root: String(root)});
  assert.deepEqual([...display.matchAll(/<td>([^<]+)<\/td>/g)].map(m => Number(m[1])),
    [2, 4, 11, root, square, real]);
  assert.deepEqual([...display.matchAll(/<dd>([^<]+)<\/dd>/g)].map(m => m[1]),
    [square === 4 ? "Same" : "Different", real === 11 ? "Same" : "Different", root === 15 ? "Satisfied" : "Fail"]);
}
// In det⁻¹ ⊗ Sym³, the four diagonal weights are (j−1, 2−j) in increasing order of j.
for (const [circle, rowExponents, upperBound] of [
  ["t1", ["−1", "0", "1", "2"], "2"],
  ["t2", ["1", "1", "1", "1"], "1"],
]) {
  for (const [vector, coordinates, firstCircleSupport] of [
    ["highest", ["0", "0", "0", "1"], "{2}"],
    ["lowest", ["1", "0", "0", "0"], "{−1}"],
    ["sum", ["1", "1", "1", "1"], "{−1, 0, 1, 2}"],
  ]) {
    const display = lib.render("weight-circle-spectrum", {vector, circle});
    assert.deepEqual([...display.matchAll(/<th scope="row"><var>([^<]+)<\/var><\/th>/g)].map(m => m[1]),
      ["e₂³", "e₁e₂²", "e₁²e₂", "e₁³"]);
    assert.deepEqual([...display.matchAll(/<td>([^<]+)<\/td>/g)].map(m => m[1]),
      rowExponents.flatMap((exponent, j) => [exponent, coordinates[j]]));
    assert.deepEqual([...display.matchAll(/<dd>([^<]+)<\/dd>/g)].map(m => m[1]),
      [circle === "t1" ? firstCircleSupport : "{1}", upperBound, upperBound]);
  }
}
for (const page of ["book.html", "print.html"]) {
  const figure = html[page].match(/<figure\b[^>]*\bid="fig-weight-circle-spectrum"[^>]*>[\s\S]*?<\/figure>/);
  assert.ok(figure && figure[0].includes(lib.render("weight-circle-spectrum", {vector: "sum", circle: "t1"})),
    "Missing static determinant-twisted symmetric cube in " + page);
}
// In the quadratic extension, (1 ± i)² = ±2i and |2|₂ = 1/2.
for (const [witness, expected, largest] of [
  ["character", ["1", "0", "0", "i", "1 − i", "1/√2", "−1", "2", "1/2", "−i", "1 + i", "1/√2"], "1/√2"],
  ["inverse", ["1", "0", "0", "−i", "1 + i", "1/√2", "−1", "2", "1/2", "i", "1 − i", "1/√2"], "1/√2"],
  ["combination", ["1", "0", "0", "1", "0", "0", "−1", "2", "1/2", "−1", "2", "1/2"], "1/2"],
]) {
  const display = lib.render("hecke-four-point-approximation", {witness});
  assert.deepEqual([...display.matchAll(/<td>([^<]+)<\/td>/g)].map(m => m[1]), expected);
  assert.deepEqual([...display.matchAll(/<dd>([^<]+)<\/dd>/g)].map(m => m[1]),
    [largest, "1/√2", witness === "combination" ? "Strictly smaller" : "Equal"]);
}
for (const page of ["book.html", "print.html"]) {
  const figure = html[page].match(/<figure\b[^>]*\bid="fig-hecke-four-point-approximation"[^>]*>[\s\S]*?<\/figure>/);
  assert.ok(figure && figure[0].includes(lib.render("hecke-four-point-approximation", {witness: "character"})),
    "Missing static four-point calculation in " + page);
}
// Each coordinate line selects a unique weight. Matrix units test the commutator independently.
for (const [weights, high] of [["separated", 4], ["adjacent", 2]]) {
  for (const [index, repeated] of ["low", "middle", "high"].entries()) {
    const distinct = [0, 1, high];
    const diagonal = [...distinct, distinct[index]].sort((a, b) => a - b);
    const display = lib.render("rank-weight-projectors", {weights, repeated});
    assert.ok(display.includes("<caption>Projectors for <var>D</var> = diag(" + diagonal.join(", ") + ")</caption>"));
    const cells = [...display.matchAll(/<td>([^<]+)<\/td>/g)].map(m => m[1]);
    const expected = distinct.flatMap(h => {
      const flags = diagonal.map(x => Number(x === h));
      return ["(" + flags.join(", ") + ")", String(flags.filter(Boolean).length)];
    });
    assert.deepEqual(cells, [...expected, "(1, 1, 1, 1)", "4"]);
    const units = diagonal.flatMap(source => diagonal.filter(target => target - source === 1));
    const pairs = high === 4 ? "0 → 1" : "0 → 1 and 1 → 2";
    assert.deepEqual([...display.matchAll(/<dd>([^<]+)<\/dd>/g)].map(m => m[1]),
      ["3", pairs, String(units.length)]);
  }
}
for (const [filter, sums, errors] of [
  ["all", [1,5,50,500], ["0","0","1/25","1/125"]],
  ["cut", [1,10,100,1000], ["0","1/5","1/25","1/125"]],
]) for (let degree = 0; degree <= 3; degree++) {
  const display = lib.render("polynomial-cut", {power: String(degree), filter});
  assert.deepEqual([...display.matchAll(/<dd>([^<]+)<\/dd>/g)].map(m => m[1]),
    [String(5 ** degree), String(sums[degree]), errors[degree]]);
}
// Fourier orthogonality on four points fixes the norms independently of the table's coordinate sum.
for (let modes = 1; modes <= 3; modes++) for (const mass of [1, 4]) {
  const display = lib.render("column-degree-defect", {modes: String(modes), mass: String(mass)});
  const fractions = mass === 1 ? ["0", "1", "2", "3"] : ["0", "1/4", "1/2", "3/4"];
  assert.deepEqual([...display.matchAll(/<dd>([^<]+)<\/dd>/g)].map(m => m[1]),
    [fractions[modes], fractions[1], fractions[modes - 1]]);
}
// Integer diagonal matrices give two different traces at determinant eight.
for (const [roots, triples, entries] of [
  ["primes", "(1,1,1)", [[27, 9], [30, 10], [12, 7]]],
  ["powers", "(0,3,0) or (1,1,1)", [[8, 6], [8, 7], [2, 4]]],
]) {
  for (const [i, candidate] of ["middle", "simple", "first"].entries()) {
    const display = lib.render("satake-multiplicities", {roots, candidate});
    const cells = [...display.matchAll(/<td>([^<]+)<\/td>/g)].map(m => m[1]);
    assert.equal(Number(cells[3]), entries[i][0]);
    assert.equal(Number(cells[5]), entries[i][1]);
    assert.deepEqual([...display.matchAll(/<dd>([^<]+)<\/dd>/g)].map(m => m[1]), [triples, i === 1 ? "Yes" : "No"]);
  }
}
// Norms and exponents are computed here from this biquadratic field's splitting classes.
for (const [prime, relative, square, norm, inverse] of [
  [3, "Yes", "No", 9, 4], [11, "No", "No", 121, 4], [17, "Yes", "Yes", 289, 4],
  [29, "Yes", "Yes", 29, 1], [61, "Yes", "Yes", 61, 3], [89, "Yes", "Yes", 89, 3],
]) {
  for (const omit of ["none", "61"]) {
    const display = lib.render("frobenius-good-places", {prime, omit});
    const cells = [...display.matchAll(/<td>([^<]+)<\/td>/g)].map(m => m[1]);
    assert.deepEqual(cells, [relative, square, String(norm), String(norm % 7), String(inverse)]);
    const verdict = prime === 61 && omit === "61" ? "Excluded" :
      square === "No" ? "Outside the good set" : inverse === 3 ? "Witness" : "Different exponent";
    assert.deepEqual([...display.matchAll(/<dd>([^<]+)<\/dd>/g)].map(m => m[1]), [prime === norm ? "1" : "2", verdict]);
  }
}
// The squared coordinate weights give both normalized expectations over the rationals.
for (const [amplitude, outer, meanU, meanT] of [
  [3, 2, "3/11", "97/110"], [3, 3, "4/11", "48/55"],
  [4, 2, "1/6", "167/180"], [4, 3, "2/9", "83/90"],
  [5, 2, "1/9", "257/270"], [5, 3, "4/27", "128/135"],
]) {
  const display = lib.render("casimir-cutoff", {amplitude, outer}).replace(/<\/?var>/g, "");
  const rows = [...display.matchAll(/<tr><th scope="row">[^<]+<\/th>(.*?)<\/tr>/g)]
    .map(row => [...row[1].matchAll(/<td>([^<]+)<\/td>/g)].map(cell => cell[1]));
  assert.deepEqual(rows, [
    ["0", "1", String(outer)], ["1", "1/2", outer === 2 ? "1/5" : "1/10"],
    ["1/2", "0", "0"], ["0", "0", outer === 2 ? "3/10" : "2/5"],
    ["Yes", "Yes", "No"], [String(amplitude), "1", "1"],
    [amplitude === 4 ? "2" : amplitude + "/2", "0", "0"],
  ]);
  assert.deepEqual([...display.matchAll(/<dd>(.*?)<\/dd>/g)].map(m => m[1]), [meanU, meanT]);
  const [uNum, uDen] = meanU.split("/").map(Number);
  const [tNum, tDen] = meanT.split("/").map(Number);
  assert.ok(2 * uNum <= uDen && 4 * tNum >= 3 * tDen);
}
// Directly enumerate which coordinate signs fix each proposed character vector.
for (const element of ["00", "01", "10", "11"]) {
  for (const candidate of ["pure", "mixed"]) {
    const display = lib.render("galois-character-peeling", {element, candidate});
    const tests = [...display.matchAll(/<dd>(.*?)<\/dd>/g)].map(m => m[1]);
    const equal = candidate === "pure" || ["00", "11"].includes(element);
    assert.deepEqual(tests, [equal ? "Equal" : "Different", candidate === "pure" ? "4 of 4" : "2 of 4"]);
  }
}
// Test strict ordering and the eigenvalue independently of the rendering branch.
for (const gap of [1, 2, 3]) {
  for (const position of [1, 2, 3]) {
    const html = lib.render("regular-unit-shift", {gap, position});
    const cells = [...html.matchAll(/<td>(-?\d+)<\/td>/g)].map(m => Number(m[1]));
    assert.deepEqual(cells.slice(3), [6000 + gap - Number(position === 1), 6000 - Number(position === 2), position === 3 ? -1 : 0]);
    const collision = position === 1 && gap === 1;
    const result = [...html.matchAll(/<dd>(.*?)<\/dd>/g)].map(m => m[1]);
    assert.deepEqual(result.slice(0, 2), [collision ? "Two equal entries" : "Regular", collision ? "No summand" : String([6001 + gap, 6001, 1][position - 1])]);
  }
}
// Partial fractions at a point away from the poles independently test the displayed weights.
for (const gap of [1, 2, 3]) {
  const poles = [-6001 - gap, -6001, -1];
  const residues = poles.map((_, i) => {
    const html = lib.render("regular-unit-shift", {gap, position: i + 1});
    const fraction = [...html.matchAll(/<dd>(.*?)<\/dd>/g)][2][1];
    const [a, b = 1] = fraction.split("/").map(Number);
    return a / b;
  });
  close(residues.reduce((a, b) => a + b), 3, 1e-12);
  for (const u of [-6000.5, -5999.5, -0.5]) {
    const original = poles.reduce((product, a) => product * (1 + 1 / (u - a)), 1) - 1;
    close(residues.reduce((sum, r, i) => sum + r / (u - poles[i]), 0), original, 1e-12);
  }
}
// Compute the discriminant from the Gram entry and the field degree in each plane.
for (const [prime, a, b] of [[11, 3, 1], [59, 3, 5], [83, 9, 1]]) {
  assert.equal(a * a + 2 * b * b, prime);
  assert.equal(prime % 12, 11);
  for (const plane of ["standard", "defect"]) {
    const html = lib.render("hyperplane-mass-stratum", {prime, plane});
    const cells = [...html.matchAll(/<td>([^<]*)<\/td>/g)].map(m => m[1]);
    const [order, badProduct, index] = cells.slice(1).map(Number);
    assert.equal(order, prime ** 4);
    assert.equal((badProduct * index) ** 2, order);
    assert.equal(plane === "standard" ? index : badProduct, prime ** 2);
    const bound = [...html.matchAll(/<dd>(.*?)<\/dd>/g)].map(m => m[1]);
    assert.deepEqual(bound, [badProduct === 1 ? "1" : "1/" + order, String(badProduct ** 2)]);
  }
}
// Recover both projections by inner products and enumerate the residue pairs modulo T+1.
for (const weight of [1, 2, 5]) {
  const u = [1, 1], w = [-weight, 1];
  const pair = (x, y) => x[0] * y[0] + weight * x[1] * y[1];
  assert.equal(pair(u, w), 0);
  const residuePairs = new Set();
  for (let first = 0; first <= weight; first++) for (let second = 0; second <= weight; second++) {
    const x = [first, second], m = weight + 1;
    residuePairs.add([pair(x, u) % m, ((pair(x, w) / weight) % m + m) % m].join(","));
  }
  assert.equal(residuePairs.size, weight + 1);
  for (let first = -2; first <= 2; first++) for (let second = -2; second <= 2; second++) {
    const x = [first, second];
    const display = lib.render("gluing-residues", {weight, first, second});
    const fractions = [...display.matchAll(/<td>(.*?)<\/td>/g)].map(m => {
      const [a, b = 1] = m[1].replace("−", "-").split("/").map(Number);
      return a / b;
    });
    const [a, ar, b, br] = fractions;
    close(a, pair(x, u) / pair(u, u), 1e-12);
    close(b, pair(x, w) / pair(w, w), 1e-12);
    close(ar, a - Math.floor(a), 1e-12);
    close(br, b - Math.floor(b), 1e-12);
    close(ar + br, Math.round(ar + br), 1e-12);
    close(a - weight * b, first, 1e-12);
    close(a + b, second, 1e-12);
  }
}
// Enumerate integer points on each rational ray to recover its first generator.
for (const [line, [x, y, q]] of Object.entries({axis: [1, 0, 1], thirds: [3, 4, 5], fifths: [5, 12, 13], eighths: [8, 15, 17]})) {
  let primitive;
  for (let i = 1; i <= q && !primitive; i++) {
    for (let j = 0; j <= q; j++) if (i * y === j * x) { primitive = [i, j]; break; }
  }
  assert.equal(x * x + y * y, q * q);
  const display = lib.render("rational-line-orbit", {line});
  assert.deepEqual([...display.matchAll(/<dd>(.*?)<\/dd>/g)].map(match => match[1]), [
    "(" + primitive.join(", ") + ")", String(primitive[0] ** 2 + primitive[1] ** 2), q === 1 ? "1" : q + "<sup>D</sup>",
  ]);
}
// Multiply the side lengths of the real rectangular image, place by place.
for (const degree of [1, 2]) for (const rank of [1, 2, 3]) for (const stretch of [-1, 0, 1]) {
  const scale = 2 ** stretch;
  let horizontal = 1, central = 1;
  for (let place = 0; place < degree; place++) {
    for (let coordinate = 0; coordinate < 2 * rank; coordinate++) horizontal *= scale;
    central *= scale * scale;
  }
  const value = cell => cell.split("/").map(Number).reduce((a, b) => a / b);
  const display = lib.render("parabolic-shell", {degree, rank, stretch});
  const cells = [...display.matchAll(/<td>([^<]*)<\/td>/g)].map(m => value(m[1]));
  const additive = horizontal * central;
  assert.deepEqual(cells, [1, 1 / additive, 1 / additive, additive, 1 / additive, 1]);
  assert.deepEqual([...display.matchAll(/<dd>([^<]*)<\/dd>/g)].map(m => value(m[1])), [horizontal, central]);
}
// Compute the norms instead from the entries of the signed-unitary two-plane block.
for (const scale of [0, 0.25, 1, 8, 16, 32]) {
  const singular = 2 ** scale;
  const diagonal = (singular + 1 / singular) / 2;
  const crossing = (singular - 1 / singular) / 2;
  const frobenius = Math.sqrt(2 * (diagonal ** 2 + crossing ** 2) + 2);
  const distance = Math.SQRT2 * Math.acosh(diagonal);
  const bounded = -8000 * Math.min(distance ** 2, distance / Math.SQRT2);
  const power = 6400 - 640 * Math.log(frobenius);
  const values = [...lib.render("cartan-power", {scale}).matchAll(/<dd>(.*?)<\/dd>/g)]
    .map(match => Number(match[1].replace("−", "-")));
  assert.equal(values.length, 3);
  assert.equal(values[0], 0);
  close(values[1], bounded, 0.0051);
  close(values[2], power, 0.0051);
  assert.ok(bounded <= power);
}
// Enumerate every witness on the half-grid, including both endpoints of each interval.
for (let halfStep = 0; halfStep <= 8; halfStep++) {
  const labelsAt = ["A", "A", "AB", "B", "B", "B", "BC", "C", "C"];
  const listFaces = values => ["A", "B", "C", "AB", "BC"].filter(face =>
    values.some(labels => [...face].every(label => labels.includes(label)))).join(", ");
  const result = lib.render("convex-nerve-cut", {cut: halfStep / 2});
  const values = [...result.matchAll(/<dd>(.*?)<\/dd>/g)].map(match => match[1]);
  assert.deepEqual(values, [listFaces(labelsAt.slice(0, halfStep + 1)),
    listFaces([labelsAt[halfStep]]), listFaces(labelsAt.slice(halfStep))]);
}
// Reconstruct t as a Gaussian residue x + iy and multiply before splitting at 5.
for (let a = 0; a < 5; a++) {
  for (let b = 0; b < 5; b++) {
    const reduce = n => ((n % 5) + 5) % 5;
    const x = reduce(3 * (a + b)), y = reduce(b - a);
    const html = lib.render("split-gram-phases", {first: a, second: b});
    const cells = [...html.matchAll(/<tr><th scope="row">([^<]+)<\/th><td>\((\d), (\d)\)<\/td><td>(\d)<\/td>/g)];
    const gaussian = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    assert.equal(cells.length, 4);
    let units = 0;
    for (let i = 0; i < gaussian.length; i++) {
      const [r, s] = gaussian[i];
      const re = 1 - r * x - s * y, im = s * x - r * y;
      const norm = reduce(re * re + im * im);
      assert.deepEqual(cells[i].slice(2).map(Number), [reduce(re + 2 * im), reduce(re + 3 * im), norm]);
      if (norm !== 0) units++;
    }
    assert.ok(units >= 2 && html.includes(units + " of 4"));
  }
}
// Compute each fundamental area from the real 2 by 2 basis for a Gaussian line.
for (const [real, imag] of [[1, 0], [1, 1], [2, 0], [2, 1]]) {
  const norm = real * real + imag * imag;
  for (const rank of [2, 3, 4]) {
    for (const scale of [1, 2, 3]) {
      const area = (a, b) => Math.abs(a * a - b * (-b));
      const line = area(real / norm, -imag / norm);
      const quotient = area(scale, 0);
      const lastRow = area(real / (norm * scale), -imag / (norm * scale));
      const row = Array.from({length: rank - 2}).reduce(product => product * line, lastRow);
      const output = lib.render("marked-ideal-weight", {rank, norm, scale});
      function fraction(match) {
        const [numerator, denominator = 1] = match[1].split("/").map(Number);
        return numerator / denominator;
      }
      const areas = Array.from(output.matchAll(/<td>([^<]+)<\/td>/g), fraction);
      const totals = Array.from(output.matchAll(/<dd>([^<]+)<\/dd>/g), fraction);
      [line, quotient, line * quotient, row].forEach((x, i) => close(areas[i], x, 1e-12));
      close(totals[0], norm, 0);
      close(totals[1], row * line * quotient, 1e-12);
      close(totals[1], 1 / norm ** rank, 1e-12);
    }
  }
}
// Use the two original continuous sums as an independent reference for the sharp cutoff.
const referencePrimePowers = new Map([[2,2],[3,3],[4,2],[5,5],[7,7],[8,2],[9,3],
  [11,11],[13,13],[16,2],[17,17]]);
for (const y of [4, 8, 12]) {
  for (const width of [2, 4]) {
    for (const chi of ["principal", "quadratic"]) {
      const residues = chi === "principal" ? [0, 1, 1] : [0, 1, -1];
      const {u, rows} = lib.progressionDifference(y, width, chi);
      assert.equal(u, y * (1 + 1 / width));
      const b = y * u / (u - y);
      function originalSum(t) {
        let sum = 0;
        for (const [n, p] of referencePrimePowers) {
          if (n <= t) sum += Math.log(p) * residues[n % 3] * (t / n - 1);
        }
        return sum;
      }
      let signed = 0;
      assert.deepEqual(rows.map(row => row.n), Array.from({length: u}, (_, i) => i + 1));
      for (const {n, prime, character, top, bottom} of rows) {
        assert.equal(prime, referencePrimePowers.get(n) || 0);
        assert.equal(character, residues[n % 3]);
        assert.ok(Number.isInteger(top) && Number.isInteger(bottom) && bottom > 0);
        const weight = top / bottom;
        const difference = b * (Math.max(0, u / n - 1) / u - Math.max(0, y / n - 1) / y);
        close(weight, difference, 1e-14);
        if (n <= y) assert.equal(top, bottom);
        else if (n === u) assert.equal(top, 0);
        else assert.ok(0 < top && top < bottom);
        if (prime) signed += character * Math.log(prime) * weight;
      }
      const independent = b * (originalSum(u) / u - originalSum(y) / y);
      close(signed, independent, 1e-13);
      const result = lib.render("progression-difference", {y: String(y), width: String(width), chi});
      const totals = [...result.matchAll(/<dd>(.*?)<\/dd>/g)].map(match => match[1]);
      assert.equal(totals.at(-1), independent.toFixed(4).replace("-", "−"));
    }
  }
}
for (const name of ["book.html", "print.html"]) {
  assert.ok(html[name].includes(lib.render("progression-difference", lib.defaults("progression-difference"))));
}
// Compare each displayed flag layer with individual matrix coordinates and the closed layer product.
for (const n of [4, 6, 8]) {
  for (const jumps of [[1], [2], [1, 1]]) {
    for (const depth of [1, 2, 3]) {
      const a = jumps.length;
      const middle = n - 2 * jumps.reduce((sum, rank) => sum + rank);
      const sizes = a === 1 ? [2 ** -depth] : [2 ** (-2 * depth), 2 ** -depth];
      let product = 1;
      for (let i = 0; i < a; i++) {
        const rank = jumps[i];
        product *= sizes[i] ** (2 * rank * middle) * (sizes[i] ** 2) ** (rank ** 2);
        for (let j = i + 1; j < a; j++) {
          const multiplicity = 2 * rank * jumps[j];
          product *= (sizes[i] / sizes[j]) ** multiplicity * (sizes[i] * sizes[j]) ** multiplicity;
        }
      }
      const coordinates = [];
      for (let i = 0; i < a; i++) {
        for (let k = 0; k < jumps[i]; k++) {
          coordinates.push({block: i, size: sizes[i]}, {block: 2 * a - i, size: 1 / sizes[i]});
        }
      }
      for (let k = 0; k < middle; k++) coordinates.push({block: a, size: 1});
      const expected = Array.from({length: 2 * a}, () => ({directions: 0, exponent: 0}));
      for (const left of coordinates) for (const right of coordinates) {
        if (left.block >= right.block) continue;
        const layer = expected[right.block - left.block - 1];
        layer.directions++;
        layer.exponent += -2 * Math.log2(left.size / right.size);
      }
      const rendered = lib.render("flag-layer-exponents", {n, jumps: jumps.join(","), depth});
      const rows = [...rendered.matchAll(/<tr><th scope="row">(\d+)<\/th><td>(\d+)<\/td><td>([\d +]+)<\/td><td>(\d+)<\/td><\/tr>/g)];
      assert.equal(rows.length, expected.length);
      let rawExponent = 0, totalDirections = 0;
      for (const [i, [, layer, directions, terms, exponent]] of rows.entries()) {
        assert.equal(Number(layer), i + 1);
        assert.deepEqual({directions: Number(directions), exponent: Number(exponent)}, expected[i]);
        assert.equal(terms.split(" + ").map(Number).reduce((sum, x) => sum + x, 0), Number(exponent));
        rawExponent += Number(exponent);
        totalDirections += Number(directions);
      }
      assert.equal(2 ** (-rawExponent / 2), product);
      const stats = [...rendered.matchAll(/<dd>(.*?)<\/dd>/g)].map(match => match[1]);
      assert.equal(Number(stats[0]), totalDirections);
      assert.equal(stats[1], rawExponent + "/2 = " + rawExponent / 2);
      const power = -Math.log2(product);
      assert.equal(stats[2], power <= 12 ? "1/" + (2 ** power) : "2<sup>−" + power + "</sup>");
    }
  }
}
// Enumerate the Gaussian coefficients in the upper-right entry of the hyperbolic plane.
for (let quarters = 0; quarters <= 8; quarters++) {
  const t = quarters / 4;
  const gaussian = [];
  for (let real = -2; real <= 2; real++) {
    for (let imag = -2; imag <= 3; imag++) {
      gaussian.push({ real, imag, distance: Math.hypot(real, imag - t / 2) });
    }
  }
  gaussian.sort((left, right) => left.distance - right.distance || right.imag - left.imag);
  const constructed = 2 * gaussian[0].imag;
  const central = gaussian.filter(z => z.real === 0);
  central.sort((left, right) => Math.abs(left.imag - t) - Math.abs(right.imag - t) || right.imag - left.imag);
  const chosen = central[0].imag;
  const rendered = lib.render("central-rounding", {quarters: String(quarters)});
  const readNumber = text => text.split("/").map(Number).reduce((a, b) => a / b);
  const values = [...rendered.matchAll(/<dd>([^<]+)<.dd>/g)].map(match => readNumber(match[1]));
  assert.deepEqual(values, [constructed, Math.abs(constructed - t), chosen, Math.abs(chosen - t)]);
  close(values[1], 2 * gaussian[0].distance, 1e-12);
}
// Express the rank-one projection in the two normalized indicator functions.
for (const denom of [4,16,64]) {
  const measure = [(denom - 1) / denom, 1 / denom];
  for (const [profile, values] of Object.entries({flat:[1,1], tilted:[1,4], deep:[0,1]})) {
    const scaled = values.map((v,i) => v * Math.sqrt(measure[i]));
    const unit = scaled.map(v => v / Math.hypot(...scaled));
    const matrix = unit.map(x => unit.map(y => x*y));
    const rendered = lib.render("cusp-trace-mass", {denom,profile});
    const rows = [...rendered.matchAll(/<tr><th scope="row">[^<]+<\/th>(.*?)<\/tr>/g)];
    assert.equal(rows.length, 2);
    for (let i = 0; i < 2; i++) {
      const cells = [...rows[i][1].matchAll(/<td>([\d/]+)<\/td>/g)].map(match => {
        const [a,b = 1] = match[1].split("/").map(Number);
        return a / b;
      });
      close(cells[0], measure[i], 1e-14);
      close(cells[1] * measure[i], matrix[i][i], 1e-14);
      close(cells[2], matrix[i][i], 1e-14);
      for (let j = 0; j < 2; j++) {
        close(matrix[i][0]*matrix[0][j] + matrix[i][1]*matrix[1][j], matrix[i][j], 1e-14);
      }
    }
    close(matrix[0][0] + matrix[1][1], 1, 1e-14);
  }
}
// Independently group Gaussian integers by squared norm, coordinate swaps and signs.
for (let h = 0; h <= 5; h++) {
  const inner = 2 ** h, outer = 2 * inner;
  let count = 0, weight = 0;
  for (let norm = inner ** 2; norm < outer ** 2; norm++) {
    for (let b = 0; 2 * b * b <= norm; b++) {
      const a = Math.sqrt(norm - b * b);
      if (!Number.isInteger(a)) continue;
      const orbit = b === 0 || a === b ? 4 : 8;
      count += orbit;
      weight += orbit / (norm * Math.sqrt(norm));
    }
  }
  const shell = lib.gaussianMinorShell(h);
  assert.equal(shell.count, count);
  close(shell.weight, weight, 1e-13);
  assert.ok(weight <= count / inner ** 3 && count < 16 * inner ** 2);
}
// Generate whole orbits of normal lines using all 384 integral unitary matrices.
const gaussianUnits = [[1,0],[0,1],[-1,0],[0,-1]];
function gaussProduct([x,y], [a,b]) { return [x*a-y*b, x*b+y*a]; }
function normalLineKey(vector) {
  return gaussianUnits.map(u => vector.map(z => gaussProduct(z,u).join(',')).join('|')).sort()[0];
}
const normalTypes = [
  [[[1,0],[0,0],[0,0]]],
  [[[1,0],[1,0],[0,0]]],
  [[[1,0],[1,0],[1,0]], [[1,1],[1,0],[0,0]]],
  [[[1,1],[1,0],[1,0]]],
];
for (let norm = 1; norm <= 4; norm++) {
  const expected = normalTypes[norm-1].map(vector => {
    const orbit = new Set();
    const original = normalLineKey(vector);
    let fixing = 0;
    for (let i=0; i<3; i++) for (let j=0; j<3; j++) {
      if (i === j) continue;
      const k = 3-i-j;
      for (const u of gaussianUnits) for (const v of gaussianUnits) for (const w of gaussianUnits) {
        const key = normalLineKey([gaussProduct(vector[i],u), gaussProduct(vector[j],v), gaussProduct(vector[k],w)]);
        orbit.add(key);
        if (key === original) fixing++;
      }
    }
    const pattern = vector.map(([x,y]) => x*x+y*y).sort((a,b) => a-b).join(', ');
    return {pattern, lines:orbit.size, stabilizer:fixing};
  }).sort((a,b) => a.pattern.localeCompare(b.pattern));
  assert.deepEqual(lib.primitiveHyperplanes(norm), expected);
}
// Evaluate the centered cyclotomic unit as a real sum of thirteen roots of unity.
const signWords = new Set();
for (const shift of [1,5,7,11]) for (const unit of [0,1]) for (const negative of [0,1]) {
  const word = [1,5,7,11].map(t => {
    let value = 1;
    for (let j=1; j<=6; j++) value += 2*Math.cos(2*Math.PI*j*t*shift/24);
    assert.ok(Math.abs(value) > 0.1);
    return ((negative ? -1 : 1)*(unit ? value : 1) < 0) ? '1' : '0';
  }).join('');
  signWords.add(word);
  assert.ok(lib.render("dyadic-unit-signs", {shift,unit,negative}).includes('<dt>Signature</dt><dd>'+word+'</dd>'));
}
assert.deepEqual([...signWords].sort(), ['0000','0011','1100','1111']);
// The binary similitude doubles the length in four real coordinates and has index four on ℤ⁴.
const parityImage = new Set();
for (let a=0; a<2; a++) for (let b=0; b<2; b++) for (let c=0; c<2; c++) for (let d=0; d<2; d++) {
  const image = [a-d, b+c, c-b, d+a]; // (z,w) ↦ (z+iw,iz+w)
  assert.equal(image.reduce((s,x) => s+x*x,0), 2*(a*a+b*b+c*c+d*d));
  parityImage.add(image.map(x => (x+2)%2).join(''));
}
assert.equal(parityImage.size,4); // γ*γ=2I puts 2ℤ⁴ in the image.
// Evaluate the four tent weights directly on their lattice supports, including the endpoints.
for (let n = 3; n <= 15; n++) {
  function coordinateWeight(center, residue) {
    let total = 0;
    for (let x = center*n-n; x <= center*n+n; x++) {
      if (((x % 3) + 3) % 3 === residue) total += n - Math.abs(x - center*n);
    }
    return total;
  }
  const expected = coordinateWeight(2, 1) * coordinateWeight(0, 0) ** 3;
  const actual = lib.binaryLatticeBox(n);
  assert.equal(actual.numerator, expected);
  assert.equal(actual.denominator, n ** 8);
  if (n % 3 === 0) assert.equal(81 * expected, n ** 8);
}
// Sum over s directly using the inverse of 13; compare every fibre, before and after reduction.
for (const prime of [2, 3]) for (const level of [3, 4]) for (const depth of [2, 3]) {
  const target = prime ** depth, modulus = (prime === 2 ? 3 : 2) * prime ** level;
  const inv = Array.from({length:modulus}, (_, i) => i).find(i => 13*i % modulus === 1);
  const actual = lib.stickelbergerFibres(prime, depth, level);
  const expected = [];
  for (let rep = 1; rep * 2 < target; rep++) {
    if (rep % prime === 0) continue;
    let sum = 0;
    for (let s = 1; 2*s < modulus; s++) {
      if (s % 2 === 0 || s % 3 === 0 || (s % target !== rep && s % target !== target-rep)) continue;
      const g = Math.floor(13 * ((inv*s) % modulus) / modulus) - 6;
      sum += (prime === 3 && s % 3 === 2 ? -1 : 1) * g;
    }
    expected.push({rep, sum, reduced:((sum % prime)+prime)%prime});
  }
  assert.deepEqual(actual, {modulus, target, rows:expected});
}
// The depth-seven example compares the two fibres of the pushed difference.
const pushedWeight = (s) => Math.floor(13 * ((325*s) % 384) / 384) - 6;
assert.equal((325*13) % 384, 1);
assert.deepEqual([1, 257, 179, 307].map(pushedWeight), [5, 0, 0, 4]);
// Multiply in F₂[C₈] in the group basis. Projection to C₄ folds the two halves.
function cyclicProduct(a, b, order) {
  let out = 0;
  for (let i = 0; i < order; i++) for (let j = 0; j < order; j++) {
    if (((a >> i) & 1) && ((b >> j) & 1)) out ^= 1 << ((i+j) % order);
  }
  return out;
}
const augmentation = 3; // [1] + [γ] as a bit mask
const squareT = cyclicProduct(augmentation, augmentation, 8);
const cubeT = cyclicProduct(squareT, augmentation, 8);
const fourthT = cyclicProduct(squareT, squareT, 8);
const phiCyclic = cyclicProduct(cubeT, 2, 8);
assert.notEqual((phiCyclic & 15) ^ (phiCyclic >> 4), 0);
assert.equal(cyclicProduct(phiCyclic, cyclicProduct(augmentation, 128, 8), 8), fourthT);
assert.notEqual(fourthT, 0);
assert.equal(cyclicProduct(fourthT, fourthT, 8), 0);
// Count six rational squares directly at two resolutions for every dilation in the norm example.
for (const k of [0, 1, 2]) {
  const target = 9 ** k;
  const rendered = lib.render("one-vector-density", {depth:k});
  const values = [...rendered.matchAll(/<dd>([0-9/]+)<\/dd>/g)].map(match => {
    const [top, bottom = '1'] = match[1].split('/');
    return [BigInt(top), BigInt(bottom)];
  });
  assert.equal(values.length, 2);
  for (const exponent of [2*k+1, 2*k+2]) {
    const modulus = 3 ** exponent, squares = Array(modulus).fill(0n);
    for (let x = 0; x < modulus; x++) squares[(x*x) % modulus]++;
    let totals = Array(modulus).fill(0n);
    totals[0] = 1n;
    const support = [...squares.keys()].filter(i => squares[i] > 0n);
    for (let coordinate = 0; coordinate < 6; coordinate++) {
      const next = Array(modulus).fill(0n);
      for (let i = 0; i < modulus; i++) {
        for (const square of support) next[(i+square) % modulus] += totals[i] * squares[square];
      }
      totals = next;
    }
    const count = totals[target % modulus], scale = BigInt(modulus) ** 5n;
    assert.equal(values[0][0] * scale, count * values[0][1]);
    assert.equal(values[1][0] * scale, count * BigInt(81 ** k) * values[1][1]);
  }
}
// All four encodings must be additive on the full semidirect product, including the odd coset.
for (const a of [0,1]) for (const c of [0,1]) {
  const theta = (x,y,k) => (a*(x+y)+c*(k % 2)) % 2;
  for (let u=0; u<16; u++) for (let v=0; v<16; v++) {
    const x = u % 2, y = (u >> 1) % 2, k = u >> 2;
    const h = v % 2, j = (v >> 1) % 2, t = v >> 2;
    const left = theta(x ^ (k % 2 ? j : h), y ^ (k % 2 ? h : j), (k+t)%4);
    assert.equal(left, theta(x,y,k) ^ theta(h,j,t));
  }
  const rendered = lib.render("quadratic-character", {value:a, square:c}).replace(/<\/?var>/g, "");
  assert.ok(rendered.includes('<th scope="row">σ²</th><td>'+c+'</td><td>0</td>'));
  assert.ok(rendered.includes('<dt>Θ on σ outside U</dt><dd>'+c+'</dd>'));
}
// Compare both cyclic decompositions of every product in the group of order 54.
const twistGroup = Array.from({length: 54}, (_, u) => [u%9, Math.floor(u/9)%3, Math.floor(u/27)]);
function multiplyTwisted([n,k,e], [m,j,d]) {
  return [(n + 7**k*m)%9, (k+j)%3, (e+d)%2];
}
for (const left of twistGroup) for (const right of twistGroup) {
  const product = multiplyTwisted(left, right);
  for (const exponent of [product[1], product[1]+3]) {
    const power = [0, exponent%3, exponent%2];
    const kernel = [4**exponent*product[0]%9, 0, (power[2]+product[2])%2];
    assert.deepEqual(multiplyTwisted(power, kernel), product);
    assert.equal(7**exponent*kernel[0]%9, product[0]);
  }
}
// Conjugate the cyclic direction by (1,0,0) and evaluate the local coboundary witness −1.
assert.deepEqual(multiplyTwisted(multiplyTwisted([1,0,0], [0,1,1]), [8,0,0]), [3,1,1]);
assert.equal((7-1)*8%9, 3);
// Directly compare the old finite slope with the new ramp after the prime power 4 enters.
const shortTwist = [[2,-Math.log(2)], [3,0], [4,Math.log(2)], [5,-Math.log(5)]];
function shortRamp(y) {
  return shortTwist.filter(([n]) => n<=y).reduce((sum,[n,term]) => sum+term*(y/n-1),0);
}
const oldSlope = shortTwist.filter(([n]) => n<=3.5).reduce((sum,[n,term]) => sum+term/n,0);
close(shortRamp(5)-shortRamp(3.5)-1.5*oldSlope, Math.log(2)/4, 1e-14);
// Check each cutoff curve by a separate 4-node Gaussian rule on short panels.
const gaussPairs = [[0.3399810435848563, 0.6521451548625461], [0.8611363115940526, 0.3478548451374538]];
for (const shift of [-1, 0, 1]) {
  for (const quarter of [1, 2, 3, 4]) {
    const {points, continued} = lib.realWhittakerCutoff(shift, quarter);
    const angle = Math.PI * quarter / 2;
    const density = Math.PI * Math.exp(-angle) / 4;
    close(continued, shift === -1 ? 0 : shift === 0 ? density : density * (1 + angle) / 2, 1e-14);
    let exact = 0;
    for (let i = 1; i < points.length; i++) {
      const midpoint = (i - 0.5) / 32, halfwidth = 1 / 64;
      for (const [node, weight] of gaussPairs) {
        for (const sign of [-1, 1]) {
          const y = midpoint + sign * node * halfwidth;
          exact += halfwidth * weight * Math.cos(angle * y) / (2 * (1+y*y) ** (shift+1));
        }
      }
      close(points[i][1], exact, 2e-7);
    }
  }
}
// Compare the explicit orbits with their known indices and check the partition at every level.
for (const prime of [3, 7]) {
  const indices = prime === 3 ? [1,2,2,2,2] : [1,2,4,4,4];
  for (let t = 2; t <= 6; t++) {
    const orbits = lib.frobeniusOrbits(prime, t), modulus = 2 ** t;
    assert.equal(orbits.length, indices[t-2]);
    assert.deepEqual(orbits.flat().sort((a,b) => a-b), Array.from({length: modulus/2}, (_, i) => 2*i+1));
    for (const orbit of orbits) {
      assert.equal(orbit.length * indices[t-2], modulus/2);
      orbit.forEach((x,i) => assert.equal(prime*x % modulus, orbit[(i+1) % orbit.length]));
    }
  }
}
// Full sets at each depth catch the extra reduced classes when reduction loses image information.
for (const [r, kernel, integral] of [[1, [0, 1, 2], [0]], [2, [0, 3, 6], [0, 3, 6]],
                                    [3, [0, 3, 6, 9, 12, 15, 18, 21, 24], [0, 3, 6, 9, 12, 15, 18, 21, 24]]]) {
  const model = lib.localizationKernel(r);
  assert.deepEqual(model.kernel, kernel);
  assert.deepEqual(model.integral, integral);
  assert.equal(model.cokernelSize, 3);
}
// A pair of proposed scaled parameters passes the degree-one Cartan bound and fails in degree two.
const scaledNumerators = [16, -3]; // roots 4 and −3/4 with common denominator 4
for (const degree of [1, 2]) {
  const numerator = Array.from({length: degree + 1}, (_, i) =>
    scaledNumerators[0] ** i * scaledNumerators[1] ** (degree - i)).reduce((a, b) => a + b, 0);
  const latticeCount = (3 ** (degree + 1) - 1) / 2;
  assert.equal(numerator, degree === 1 ? 13 : 217);
  assert.equal(numerator <= 4 ** degree * latticeCount, degree === 1);
}
// Each left coset has two elements, while the two double cosets have different masses.
const [singletons, leftCosets, doubleCosets] = lib.smallGenusClasses();
assert.equal(singletons.length, 6);
assert.deepEqual(leftCosets.map(c => c.length), [2, 2, 2]);
assert.deepEqual(doubleCosets[0], ["123", "213"]);
assert.deepEqual(doubleCosets[1], ["132", "231", "312", "321"]);
for (const partition of [singletons, leftCosets, doubleCosets]) {
  assert.equal(new Set(partition.flat()).size, 6);
  assert.equal(partition.flat().length, 6);
  for (let second = 0; second <= 6; second++) {
    const weight = p => doubleCosets[0].includes(p) ? 2 : second;
    assert.ok(partition.every(group => group.every(p => weight(p) === weight(group[0]))));
    assert.equal(partition.reduce((sum, group) => sum + group.length * weight(group[0]), 0), 4 + 4 * second);
  }
}
// A vertex has a fixed complement of dimension n−1. Its neighbours are the split vertices there.
for (const [dimension, count, degree, sizes] of [[2, 6, 1, [2, 2, 2]], [3, 28, 6, [28]]]) {
  const graph = lib.splitGraph(dimension);
  assert.equal(graph.points.length, count);
  assert.equal(graph.edges, count * degree / 2);
  assert.ok(graph.points.every(p => p.adjacent.length === degree));
  assert.deepEqual(graph.components.map(c => c.length), sizes);
  const index = (v, f) => graph.points.findIndex(p => p.vector === v && p.form === f);
  const a = index(1, 1), c = index(1, 3);
  assert.ok(!graph.points[a].adjacent.includes(c));
  if (dimension === 2) assert.ok(!graph.components.find(component => component.includes(a)).includes(c));
  else {
    const u = index(4, 4);
    assert.ok(graph.points[a].adjacent.includes(u) && graph.points[u].adjacent.includes(c));
  }
}
// Independently lift the nonstandard residue tube X=(1,0) modulo 3 to moduli 9 and 27.
// Its four scalar coordinates are (a,b,c,d), and the Gram value is their squared norm.
for (const modulus of [9, 27]) {
  const counts = Array(modulus).fill(0);
  for (let a = 1; a < modulus; a += 3) for (let b = 0; b < modulus; b += 3) {
    for (let c = 0; c < modulus; c += 3) for (let d = 0; d < modulus; d += 3) {
      counts[(a*a + b*b + c*c + d*d) % modulus]++;
    }
  }
  for (let t = 0; t < modulus; t++) {
    assert.equal(counts[t], t % 3 === 1 ? (modulus / 3) ** 3 : 0);
  }
  // Each side of the finite Fourier identity is measured in the ambient lattice.
  for (let j = 0; j < modulus; j++) {
    let real = 0, imaginary = 0;
    for (let t = 0; t < modulus; t++) {
      const angle = 2 * Math.PI * j * (t - 1) / modulus;
      real += counts[t] * Math.cos(angle) / modulus ** 4;
      imaginary += counts[t] * Math.sin(angle) / modulus ** 4;
    }
    close(real, j % (modulus / 3) === 0 ? 1/81 : 0, 1e-13);
    close(imaginary, 0, 1e-13);
  }
}
// Count Gaussian generators by squared norm and saturation at the concrete cutoff G=2.
const gaussianOrbits = new Map();
for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++)
  for (let c = -1; c <= 1; c++) for (let d = -1; d <= 1; d++) {
    const h = a*a + b*b + c*c + d*d;
    if (h === 0 || h > 2) continue;
    const orbit = [[a,b,c,d], [-b,a,-d,c], [-a,-b,-c,-d], [b,-a,d,-c]];
    const key = orbit.map(row => row.join(",")).sort()[0];
    const indexTwo = h === 2 && ((!a && !b) || (!c && !d));
    gaussianOrbits.set(key, indexTwo ? "index-two" : "primitive-" + h);
  }
for (const [type, expected] of [["primitive-1", 2], ["primitive-2", 4], ["index-two", 2]]) {
  assert.equal([...gaussianOrbits.values()].filter(x => x === type).length, expected);
}
// The norm form of F₉ has one vector of norm 0 in one dimension and four of each nonzero norm.
let normHistogram = [1, 0, 0];
for (let dim = 1; dim <= 3; dim++) {
  const next = [0, 0, 0];
  for (let r = 0; r < 3; r++) {
    for (let add = 0; add < 3; add++) next[(r + add) % 3] += normHistogram[r] * [1, 4, 4][add];
  }
  normHistogram = next;
  if (dim >= 2) assert.equal(lib.countHermitianFrames(dim, 1).first, next[1]);
}
// In the tangent map at the standard two-frame, enumerate all entries of its upper 2 × 2 block.
// The last complex row is unrestricted and gives 3⁴ additional lifts.
const tangent = Array(81).fill(0);
for (let code = 0; code < 3 ** 8; code++) {
  let rest = code;
  const h = Array.from({length: 8}, () => { const digit = rest % 3; rest = Math.floor(rest / 3); return digit; });
  const offReal = (h[2] + h[4]) % 3, offImag = (h[3] - h[5] + 3) % 3;
  const index = (2 * h[0]) % 3 + 3 * ((2 * h[6]) % 3) + 9 * offReal + 27 * offImag;
  tangent[index]++;
}
assert.ok(tangent.every(count => count * 81 === 3 ** 8));
for (const level of [1, 2, 3]) {
  const pair = lib.hermitianDensity(true, level), line = lib.hermitianDensity(false, level);
  assert.equal(pair.count, 252 * 24 * 3 ** (8 * (level - 1)));
  assert.equal(pair.density, "224/243");
  assert.equal(line.count, 24 * 3 ** (3 * (level - 1)));
  assert.equal(line.density, "8/9");
}
// Enumerate all Eisenstein integer columns of norm ≤2 and count the two specified Gram matrices.
const eisenstein = [];
for (let a = -2; a <= 2; a++) {
  for (let b = -2; b <= 2; b++) {
    const norm = a * a - a * b + b * b;
    if (norm <= 2) eisenstein.push({a, b, norm});
  }
}
const shortColumns = eisenstein.flatMap(x => eisenstein.map(y => [x,y]))
  .filter(([x,y]) => x.norm + y.norm <= 2);
const overlapCounts = [0, 0];
for (const left of shortColumns) {
  if (left[0].norm + left[1].norm !== 1) continue;
  for (const right of shortColumns) {
    const norm = right[0].norm + right[1].norm;
    let real = 0, omega = 0;
    for (let k = 0; k < 2; k++) {
      const x = left[k], y = right[k];
      real += (x.a - x.b) * y.a + x.b * y.b;
      omega += x.a * y.b - x.b * y.a;
    }
    if (omega === 0 && real === 0 && norm === 1) overlapCounts[0]++;
    if (omega === 0 && real === 1 && norm === 2) overlapCounts[1]++;
  }
}
assert.deepEqual(overlapCounts, [72, 72]);
for (let height = 1; height <= 4; height++) {
  assert.ok(lib.render("orbit-weights", {height}).includes(String(72 + 72 * height)));
}
// Count integer numerators by membership in the scaled interval.
for (let u = 0; u <= 3; u++) {
  for (let v = 0; v <= 3; v++) {
    const grid = lib.heightGrid(u, v);
    const label = [u, v];
    const counts = label.flatMap(i => label.map(j => {
      let count = 0;
      for (let numerator = -64; numerator <= 64; numerator++) {
        if (Math.abs(numerator / 2 ** (i + j)) <= 1) count++;
      }
      return count;
    }));
    assert.deepEqual(grid.counts, counts);
    assert.equal(grid.candidates, counts.reduce((x, y) => x * y, 1));
    assert.ok(grid.candidates <= grid.bound);
  }
}
// A repeated block contributes one factor of d for each trace cycle.
for (const d of [1, 2, 3]) {
  assert.deepEqual(lib.traceCycles(d, true), {identity: 3 * d * d, swap: 2 * d});
  assert.deepEqual(lib.traceCycles(d, false), {identity: 3 * d * d, swap: 0});
}
// Orthogonality characterizes each frequency independently of its phase count.
let invertibleFrequencies = 0;
for (let a = 0; a < 3; a++) {
  for (let b = 0; b < 3; b++) {
    for (let c = 0; c < 3; c++) {
      if ((a * c - b * b) % 3) invertibleFrequencies++;
      const supported = a === 1 && b === 0 && c === 0;
      assert.deepEqual(lib.fourierRank(a,b,c), supported ? [27, 0, 0] : [9, 9, 9]);
    }
  }
}
assert.equal(invertibleFrequencies, 18);
// Enumerate nearby Gaussian integers directly in physical coordinates.
for (let first = 0; first <= 5; first++) {
  for (let second = 0; second <= 5; second++) {
    let best = Infinity;
    for (let real = -1; real <= 3; real++) {
      for (let imag = -1; imag <= 2; imag++) {
        best = Math.min(best, (first + second - 5 * real) ** 2 + (second - 5 * imag) ** 2);
      }
    }
    const picked = lib.shearRounding(first, second);
    assert.equal(picked.corrected.squaredNumerator, best);
    assert.ok(picked.direct.squaredNumerator >= best);
  }
}
assert.equal(lib.shearRounding(2, 2).direct.squaredNumerator, 20);
assert.equal(lib.shearRounding(2, 2).corrected.squaredNumerator, 5);
// Slice the disk by integer real part. Count permitted imaginary parts
// directly with a square root, including the full-weight boundary.
for (const d of [1, 4, 16]) {
  const stats = lib.minimumScale(d);
  function slicedDisk(limit) {
    let count = 0, moment = 0;
    for (let a = -Math.floor(Math.sqrt(limit)); a <= Math.sqrt(limit); a++) {
      const b = Math.floor(Math.sqrt(limit - a * a));
      count += 2 * b + 1;
      moment += (2 * b + 1) * a * a + b * (b + 1) * (2 * b + 1) / 3;
    }
    return { count, moment };
  }
  assert.equal(stats.points.length, slicedDisk(4 * d - 1).count);
  assert.equal(stats.fullWeight, slicedDisk(d).count);
  assert.equal(stats.numerator, slicedDisk(d).moment);
  assert.equal(new Set(stats.points.map(p => p.a + "," + p.b)).size, stats.points.length);
  for (const direction of ["primal", "dual"]) {
    const rendered = lib.render("minimum-scale", {scale: String(d), direction});
    assert.equal((rendered.match(/r="2.7"/g) || []).length, stats.fullWeight);
    assert.equal((rendered.match(/-2.6 -2.6Z/g) || []).length, stats.points.length - stats.fullWeight);
    if (direction === "dual") assert.ok(rendered.includes("T<sub>d</sub>[e₂ / 64] = 0"));
  }
}
// A derivative of a finite geometric series gives an independent sum
// at each target point. These dyadic inputs are exactly representable.
function gaussianMultiply([a, b], [c, d]) { return [a * c - b * d, a * d + b * c]; }
function gaussianDivide([a, b], [c, d]) {
  const norm = c * c + d * d;
  return [(a * c + b * d) / norm, (b * c - a * d) / norm];
}
function geometricDerivative(last, ratio) {
  let power = [1, 0];
  for (let j = 0; j < last; j++) power = gaussianMultiply(power, ratio);
  const next = gaussianMultiply(power, ratio);
  const numerator = [1 - (last + 1) * power[0] + last * next[0],
    -(last + 1) * power[1] + last * next[1]];
  const difference = [1 - ratio[0], -ratio[1]];
  return gaussianDivide(numerator, gaussianMultiply(difference, difference));
}
for (const [phase, z] of Object.entries({one: [1, 0], minus: [-1, 0], i: [0, 1]})) {
  for (let cutoff = 1; cutoff <= 8; cutoff++) {
    const state = lib.kernelOrder(cutoff, phase);
    let real = 0, imag = 0, limitReal = 0, limitImag = 0;
    for (const row of state.lifts) {
      const r = row.y / 2;
      const a = geometricDerivative(cutoff, [r, 0])[0];
      const [b, c] = geometricDerivative(cutoff, [r * z[0], r * z[1]]);
      close(row.first / state.denominator, a, 2e-14);
      close(row.real / state.denominator, b, 2e-14);
      close(row.imag / state.denominator, c, 2e-14);
      real += a * b / 2;
      imag -= a * c / 2;
      const v = [1 - r * z[0], -r * z[1]];
      const [br, bi] = gaussianDivide([1, 0], gaussianMultiply(v, v));
      limitReal += br / (2 * (1 - r) ** 2);
      limitImag -= bi / (2 * (1 - r) ** 2);
    }
    const square = state.denominator ** 2;
    close(state.targetReal / (2 * square), real, 2e-13);
    close(state.targetImag / (2 * square), imag, 2e-13);
    assert.equal(state.targetReal, 2 * state.sourceReal);
    assert.equal(state.targetImag, 2 * state.sourceImag);
    const truncatedMass = 4 - (2 * cutoff + 4) / 2 ** cutoff;
    assert.equal(state.tail / square, 16 - truncatedMass ** 2);
    assert.ok(Math.hypot(limitReal - real, limitImag - imag) <= state.tail / square + 2e-13);
  }
}
// Composite Simpson quadrature of the original coefficient gives a check
// independent of the eighth-turn antiderivative used by the figure.
{
  const lab = lib.configs["central-period"];
  const { min, max, step } = lab.params[0];
  let states = 0, openEqualities = 0;
  for (let start = min; start <= max; start += step) {
    for (const [choice] of lab.params[1].options) {
      const length = Number(choice), panels = 256;
      const width = length / panels;
      let sum = 0;
      for (let j = 0; j <= panels; j++) {
        const weight = j === 0 || j === panels ? 1 : (j % 2 ? 4 : 2);
        sum += weight * (2 + Math.cos(2 * Math.PI * (start + j * width)));
      }
      const reference = sum * width / 3;
      const result = lib.centralPeriod(start, length);
      const output = lib.render("central-period", {start, length: choice});
      // Equal endpoint sines mean either a full turn or an interval
      // centered at 1/4 modulo 1/2 (a zero of the cosine).
      const equal = length === 1 || (16 * start + 8 * length) % 8 === 4;
      assert.equal(result.equal, equal);
      close(result.original, reference, 1e-9);
      assert.equal(result.mean, 2 * length);
      if (equal) {
        assert.equal(result.original, result.mean);
        assert.equal(result.originalExact, result.meanExact);
        if (length === 1) assert.equal(result.originalExact, "2");
        else {
          openEqualities++;
          assert.ok(output.includes("coincide on this open arc"));
        }
      } else {
        assert.ok(output.includes("≈ " + reference.toFixed(4)));
        assert.ok(output.includes("differ on this open arc"));
      }
      assert.equal((output.match(/class="ink" d="[^"]+"/g) || []).length, 1);
      assert.ok(output.includes('class="dash"'));
      states++;
    }
  }
  assert.equal(states, 24);
  assert.equal(openEqualities, 4);
}
for (const [id, c] of Object.entries(lib.configs)) {
  assert.ok(ids["book.html"].has("fig-" + id));
  for (const p of c.params) {
    const vals = p.options ? p.options.map((v) => v[0]) : [p.min, p.max];
    for (const v of vals) {
      const state = { ...lib.defaults(id), [p.key]: v };
      const output = lib.render(id, state);
      assert.ok(
        !/NaN|Infinity|undefined/.test(output),
        id + ": " + JSON.stringify(state),
      );
    }
  }
}
// Multiply the two short Dirichlet polynomials directly, using Möbius
// coefficients obtained independently from the divisor-sum recurrence.
for (const [cuts] of lib.configs["mobius-product"].params[0].options) {
  const [Y, N] = cuts.split("-").map(Number);
  const mu = [0, 1];
  const pairs = Array(49).fill(0), coefficient = Array(49).fill(0);
  for (let d = 2; d <= Y; d++) {
    let previous = 0;
    for (let divisor = 1; divisor < d; divisor++)
      if (d % divisor === 0) previous += mu[divisor];
    mu[d] = -previous;
  }
  for (let d = 1; d <= Y; d++) {
    for (let b = 1; b <= N; b++) {
      pairs[d*b]++;
      coefficient[d*b] += mu[d];
    }
  }
  for (let n = 1; n <= 48; n++) {
    const rendered = lib.render("mobius-product", { cuts, n });
    const totals = [...rendered.matchAll(/<dd>([^<]+)<\/dd>/g)]
      .map(match => Number(match[1].replace("−", "-")));
    assert.deepEqual(totals, [pairs[n], Number(n === 1), coefficient[n]]);
  }
}
// Count corner residues by solving their trace equation. In both quadratic
// residue fields take √2 as the trace-zero basis element.
for (const q of [3, 5]) {
  for (const a of [-1, 0, 1]) {
    let previous = 0;
    for (let j = 0; j <= 3; j++) {
      const e = Math.max(a, 0) + Math.floor(j / 2), f = 2 * Math.max(a, 0) + j;
      const modulus = q ** f, rowModulus = q ** e;
      const realParts = Array(modulus).fill(0);
      for (let c = 0; c < modulus; c++) realParts[(2 * c) % modulus]++;
      let ball = 0;
      for (let u = 0; u < rowModulus; u++) {
        for (let v = 0; v < rowModulus; v++) {
          const target = -(u*u - 2*v*v) * q ** (f - 2*e);
          const residue = (target % modulus + modulus) % modulus;
          ball += realParts[residue] * modulus; // Free imaginary digit string.
        }
      }
      const output = lib.render("inert-cell", { q: String(q), diagonal: String(a), excess: j });
      const rows = [...output.matchAll(/scope="row">(\d+)<\/th><td>(\d+)<\/td><td>(\d+)<\/td><td>(\d+)<\/td>/g)];
      assert.equal(rows.length, j + 1);
      assert.deepEqual(rows.at(-1).slice(1).map(Number), [Math.abs(a)+j, rowModulus**2, modulus, ball-previous]);
      assert.ok(output.includes(" = " + ball + " cosets."));
      previous = ball;
    }
  }
}
// Count lines through marked points geometrically, independently of enumeration.
for (const q of [2, 3, 5, 25]) {
  const cases = {
    pair: [[-1, q], [0, q*q - q + 1], [1, q]],
    collinear: [[-2, q], [0, (q - 1)**2], [1, 2*q]],
    triangle: [[-2, q-1], [-1, 2], [0, (q - 1)**2], [1, 2*(q-1)], [2, 1]],
  };
  for (const [points, expected] of Object.entries(cases)) {
    const output = lib.render("flag-average", { q: String(q), points });
    const rows = [...output.matchAll(/scope="row">([^<]+)<\/th><td>(\d+)<\/td><td>([^<]+)<\/td>/g)]
      .map(([, sum, count, average]) => [Number(sum.replace("−", "-")), Number(count), average.replace("−", "-")]);
    assert.deepEqual(rows, expected.map(([s,n]) => [s, n, s === 0 ? "0" : s + "/" + (q+1)]));
    const pointSquares = points === "pair" ? 2 : 6;
    const lineSquares = expected.reduce((a,[s,n]) => a + s*s*n, 0);
    assert.equal(lineSquares, q * pointSquares);
    assert.ok(output.includes("sum to " + lineSquares + "/" + (q+1)**2));
  }
}
function checkSatakeAverage() {
  const fraction = (a, b) => {
    let x = Math.abs(a), y = Math.abs(b);
    while (y) [x, y] = [y, x % y];
    return [Math.sign(b) * a / x, Math.abs(b) / x];
  };
  const label = ([a, b]) => (b === 1 ? String(a) : a + "/" + b).replace("-", "−");
  const classes = [];
  for (let a = -2; a <= 2; a++) {
    for (let j = 0; j < 9; j++) {
      // The corner is i*j/9 modulo i Z3. The diagonal alone excludes |a|>1.
      const cornerVal = j === 0 ? Infinity : j % 3 === 0 ? -1 : -2;
      if (Math.min(a, -a, a + cornerVal) === -1) classes.push(a);
    }
  }
  const exponents = [1, 0, -1];
  assert.deepEqual(exponents.map(a => classes.filter(e => e === a).length), [9, 2, 1]);
  for (const [alpha] of lib.configs["satake-average"].params[0].options) {
    const [n, d = 1] = alpha.split("/").map(Number);
    const power = a => a === 0 ? [1, 1] : a > 0 ? fraction(n, 3*d) : fraction(3*d, n);
    let sum = [0, 1];
    for (const a of classes) {
      const [p, q] = power(a);
      sum = fraction(sum[0] * q + p * sum[1], sum[1] * q);
    }
    const output = lib.render("satake-average", {alpha});
    assert.deepEqual([...output.matchAll(/<dd>([^<]+)<\/dd>/g)].map(m => m[1]), exponents.map(a => label(power(a))));
    assert.deepEqual([...output.matchAll(/<strong>([^<]+)<\/strong>/g)].map(m => m[1]), [label(sum), label(fraction(sum[0], 12*sum[1]))]);
    const ys = [...output.matchAll(/<circle cx="[^"]+" cy="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ys.length, 12);
    assert.equal(new Set(ys).size, alpha === "3" ? 1 : 3);
    const values = classes.slice().sort((a,b) => b-a).map(a => {const [p,q] = power(a); return p/q});
    const high = Math.max(...values), low = Math.min(0, ...values);
    const y = v => (109 - 83 * (v - low)/(high - low)).toFixed(2);
    assert.deepEqual(ys, values.map(y));
    assert.ok(output.includes('class="dash" d="M34 ' + y(sum[0]/(12*sum[1])) + 'H368"'));
  }
}
checkSatakeAverage();
function checkInertLength() {
  // Enumerate the row image of the scaled matrix itself over F3[i], i² = −1.
  const mod = n => ((n % 3) + 3) % 3;
  const add = ([x, y], [u, v]) => [mod(x + u), mod(y + v)];
  const mul = ([x, y], [u, v]) => [mod(x * u - y * v), mod(x * v + y * u)];
  const label = ([x, y]) => ["0", "1", "2", "i", "1 + i", "2 + i", "2i", "1 + 2i", "2 + 2i"][x + 3 * y];
  const field = Array.from({ length: 9 }, (_, k) => [k % 3, Math.floor(k / 3)]);
  for (const s of [1, 2]) for (const t of [0, 1, 2]) {
    const scaled = [[3, 3, s, [-s, t]], [0, 9, 0, -3*s], [0, 0, 1, -1], [0, 0, 0, 3]];
    const rows = scaled.map(row => row.map(z => add([0, 0], Array.isArray(z) ? z : [z, 0])));
    for (const i of [1, 3]) assert.ok(rows[i].every(z => label(z) === "0"));
    const combine = (a, b) => rows[0].map((z, j) => add(mul(a, z), mul(b, rows[2][j])));
    const image = new Set(field.flatMap(a => field.map(b => JSON.stringify(combine(a, b)))));
    const rank = {9: 1, 81: 2}[image.size];
    assert.ok(rank, "Unexpected number of images in the row span");
    const result = lib.render("inert-length", {s: String(s), t: String(t)});
    const values = [...result.matchAll(/<td>([^<]+)<\/td>/g)].map(match => match[1]);
    assert.deepEqual(values, [...rows[0], ...rows[2], ...combine([1, 0], [-s, 0])].map(label));
    const metrics = [...result.matchAll(/<dd>(\d+)<\/dd>/g)].map(match => Number(match[1]));
    assert.deepEqual(metrics, [rank, rank, image.size]);
  }
}
checkInertLength();
function checkSplitEndpoint() {
  for (const q of [2, 3, 4, 5]) {
    for (let degree = 0; degree <= 6; degree++) {
      const rows = lib.splitEndpointCoefficients(q, degree);
      const rendered = lib.render("split-endpoint", { q: String(q), degree });
      const displayed = [...rendered.matchAll(/<td>(\d+)<\/td>/g)].map(match => Number(match[1]));
      assert.equal(rows.length, degree + 1);
      assert.equal(displayed.length, 3 * rows.length);
      for (let k = 0; k <= degree; k++) {
        const expected = (q ** (k + 1) - 1) / (q - 1);
        const corrected = Number(k === 0);
        assert.deepEqual(rows[k], { k, xDegree: 3 + 2 * k, before: expected, hermite: expected, after: corrected });
        assert.deepEqual(displayed.slice(3 * k, 3 * k + 3), [expected, expected, corrected]);
      }
      const xDegree = 3 + 2 * degree;
      assert.ok(rendered.includes("<caption>Endpoint coefficients through degree " + xDegree + " in X (q = " + q + ")</caption>"));
    }
  }
}
checkSplitEndpoint();
function checkCubicJacobi() {
  // Enumerate powers of a generator; form both sums from discrete logs.
  for (const [p, generator, roots] of [[7, 3, [2, 4]], [13, 2, [3, 9]], [19, 2, [7, 11]]]) {
    const powers = [1];
    for (let k = 1; k < p - 1; k++) powers.push((powers[k - 1] * generator) % p);
    assert.equal(new Set(powers).size, p - 1);
    const h = (p - 1) / 3;
    for (const [index, choice] of ["lower", "upper"].entries()) {
      const r = roots[index], step = powers[h] === r ? 1 : 2;
      assert.equal((r ** step) % p, powers[h]);
      const counts = [0, 0, 0], partnerCounts = [0, 0, 0];
      const residues = roots.map(() => [0, 0]);
      for (const x of powers) {
        if (x === 1) continue;
        const k = step * (powers.indexOf(x) + powers.indexOf(p + 1 - x)) % 3;
        const inverse = (3 - k) % 3;
        counts[k]++;
        partnerCounts[inverse]++;
        for (const [i, root] of roots.entries()) {
          residues[i][0] = (residues[i][0] + root ** k) % p;
          residues[i][1] = (residues[i][1] + root ** inverse) % p;
        }
      }
      const [a, b] = [counts[0] - counts[2], counts[1] - counts[2]];
      const [c, d] = [partnerCounts[0] - partnerCounts[2], partnerCounts[1] - partnerCounts[2]];
      // Multiply (a+bω)(c+dω), using only the integral relation ω²=−1−ω.
      assert.deepEqual([a * c - b * d, a * d + b * c - b * d], [p, 0]);
      const actual = lib.cubicJacobi(p, choice);
      assert.deepEqual([actual.root, actual.h, actual.a, actual.b, actual.norm], [r, h, a, b, p]);
      assert.deepEqual(actual.counts, counts);
      assert.deepEqual(actual.partner, [c, d]);
      assert.equal(counts.reduce((u, v) => u + v, 0), p - 2);
      const rendered = lib.render("jacobi-primes", { p: String(p), root: choice }).replace(/<\/?var>/g, "");
      assert.deepEqual([...rendered.matchAll(/<dd>(\d+)<\/dd>/g)].map(m => Number(m[1])), counts);
      const show = (x, y) => (x < 0 ? "−" : "") + Math.abs(x) + (y < 0 ? " − " : " + ") + Math.abs(y) + "ω";
      assert.ok(rendered.includes("J = <strong>" + show(a, b) + "</strong>"));
      assert.ok(rendered.includes("J̄ = <strong>" + show(c, d) + "</strong>"));
      assert.ok(rendered.includes("= <strong>" + p + "</strong>"));
      for (const [i, root] of roots.entries()) {
        const [value, conjugate] = residues[i];
        const order = Number(i === index), partnerOrder = 1 - order;
        assert.equal(Number(value === 0), order);
        assert.equal(Number(conjugate === 0), partnerOrder);
        assert.deepEqual(actual.reductions[i], { root, value, conjugate, order, partnerOrder });
        assert.ok(rendered.includes('<th scope="row">ω ↦ ' + root + "</th><td>" + value + "</td><td>" +
          conjugate + "</td><td>" + order + ", " + partnerOrder + "</td>"));
      }
    }
  }
}
checkCubicJacobi();
function checkGramPair() {
  for (const a of [0.5, 1, 1.5]) {
    for (const h of [0, 0.6, 1]) {
      const words = [
        [[2 * a, 0, 0, 0], [0, 2, 0, 0]],
        [[3 * h, 0, 3 * Math.sqrt(1 - h * h), 0], [0, 0, 0, 3]],
      ];
      const c = [4, 9];
      function entry(u, v, i, j) {
        const dot = words[u][i].reduce((sum, coordinate, k) => sum + coordinate * words[v][j][k], 0);
        return dot / Math.sqrt(c[u] * c[v]);
      }
      function squaredErrors(indices) {
        return [[0, 0], [1, 1], [0, 1]].map(([u, v]) => {
          let error = 0;
          for (const i of indices)
            for (const j of indices)
              error += (entry(u, v, i, j) - Number(u === v && i === j)) ** 2;
          return error;
        });
      }
      for (const [column, index] of [["first", 0], ["second", 1]]) {
        const gram = lib.gramPair(a, h, column);
        const full = squaredErrors([0, 1]), retained = squaredErrors([index]);
        const table = lib.render("gram-pair", { a: String(a), h: String(h), column });
        const cells = [...table.matchAll(/<td>([^<]+)<\/td>/g)].map(match => Number(match[1]));
        assert.equal(cells.length, 6);
        for (let block = 0; block < 3; block++) {
          close(gram.full[block], full[block], 1e-12);
          close(gram.retained[block], retained[block], 1e-12);
          close(cells[2 * block], full[block], 1e-12);
          close(cells[2 * block + 1], retained[block], 1e-12);
        }
        close(gram.overlap, entry(0, 1, 0, 0), 1e-12);
        close(gram.retainedOverlap, entry(0, 1, index, index), 1e-12);
        const metrics = [...table.matchAll(/<dd>([^<]+)<\/dd>/g)].map(match => Number(match[1]));
        assert.equal(metrics.length, 3);
        close(metrics[0], entry(0, 1, index, index), 1e-12);
        close(metrics[1], full[0] / 2, 1e-12);
        close(metrics[2], retained[0], 1e-12);
        assert.ok(table.includes("<caption>Squared Gram errors with " + column + " columns retained</caption>"));
      }
    }
  }
}
checkGramPair();
assert.equal(lib.primeBase(1), 0);
for (const twist of [1, 2]) {
  for (const weight of [0, 1, 2, 3, 4]) {
    for (const gluingLog of [1, 3, 5]) {
      const entries = lib.prismInsertions(twist, weight, gluingLog);
      assert.equal(entries.length, 2 * twist + 1);
      for (let pair = 0; pair < twist; pair++) {
        assert.equal(entries[2 * pair], entries[2 * pair + 1]);
      }
      assert.equal(entries[2 * twist], weight ** twist * (gluingLog % 5));
    }
  }
}
assert.equal(lib.primeBase(27), 3);
assert.equal(lib.primeBase(36), 0);
close(
  lib.contributions(6, "one").reduce((a, v) => a + v.y, 0),
  2.5 * Math.log(2) + Math.log(3) + Math.log(5) / 5,
  1e-14,
);
close(
  lib.contributions(6, "four").reduce((a, v) => a + v.y, 0),
  -Math.log(3) + Math.log(5) / 5,
  1e-14,
);
close(lib.centeringRatio(), 0.245609584777, 3.2e-9);
for (const s of [1.1, 1.5, 2, 4])
  for (const n of [1, 3, 12]) {
    const u = 3,
      r = lib.mellin(n, s, u);
    let sum = 0;
    for (let j = 0; j < 12000; j++) {
      const t = ((j + 0.5) * u) / 12000;
      sum += (n ** -s * Math.expm1(t) * Math.exp(-s * t) * u) / 12000;
    }
    close(r.area, sum, 3e-8);
    close(r.area + r.tail, r.total, 1e-14);
  }
for (const p of [2, 3, 5, 7, 11])
  for (let n = 1; n <= 160; n++) {
    let v = 0;
    for (let k = 1; k <= n; k++) {
      let q = k;
      while (q % p === 0) {
        v++;
        q /= p;
      }
    }
    assert.equal(
      lib.factorial(p, n).reduce((a, r) => a + r[1], 0),
      v,
    );
  }
// A learner can use the printed bounds literally, even when the denominator is 12.
for (const p of [2, 3, 5, 7, 11]) {
  let valuation = 0;
  for (let d = 1; d <= 160; d++) {
    for (let n = d; n % p === 0; n /= p) valuation++;
    const result = lib.render("padic", { p: String(p), d });
    const values = [...result.matchAll(/<dd>([^<]+)<\/dd>/g)].map(m => {
      const [n, den = "1"] = m[1].replace("−", "-").split("/");
      return [Number(n), Number(den)];
    });
    assert.deepEqual(values[0], [valuation, 1]);
    const den = p*p - 1;
    for (const [i, n] of [d - 1, den * valuation - (d - 1)].entries()) {
      assert.equal(den * values[i + 1][0], n * values[i + 1][1]);
      assert.ok(values[i + 1][1] > 0);
    }
  }
}
for (const b of [0.52, 0.76, 0.98]) {
  for (const side of ["left", "right"]) {
    const start = Number((side === "left" ? 1-b : b).toFixed(2));
    const image = Number((1-start).toFixed(2));
    const result = lib.render("reflection", {b, side, fraction:0.5, epsfrac:0.5});
    assert.ok(result.includes("The starting zero of ψ is at " + start + " + i."));
    assert.ok(result.includes("a zero of ψ⁻¹ at " + image + " − i."));
    assert.ok(result.includes("a zero of ψ at " + image + " + i."));
    const [solid, open] = [...result.matchAll(/<circle cx="([^"]+)" cy="([^"]+)"/g)];
    const square = result.match(/<rect x="([^"]+)" y="([^"]+)" width="8" height="8"/);
    close(Number(open[1]), Number(square[1])+4, 1e-10);
    close(Number(open[2]), Number(solid[2]), 1e-10);
    assert.ok(Number(square[2])+4 > Number(open[2]));
    assert.equal(Number(solid[1]) < Number(open[1]), side === "left");
  }
}
close(lib.profile(60, 6, 10), 1, 1e-14);
for (const [sigma, t, r, i] of [
  [2, 0, Math.PI ** 2 / 6, 0],
  [0.5, 14.134725141734693, 0, 0],
  [0.5, 21.022039638771554, 0, 0],
]) {
  const z = zeta(sigma, t);
  close(z[0], r, 1e-8);
  close(z[1], i, 1e-8);
}
// Reference values from the finite gamma survival sums in 100-digit arithmetic.
for (const [k, s, width, kernel, envelope] of [
  [5, 3, 0.1, 0.08339816067891856, 0.0032203205676938716],
  [40, 6, 0.5, 0.7910264271950411, 0.0705607204312009],
  [80, 3, 0.1, 0.32948243130744614, 2.637981370587153e-16],
  [160, 3, 0.1, 0.4527989293313142, 2.172022206886884e-30],
  [160, 12, 1, 0.9999186169230049, 0.9040537071884589],
]) {
  const start = k / s / (1 + width / 2);
  const output = lib.render("kernel", { k, s, width });
  const percentages = [...output.matchAll(/<dd>([^<]+)%<\/dd>/g)].map(m => Number(m[1]));
  assert.equal(percentages.length, 2);
  for (const [i, expected] of [kernel, envelope].entries()) {
    const rate = s - 2 * i;
    close(lib.gammaWindowMass(k, rate * start, rate * width * start) / expected, 1, 2e-13);
    close(percentages[i] / (100 * expected), 1, 5e-4);
  }
}
// Compare plotted displacements with the argument of the complex reciprocal.
for (const b of [0.1, 0.5, 0.9]) {
  for (const t of [0, 0.25, 1, 4]) {
    const output = lib.render("residue", { b, t, m: 2, a: 1.25 });
    const points = [...output.matchAll(/<circle cx="([^"]+)" cy="([^"]+)"/g)];
    assert.equal(points.length, 3);
    const dx = Number(points[2][1]) - Number(points[0][1]);
    const dy = Number(points[0][2]) - Number(points[2][2]);
    close(Math.atan2(dy, dx), Math.atan2((2*b - 1)*t, b*(1 - b) + t*t), 1e-13);
    close((Number(points[1][1]) - Number(points[0][1])) / dx, 2/3.25, 1e-13);
  }
}
for (const q of [2, 3, 5, 7]) {
  for (const s of [0.5, 1.5, 3.5, 4]) {
    const factors = lib.eulerQuotients(q, s);
    const splitNumerator = (1 - q ** (-s - 0.5)) ** -2;
    const inertNumerator = (1 - (q * q) ** (-s - 0.5)) ** -1;
    close(factors.normalizer, 1 / (1 - q ** (-2 * s - 1)), 1e-14);
    close(factors.split, splitNumerator / factors.normalizer, 1e-14);
    close(factors.inert, inertNumerator / factors.normalizer, 1e-14);
  }
}
close(lib.gammaWindowMass(3, 2, 0), 0, 0);
const residues = [2, 3, 4, 1];
const distinctGridStates = new Set();
for (const a of [2, 3, 4]) {
  for (const b of [2, 3, 4]) {
    const grid = lib.rankGrid(a, b);
    assert.equal(grid.length, 4);
    for (const [i, h] of residues.entries()) {
      assert.equal(grid[i].length, 4);
      for (const [j, k] of residues.entries()) {
        let expected = 0;
        if ((h === a && k === b) || (h === 1 && k === 1)) expected = 1;
        if ((h === a && k === 1) || (h === 1 && k === b)) expected = -1;
        assert.equal(grid[i][j], expected);
      }
      assert.equal(grid[i].reduce((sum, n) => sum + n, 0), 0);
      assert.equal(grid.reduce((sum, row) => sum + row[i], 0), 0);
    }
    distinctGridStates.add(JSON.stringify(grid));
    const table = lib.render("rank-grid", { row: String(a), column: String(b) });
    assert.ok(table.includes("<caption>Basis vector at (" + a + ", " + b + ")</caption>"));
    assert.equal((table.match(/class="rank-positive">\+1</g) || []).length, 2);
    assert.equal((table.match(/class="rank-negative">−1</g) || []).length, 2);
    assert.equal((table.match(/class="rank-zero">0</g) || []).length, 12);
    assert.equal((table.match(/scope="row"/g) || []).length, 5);
    assert.equal((table.match(/scope="col"/g) || []).length, 6);
  }
}
assert.equal(distinctGridStates.size, 9);
for (const name of ["book.html", "print.html"]) {
  assert.ok(html[name].includes(lib.render("minimum-scale", lib.defaults("minimum-scale"))));
  assert.ok(html[name].includes(lib.render("kernel-order", lib.defaults("kernel-order"))));
  assert.ok(html[name].includes(lib.render("central-period", lib.defaults("central-period"))),
    "Missing complete default central period figure in " + name);
  assert.ok(html[name].includes(lib.render("inert-length", lib.defaults("inert-length"))),
    "Missing complete default inert lattice experiment in " + name);
  assert.ok(html[name].includes(lib.render("satake-average", lib.defaults("satake-average"))),
    "Missing complete default Satake coset average in " + name);
  assert.ok(html[name].includes(lib.render("jacobi-primes", lib.defaults("jacobi-primes"))),
    "Missing complete default cubic Jacobi experiment in " + name);
  assert.ok(html[name].includes('<caption>Endpoint coefficients through degree 7 in X (q = 2)</caption>'),
    "Missing default split Euler table in " + name);
  assert.ok(html[name].includes('<caption>Squared Gram errors with first columns retained</caption>'),
    "Missing readable default Gram table in " + name);
  assert.ok(html[name].includes('<table class="rank-grid"><caption>Basis vector at (2, 3)</caption>'),
    "Missing readable default rank grid in " + name);
}
for (let first = 0; first <= 16; first++) {
  for (let second = 0; second <= 16; second++) {
    const [left, right] = lib.selectWindow([first, second]);
    assert.equal(right, 2 * left);
    assert.ok(right <= 16 && left >= 16 / (2 ** 4 * 4 ** 2));
    for (const k of [first, second])
      assert.ok(left >= 2 * k || right < k / 2, "Selected a forbidden twist interval");
  }
}
// Enumerate kernels of surjective linear forms over Z/3 and Z/9.
// Their counts give the two distinct projective-line counts in the split example.
function countPrimitiveKernels(modulus) {
  const kernels = new Set();
  for (let a = 0; a < modulus; a++) {
    for (let b = 0; b < modulus; b++) {
      if (a % 3 === 0 && b % 3 === 0) continue;
      const points = [];
      for (let x = 0; x < modulus; x++) {
        for (let y = 0; y < modulus; y++) {
          if ((a * x + b * y) % modulus === 0) points.push(x * modulus + y);
        }
      }
      kernels.add(points.join(","));
    }
  }
  return kernels.size;
}
assert.equal(2 * countPrimitiveKernels(3), 8);
assert.equal(2 + 3 * countPrimitiveKernels(9), 38);

// Rank-three inert example. Enumerate fixed-label shells independently of
// the closed generating function displayed in the chapter.
let previousBall = 0;
let shellSum = 0;
for (let j = 0; j < 48; j++) {
  const ball = 3 ** (4 * Math.floor(j / 2) + (j % 2));
  shellSum += (ball - previousBall) / 27 ** j;
  previousBall = ball;
}
close(shellSum, 65 / 54, 1e-14);
// Evaluate the two original floors independently of the grouped signed carries.
for (const depth of [1, 2, 3]) {
  const level = 5 ** depth;
  for (const b of [2, 3, 4]) {
    const state = lib.bernoulliCarries(depth, b);
    let sum = 0;
    let scaledBernoulli = 0;
    for (let u = 1; u < level; u++) {
      if (u % 5 === 0) continue;
      sum += u * (Math.floor(u * b / level) - Math.floor((level - u) * b / level));
      // 12F · F·B₂(u/F)/2
      scaledBernoulli += 6 * u * u - 6 * u * level + level * level;
    }
    assert.equal(scaledBernoulli, -4 * level);
    assert.equal(state.sum, sum);
    assert.equal(state.cleared, 24 * b * sum - 4 * (b * b - 1) * scaledBernoulli / level);
    assert.equal(state.cleared % level, 0);
    assert.equal(state.valuation, b === 4 ? 1 : 0);
  }
}
assert.equal(lib.bernoulliCarries(1, 2).cleared, 240);
// Recover the primitive and imprimitive cubic Bernoulli values from the
// residue sums. The character has values +1 and -1 on the two units.
const bernoulli3 = (x) => x * (x - 0.5) * (x - 1);
close(9 * (bernoulli3(1 / 3) - bernoulli3(2 / 3)), 2 / 3, 1e-14);
close(36 * (bernoulli3(1 / 6) - bernoulli3(5 / 6)), 10 / 3, 1e-14);
assert.equal(lib.normal(lib.configs.mellin.params[1], "-2"), 1.1);
assert.equal(lib.normal(lib.configs.ramp.params[1], "invalid"), "one");
console.log(
  "Checked relative links and anchors, figure boundaries, nine ordinary-line subspace counts, eight five-adic cut tests, six four-element-group norm settings, six prescribed multiplicity tests, six Casimir cuts, twelve good-prime configurations, eight whole-character tests, nine regular shifts and their partial-trace scalars, six hyperplane mass strata, 75 pairs of gluing residues, four integral intersections of rational lines, eighteen parabolic mass comparisons, six Frobenius power comparisons on a signed unitary plane, all nine Gaussian adjoint roundings, nine two-point projections, counts and weights in six Gaussian minor shells, 384 unitary symmetries per Gaussian normal type, 16 cyclotomic signatures, the binary similitude at 2, 13 binary lattice scales, eight projected Stickelberger sums, the depth-seven difference and the cyclic ideal calculation, six integral Hermitian norm congruence counts, four index-two character encodings, 2916 cyclotomic model products, 12 archimedean cutoff curves, ten Frobenius orbit partitions, three reduced localization maps, all seven finite genus means, both split graphs, eight Gaussian sublattices, the exceptional Whittaker test modulo 9 and 27, six Hermitian congruence densities, all 81 tangent-map fibres, two sets of 72 Eisenstein Gram representatives, 16 dyadic height grids, six colored trace contractions, all 27 symmetric Fourier frequencies, 36 sheared-lattice targets, six Gaussian cutoff states, 24 double-kernel pairings and tail bounds, 24 central arcs and cycles, the six rank-two Satake averages, all six rank-four inert row spans, 24 inert cells and 12 flag-incidence distributions, positive gamma masses, complex residue angles, both reflection directions, 240 truncated Möbius products, Mellin quadrature, exact factorial gains and loss bounds, zeta samples, local Euler factors, split and inert shells, all 28 split-endpoint settings, all six cubic Jacobi sums and their conjugates, Bernoulli sums at all nine carry settings, nine signed rank grids, all 18 Gram restrictions, all 30 finite-prism settings and all 289 marked-window states.",
);
