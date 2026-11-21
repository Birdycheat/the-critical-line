"use strict";
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const root = path.resolve(__dirname, "..");
const lib = require("../assets/labs.js");
const { zeta } = require("./plate.cjs");
const names = ["index", "book", "experiments", "atlas", "reference", "print"];
const ledger = new Set();
for (const name of fs
  .readdirSync(path.join(root, "records"))
  .filter((n) => n.endsWith(".json"))) {
  const record = JSON.parse(
    fs.readFileSync(path.join(root, "records", name), "utf8"),
  );
  for (const c of record.claims || record.targets || []) {
    assert.ok(!ledger.has(c.id), "Duplicate claim " + c.id);
    ledger.add(c.id);
  }
}
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
for (const match of html["book.html"].matchAll(/<details\b[^>]*\sid="([^"]+)"/g)) {
  assert.ok(ids["print.html"].has(match[1]), "Missing printed example anchor " + match[1]);
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
function close(x, y, tol) {
  assert.ok(Math.abs(x - y) <= tol, x + " versus " + y);
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
      const rendered = lib.render("jacobi-primes", { p: String(p), root: choice });
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
  assert.ok(html[name].includes(lib.render("inert-length", lib.defaults("inert-length"))),
    "Missing complete default inert lattice experiment in " + name);
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
  "Checked relative links and anchors, figure boundaries, all six rank-four inert row spans, 24 inert cells and 12 flag-incidence distributions, positive gamma masses, complex residue angles, both reflection directions, Mellin quadrature, exact factorial gains and loss bounds, zeta samples, local Euler factors, split and inert shells, all 28 split-endpoint settings, all six cubic Jacobi sums and their conjugates, Bernoulli sums at all nine carry settings, nine signed rank grids, all 18 Gram restrictions, all 30 finite-prism settings and all 289 marked-window states.",
);
