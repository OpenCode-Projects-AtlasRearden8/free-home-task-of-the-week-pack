#!/usr/bin/env node
/**
 * Build script: renders each src/*.html sheet to an unbranded letter-size
 * PDF in printables/ using headless Chrome. Fully offline; CSS is local.
 */
import { spawnSync } from "node:child_process";
import { readdirSync, mkdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const srcDir = join(root, "src");
const outDir = join(root, "printables");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  process.env.CHROME,
  "google-chrome",
  "chromium-browser",
  "chromium",
].filter(Boolean);

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    const probe = spawnSync(candidate, ["--version"], { timeout: 10_000 });
    if (probe.status === 0) return candidate;
  }
  return null;
}

function collectHtml() {
  return readdirSync(srcDir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => join(srcDir, f))
    .sort();
}

function outPathFor(htmlPath) {
  const name = htmlPath.replace(/^.*\//, "").replace(/\.html$/i, "");
  return join(outDir, `${name}.pdf`);
}

const extraFlags = process.platform === "linux" && typeof process.getuid === "function" && process.getuid() === 0
  ? ["--no-sandbox", "--disable-setuid-sandbox"]
  : ["--disable-gpu"];

let failed = false;

const chrome = findChrome();
if (!chrome) {
  console.error("build: no Chrome/Chromium found (set CHROME_PATH to override).");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const pages = collectHtml();
if (pages.length === 0) {
  console.error("build: no .html sheets found in src/");
  process.exit(1);
}

for (const htmlPath of pages) {
  const out = outPathFor(htmlPath);
  const args = [
    "--headless=new",
    "--disable-dev-shm-usage",
    ...extraFlags,
    "--no-pdf-header-footer",
    "--virtual-time-budget=3000",
    `--print-to-pdf=${out}`,
    pathToFileURL(htmlPath).href,
  ];
  const res = spawnSync(chrome, args, { timeout: 60_000, stdio: "pipe" });
  if (res.status !== 0 || statSync(out, { throwIfNoEntry: false }) === undefined) {
    console.error(`build: FAILED ${htmlPath} -> ${out}`);
    if (res.stderr) console.error(res.stderr.toString().trim());
    failed = true;
    continue;
  }
  const size = statSync(out).size;
  console.log(`built ${out.replace(/^.*printables\//, "printables/")} (${(size / 1024).toFixed(0)} KB, 1 page)`);
}

if (failed) process.exit(1);
