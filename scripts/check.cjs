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
assert.equal(lib.primeBase(1), 0);
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
close(lib.upperTail(3, 0), 1, 0);
assert.ok(lib.upperTail(100, 115) < lib.upperTail(100, 90));
assert.equal(lib.normal(lib.configs.mellin.params[1], "-2"), 1.1);
assert.equal(lib.normal(lib.configs.ramp.params[1], "invalid"), "one");
console.log(
  "Checked relative links, unique anchors, plotted boundary states, worked ramps, independent numerical integration, factorial valuations and zeta samples.",
);
