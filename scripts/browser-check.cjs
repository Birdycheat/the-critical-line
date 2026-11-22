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
async function assertVectorWeights(page) {
  const cells = page.locator("#fig-rank-grid tbody td");
  assert.ok(await cells.count() > 0);
  const weights = await cells.evaluateAll(nodes => [...new Set(nodes.map(node => getComputedStyle(node).fontWeight))]);
  assert.deepEqual(weights, ["400"], "All displayed basis-vector entries must have regular weight");
}
const defaultCrystallineColumns = ["2", "−2", "−2i", "−2i", "−2i", "−2i"];
const defaultWeilOperator = ["n₂ = 1","t2","n₁ = 0","t","t13","t14","1/t","t15","t15"];
const defaultOrbitalFibre = ["−1/5","−1/5","−1","D, 1","ℤ₅","5","1","(1/5)ℤ₅ ∖ ℤ₅","20","4"];
const defaultLogarithmColumn = ["(2, 0, −1)","Yes","(2, 4, 3)","No","(2, −2, 1)","No","(0, −2, −1)","No"];
const defaultModification = ["u4","u2","u","u5","u3 (1, 0)","u3 (1, −1)","u3 (1, 1)","u3 (0, 1)"];
async function assertModificationTable(figure) {
  assert.deepEqual(await figure.locator("tbody td").allTextContents(),defaultModification);
  const mathematicalEntries=figure.locator("th var, th sub, th sup, .math-coordinates, td");
  assert.ok(await mathematicalEntries.evaluateAll(nodes=>nodes.length>=12&&nodes.every(el=>getComputedStyle(el).fontWeight==="400")));
}
async function assertLogarithmTable(figure) {
  assert.deepEqual(await figure.locator("tbody td").allTextContents(),defaultLogarithmColumn);
  const symbols = figure.locator("tbody th var, tbody td:nth-child(2)");
  assert.ok(await symbols.evaluateAll(nodes => nodes.length >= 8 && nodes.every(node=>getComputedStyle(node).fontWeight==="400")));
}
async function assertRenderedFont(session, selector, postScriptName) {
  const { root } = await session.send("DOM.getDocument");
  const { nodeId } = await session.send("DOM.querySelector", { nodeId: root.nodeId, selector });
  assert.ok(nodeId, "Missing font sample " + selector);
  const { fonts } = await session.send("CSS.getPlatformFontsForNode", { nodeId });
  assert.ok(fonts.some(font => font.isCustomFont && font.glyphCount > 0 && font.postScriptName === postScriptName),
    selector + " must render with " + postScriptName + ", saw " + JSON.stringify(fonts));
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
    const fontSession = await context.newCDPSession(page);
    await fontSession.send("DOM.enable");
    await fontSession.send("CSS.enable");
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(r.status() + " " + r.url());
    });
    await page.goto(base + "index.html");
    await page.evaluate(() => document.fonts.ready);
    await assertRenderedFont(fontSession, "h1", "LMRoman10-Regular");
    await assertRenderedFont(fontSession, "#opening-plot text", "CriticalLinePlateLabels-Regular");
    const loadedFaces = await page.evaluate(async () => {
      const specs = [
        ['normal 400 20px "Latin Modern Roman"', "Riemann"],
        ['italic 400 20px "Latin Modern Roman"', "Riemann"],
        ['normal 700 20px "Latin Modern Roman"', "Riemann"],
        ['italic 700 20px "Latin Modern Roman"', "Riemann"],
        ['normal 400 20px "Latin Modern Math"', "∑"],
      ];
      return Promise.all(specs.map(async ([spec, sample]) => {
        const faces = await document.fonts.load(spec, sample);
        return faces.length > 0 && faces.every(face => face.status === "loaded");
      }));
    });
    assert.ok(loadedFaces.every(Boolean), "All five declared font faces must load");
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
        if (id === "trace-lattice-primes") {
          assert.equal(await fig.locator("caption").innerText(), "Tests modulo 5");
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["2, 3", "25 of 25", "Yes", "No"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["4734976", "Satisfied"]);
        } else if (id === "iwahori-translated-slopes") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["(12, 1), (3, 1)", "X² − 13X + 9", "0 and 1", "−4, −2"]);
          assert.match(await fig.locator('[role="status"]').textContent(), /Eigenvalue valuations of g: −4, −2/);
        } else if (id === "hecke-four-point-approximation") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1/√2", "1/√2", "Equal"]);
          assert.deepEqual(await fig.locator("tbody tr").nth(1).locator("td").allInnerTexts(), ["i", "1 − i", "1/√2"]);
        } else if (id === "quadratic-place-restrictions") {
          assert.equal(await fig.locator("caption").innerText(), "Generator residues modulo 17");
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["Same", "Different", "Satisfied"]);
        } else if (id === "filtered-lattice-modification") {
          await assertModificationTable(fig);
        } else if (id === "logarithm-zero") {
          await assertLogarithmTable(fig);
          assert.equal(await fig.getByRole("status").textContent(),"Shift 2. Column 3 of the Galois transform is (2, 0, −1). Quadratic contribution (2, 2, 0).");
        } else if (id === "orbital-unipotent-fibre") {
          assert.deepEqual(await fig.locator("tbody td").allTextContents(),defaultOrbitalFibre);
          assert.equal(await fig.locator('[role="status"]').textContent(),"Image coordinate −1/5. Test value 1. Image cell mass 1/5. Fibre sum 0. Integral 0.");
        } else if (id === "signed-weil-operator") {
          assert.deepEqual(await fig.locator("tbody td").allTextContents(),defaultWeilOperator);
          assert.equal(await fig.locator('[role="status"]').textContent(),"Signed exponent 1. Input t to the power 2. Output t. Both cleared products are t to the power 15.");
        } else if (id === "crystalline-invariant-columns") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), defaultCrystallineColumns);
          assert.equal(await fig.getByRole("status").textContent(), "Scalar factor −1. The selected multiple goes from −2i to −2i. The product moves. The normalized column is fixed. Its selected multiple is fixed.");
        } else if (id === "integral-lattice-saturation") {
          assert.deepEqual(await fig.locator("tbody td").allTextContents(), ["(u−1, 0)", "No", "No", "0", "3", "No"]);
          assert.equal(await fig.locator('[role="status"]').textContent(), "The vector is outside the integral span. The matrix congruence has no solution.");
        } else if (id === "period-witness-compatibility") {
          assert.deepEqual(await fig.locator("tbody td").allTextContents(), ["3", "9", "t", "t", "189t3", "2295t4", "Yes", "Yes"]);
          assert.equal(await fig.locator('[role="status"]').textContent(), "Both witnesses give the same normalized class modulo t³.");
        } else if (id === "period-common-power") {
          assert.deepEqual(await fig.locator("tbody td").allTextContents(), ["(3, 5)", "(0, 2)", "(5, 3)", "(2, 0)"]);
          assert.deepEqual(await fig.locator(".metrics dd").allTextContents(), ["t3", "Divide by t3", "t2I"]);
          assert.equal(await fig.locator('[role="status"]').textContent(), "Height 4 to 1. Smallest target exponent 0. Both matrices are integral.");
        } else if (id === "translated-trace-precision") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["2", "0", "2", "2", "0", "2"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["Yes", "No"]);
          assert.equal(await fig.locator('[role="status"]').textContent(), "Trace residues modulo 4 are 2 and 2. X is outside 2M.");
        } else if (id === "square-torus-fixed-points") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["17", "(1 + 4i)/17", "1 + 4i"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1 + 4i", "16 − 4i"]);
          assert.equal(await fig.locator('[role="status"]').textContent(), "17 fixed points. Weight per point (1 + 4i)/17. Sum 1 + 4i.");
        } else if (id === "gaussian-quotient-marking") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["(1, 0)", "(1, 13)", "(0, 0)", "(1, 0)", "(1, 0)"]);
          assert.equal(await fig.locator(".metrics dd").innerText(), "Agrees");
          assert.equal(await fig.getByRole("status").textContent(), "Level-7 image (1, 0). Prescribed label recovered.");
        } else if (id === "ramified-residues") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["Holds", "32"]);
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["(η, 1 + η)", "(0, 0)", "(1, 0)", "(0, 1 + η)"]);
          assert.equal(await fig.getByRole("status").textContent(), "Hypothesis satisfied. 32 ordered pairs.");
        } else if (id === "polarized-graph") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["f₂", "[f₂]", "f₁", "[f₁]"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1 − 1 ≡ 0", "Yes"]);
          assert.equal(await fig.getByRole("status").textContent(), "Pairing coefficient 0 modulo 3. The plane is isotropic.");
        } else if (id === "ordinary-frobenius-coefficients") {
          const outputs = fig.locator("tbody tr td:last-child");
          assert.deepEqual(await outputs.allInnerTexts(), ["ωt", "ωε", "−ωt³"]);
          await fig.getByRole("combobox", {name: "Degree in t"}).selectOption("2");
          assert.deepEqual(await outputs.allInnerTexts(), ["ωt²", "0", "0"]);
          assert.equal(await fig.getByRole("status").textContent(), "Restriction 0. Cube 0.");
          await fig.locator("button.reset").click();
        } else if (id === "ordinary-torsion-reduction") {
          assert.equal(await fig.locator("tbody tr:last-child td:last-child").innerText(), "9");
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["3", "2"]);
          const status = fig.getByRole("status");
          assert.equal(await status.textContent(), "9 solutions in the test ring. Local length 3.");
          await fig.getByRole("combobox", {name: "Test ring order e"}).selectOption("1");
          assert.equal(await status.textContent(), "1 solution in the test ring. Local length 3.");
          await fig.locator("button.reset").click();
        } else if (id === "ordinary-line-cancellation") {
          assert.deepEqual(await fig.locator(".metrics dt").allInnerTexts(), ["Even weight at P₂", "Odd weight at P₂"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["3", "3"]);
        } else if (id === "clopen-branch-reduction") {
          assert.equal(await fig.locator("caption").innerText(), "Specialization of the two branches");
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1 − X/5", "No", "One double point"]);
        } else if (id === "weight-circle-spectrum") {
          assert.equal(await fig.locator("caption").innerText(), "Monomial coordinates of the selected vector");
          assert.deepEqual(await fig.locator("tbody tr td:first-of-type").allInnerTexts(), ["−1", "0", "1", "2"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["{−1, 0, 1, 2}", "2", "2"]);
        } else if (id === "rank-weight-projectors") {
          assert.equal(await fig.locator("caption").innerText(), "Projectors for D = diag(0, 1, 1, 4)");
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["3", "0 → 1", "2"]);
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["(1, 1, 1, 1)", "4"]);
        } else if (id === "polynomial-cut") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["5", "10", "1/5"]);
          assert.deepEqual(await fig.locator("tbody tr").first().locator("td").allInnerTexts(), ["0", "0"]);
        } else if (id === "satake-multiplicities") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["(0,3,0) or (1,1,1)", "No"]);
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["7", "6"]);
        } else if (id === "column-degree-defect") {
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["2", "1", "1"]);
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["0", "1", "−1"]);
        } else if (id === "frobenius-good-places") {
          assert.deepEqual(await fig.locator("tbody td").allInnerTexts(), ["Yes", "Yes", "61", "5", "3"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["1", "Witness"]);
        } else if (id === "casimir-cutoff") {
          assert.deepEqual(await fig.locator("tbody tr").nth(4).locator("td").allInnerTexts(), ["Yes", "Yes", "No"]);
          assert.deepEqual(await fig.locator("tbody tr").last().locator("td").allInnerTexts(), ["3/2", "0", "0"]);
          assert.deepEqual(await fig.locator(".metrics dd").allInnerTexts(), ["3/11", "97/110"]);
        } else if (id === "galois-character-peeling") {
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
    await openFigure(page, base + "book.html#fig-clopen-branch-reduction");
    const branches = page.locator("#fig-clopen-branch-reduction.ready");
    const previousViewport = page.viewportSize();
    await page.setViewportSize({width: 320, height: 844});
    for (const [model, cells, values] of [
      ["glued", ["0", "0", "5", "0"], ["1 − X/5", "No", "One double point"]],
      ["product", ["0", "0", "1", "1"], ["1 − X", "Yes", "Two reduced points"]],
    ]) {
      await branches.getByRole("combobox", {name: "Integral model", exact: true}).selectOption(model);
      assert.deepEqual(await branches.locator("tbody td").allInnerTexts(), cells);
      assert.deepEqual(await branches.locator(".metrics dd").allInnerTexts(), values);
      assert.ok(await branches.locator("table").evaluate(el =>
        el.getBoundingClientRect().right <= el.closest("figure").getBoundingClientRect().right + 1));
    }
    const branchLink = await branches.locator("[data-share]").getAttribute("href");
    await openFigure(page, branchLink);
    assert.equal(await branches.getByRole("combobox", {name: "Integral model", exact: true}).inputValue(), "product");
    assert.deepEqual(await branches.locator(".metrics dd").allInnerTexts(), ["1 − X", "Yes", "Two reduced points"]);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-ordinary-line-cancellation");
    const ordinary = page.locator("#fig-ordinary-line-cancellation.ready");
    for (const width of [320, 390]) {
      await page.setViewportSize({width, height: 844});
      await ordinary.getByRole("combobox", {name: "Field size Q"}).selectOption("5");
      for (const [rank, end, weights, counts] of [
        ["0", "P₀", "1", ["1", "1"]],
        ["1", "P₂", "5", ["5", "1"]],
        ["2", "P₁", "125", ["25", "1"]],
      ]) {
        await ordinary.getByRole("combobox", {name: "Dimension of U"}).selectOption(rank);
        assert.deepEqual(await ordinary.getByRole("row", {name: /^Number of lifts/}).locator("td").allInnerTexts(), counts);
        assert.deepEqual(await ordinary.getByRole("row", {name: /^Final point/}).locator("td").allInnerTexts(), [end, end]);
        assert.deepEqual(await ordinary.locator(".metrics dt").allInnerTexts(), ["Even weight at " + end, "Odd weight at " + end]);
        assert.deepEqual(await ordinary.locator(".metrics dd").allInnerTexts(), [weights, weights]);
        assert.ok(await ordinary.locator("table").evaluate(t =>
          t.getBoundingClientRect().right <= t.closest("figure").getBoundingClientRect().right + 1));
      }
    }
    await openFigure(page, await ordinary.locator("[data-share]").getAttribute("href"));
    assert.equal(await ordinary.getByRole("combobox", {name: "Field size Q"}).inputValue(), "5");
    assert.equal(await ordinary.getByRole("combobox", {name: "Dimension of U"}).inputValue(), "2");
    assert.deepEqual(await ordinary.locator(".metrics dd").allInnerTexts(), ["125", "125"]);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-filtered-lattice-modification");
    const modification=page.locator("#fig-filtered-lattice-modification.ready");
    for (const width of [320,390]) {
      await page.setViewportSize({width,height:844});
      for (const degrees of ["mixed","swapped","flat"]) {
        await modification.getByRole("combobox",{name:"Filtration degrees"}).selectOption(degrees);
        for (const height of [0,1,2,3]) {
          const depth=modification.getByRole("slider",{name:"Target depth N"});
          await depth.focus(); await depth.press("Home");
          for(let i=0;i<height;i++) await depth.press("ArrowRight");
          for (const rule of ["subtract","add"]) {
            await modification.getByRole("combobox",{name:"Exponent on column i of X"}).selectOption(rule);
            const status=await modification.locator('[role="status"]').textContent();
            const integral=degrees==="flat"||height>=2, deep=degrees==="flat"||rule==="subtract";
            assert.ok(status.endsWith("Integral modifiers: "+(integral?"yes.":"no.")+" Both depth bounds: "+(deep?"yes.":"no.")));
            assert.ok(await modification.locator("table").evaluateAll(ts=>ts.length===2&&ts.every(t=>t.getBoundingClientRect().right<=t.closest("figure").getBoundingClientRect().right+1)));
          }
        }
      }
    }
    const modificationLink=new URL(await modification.locator("[data-share]").getAttribute("href"));
    assert.equal(modificationLink.searchParams.get("filtered-lattice-modification.degrees"),"flat");
    await openFigure(page,modificationLink.href);
    assert.equal(await modification.getByRole("combobox",{name:"Exponent on column i of X"}).inputValue(),"add");
    await modification.getByRole("button",{name:"Reset"}).click();
    await assertModificationTable(modification);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-logarithm-zero");
    const logarithm = page.locator("#fig-logarithm-zero.ready");
    for (const width of [320,390]) {
      await page.setViewportSize({width,height:844});
      for(const a of [-1,0,1,2]) {
        await logarithm.getByRole("combobox",{name:"Translation parameter a"}).selectOption(String(a));
        for (const j of [1,2,3]) {
          await logarithm.getByRole("combobox",{name:"Column to inspect"}).selectOption(String(j));
          const matches = await logarithm.locator("tbody tr td:last-child").allTextContents();
          assert.deepEqual(matches,a===0?["Yes","Yes","Yes","Yes"]:j===1?["Yes","Yes","No","Yes"]:
            j===2?["Yes","No","No","Yes"]:["Yes","No","No","No"]);
          assert.ok((await logarithm.getByRole("status").textContent()).startsWith("Shift "+(2*a)+". Column "+j+" of the Galois transform is "));
          assert.ok(await logarithm.locator("table").evaluate(t=>t.getBoundingClientRect().right<=t.closest("figure").getBoundingClientRect().right+1));
        }
      }
    }
    const logarithmLink = new URL(await logarithm.locator("[data-share]").getAttribute("href"));
    assert.equal(logarithmLink.searchParams.get("logarithm-zero.translation"),"2");
    await openFigure(page,logarithmLink.href);
    assert.equal(await logarithm.locator("tbody tr").first().locator("td").first().textContent(),"(8, 4, −3)");
    await logarithm.getByRole("button",{name:"Reset"}).click();
    await assertLogarithmTable(logarithm);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-orbital-unipotent-fibre");
    const orbital=page.locator("#fig-orbital-unipotent-fibre.ready");
    const orbitalCases={
      units:[["0","0","0","K, −4"],["−1","−1","0","K, −4"],["−1/5","−1/5","−1","D, 1"],["−1/25","−1/25","−2","Outside the support, 0"]],
      split:[["0","0","−1","D, 1"],["24/125","24/25","−2","Outside the support, 0"],["24/625","24/125","−3","Outside the support, 0"],["24/3125","24/625","−4","Outside the support, 0"]],
    };
    const splitSupport=["Empty","0","0","(1/25)ℤ₅","1","25"];
    for(const width of [320,390]) {
      await page.setViewportSize({width,height:844});
      for(const slice of ["units","split"]){
        await orbital.getByRole("combobox",{name:"Diagonal matrix"}).selectOption(slice);
        for(const [index,coset] of ["zero","1","2","3"].entries()){
          await orbital.getByRole("combobox",{name:"Representative X modulo ℤ₅"}).selectOption(coset);
          assert.deepEqual(await orbital.locator("tbody td").allTextContents(),
            orbitalCases[slice][index].concat(slice==="units"?defaultOrbitalFibre.slice(4):splitSupport));
          const summary=await orbital.locator('[role="status"]').textContent();
          assert.ok(summary.includes("Image coordinate "+orbitalCases[slice][index][0]+"."));
          assert.ok(summary.endsWith(slice==="units"?"Fibre sum 0. Integral 0.":"Fibre sum 1. Integral 25."));
          assert.ok(await orbital.locator("table").evaluateAll(tables=>tables.length===2&&tables.every(t=>
            t.getBoundingClientRect().right<=t.closest("figure").getBoundingClientRect().right+1)));
        }
      }
    }
    const orbitalLink=new URL(await orbital.locator("[data-share]").getAttribute("href"));
    assert.equal(orbitalLink.searchParams.get("orbital-unipotent-fibre.slice"),"split");
    assert.equal(orbitalLink.searchParams.get("orbital-unipotent-fibre.coset"),"3");
    await openFigure(page,orbitalLink.href);
    assert.deepEqual(await orbital.locator("tbody td").allTextContents(),orbitalCases.split[3].concat(splitSupport));
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-signed-weil-operator");
    const signedWeil=page.locator("#fig-signed-weil-operator.ready");
    const signedCases=[
      ["n₂ = 0","t","n₁ = 2","t4","t17","t14","t3","t18","t18"],
      ["n₂ = 0","t","n₁ = 1","t2","t11","t10","t","t12","t12"],
      ["n₂ = 0","t","n₁ = 0","t","t8","t8","1","t9","t9"],
      defaultWeilOperator,
      ["n₂ = 2","t4","n₁ = 0","t","t23","t26","1/t3","t27","t27"],
    ];
    for(const width of [320,390]) {
      await page.setViewportSize({width,height:844});
      const slider=signedWeil.getByRole("slider",{name:"Signed exponent α"});
      await slider.press("Home");
      for(const [index,cells] of signedCases.entries()){
        if(index) await slider.press("ArrowRight");
        assert.deepEqual(await signedWeil.locator("tbody td").allTextContents(),cells);
        assert.ok((await signedWeil.locator('[role="status"]').textContent()).startsWith("Signed exponent " + (index-2) + "."));
        assert.ok(await signedWeil.locator("table").evaluateAll(tables=>tables.length===2 && tables.every(t=>
          t.getBoundingClientRect().right<=t.closest("figure").getBoundingClientRect().right+1)));
      }
      assert.ok(await signedWeil.locator("th var").evaluateAll(vars=>vars.length>0&&vars.every(v=>getComputedStyle(v).fontWeight==="400")));
    }
    const weilLink=new URL(await signedWeil.locator("[data-share]").getAttribute("href"));
    assert.equal(weilLink.searchParams.get("signed-weil-operator.degree"),"2");
    await openFigure(page,weilLink.href);
    assert.deepEqual(await signedWeil.locator("tbody td").allTextContents(),signedCases[4]);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-crystalline-invariant-columns");
    const crystalline = page.locator("#fig-crystalline-invariant-columns.ready");
    for (const width of [320, 390]) {
      await page.setViewportSize({width, height:844});
      for (const [scalar,factor,product,image] of [["one","1","−2i","−2i"],["i","−1","2","−2"],["sum","−i","2 − 2i","−2 − 2i"]]) {
        await crystalline.getByRole("combobox", {name:"Frame scalar w"}).selectOption(scalar);
        for (const [coefficient,multiple,acted] of [["one","−2i","−2i"],["two","−4i","−4i"],["i","2","−2"],["sum","2 − 2i","−2 − 2i"]]) {
          await crystalline.getByRole("combobox", {name:"Column coefficient a"}).selectOption(coefficient);
          assert.deepEqual(await crystalline.locator("tbody td").allInnerTexts(), [product,image,"−2i","−2i",multiple,acted]);
          assert.equal(await crystalline.getByRole("status").textContent(),
            "Scalar factor " + factor + ". The selected multiple goes from " + multiple + " to " + acted + ". " +
            await crystalline.locator("[data-result] p").last().textContent());
          assert.ok(await crystalline.locator("table").evaluate(el =>
            el.getBoundingClientRect().right <= el.closest("figure").getBoundingClientRect().right + 1));
        }
      }
      assert.ok(await crystalline.locator("th var").evaluateAll(vars => vars.length === 3 && vars.every(el => getComputedStyle(el).fontWeight === "400")));
    }
    const columnLink = new URL(await crystalline.locator("[data-share]").getAttribute("href"));
    for (const key of ["scalar","coefficient"]) assert.equal(columnLink.searchParams.get("crystalline-invariant-columns." + key),"sum");
    await openFigure(page,columnLink.href);
    assert.deepEqual(await crystalline.locator("tbody td").allInnerTexts(), ["2 − 2i","−2 − 2i","−2i","−2i","2 − 2i","−2 − 2i"]);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-integral-lattice-saturation");
    const saturation = page.locator("#fig-integral-lattice-saturation.ready");
    for (const width of [320, 390]) {
      await page.setViewportSize({width, height:844});
      const cases = [
        [0,"e1",0,3,["(1, 0)","Yes","Yes","Every residue","1","Yes, G = I"]],
        [2,"ue1",1,2,["(u−1, 0)","No","No","0","3","No"]],
        [2,"u2e1",2,2,["(1, 0)","Yes","No","0","0","Yes, G = 0"]],
        [1,"e2",2,3,["(0, 1)","Yes","No","0","9","No"]],
      ];
      for (const [power, vector, loss, precision, cells] of cases) {
        await saturation.evaluate((el, values) => {
          for (const [key, value] of Object.entries(values)) {
            const field = el.querySelector('[name="' + key + '"]');
            field.value = String(value); field.dispatchEvent(new Event("input", {bubbles:true}));
          }
        }, {power, vector, loss, precision});
        assert.deepEqual(await saturation.locator("tbody td").allTextContents(), cells);
        assert.ok(await saturation.locator("table").evaluateAll(tables => tables.every(table =>
          table.getBoundingClientRect().right <= table.closest("figure").getBoundingClientRect().right + 1)));
      }
    }
    const satLink = new URL(await saturation.locator("[data-share]").getAttribute("href"));
    for (const [key, value] of Object.entries({vector:"e2", loss:"2", precision:"3"})) {
      assert.equal(satLink.searchParams.get("integral-lattice-saturation." + key), value);
    }
    await openFigure(page, satLink.href);
    assert.deepEqual(await saturation.locator("tbody td").allTextContents(), ["(0, 1)","Yes","No","0","9","No"]);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-period-witness-compatibility");
    const witnesses = page.locator("#fig-period-witness-compatibility.ready");
    for (const width of [320, 390]) {
      await page.setViewportSize({width, height:844});
      for (const w of [4, -1]) {
        await witnesses.getByRole("combobox", {name:"Action on t"}).selectOption(String(w));
        for (let degree = 2; degree <= 4; degree++) for (let scale = 0; scale <= 3; scale++) {
          await witnesses.evaluate((el, values) => {
            for (const [key, value] of Object.entries(values)) {
              const slider = el.querySelector('input[name="' + key + '"]');
              slider.value = String(value); slider.dispatchEvent(new Event("input", {bubbles:true}));
            }
          }, {degree, scale});
          const cols = await witnesses.locator("tbody td").allTextContents();
          assert.equal(cols[1], String(3 ** scale));
          assert.equal(cols[3], degree === 2 ? "t + t2" : "t");
          assert.equal(cols[7], degree === 4 || (w === -1 && degree === 2) ? "Yes" : "No");
          assert.equal(await witnesses.locator('[role="status"]').textContent(), await witnesses.locator("[data-result] p").textContent());
          assert.ok(await witnesses.locator("table").evaluate(el =>
            el.getBoundingClientRect().right <= el.closest("figure").getBoundingClientRect().right + 1));
          assert.ok(await witnesses.locator("thead th").evaluateAll(headers => headers.every(th => {
            const label = document.createRange(); label.selectNodeContents(th);
            return label.getClientRects().length === 1;
          })));
        }
      }
    }
    await witnesses.locator('input[name="degree"]').press("Home");
    const witnessLink = new URL(await witnesses.locator("[data-share]").getAttribute("href"));
    for (const [key, value] of Object.entries({tangent:"-1", degree:"2", scale:"3"})) {
      assert.equal(witnessLink.searchParams.get("period-witness-compatibility." + key), value);
    }
    await openFigure(page, witnessLink.href);
    assert.deepEqual(await witnesses.locator("tbody td").allTextContents(), ["3","27","t","t + t2","−6t3","0","Yes","Yes"]);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-period-common-power");
    const commonPower = page.locator("#fig-period-common-power.ready");
    for (const width of [320, 390]) {
      await page.setViewportSize({width, height: 844});
      for (const [layer, h1, h2] of [["opposite", -1, 1], ["upper", 0, 1], ["flat", 0, 0]]) {
        await commonPower.getByRole("combobox", {name: "Starting height and jumps"}).selectOption(layer);
        for (let h = 0; h <= 4; h++) {
          await commonPower.getByRole("slider", {name: "Target height H"}).evaluate((el, value) => {
            el.value = String(value); el.dispatchEvent(new Event("input", {bubbles: true}));
          }, h);
          const cells = await commonPower.locator("tbody td:last-child").allTextContents();
          const pair = (x, y) => ("(" + x + ", " + y + ")").replaceAll("-", "−");
          assert.deepEqual(cells, [pair(h + h1, h + h2), pair(h - h1, h - h2)]);
          const status = await commonPower.locator('[role="status"]').textContent();
          assert.equal(status.includes("has a pole"), h < Math.max(Math.abs(h1), Math.abs(h2)));
          assert.ok(await commonPower.locator("table").evaluate(el =>
            el.getBoundingClientRect().right <= el.closest("figure").getBoundingClientRect().right + 1));
          assert.ok(await commonPower.locator("table var, .metrics var").evaluateAll(nodes =>
            nodes.every(n => getComputedStyle(n).fontWeight === "400")));
        }
      }
    }
    const commonLink = new URL(await commonPower.locator("[data-share]").getAttribute("href"));
    assert.equal(commonLink.searchParams.get("period-common-power.layer"), "flat");
    assert.equal(commonLink.searchParams.get("period-common-power.target"), "4");
    await openFigure(page, commonLink.href);
    assert.deepEqual(await commonPower.locator(".metrics dd").allTextContents(), ["t2", "Multiply by t2", "t8I"]);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-translated-trace-precision");
    const precision = page.locator("#fig-translated-trace-precision.ready");
    for (const width of [320, 390]) {
      await page.setViewportSize({width, height: 844});
      for (const [n, a, b, cells, answers] of [
        [1, 1, 1, ["2", "0", "2", "2", "0", "2"], ["Yes", "No"]],
        [1, 0, 1, ["0", "0", "0", "2", "0", "2"], ["No", "No"]],
        [2, -2, 2, ["−4", "0", "4", "4", "0", "4"], ["Yes", "No"]],
        [0, -1, 0, ["−2", "0", "0", "0", "0", "0"], ["Yes", "Yes"]],
        [3, 8, -8, ["16", "0", "0", "−16", "0", "0"], ["Yes", "Yes"]],
      ]) {
        for (const [key, value] of Object.entries({n, a, b}))
          await precision.locator('input[name="' + key + '"]').evaluate((el, value) => {
            el.value = String(value); el.dispatchEvent(new Event("input", {bubbles: true}));
          }, value);
        assert.deepEqual(await precision.locator("tbody td").allInnerTexts(), cells);
        assert.deepEqual(await precision.locator(".metrics dd").allInnerTexts(), answers);
        assert.ok(await precision.locator("table").evaluate(el =>
          el.getBoundingClientRect().right <= el.closest("figure").getBoundingClientRect().right + 1));
      }
    }
    const precisionLink = new URL(await precision.locator("[data-share]").getAttribute("href"));
    for (const [key, value] of Object.entries({n: "3", a: "8", b: "-8"}))
      assert.equal(precisionLink.searchParams.get("translated-trace-precision." + key), value);
    await openFigure(page, precisionLink.href);
    assert.deepEqual(await precision.locator(".metrics dd").allInnerTexts(), ["Yes", "Yes"]);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-square-torus-fixed-points");
    const torus = page.locator("#fig-square-torus-fixed-points.ready");
    for (const width of [320, 390]) {
      await page.setViewportSize({width, height: 844});
      for (const [a, b, y, expected] of [
        [0, 4, "0", ["17", "(1 + 4i)/17", "1 + 4i"]],
        [0, -1, "0", ["2", "(1 − i)/2", "1 − i"]],
        [1, 0, "1", ["All of E", "Undefined", "Undefined"]],
        [0, 0, "0", ["1", "1", "1"]],
        [4, 0, "0", ["9", "−1/3", "−3"]],
        [4, 0, "1", ["9", "1", "9"]],
      ]) {
        for (const [key, value] of Object.entries({real: a, imag: b}))
          await torus.locator('input[name="' + key + '"]').evaluate((el, value) => {
            el.value = String(value); el.dispatchEvent(new Event("input", {bubbles: true}));
          }, value);
        await torus.locator('select[name="y"]').selectOption(y);
        assert.deepEqual(await torus.locator("tbody td").allInnerTexts(), expected);
        assert.ok(await torus.locator("table").evaluate(el =>
          el.getBoundingClientRect().right <= el.closest("figure").getBoundingClientRect().right + 1));
      }
    }
    const torusLink = new URL(await torus.locator("[data-share]").getAttribute("href"));
    for (const [key, value] of Object.entries({real: "4", imag: "0", y: "1"}))
      assert.equal(torusLink.searchParams.get("square-torus-fixed-points." + key), value);
    await openFigure(page, torusLink.href);
    assert.deepEqual(await torus.locator("tbody td").allInnerTexts(), ["9", "1", "9"]);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-gaussian-quotient-marking");
    const gaussian = page.locator("#fig-gaussian-quotient-marking.ready");
    for (const width of [320, 390]) {
      await page.setViewportSize({width, height: 844});
      for (const [u, v, factor, shift, point, change, target, agrees] of [
        ["1", "0", "F", "zero", "(1, 13)", "(0, 0)", "(1, 0)", "Agrees"],
        ["1", "0", "F", "one", "(8, 6)", "(7, 7)", "(1, 0)", "Agrees"],
        ["0", "0", "h", "i", "(7, 7)", "(7, 7)", "(0, 0)", "Agrees"],
        ["0", "1", "h", "both", "(13, 1)", "(0, 0)", "(6, 0)", "Differs"],
      ]) {
        for (const [name, value] of Object.entries({u, v, factor, shift}))
          await gaussian.locator('select[name="' + name + '"]').selectOption(value);
        assert.deepEqual((await gaussian.locator("tbody td").allInnerTexts()).slice(1, 4), [point, change, target]);
        assert.equal(await gaussian.locator(".metrics dd").innerText(), agrees);
        assert.ok(await gaussian.locator("table").evaluate(el =>
          el.getBoundingClientRect().right <= el.closest("figure").getBoundingClientRect().right + 1));
      }
    }
    const gaussianLink = new URL(await gaussian.locator("[data-share]").getAttribute("href"));
    for (const [key, value] of Object.entries({u: "0", v: "1", factor: "h", shift: "both"}))
      assert.equal(gaussianLink.searchParams.get("gaussian-quotient-marking." + key), value);
    await openFigure(page, gaussianLink.href);
    assert.equal(await gaussian.locator(".metrics dd").innerText(), "Differs");
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-ramified-residues");
    const ramified = page.locator("#fig-ramified-residues.ready");
    for (const width of [320, 390]) {
      await page.setViewportSize({width, height: 844});
      for (const [first, second, relation, cells, values] of [
        ["eta", "sum", "split", ["(η, 1 + η)", "(0, 0)", "(1, 0)", "(0, 1 + η)"], ["Holds", "32"]],
        ["1", "sum", "split", ["(1, 1 + η)", "(η, 0)", "None", "None"], ["Fails", "0"]],
        ["eta", "0", "generate", ["(η, 0)", "0", "(1, 0)"], ["Holds", "8"]],
        ["sum", "1", "project", ["(1 + η, 1)", "(η, 0)", "None"], ["Fails", "0"]],
        ["0", "1", "project", ["(0, 1)", "(0, 0)", "(0, 0)"], ["Holds", "8"]],
      ]) {
        await ramified.getByRole("combobox", {name: "Coordinate at 𝔴", exact: true}).selectOption(first);
        await ramified.getByRole("combobox", {name: "Coordinate at 𝔳", exact: true}).selectOption(second);
        await ramified.getByRole("combobox", {name: "Equation", exact: true}).selectOption(relation);
        assert.deepEqual(await ramified.locator("tbody td").allInnerTexts(), cells);
        assert.deepEqual(await ramified.locator(".metrics dd").allInnerTexts(), values);
        assert.ok(await ramified.locator("table").evaluate(t => t.getBoundingClientRect().right <= t.closest("figure").getBoundingClientRect().right + 1));
      }
    }
    const ramifiedLink = new URL(await ramified.locator("[data-share]").getAttribute("href"));
    for (const [key, expected] of [["first", "0"], ["second", "1"], ["relation", "project"]])
      assert.equal(ramifiedLink.searchParams.get("ramified-residues." + key), expected);
    await openFigure(page, ramifiedLink.href);
    assert.deepEqual(await ramified.locator(".metrics dd").allInnerTexts(), ["Holds", "8"]);
    assert.deepEqual(await ramified.locator("tbody td").allInnerTexts(), ["(0, 1)", "(0, 0)", "(0, 0)"]);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-polarized-graph");
    const plane = page.locator("#fig-polarized-graph.ready");
    await plane.getByRole("combobox", {name: "Direction (a, b)", exact: true}).selectOption("opposite");
    await plane.getByRole("combobox", {name: "Lift of e₁", exact: true}).selectOption("unit");
    for (const [width, characteristic, residue, second, answer] of [[320, "2", "0", "f₁", "Yes"], [390, "5", "3", "−f₁", "No"]]) {
      await page.setViewportSize({width, height: 844});
      await plane.getByRole("combobox", {name: "Characteristic", exact: true}).selectOption(characteristic);
      assert.deepEqual(await plane.locator("tbody td").allInnerTexts(), ["e₁ + f₂", "[f₂]", second, "[" + second + "]"]);
      assert.deepEqual(await plane.locator(".metrics dd").allInnerTexts(), ["−1 − 1 ≡ " + residue, answer]);
      assert.ok(await plane.locator("table").evaluate(t => t.getBoundingClientRect().right <= t.closest("figure").getBoundingClientRect().right + 1));
    }
    const planeLink = new URL(await plane.locator("[data-share]").getAttribute("href"));
    for (const [key, value] of [["prime", "5"], ["direction", "opposite"], ["lift", "unit"]])
      assert.equal(planeLink.searchParams.get("polarized-graph." + key), value);
    await openFigure(page, planeLink.href);
    assert.deepEqual(await plane.locator("tbody td").allInnerTexts(), ["e₁ + f₂", "[f₂]", "−f₁", "[−f₁]"]);
    assert.deepEqual(await plane.locator(".metrics dd").allInnerTexts(), ["−1 − 1 ≡ 3", "No"]);
    await page.setViewportSize(previousViewport);
    await openFigure(page, base + "book.html#fig-hecke-four-point-approximation");
    const fourPoint = page.locator("#fig-hecke-four-point-approximation.ready");
    await fourPoint.getByRole("combobox", {name: "Function in P"}).selectOption("combination");
    const fourPointLink = await fourPoint.locator("[data-share]").getAttribute("href");
    assert.equal(new URL(fourPointLink).searchParams.get("hecke-four-point-approximation.witness"), "combination");
    await openFigure(page, fourPointLink);
    assert.equal(await fourPoint.getByRole("combobox", {name: "Function in P"}).inputValue(), "combination");
    assert.deepEqual(await fourPoint.locator(".metrics dd").allInnerTexts(), ["1/2", "1/√2", "Strictly smaller"]);
    assert.deepEqual(await fourPoint.locator("tbody tr").first().locator("td").allInnerTexts(), ["1", "0", "0"]);
    await openFigure(page, base + "book.html#fig-weight-circle-spectrum");
    const spectrum = page.locator("#fig-weight-circle-spectrum.ready");
    for (const circle of ["t1", "t2"]) {
      await spectrum.getByRole("combobox", {name: "Circle", exact: true}).selectOption(circle);
      for (const [vector, support] of [["highest", "{2}"], ["sum", "{−1, 0, 1, 2}"], ["lowest", "{−1}"]]) {
        await spectrum.getByRole("combobox", {name: "Vector", exact: true}).selectOption(vector);
        const bound = circle === "t1" ? "2" : "1";
        assert.deepEqual(await spectrum.locator(".metrics dd").allInnerTexts(), [circle === "t1" ? support : "{1}", bound, bound]);
        const coefficients = {highest: ["0", "0", "0", "1"], sum: ["1", "1", "1", "1"], lowest: ["1", "0", "0", "0"]};
        assert.deepEqual(await spectrum.locator("tbody tr td:last-child").allInnerTexts(), coefficients[vector]);
      }
    }
    const spectrumLink = await spectrum.locator("[data-share]").getAttribute("href");
    await openFigure(page, spectrumLink);
    assert.equal(await spectrum.getByRole("combobox", {name: "Vector", exact: true}).inputValue(), "lowest");
    assert.equal(await spectrum.getByRole("combobox", {name: "Circle", exact: true}).inputValue(), "t2");
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
    await assertVectorWeights(page);
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
    await assertRenderedFont(fontSession, "math mi", "LatinModernMath-Regular");
    await assertRenderedFont(fontSession, "#lifts-rank-root-spaces + p", "CriticalLineMathScripts-Regular");
    assert.equal(await page.locator("h4 i").first().evaluate(el => getComputedStyle(el).fontWeight), "400");
    for (const [heading, symbol] of [
      [page.locator("strong").filter({hasText: "The model at an allowed weight"}), "ν"],
      [page.locator("#normalization-signed-branching-lambda-step"), "λ"],
    ]) {
      const vector = heading.locator("i, var");
      assert.equal(await vector.textContent(), symbol);
      assert.equal(await vector.evaluate(el => getComputedStyle(el).fontWeight), "400");
    }
    const summaryVariables = page.locator("summary i, summary var");
    assert.ok(await summaryVariables.count() > 0);
    assert.ok(await summaryVariables.evaluateAll(nodes => nodes.every(node => getComputedStyle(node).fontWeight === "400")));
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
              getComputedStyle(el).fontFamily.startsWith('"Latin Modern Roman"'),
            ),
          file,
        );
        if (width === 1360) await assertRenderedFont(fontSession, "main h1", "LMRoman10-Regular");
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
    await page.evaluate(() => document.fonts.ready);
    await assertRenderedFont(fontSession, "math mi", "LatinModernMath-Regular");
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
    assert.deepEqual(await page.locator("#fig-casimir-cutoff .metrics dd").allInnerTexts(), ["3/11", "97/110"]);
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
    assert.deepEqual(await page.locator("#fig-ordinary-line-cancellation .metrics dd").allInnerTexts(), ["3", "3"]);
    assert.deepEqual(await page.locator("#fig-crystalline-invariant-columns tbody td").allInnerTexts(), defaultCrystallineColumns);
    assert.deepEqual(await page.locator("#fig-signed-weil-operator tbody td").allTextContents(),defaultWeilOperator);
    assert.deepEqual(await page.locator("#fig-orbital-unipotent-fibre tbody td").allTextContents(),defaultOrbitalFibre);
    await assertLogarithmTable(page.locator("#fig-logarithm-zero"));
    await assertModificationTable(page.locator("#fig-filtered-lattice-modification"));
    await assertVectorWeights(page);
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
    const staticBranches = plain.locator("#fig-clopen-branch-reduction");
    await assertVectorWeights(plain);
    const staticCrystalline = plain.locator("#fig-crystalline-invariant-columns");
    assert.deepEqual(await plain.locator("#fig-signed-weil-operator tbody td").allTextContents(),defaultWeilOperator);
    assert.deepEqual(await plain.locator("#fig-orbital-unipotent-fibre tbody td").allTextContents(),defaultOrbitalFibre);
    await assertLogarithmTable(plain.locator("#fig-logarithm-zero"));
    await assertModificationTable(plain.locator("#fig-filtered-lattice-modification"));
    assert.deepEqual(await staticCrystalline.locator("tbody td").allInnerTexts(), defaultCrystallineColumns);
    assert.ok(await staticCrystalline.locator("th var").evaluateAll(vars => vars.length === 3 && vars.every(el => getComputedStyle(el).fontWeight === "400")));
    const staticSaturation = plain.locator("#fig-integral-lattice-saturation");
    assert.deepEqual(await staticSaturation.locator("tbody td").allTextContents(), ["(u−1, 0)","No","No","0","3","No"]);
    const staticWitnesses = plain.locator("#fig-period-witness-compatibility");
    assert.deepEqual(await staticWitnesses.locator("tbody td").allTextContents(), ["3","9","t","t","189t3","2295t4","Yes","Yes"]);
    const staticPower = plain.locator("#fig-period-common-power");
    assert.deepEqual(await staticPower.locator("tbody td").allTextContents(), ["(3, 5)", "(0, 2)", "(5, 3)", "(2, 0)"]);
    assert.deepEqual(await staticPower.locator(".metrics dd").allTextContents(), ["t3", "Divide by t3", "t2I"]);
    const staticPrecision = plain.locator("#fig-translated-trace-precision");
    assert.deepEqual(await staticPrecision.locator("tbody td").allInnerTexts(), ["2", "0", "2", "2", "0", "2"]);
    assert.deepEqual(await staticPrecision.locator(".metrics dd").allInnerTexts(), ["Yes", "No"]);
    const staticTorus = plain.locator("#fig-square-torus-fixed-points");
    assert.deepEqual(await staticTorus.locator("tbody td").allInnerTexts(), ["17", "(1 + 4i)/17", "1 + 4i"]);
    assert.deepEqual(await staticTorus.locator(".metrics dd").allInnerTexts(), ["1 + 4i", "16 − 4i"]);
    const staticGaussian = plain.locator("#fig-gaussian-quotient-marking");
    assert.deepEqual(await staticGaussian.locator("tbody td").allInnerTexts(), ["(1, 0)", "(1, 13)", "(0, 0)", "(1, 0)", "(1, 0)"]);
    assert.equal(await staticGaussian.locator(".metrics dd").innerText(), "Agrees");
    const staticRamified = plain.locator("#fig-ramified-residues");
    assert.deepEqual(await staticRamified.locator("tbody td").allInnerTexts(), ["(η, 1 + η)", "(0, 0)", "(1, 0)", "(0, 1 + η)"]);
    assert.deepEqual(await staticRamified.locator(".metrics dd").allInnerTexts(), ["Holds", "32"]);
    assert.equal(await staticRamified.locator("tbody var").first().evaluate(el => getComputedStyle(el).fontWeight), "400");
    const staticPlane = plain.locator("#fig-polarized-graph");
    assert.deepEqual(await staticPlane.locator("tbody td").allInnerTexts(), ["f₂", "[f₂]", "f₁", "[f₁]"]);
    assert.deepEqual(await staticPlane.locator(".metrics dd").allInnerTexts(), ["1 − 1 ≡ 0", "Yes"]);
    assert.equal(await staticPlane.locator("tbody var").first().evaluate(el => getComputedStyle(el).fontWeight), "400");
    assert.deepEqual(await plain.locator("#fig-ordinary-frobenius-coefficients tbody tr td:last-child").allInnerTexts(), ["ωt", "ωε", "−ωt³"]);
    const staticTorsion = plain.locator("#fig-ordinary-torsion-reduction");
    assert.deepEqual(await staticTorsion.locator("tbody tr td:last-child").allInnerTexts(), ["3", "1", "9"]);
    const staticOrdinary = plain.locator("#fig-ordinary-line-cancellation");
    assert.deepEqual(await staticOrdinary.getByRole("row", {name: /^Final point/}).locator("td").allInnerTexts(), ["P₂", "P₂"]);
    assert.deepEqual(await staticOrdinary.locator(".metrics dd").allInnerTexts(), ["3", "3"]);
    assert.equal(await staticBranches.locator("caption").innerText(), "Specialization of the two branches");
    assert.deepEqual(await staticBranches.locator("tbody td").allInnerTexts(), ["0", "0", "5", "0"]);
    assert.deepEqual(await staticBranches.locator(".metrics dd").allInnerTexts(), ["1 − X/5", "No", "One double point"]);
    const staticPlaces = plain.locator("#fig-quadratic-place-restrictions");
    assert.deepEqual(await staticPlaces.locator("tbody tr").last().locator("td").allInnerTexts(), ["15", "4", "6"]);
    const staticSpectrum = plain.locator("#fig-weight-circle-spectrum");
    assert.deepEqual(await staticSpectrum.locator("tbody tr td:first-of-type").allInnerTexts(), ["−1", "0", "1", "2"]);
    assert.deepEqual(await staticSpectrum.locator(".metrics dd").allInnerTexts(), ["{−1, 0, 1, 2}", "2", "2"]);
    assert.equal(await staticSpectrum.locator("tbody var").first().evaluate(el => getComputedStyle(el).fontWeight), "400");
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
    const staticFigureIds = await plain.locator("[data-lab]")
      .filter({ has: plain.locator("[data-result] svg[aria-label], [data-result] table:has(caption)") })
      .evaluateAll(figures => figures.map(figure => figure.dataset.lab));
    assert.deepEqual(staticFigureIds, ids);
    assert.equal(await plain.locator("[data-controls]:visible").count(), 0);
    assert.deepEqual(await plain.locator("#fig-casimir-cutoff tbody tr").last().locator("td").allInnerTexts(), ["3/2", "0", "0"]);
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
