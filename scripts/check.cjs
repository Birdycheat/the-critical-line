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
  "Checked relative links and anchors, figure boundaries, three reduced localization maps, all seven finite genus means, both split graphs, eight Gaussian sublattices, the exceptional Whittaker test modulo 9 and 27, six Hermitian congruence densities, all 81 tangent-map fibres, two sets of 72 Eisenstein Gram representatives, 16 dyadic height grids, six colored trace contractions, all 27 symmetric Fourier frequencies, 36 sheared-lattice targets, six Gaussian cutoff states, 24 double-kernel pairings and tail bounds, 24 central arcs and cycles, the six rank-two Satake averages, all six rank-four inert row spans, 24 inert cells and 12 flag-incidence distributions, positive gamma masses, complex residue angles, both reflection directions, 240 truncated Möbius products, Mellin quadrature, exact factorial gains and loss bounds, zeta samples, local Euler factors, split and inert shells, all 28 split-endpoint settings, all six cubic Jacobi sums and their conjugates, Bernoulli sums at all nine carry settings, nine signed rank grids, all 18 Gram restrictions, all 30 finite-prism settings and all 289 marked-window states.",
);
