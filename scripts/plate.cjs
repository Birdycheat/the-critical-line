const fs = require('node:fs');
const path = require('node:path');
// Euler–Maclaurin continuation, with the endpoint included in the tail.
const mul = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
const scale = ([a, b], q) => [a * q, b * q];
const add = ([a, b], [c, d]) => [a + c, b + d];
const pow = (n, a, b) =>
  scale([Math.cos(b * Math.log(n)), Math.sin(b * Math.log(n))], n ** a);
function zeta(sigma, t, N = 96) {
  let z = [0, 0];
  for (let n = 1; n < N; n++) z = add(z, pow(n, -sigma, -t));
  const d = (sigma - 1) ** 2 + t * t;
  z = add(z, mul(pow(N, 1 - sigma, -t), [(sigma - 1) / d, -t / d]));
  z = add(z, scale(pow(N, -sigma, -t), 0.5));
  let product = [1, 0];
  for (let k = 1; k <= 5; k++) {
    product = mul(product, [sigma + k - 1, t]);
    const bernoulli = { 1: 1 / 12, 3: -1 / 720, 5: 1 / 30240 }[k];
    if (bernoulli)
      z = add(z, scale(mul(product, pow(N, -sigma - k, -t)), bernoulli));
  }
  return z;
}
function plate() {
  // SVGs used through an image element cannot fetch external font resources.
  const plateFont = fs.readFileSync(path.join(__dirname, "../assets/fonts/critical-strip-labels.woff")).toString("base64");
  const plateStyle = "<style>@font-face{font-family:'Critical Line Plate Labels';src:url(data:font/woff;base64," + plateFont + ") format('woff')}</style>";
  const W = 540,
    H = 350,
    nt = 168,
    ns = 26;
  function point(s, t, z) {
    return [
      33 + (t - 8) * 15.2 + 95 * s,
      278 - 60 * s - 39 * z + 0.24 * (t - 8),
    ];
  }
  const coords = ([x, y]) => x.toFixed(2) + "," + y.toFixed(2);
  const paths = [];
  const grid = [];
  for (let j = 0; j <= ns; j++) {
    const s = j / ns;
    grid.push(
      Array.from({ length: nt + 1 }, (_, i) => {
        const t = 8 + (24 * i) / nt;
        return point(s, t, Math.hypot(...zeta(s, t)));
      }),
    );
  }
  for (let j = ns; j >= 0; j--) {
    const s = j / ns,
      g = grid[j];
    const d = "M" + g.map(coords).join(" L");
    const bottom =
      " L" + coords(point(s, 32, 0)) + " L" + coords(point(s, 8, 0)) + " Z";
    paths.push('<path d="' + d + bottom + '" fill="#fefdfa" stroke="none"/>');
    paths.push(
      '<path data-slice="' +
        j +
        '" d="' +
        d +
        '" fill="none" stroke="' +
        (j === ns / 2 ? "#9c4121" : "#444b4e") +
        '" stroke-width="' +
        (j === ns / 2 ? 2.2 : 0.78) +
        '"/>',
    );
    if (j > 0) {
      for (let i = 0; i <= nt; i += 7) {
        paths.push(
          '<path d="M' +
            coords(g[i]) +
            " L" +
            coords(grid[j - 1][i]) +
            '" fill="none" stroke="#9a9b94" stroke-width=".55"/>',
        );
      }
    }
  }
  let ticks = "";
  for (const t of [8, 12, 16, 20, 24, 28, 32]) {
    const [x, y] = point(0, t, 0);
    ticks +=
      '<path d="M' +
      x +
      " " +
      y +
      'v4" stroke="#646a6c"/><text x="' +
      x +
      '" y="' +
      (y + 19) +
      '" text-anchor="middle">' +
      t +
      "</text>";
  }
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="plate-title plate-desc" viewBox="0 0 ' +
    W +
    " " +
    H +
    '"><title id="plate-title">Magnitude of the Riemann zeta function across the critical strip</title><desc id="plate-desc">Twenty-seven cross sections plot the magnitude against imaginary part from eight to thirty-two. The highlighted cross section is identified in the caption. Troughs show where the magnitude approaches zero.</desc>' + plateStyle + '<g font-family="Critical Line Plate Labels,Latin Modern Roman,serif" font-size="12" fill="#41484b"><g fill="none" stroke="#96958b" stroke-dasharray="2 5" stroke-width=".65">' +
    [0, 1, 2, 3, 4]
      .map(
        (z) =>
          '<path d="M' +
          coords(point(0, 8, z)) +
          " L" +
          coords(point(1, 8, z)) +
          " L" +
          coords(point(1, 32, z)) +
          '"/>',
      )
      .join("") +
    "</g>" +
    paths.join("") +
    '<path d="M' +
    coords(point(0, 8, 0)) +
    " L" +
    coords(point(0, 32, 0)) +
    " L" +
    coords(point(1, 32, 0)) +
    '" fill="none" stroke="#646a6c"/>' +
    ticks +
    '<text x="210" y="330">imaginary part  𝑡</text><text x="30" y="103">|𝜁|</text><text x="452" y="268">𝜎 = 1</text><text x="410" y="294">𝜎 = 0</text></g></svg>'
  );
}
module.exports = { plate, zeta };
