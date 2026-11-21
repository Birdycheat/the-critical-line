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
close(lib.upperTail(1, 1), 2 / Math.E, 1e-14);
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
close(lib.upperTail(3, 0), 1, 0);
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
assert.ok(lib.upperTail(100, 115) < lib.upperTail(100, 90));
assert.equal(lib.normal(lib.configs.mellin.params[1], "-2"), 1.1);
assert.equal(lib.normal(lib.configs.ramp.params[1], "invalid"), "one");
console.log(
  "Checked relative links and anchors, figure boundaries, Mellin quadrature, factorial valuations, zeta samples, local Euler factors, split and inert shells, all 28 split-endpoint settings, Bernoulli sums at all nine carry settings, nine signed rank grids, all 18 Gram restrictions, all 30 finite-prism settings and all 289 marked-window states.",
);
