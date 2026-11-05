/**
 * Tests: the build runs and every sheet is produced as a valid, single-page
 * PDF. Runs against a fresh build so failures match real usage.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)).replace(/\/test$/, "");
const outDir = join(root, "printables");

const EXPECTED_SHEETS = [
  "quest-cards",
  "xp-leaderboard",
  "boss-battles",
  "strike-team",
];

function pdfPageCount(buf) {
  // Count all page-tree nodes by finding "/Type /Page" (not followed by "s").
  // Chrome emits pages with a space or as "/Type/Page"; handle both,
  // and ignore object streams by falling back to a loose search.
  const text = buf.toString("latin1");
  const matches = text.match(/\/Type\s*\/Page[^s]/g) || [];
  return matches.length;
}

test("build completes successfully", () => {
  const res = spawnSync("node", [join(root, "build.mjs")], {
    cwd: root,
    timeout: 180_000,
  });
  assert.equal(res.status, 0, `build.mjs exited nonzero:\n${res.stderr}`);
});

for (const sheet of EXPECTED_SHEETS) {
  test(`sheet builds to a single-page PDF: ${sheet}.pdf`, () => {
    const pdfPath = join(outDir, `${sheet}.pdf`);
    assert.ok(existsSync(pdfPath), `${pdfPath} was not produced`);
    const { size } = statSync(pdfPath);
    assert.ok(size > 5_000, `${sheet}.pdf suspiciously small (${size} bytes)`);

    const buf = readFileSync(pdfPath);
    assert.ok(buf.slice(0, 5).toString().startsWith("%PDF"), `${sheet}.pdf lacks PDF header`);

    const pages = pdfPageCount(buf);
    assert.equal(pages, 1, `${sheet}.pdf expected exactly 1 page, found ${pages}`);
  });
}

test("sources contain all four HTML sheets", () => {
  for (const sheet of EXPECTED_SHEETS) {
    assert.ok(
      existsSync(join(root, "src", `${sheet}.html`)),
      `missing source sheet src/${sheet}.html`
    );
  }
});

test("shared print stylesheet exists and is referenced", () => {
  const cssPath = join(root, "src", "css", "print.css");
  assert.ok(existsSync(cssPath), "missing src/css/print.css");
  for (const sheet of EXPECTED_SHEETS) {
    const html = readFileSync(join(root, "src", `${sheet}.html`), "utf8");
    assert.ok(html.includes('css/print.css'), `${sheet}.html does not reference print.css`);
  }
});
