"use strict";
// Zero-dependency A4 PDF compiler for print.html via Chrome/Chromium DevTools Protocol.
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const outPath = path.resolve(
  process.argv[2] || path.join(root, ".v1-staging", "the-critical-line-working-edition-2026-11-22.pdf"),
);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function findBrowser() {
  const candidates = [
    process.env.CHROME_BIN,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error("No Chrome/Chromium/Edge binary found for PDF compilation.");
}

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const clean = decodeURIComponent((req.url || "/").split("?")[0]);
      const rel = clean === "/" ? "index.html" : clean.replace(/^\/+/, "");
      const file = path.resolve(root, rel);
      if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
      });
      fs.createReadStream(file).pipe(res);
    });
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

async function main() {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const browserBin = findBrowser();
  const server = await startStaticServer();
  const { port } = server.address();
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "critical-line-pdf-"));

  const proc = spawn(
    browserBin,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--remote-debugging-port=0",
      "--user-data-dir=" + profileDir,
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );

  try {
    const wsUrl = await new Promise((resolve, reject) => {
      let stderr = "";
      const timer = setTimeout(() => reject(new Error("Timed out waiting for Chrome DevTools endpoint: " + stderr)), 20000);
      proc.stderr.setEncoding("utf8");
      proc.stderr.on("data", chunk => {
        stderr += chunk;
        const m = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (m) {
          clearTimeout(timer);
          resolve(m[1]);
        }
      });
      proc.on("exit", code => {
        clearTimeout(timer);
        reject(new Error("Browser exited early with code " + code + ": " + stderr));
      });
    });

    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.addEventListener("open", res, { once: true });
      ws.addEventListener("error", rej, { once: true });
    });

    let nextId = 1;
    const pending = new Map();
    const waitEvent = new Map();
    ws.addEventListener("message", ev => {
      const msg = JSON.parse(String(ev.data));
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method && waitEvent.has(msg.method)) {
        const list = waitEvent.get(msg.method);
        waitEvent.delete(msg.method);
        list.forEach(fn => fn(msg.params));
      }
    });

    const call = (method, params = {}, sessionId) =>
      new Promise((resolve, reject) => {
        const id = nextId++;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
      });
    const once = method =>
      new Promise(resolve => {
        if (!waitEvent.has(method)) waitEvent.set(method, []);
        waitEvent.get(method).push(resolve);
      });

    const { targetInfos } = await call("Target.getTargets");
    const pageTarget = targetInfos.find(t => t.type === "page") || (await call("Target.createTarget", { url: "about:blank" }));
    const targetId = pageTarget.targetId;
    const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });

    await call("Page.enable", {}, sessionId);
    await call("Runtime.enable", {}, sessionId);
    await call("Emulation.setEmulatedMedia", { media: "print" }, sessionId);

    const loaded = once("Page.loadEventFired");
    await call("Page.navigate", { url: `http://127.0.0.1:${port}/print.html` }, sessionId);
    await loaded;
    await call(
      "Runtime.evaluate",
      { expression: "document.fonts.ready.then(() => true)", awaitPromise: true },
      sessionId,
    );

    const { stream } = await call(
      "Page.printToPDF",
      {
        printBackground: true,
        preferCSSPageSize: true,
        paperWidth: 8.27,
        paperHeight: 11.69,
        transferMode: "ReturnAsStream",
      },
      sessionId,
    );

    const out = fs.createWriteStream(outPath);
    while (true) {
      const chunk = await call("IO.read", { handle: stream, size: 1024 * 1024 }, sessionId);
      const buf = chunk.base64Encoded ? Buffer.from(chunk.data, "base64") : Buffer.from(chunk.data, "utf8");
      if (buf.length) out.write(buf);
      if (chunk.eof) break;
    }
    await call("IO.close", { handle: stream }, sessionId);
    await new Promise(res => out.end(res));
    ws.close();

    const sizeMb = (fs.statSync(outPath).size / (1024 * 1024)).toFixed(2);
    console.log(`Compiled ${outPath} (${sizeMb} MB)`);
  } finally {
    proc.kill();
    server.close();
    try {
      fs.rmSync(profileDir, { recursive: true, force: true });
    } catch {}
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
