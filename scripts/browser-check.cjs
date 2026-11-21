"use strict";
// Run against the local HTTP preview with a separately installed Playwright.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const [modulePath, output, base = "http://127.0.0.1:8744/"] =
  process.argv.slice(2);
if (!modulePath || !output)
  throw Error(
    "Pass the Playwright module path and a temporary output directory.",
  );
const { chromium } = require(modulePath);
async function openFigure(page, address) {
  await page.goto(address);
  await page.locator(new URL(address).hash + ".ready").waitFor();
}
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1360, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage(),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(r.status() + " " + r.url());
    });
    await page.goto(base + "index.html");
    await page.evaluate(() => document.fonts.ready);
    assert.ok(
      await page.evaluate(() =>
        document.fonts.check('20px "Libertinus Serif"'),
      ),
    );
    assert.equal(
      await page.locator(".site-header .brand").innerText(),
      "Andréa Gourion",
    );
    await page.locator("#slice-change").press("Enter");
    assert.equal(await page.locator("#slice-label").innerText(), "σ = 0");
    await page.locator("#slice-reset").press("Enter");
    assert.equal(await page.locator("#slice-label").innerText(), "σ = ½");
    await page.screenshot({ path: path.join(output, "home.png") });
    await page.getByRole("link", { name: "Begin reading" }).click();
    assert.ok(page.url().endsWith("book.html#target"));
    assert.equal(await page.locator("#how-to-read").count(), 1);
    const panel = page.locator("#global-higher-corank-correspondence");
    const formalLink = panel.locator('a[href*=".lean#"]').first();
    assert.equal(await formalLink.isVisible(), false);
    await panel.locator("summary").press("Enter");
    assert.ok(await formalLink.isVisible());
    await panel.locator("summary").press("Space");
    assert.equal(await formalLink.isVisible(), false);
    const mathematicalLink = page.locator('a[href="reference.html#theorem-hasse-norm"]').first();
    await mathematicalLink.click();
    const normTheorem = page.locator("#theorem-hasse-norm");
    assert.ok(await normTheorem.isVisible());
    assert.ok(await normTheorem.getByRole("link", { name: /Milne/ }).isVisible());
    await normTheorem.locator('a[href="book.html#inputs-dyadic-signatures"]').click();
    assert.equal(new URL(page.url()).hash, "#inputs-dyadic-signatures");
    const firstNote = page.locator(".refno a:visible").first();
    const noteTarget = await firstNote.getAttribute("href");
    await firstNote.click();
    assert.equal(new URL(page.url()).hash, noteTarget);
    assert.ok(await page.locator(noteTarget).isVisible());
    const ids = await page
      .locator("[data-lab]")
      .evaluateAll((els) => els.map((el) => el.dataset.lab));
    for (const width of [1360, 768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + "book.html");
      for (const id of ids) {
        const fig = page.locator("#fig-" + id);
        await fig.scrollIntoViewIfNeeded();
        await fig.locator("button.reset").waitFor({ state: "visible" });
        const before = await fig.locator("[data-result]").innerText();
        const controls = fig.locator(
          "[data-controls] input, [data-controls] select",
        );
        for (const field of await controls.all()) {
          await field.focus();
          if (await field.evaluate((e) => e.tagName === "SELECT"))
            await field.press(id === "orthogonal" ? "Home" : "ArrowDown");
          else await field.press("End");
        }
        assert.notEqual(
          await fig.locator("[data-result]").innerText(),
          before,
          id + " did not respond to keyboard",
        );
        const share = new URL(
          await fig.locator("[data-share]").getAttribute("href"),
        );
        assert.equal(share.hash, "#fig-" + id);
        assert.ok(share.searchParams.size > 0);
        await fig.locator("button.reset").click();
        assert.equal(
          await fig.locator("[data-result]").innerText(),
          before,
          id + " reset",
        );
        if (id === "galois-character-peeling") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["(1, 1)", "(−1, −1)", "(−1, −1)"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["Equal", "2 of 4"]);
        } else if (id === "regular-unit-shift") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["Two equal entries", "No summand", "0"]);
        } else if (id === "hyperplane-mass-stratum") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["e₂", "14641", "1", "121"]);
        } else if (id === "gluing-residues") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["1/3", "1/3", "−1/3", "2/3"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["3", "0"]);
        } else if (id === "rational-line-orbit") {
          assert.deepEqual(await fig.locator(".metrics dd").allTextContents(), ["(3, 4)", "25", "5D"]);
        } else if (id === "parabolic-shell") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["1", "1/16", "1/16", "16", "1/16", "1"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["4", "4"]);
        } else if (id === "cartan-power") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["0.00", "−88722.84", "−697.83"]);
        } else if (id === "convex-nerve-cut") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["A, B, AB", "B", "B, C, BC"]);
        } else if (id === "split-gram-phases") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["(0, 2)", "0", "(2, 0)", "0", "(3, 3)", "4", "(4, 4)", "1"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["i, −i", "2 of 4"]);
        } else if (id === "marked-ideal-weight") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["1/2", "4", "2", "1/8"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["2", "1/4"]);
        } else if (id === "progression-difference") {
          assert.equal(await fig.locator("caption").innerText(), "Integer weights for y = 4, u = 6");
          assert.deepEqual(await fig.locator("tbody tr").first().locator("td").allInnerTexts(), ["0", "1", "1", "0"]);
          assert.deepEqual(await fig.locator("tbody tr").nth(3).locator("td").allInnerTexts(), ["log 2", "1", "1", "log 2"]);
          assert.deepEqual(await fig.locator("tbody tr").nth(4).locator("td").allInnerTexts(), ["log 5", "1", "2/5", "2/5 log 5"]);
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["0", "0", "0", "0"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["2 log 2", "2/5 log 5", "2.0301"]);
        } else if (id === "central-rounding") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["2", "3/4", "1", "1/4"]);
          assert.equal(await fig.locator("svg circle").count(), 5);
        } else if (id === "cusp-trace-mass") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1", "16/31"]);
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["1/16", "256/31", "16/31"]);
        } else if (id === "minor-shells") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["4", "8"]);
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["36", "1.964", "9/2"]);
        } else if (id === "primitive-hyperplanes") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["40/384", "1/16 + 1/24"]);
          assert.deepEqual(await fig.locator("tbody tr").first().locator("td").allInnerTexts(), ["24", "16"]);
        } else if (id === "dyadic-unit-signs") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["0011", "4 of 16"]);
          assert.equal(await fig.locator("tbody tr").count(), 4);
        } else if (id === "binary-lattice-limit") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["135/8192", "1/81"]);
          assert.equal(await fig.locator("svg circle").count(), 13);
        } else if (id === "stickelberger-fibres") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["24", "2"]);
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["5", "1", "9", "1"]);
        } else if (id === "one-vector-density") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["2044/2187", "2044/27"]);
          assert.equal(await fig.locator("tbody tr").count(), 2);
        } else if (id === "quadratic-character") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1", "0"]);
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["1", "0"]);
        } else if (id === "whittaker-cutoff") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1/4", "0"]);
          assert.ok(await fig.locator("svg path.ink").isVisible());
          assert.equal(await fig.locator("svg path.dash").count(), 1);
        } else if (id === "inertia-orbits") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["8", "2"]);
          assert.equal(await fig.locator("tbody tr").count(), 2);
        } else if (id === "localization-kernel") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["3", "3"]);
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["0, 1, 2", "3", "0", "1"]);
        } else if (id === "genus-mass") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["4", "7/2"]);
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["2", "(4 + 20)/6"]);
        } else if (id === "split-graph") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["6", "3", "3"]);
          assert.equal(await fig.locator("circle").count(), 6);
          assert.ok(await fig.locator("svg").isVisible());
        } else if (id === "hermitian-density") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["6,048", "224/243"]);
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["252", "24"]);
        } else if (id === "orbit-weights") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["216", "1"]);
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["72", "1/216", "1/3", "72", "1/108", "2/3"]);
        } else if (id === "height-grid") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["675", "1,296"]);
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["9 (k = 2)", "5 (k = 1)", "5 (k = 1)", "3 (k = 0)"]);
        } else if (id === "trace-cycles") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["3", "2"]);
        } else if (id === "fourier-rank") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1 · invertible", "9, 9, 9", "0"]);
        } else if (id === "shear-rounding") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["(2/5, 2/5)", "4/5", "1/5"]);
        } else if (id === "minimum-scale") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["45", "13", "e₁"]);
          assert.ok((await fig.locator("[data-result]").innerText()).includes("7/180"));
          assert.ok(await fig.locator("svg").isVisible());
        } else if (id === "kernel-order") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1 − i", "1 − i"]);
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["2", "1 + i", "0", "1 − i"]);
          assert.equal(await fig.locator("[data-result] strong").innerText(), "12");
        } else if (id === "central-period") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["[0, 1]", "2", "2"]);
          assert.ok(await fig.locator("svg").isVisible());
          assert.ok(await fig.locator("svg path.ink").isVisible());
          // A horizontal SVG path has a zero-height DOM rectangle even when
          // Chrome paints its stroke. Check its painted style and its span.
          assert.ok(await fig.locator("svg path.dash").evaluate(path => {
            const style = getComputedStyle(path);
            const box = path.getBoundingClientRect();
            const svg = path.ownerSVGElement.getBoundingClientRect();
            return style.display !== "none" && style.visibility === "visible" &&
              Number(style.opacity) > 0 && Number(style.strokeOpacity) > 0 &&
              style.stroke !== "none" && parseFloat(style.strokeWidth) > 0 &&
              style.strokeDasharray !== "none" && box.width > 0.75 * svg.width &&
              box.top > svg.top && box.top < svg.bottom;
          }), "Central average reference line is not painted across the plot");
          assert.equal(await fig.locator("svg").evaluate(svg => {
            const bounds = svg.getBoundingClientRect();
            return [...svg.querySelectorAll("text")].every(label => {
              const box = label.getBoundingClientRect();
              return box.left >= bounds.left && box.right <= bounds.right &&
                box.top >= bounds.top && box.bottom <= bounds.bottom;
            });
          }), true, "Central period plot labels extend past its view at width " + width);
        } else if (id === "mobius-product") {
          assert.equal(await fig.locator("table caption").innerText(), "Factor pairs for n = 6");
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["2", "0", "−2"]);
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["1", "1", "d > Y", "0"]);
        } else if (id === "inert-cell") {
          assert.equal(await fig.locator("table caption").innerText(), "One inert cell at q = 3, a = 0");
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["9", "9", "78"]);
        } else if (id === "satake-average") {
          assert.equal(await fig.locator("svg circle").count(), 12);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1/3", "1", "3"]);
          assert.deepEqual(await fig.locator("[data-result] strong").allInnerTexts(), ["8", "2/3"]);
        } else if (id === "inert-length") {
          assert.equal(await fig.locator("table caption").innerText(), "Rows of 3G modulo 3 at s = 1, t = 0");
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1", "1", "9"]);
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["0", "0", "0", "0"]);
        } else if (id === "flag-layer-exponents") {
          assert.equal(await fig.locator("table caption").innerText(), "Sizes (1/2), completed ranks (1, 2, 1)");
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["4", "4 + 4", "8", "1", "4", "4"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["5", "12/2 = 6", "1/64"]);
        } else if (id === "flag-average") {
          assert.equal(await fig.locator("table caption").innerText(), "Line averages over 𝔽₂₅");
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["25", "−1/26", "601", "0", "25", "1/26"]);
        } else if (id === "jacobi-primes") {
          assert.equal(await fig.locator("table caption").innerText(), "Two primes above 7");
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["2", "0", "3"]);
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["0", "1", "1, 0", "1", "0", "0, 1"]);
        } else if (id === "split-endpoint") {
          assert.equal(await fig.locator("table caption").innerText(), "Endpoint coefficients through degree 7 in X (q = 2)");
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["7", "7", "0"]);
        } else if (id === "prism") {
          assert.equal(await fig.locator("table caption").innerText(), "Insertion sums in degree 3");
          assert.equal(await fig.locator(".metrics dd").last().innerText(), "1");
        } else if (id === "gram-pair") {
          assert.equal(await fig.locator("table caption").innerText(), "Squared Gram errors with first columns retained");
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["0.36", "0.36"]);
        } else if (id === "floor-sum") {
          assert.equal(await fig.locator("table caption").innerText(), "Signed contributions at level 5");
        } else if (id === "rank-grid") {
          assert.equal(await fig.locator("table caption").innerText(), "Basis vector at (2, 3)");
        } else {
          assert.ok(await fig.locator("svg").getAttribute("aria-label"));
        }
        if (width === 390) {
          const figureHeight = await fig.evaluate(el => Math.ceil(el.getBoundingClientRect().height));
          // Keep the entire figure in the mobile viewport during the capture.
          const captureHeight = Math.max(900, figureHeight + 64);
          if (captureHeight > 900) await page.setViewportSize({ width, height: captureHeight });
          await fig.evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
          const area = await fig.boundingBox();
          assert.ok(area.y >= -1 && area.y + area.height <= captureHeight + 1);
          await page.screenshot({ path: path.join(output, id + ".png"), clip: area });
          if (captureHeight > 900) await page.setViewportSize({ width, height: 900 });
        }
      }
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        "book overflows " + width,
      );
    }
    await openFigure(page, base + "book.html?progression-difference.y=8&progression-difference.chi=quadratic#fig-progression-difference");
    const difference = page.locator("#fig-progression-difference.ready");
    assert.deepEqual(await difference.locator("tbody tr").nth(7).locator("td").allInnerTexts(), ["log 2", "−1", "1", "−log 2"]);
    assert.deepEqual(await difference.locator("tbody tr").nth(8).locator("td").allInnerTexts(), ["log 3", "0", "2/3", "0"]);
    assert.deepEqual(await difference.locator("tbody tr").nth(10).locator("td").allInnerTexts(), ["log 11", "−1", "2/11", "−2/11 log 11"]);
    assert.deepEqual(await difference.locator(".metrics dd").allInnerTexts(), ["−log 2 − log 5 + log 7", "−2/11 log 11", "−0.7927"]);
    await difference.getByRole("combobox", {name: "Relative step δ"}).selectOption("4");
    assert.equal(await difference.locator("caption").innerText(), "Integer weights for y = 8, u = 10");
    assert.equal(await difference.locator(".metrics dd").nth(1).innerText(), "0");
    await openFigure(page, base + "book.html?minimum-scale.scale=16&minimum-scale.direction=dual#fig-minimum-scale");
    const minimum = page.locator("#fig-minimum-scale.ready");
    assert.deepEqual(await minimum.locator(".metrics dd").allInnerTexts(), ["193", "49", "e₂ / 64"]);
    await minimum.getByRole("combobox", {name: "Test direction"}).press("Home");
    assert.ok((await minimum.locator("[data-result]").innerText()).includes("3/386"));
    const minimumLink = new URL(await minimum.locator("[data-share]").getAttribute("href"));
    assert.equal(minimumLink.searchParams.get("minimum-scale.scale"), "16");
    await openFigure(page, minimumLink.href);
    assert.deepEqual(await minimum.locator(".metrics dd").allInnerTexts(), ["193", "49", "e₁"]);
    await openFigure(page, base + "book.html?kernel-order.cutoff=3&kernel-order.phase=i#fig-kernel-order");
    const order = page.locator("#fig-kernel-order.ready");
    assert.deepEqual(await order.locator(".metrics dd").allInnerTexts(), ["7/16 − i", "7/16 − i"]);
    await order.getByRole("combobox").press("Home");
    assert.deepEqual(await order.locator(".metrics dd").allInnerTexts(), ["65/16", "65/16"]);
    const orderLink = new URL(await order.locator("[data-share]").getAttribute("href"));
    assert.equal(orderLink.searchParams.get("kernel-order.phase"), "one");
    await openFigure(page, orderLink.href);
    assert.equal(await order.locator("[data-result] strong").innerText(), "135/16");
    await openFigure(page, base + "book.html?central-period.start=0&central-period.length=0.25#fig-central-period");
    const central = page.locator("#fig-central-period.ready");
    assert.deepEqual(await central.locator(".metrics dd").allInnerTexts(), ["[0, 1/4]", "1/2 + 1/(2π) ≈ 0.6592", "1/2"]);
    await central.locator('input[name="start"]').press("ArrowRight");
    assert.deepEqual(await central.locator(".metrics dd").allInnerTexts(), ["[1/8, 3/8]", "1/2", "1/2"]);
    assert.match(await central.locator("[data-result]").innerText(), /coincide on this open arc/);
    const centralLink = new URL(await central.locator("[data-share]").getAttribute("href"));
    assert.equal(centralLink.searchParams.get("central-period.start"), "0.125");
    assert.equal(centralLink.searchParams.get("central-period.length"), "0.25");
    await central.locator('select[name="length"]').press("Home");
    assert.deepEqual(await central.locator(".metrics dd").allInnerTexts(), ["[1/8, 9/8]", "2", "2"]);
    await openFigure(page, base + "book.html?flag-average.q=2&flag-average.points=triangle#fig-flag-average");
    const flags = page.locator("#fig-flag-average.ready");
    assert.equal(await flags.locator("table caption").innerText(), "Line averages over 𝔽₂");
    assert.deepEqual(await flags.locator("tbody td").allInnerTexts(), ["1", "−2/3", "2", "−1/3", "1", "0", "2", "1/3", "1", "2/3"]);
    await openFigure(page, base + "book.html?satake-average.alpha=3#fig-satake-average");
    const satake = page.locator("#fig-satake-average.ready");
    assert.deepEqual(await satake.locator(".metrics dd").allInnerTexts(), ["1", "1", "1"]);
    assert.deepEqual(await satake.locator("[data-result] strong").allInnerTexts(), ["12", "1"]);
    await satake.getByRole("combobox", {name: "Satake parameter α"}).press("End");
    assert.deepEqual(await satake.locator(".metrics dd").allInnerTexts(), ["−1/3", "1", "−3"]);
    const satakeShare = new URL(await satake.locator("[data-share]").getAttribute("href"));
    assert.equal(satakeShare.searchParams.get("satake-average.alpha"), "-1");
    assert.equal(satakeShare.hash, "#fig-satake-average");
    await openFigure(page, satakeShare.href);
    assert.deepEqual(await satake.locator("[data-result] strong").allInnerTexts(), ["−4", "−1/3"]);
    await openFigure(page, base + "book.html?inert-length.s=2&inert-length.t=2#fig-inert-length");
    const inertLength = page.locator("#fig-inert-length.ready");
    assert.deepEqual(await inertLength.locator(".metrics dd").allInnerTexts(), ["2", "2", "81"]);
    assert.deepEqual(await inertLength.locator("tbody tr").first().locator("td").allInnerTexts(), ["0", "0", "2", "1 + 2i"]);
    assert.equal(await inertLength.locator("tbody tr").last().locator("th").innerText(), "R₁ − 2R₃");
    assert.deepEqual(await inertLength.locator("tbody tr").last().locator("td").allInnerTexts(), ["0", "0", "0", "2i"]);
    await inertLength.getByRole("combobox", {name: "Imaginary coefficient t"}).press("Home");
    assert.deepEqual(await inertLength.locator(".metrics dd").allInnerTexts(), ["1", "1", "9"]);
    const inertShare = new URL(await inertLength.locator("[data-share]").getAttribute("href"));
    assert.equal(inertShare.hash, "#fig-inert-length");
    assert.equal(inertShare.searchParams.get("inert-length.s"), "2");
    assert.equal(inertShare.searchParams.has("inert-length.t"), false);
    await openFigure(page, inertShare.href);
    assert.equal(await inertLength.locator("table caption").innerText(), "Rows of 3G modulo 3 at s = 2, t = 0");
    await openFigure(page, base + "book.html?inert-cell.q=5&inert-cell.diagonal=-1&inert-cell.excess=3#fig-inert-cell");
    const cell = page.locator("#fig-inert-cell.ready");
    assert.equal(await cell.locator("table caption").innerText(), "One inert cell at q = 5, a = −1");
    assert.deepEqual(await cell.locator("tbody tr").last().locator("td").allInnerTexts(), ["25", "125", "2500"]);
    await openFigure(page, base + "book.html?kernel.k=160&kernel.s=3&kernel.width=0.1#fig-kernel");
    assert.equal(await page.locator("#fig-kernel.ready .metrics dd").last().innerText(), "2.172e-28%");
    await openFigure(page, base + "book.html?mobius-product.n=4#fig-mobius-product");
    const product = page.locator("#fig-mobius-product.ready");
    assert.deepEqual(await product.locator(".metrics dd").allInnerTexts(), ["2", "0", "0"]);
    await product.getByRole("slider").press("Home");
    assert.deepEqual(await product.locator(".metrics dd").allInnerTexts(), ["1", "1", "1"]);
    const proofPage = await context.newPage();
    await proofPage.goto(base + "book.html#inputs-flag-gap");
    const proof = proofPage.locator("#inputs-flag-gap");
    assert.ok(await proof.locator("p").first().isVisible(), "Direct link must open the proof");
    await proof.locator(":scope > summary").click();
    await proofPage.locator("#outline-local-counts").evaluate(e => { e.open = true; });
    await proofPage.locator('#outline-local-counts a[href="#inputs-flag-gap"]').click();
    assert.ok(await proof.locator("p").first().isVisible(), "Repeated link must reopen its proof");
    await openFigure(proofPage, base + "book.html?reflection.side=left#fig-reflection");
    const reflection = proofPage.locator("#fig-reflection.ready");
    assert.ok((await reflection.locator("[data-result]").innerText()).includes("a zero of ψ⁻¹ at 0.76 − i"));
    await reflection.getByRole("combobox", {name:"Starting zero of ψ"}).press("Home");
    assert.ok((await reflection.locator("[data-result]").innerText()).includes("a zero of ψ⁻¹ at 0.24 − i"));
    await openFigure(proofPage, base + "book.html?padic.d=27#fig-padic");
    assert.deepEqual(await proofPage.locator("#fig-padic.ready .metrics dd").allInnerTexts(), ["6","13/12","59/12"]);
    await proofPage.close();
    await openFigure(page, base + "book.html?ramp.x=30&ramp.chi=four#fig-ramp");
    assert.equal(await page.locator("#field-ramp-x").inputValue(), "30");
    assert.equal(await page.locator("#field-ramp-chi").inputValue(), "four");
    await openFigure(page, base + "book.html?jacobi-primes.p=19&jacobi-primes.root=upper#fig-jacobi-primes");
    const jacobi = page.locator("#fig-jacobi-primes.ready");
    assert.equal(await jacobi.getByRole("combobox", { name: "Rational prime p" }).inputValue(), "19");
    const definingRoot = jacobi.getByRole("combobox", { name: "Root defining χ" });
    assert.equal(await definingRoot.inputValue(), "upper");
    assert.deepEqual(await jacobi.locator("tbody td").allInnerTexts(), ["7", "0", "0, 1", "0", "7", "1, 0"]);
    const upperLink = await jacobi.locator("[data-share]").getAttribute("href");
    await definingRoot.press("Home");
    assert.deepEqual(await jacobi.locator(".metrics dd").allInnerTexts(), ["8", "3", "6"]);
    assert.deepEqual(await jacobi.locator("tbody td").allInnerTexts(), ["0", "7", "1, 0", "7", "0", "0, 1"]);
    const lowerLink = new URL(await jacobi.locator("[data-share]").getAttribute("href"));
    assert.equal(lowerLink.hash, "#fig-jacobi-primes");
    assert.equal(lowerLink.searchParams.get("jacobi-primes.p"), "19");
    assert.equal(lowerLink.searchParams.has("jacobi-primes.root"), false);
    const sharedJacobi = await context.newPage();
    await openFigure(sharedJacobi, upperLink);
    const restored = sharedJacobi.locator("#fig-jacobi-primes.ready");
    assert.equal(await restored.getByRole("combobox", { name: "Root defining χ" }).inputValue(), "upper");
    assert.deepEqual(await restored.locator(".metrics dd").allInnerTexts(), ["8", "6", "3"]);
    await sharedJacobi.close();
    await openFigure(page, base + "book.html?split-endpoint.q=4&split-endpoint.degree=3#fig-split-endpoint");
    const endpoint = page.locator("#fig-split-endpoint.ready");
    const endpointDegree = endpoint.getByRole("slider", { name: "Degree k in T = X²" });
    assert.equal(await endpoint.getByRole("combobox", { name: "Residue-field size q" }).inputValue(), "4");
    assert.deepEqual(await endpoint.locator("tbody tr").last().locator("td").allInnerTexts(), ["85", "85", "0"]);
    await endpointDegree.press("Home");
    assert.equal(await endpoint.locator("tbody tr").count(), 1);
    assert.deepEqual(await endpoint.locator("tbody td").allInnerTexts(), ["1", "1", "1"]);
    await endpointDegree.press("ArrowRight");
    assert.deepEqual(await endpoint.locator("tbody tr").last().locator("td").allInnerTexts(), ["5", "5", "0"]);
    await openFigure(page, base + "book.html?rank-grid.row=4&rank-grid.column=2#fig-rank-grid");
    const grid = page.locator("#fig-rank-grid.ready table");
    assert.equal(await grid.locator("caption").innerText(), "Basis vector at (4, 2)");
    const selectedRow = grid.getByRole("rowheader", { name: "4", exact: true }).locator("..");
    assert.deepEqual(await selectedRow.locator("td").allInnerTexts(), ["+1", "0", "0", "−1", "0"]);
    await openFigure(page, base + "book.html?prism.twist=2&prism.weight=2&prism.gluing=3#fig-prism");
    const prism = page.locator("#fig-prism.ready");
    assert.equal(await prism.locator(".metrics dd").last().innerText(), "2");
    assert.equal(await prism.locator("tbody tr").count(), 5);
    await openFigure(page, base + "book.html?gram-pair.a=1.5&gram-pair.h=0.6&gram-pair.column=second#fig-gram-pair");
    const gram = page.locator("#fig-gram-pair.ready");
    assert.equal(await gram.getByRole("combobox", { name: "Column kept in each word" }).inputValue(), "second");
    assert.deepEqual(await gram.locator("tbody td").allInnerTexts(), ["1.5625", "0", "0", "0", "0.81", "0"]);
    assert.deepEqual(await gram.locator(".metrics dd").allInnerTexts(), ["0", "0.78125", "0"]);
    await gram.getByRole("combobox", { name: "Column kept in each word" }).press("Home");
    assert.deepEqual(await gram.locator("tbody td").allInnerTexts(), ["1.5625", "1.5625", "0", "0", "0.81", "0.81"]);
    assert.deepEqual(await gram.locator(".metrics dd").allInnerTexts(), ["0.9", "0.78125", "1.5625"]);
    await openFigure(page, base + "book.html?floor-sum.depth=3&floor-sum.multiplier=4#fig-floor-sum");
    const floorSum = page.locator("#fig-floor-sum.ready");
    assert.equal(await floorSum.locator("table caption").innerText(), "Signed contributions at level 125");
    assert.equal(await floorSum.locator(".metrics dd").first().innerText(), "7810");
    await page.goto(base + "index.html");
    await page.locator(".mobile-menu-button").press("Enter");
    assert.equal(await page.locator("#book-menu").isVisible(), true);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#book-menu").isVisible(), false);
    assert.ok(
      await page
        .locator(".mobile-menu-button")
        .evaluate((el) => document.activeElement === el),
    );
    await page.screenshot({ path: path.join(output, "mobile.png") });
    await page.goto(base + "reference.html");
    await page.locator("[data-filter]").fill("von Mangoldt");
    assert.equal(await page.locator("[data-search]:visible").count(), 1);
    await page.goto(base + "atlas.html");
    await page.locator("[data-filter]").fill("mellin");
    assert.ok((await page.locator("[data-search]:visible").count()) > 0);
    const atlasSearch = page.locator("[data-filter]");
    const referencedClaim = page.locator('[id="claim-CNT-01"]');
    await atlasSearch.fill("1337/90");
    assert.equal(await referencedClaim.isVisible(), false);
    const wordBound = page.locator('[id="claim-WUP-01"]');
    assert.ok(await wordBound.locator('a[href="#claim-CNT-01"]').isVisible());
    await wordBound.locator('a[href="#claim-CNT-01"]').click();
    await referencedClaim.waitFor({ state: "visible" });
    assert.equal(await atlasSearch.inputValue(), "1337/90");
    assert.match(await page.locator("[data-count]").innerText(), /1 linked entry/);
    await page.goBack();
    await referencedClaim.waitFor({ state: "hidden" });
    assert.ok(await wordBound.isVisible());
    await page.goto(base + "book.html#eq-pilot-chi-transform");
    await page.screenshot({ path: path.join(output, "equation.png") });
    assert.ok((await page.locator("math mfrac").count()) > 0);
    for (const file of [
      "index.html",
      "book.html",
      "experiments.html",
      "reference.html",
      "atlas.html",
      "print.html",
    ]) {
      for (const width of [390, 768, 1360]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(base + file);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator("main.article").count(), 1, file);
        assert.equal(
          await page.locator(".site-header .header-inner").count(),
          1,
          file,
        );
        assert.equal(
          await page.locator(".site-footer .colophon").count(),
          1,
          file,
        );
        assert.ok(
          await page
            .locator("main")
            .evaluate((el) =>
              getComputedStyle(el).fontFamily.includes("Libertinus"),
            ),
          file,
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          file + " overflow at " + width,
        );
      }
    }
    await page.goto(base + "print.html");
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator("details.correspondence:visible").count(), 0);
    assert.ok(await page.locator("#global-higher-gaussian-planes").isVisible());
    assert.ok(await page.locator("#claim-HCM-03").isVisible());
    assert.ok(await page.locator("#theorem-hasse-norm").isVisible());
    const referenceLayout = await page.locator("#book-references ol").evaluate(list => {
      const sample = document.createElement("span");
      sample.textContent = list.children.length + ". ";
      sample.style.whiteSpace = "pre";
      list.append(sample);
      const markerWidth = sample.getBoundingClientRect().width;
      sample.remove();
      return {
        indent: parseFloat(getComputedStyle(list).paddingInlineStart),
        markerWidth,
        split: getComputedStyle(list.lastElementChild).breakInside,
      };
    });
    assert.ok(referenceLayout.indent >= referenceLayout.markerWidth, "Source list must fit its longest number");
    assert.equal(referenceLayout.split, "avoid");
    assert.deepEqual(await page.locator("#fig-kernel-order .metrics dd").allInnerTexts(), ["1 − i", "1 − i"]);
    assert.deepEqual(await page.locator("#fig-minimum-scale .metrics dd").allInnerTexts(), ["45", "13", "e₁"]);
    assert.ok(await page.locator("#fig-central-period svg").isVisible());
    assert.deepEqual(await page.locator("#fig-central-period .metrics dd").allInnerTexts(), ["[0, 1]", "2", "2"]);
    assert.ok(await page.locator("#fig-inert-length table").isVisible());
    assert.ok(await page.locator("#fig-satake-average svg").isVisible());
    assert.deepEqual(await page.locator("#fig-satake-average [data-result] strong").allInnerTexts(), ["8", "2/3"]);
    assert.deepEqual(await page.locator("#fig-inert-length .metrics dd").allInnerTexts(), ["1", "1", "9"]);
    assert.equal(await page.locator(".site-header").isVisible(), false);
    assert.ok(await page.locator("#fig-jacobi-primes table").isVisible());
    assert.deepEqual(await page.locator("#fig-jacobi-primes tbody td").allInnerTexts(), ["0", "1", "1, 0", "1", "0", "0, 1"]);
    assert.deepEqual(await page.locator("#fig-mobius-product .metrics dd").allInnerTexts(), ["2", "0", "−2"]);
    await page.pdf({
      path: path.join(output, "print-check.pdf"),
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    const staticContext = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const plain = await staticContext.newPage();
    await plain.goto(base + "book.html");
    const plainDifference = plain.locator("#fig-progression-difference");
    assert.equal(await plainDifference.locator("tbody tr").count(), 6);
    assert.deepEqual(await plainDifference.locator(".metrics dd").allInnerTexts(), ["2 log 2", "2/5 log 5", "2.0301"]);
    assert.ok(await plainDifference.locator("table").evaluate(el =>
      el.getBoundingClientRect().width <= el.closest("figure").getBoundingClientRect().width + 1));
    assert.deepEqual(await plain.locator("#fig-minimum-scale .metrics dd").allInnerTexts(), ["45", "13", "e₁"]);
    assert.deepEqual(await plain.locator("#fig-kernel-order .metrics dd").allInnerTexts(), ["1 − i", "1 − i"]);
    assert.ok(await plain.locator("#fig-central-period svg").isVisible());
    assert.deepEqual(await plain.locator("#fig-central-period .metrics dd").allInnerTexts(), ["[0, 1]", "2", "2"]);
    const staticPanel = plain.locator("#global-higher-corank-correspondence");
    const staticLink = staticPanel.locator('a[href*=".lean#"]').first();
    assert.equal(await staticLink.isVisible(), false);
    await staticPanel.locator("summary").click();
    assert.ok(await staticLink.isVisible());
    await staticPanel.locator("summary").click();
    assert.ok(await plain.locator('a[href="reference.html#theorem-orbit-stabilizer"]').first().isVisible());
    assert.equal(await plain.locator(".desktop-nav").isVisible(), true);
    assert.equal(await plain.locator("[data-result] svg[aria-label], [data-result] table:has(caption)").count(), ids.length);
    assert.equal(await plain.locator("[data-controls]:visible").count(), 0);
    assert.deepEqual(await plain.locator("#fig-mobius-product .metrics dd").allInnerTexts(), ["2", "0", "−2"]);
    const staticJacobi = plain.locator("#fig-jacobi-primes");
    assert.deepEqual(await plain.locator("#fig-inert-length .metrics dd").allInnerTexts(), ["1", "1", "9"]);
    assert.equal(await plain.locator("#fig-inert-length tbody tr").count(), 3);
    assert.equal(await plain.locator("#fig-satake-average svg circle").count(), 12);
    assert.deepEqual(await plain.locator("#fig-satake-average [data-result] strong").allInnerTexts(), ["8", "2/3"]);
    assert.equal(await staticJacobi.locator("caption").innerText(), "Two primes above 7");
    assert.deepEqual(await staticJacobi.locator(".metrics dd").allInnerTexts(), ["2", "0", "3"]);
    assert.deepEqual(await staticJacobi.locator("tbody td").allInnerTexts(), ["0", "1", "1, 0", "1", "0", "0, 1"]);
    await plain.locator("#pilot details summary").first().click();
    assert.equal(await plain.locator("#pilot details[open]").count(), 1);
    assert.deepEqual(errors, []);
    console.log(
      "Checked " +
        ids.length +
        " figures at three widths, controls, reset, sharing, search, MathML, mobile menu, template on all six pages, print and no-JavaScript reading.",
    );
  } finally {
    await browser.close();
  }
}
run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
