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
    const mode = page.locator("#source-mode");
    const sourceTitle = page.locator(".source-citation .source-title").first();
    assert.equal(await sourceTitle.isVisible(), false);
    await mode.press("Enter");
    assert.equal(await sourceTitle.isVisible(), true);
    assert.equal(await mode.getAttribute("aria-pressed"), "true");
    await mode.press("Enter");
    assert.equal(await sourceTitle.isVisible(), false);
    const firstNote = page.locator(".source-citation .refno a").first();
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
        if (id === "rank-grid") {
          assert.equal(await fig.locator("table caption").innerText(), "Basis vector at (2, 3)");
        } else {
          assert.ok(await fig.locator("svg").getAttribute("aria-label"));
        }
        if (width === 390)
          await fig.screenshot({ path: path.join(output, id + ".png") });
      }
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        "book overflows " + width,
      );
    }
    await page.goto(base + "book.html?ramp.x=30&ramp.chi=four#fig-ramp");
    await page.locator("#fig-ramp.ready").waitFor();
    assert.equal(await page.locator("#field-ramp-x").inputValue(), "30");
    assert.equal(await page.locator("#field-ramp-chi").inputValue(), "four");
    await page.goto(base + "book.html?rank-grid.row=4&rank-grid.column=2#fig-rank-grid");
    const grid = page.locator("#fig-rank-grid.ready table");
    assert.equal(await grid.locator("caption").innerText(), "Basis vector at (4, 2)");
    const selectedRow = grid.getByRole("rowheader", { name: "4", exact: true }).locator("..");
    assert.deepEqual(await selectedRow.locator("td").allInnerTexts(), ["+1", "0", "0", "−1", "0"]);
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
    assert.equal(await page.locator(".site-header").isVisible(), false);
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
    assert.equal(await plain.locator("#source-mode").isVisible(), false);
    assert.ok(await plain.locator(".source-citation .source-title").first().isVisible());
    assert.equal(await plain.locator(".desktop-nav").isVisible(), true);
    assert.equal(await plain.locator("[data-result] svg[aria-label], [data-result] table:has(caption)").count(), ids.length);
    assert.equal(await plain.locator("[data-controls]:visible").count(), 0);
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
