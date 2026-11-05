# STATUS.md

## What was built

A free family "chores-as-quests" printable pack: four weekly, letter-size,
print-ready PDFs built from plain HTML/CSS sources. The household is treated
as a pick-up group — quests are accepted voluntarily, XP is never deducted,
AFK is allowed, and grown-ups play by the same rules.

Included sheets (one page each, in `printables/`):

- `quest-cards.pdf` — six cut-and-hang quest-of-the-week cards with fill-in
  XP, difficulty pips, accept-by lines, plus optional group-bonus and
  legend-of-the-week callouts.
- `xp-leaderboard.pdf` — party XP leaderboard table (six player rows), a
  fill-in XP level ladder (Lv 1–10), and a week-end ceremony section with a
  champion pick and a no-debt house rule.
- `boss-battles.pdf` — three raid-style boss cards (HP pips, one per
  15-minute session; weakness/loot/trap fields) and six quick "mob" rows.
- `strike-team.pdf` — weekend co-op planning: role cards (tank / support /
  healer / DPS), a three-target pull list, a pre-raid checklist,
  group-etiquette rules, and a five-minute debrief section.

Deliberately unbranded: the PDFs contain no names, links, or logos. They
complement the free Family Tech Agreement Kit (screen-time agreements) and do
not overlap it — that kit covers how a household uses tech together; this pack
covers how a household runs.

## How to run it

Requirements: Node.js 18+ and Google Chrome or Chromium on `PATH`.

```sh
npm run build   # renders src/*.html -> printables/*.pdf via headless Chrome
npm test        # runs a fresh build and verifies every sheet (Node built-in test runner)
```

Use `CHROME_PATH=/path/to/chrome npm run build` to override the browser.
No npm dependencies are installed at any step.

## Verification results

- `npm run build`: succeeds; all four PDFs rendered (~90–125 KB each).
- `npm test`: **7/7 tests pass** —
  1. build exits cleanly,
  2–5. each sheet exists in `printables/`, has a valid `%PDF` header, is
  non-trivial in size, and contains **exactly 1 page**,
  6. all four HTML sources exist,
  7. all sheets reference the shared `src/css/print.css`.
- Independent check with `pdfinfo`: every PDF is 1 page at 612 x 792 pts
  (US Letter).
- Visual inspection (`pdftoppm` previews): all four sheets fit the page with
  sensible margins; no overflow, overlap, or stray second pages.

## Known gaps

- The build depends on a local Chrome/Chromium binary (documented; no other
  dependency). A WeasyPrint fallback could be added later, but WeasyPrint
  handles modern flex/grid CSS less faithfully than a real browser engine.
- Page-count verification in the test suite parses the PDF stream for
  `/Type /Page` patterns; `pdfinfo` cross-checks the same result manually.
- Difficulty labels (I–IV) are a suggestion; households must set their own XP
  values, level thresholds, and rewards — intentionally left blank.
- No i18n variants (English only) and no A4 preset yet — `%page` is fixed at
  Letter; A4 households can print with "scale to fit" in most viewers.
