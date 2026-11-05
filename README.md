# Free Home Task of the Week Pack

Free family "chores-as-quests" printables: one printable page per week that
treats the household like a pick-up group instead of a chore list. Pure fun,
no shame mechanics — XP is never deducted, and grown-ups play too.

Four weekly sheets, built from plain HTML/CSS into unbranded, letter-size,
print-ready PDFs:

| Sheet | What it does |
| --- | --- |
| `quest-cards.pdf` | Six cut-and-hang **quest-of-the-week cards** with fill-in XP, difficulty pips, and an accept-by line |
| `xp-leaderboard.pdf` | **Party XP leaderboard** — weekly XP log for players of any age, plus a fill-in XP level ladder (levels 1–10) and a no-debt house rule |
| `boss-battles.pdf` | **Boss-battle cleaning jobs** — three raid-style boss cards with HP pips per 15-minute session, weaknesses, and loot, plus quick "mob" pulls |
| `strike-team.pdf` | Co-op **weekend strike team** planning sheet — party roles (tank/support/healer/DPS), a 3-target pull list, pre-raid checklist, etiquette, and a 5-minute debrief |

## Design principles

- **One page per week.** Every sheet is a single letter-size page; nothing scrolls onto page two.
- **Unbranded PDFs.** The printables contain no names, links, or logos — they're for your household, not for marketing.
- **Pick-up-group spirit.** Whoever can show up, shows up. AFK is allowed; low-energy days count; nothing is "owed back."
- **Local-first and offline.** Sources are plain HTML/CSS with no web fonts, JavaScript, or network calls. Print/color styling works in grayscale too.
- **Zero dependencies.** The build uses headless Chrome (already on most machines) — no npm packages to install.

## How to build

Requirements: Node.js 18+ and Google Chrome or Chromium in your `PATH`.

```sh
npm run build
```

That renders every `src/*.html` sheet to `printables/<name>.pdf`. To use a
specific Chrome binary, set `CHROME_PATH`:

```sh
CHROME_PATH=/path/to/chrome npm run build
```

## How to test

```sh
npm test
```

The test suite runs a fresh build and verifies that each of the four sheets
exists in `printables/`, is a valid PDF with exactly one page, and that all
sources and the shared stylesheet are wired together correctly.

## Repository layout

```
build.mjs               # HTML -> PDF build script (headless Chrome)
src/                    # HTML/CSS sources for the four weekly sheets
  css/print.css         # Shared letter-size print stylesheet
printables/             # Built, unbranded PDFs (committed after each build)
test/                   # Node-built-in test suite verifying the build
```

## Using the pack weekly

1. Sunday (or whenever): print one of each sheet.
2. Fill the **quest cards** together and let everyone "accept" quests.
3. Keep the **leaderboard** on the fridge; log XP once a week, no deductions ever.
4. When a big job looms, roll it onto a **boss battle** card and chip its HP in 15-minute sessions.
5. Run the **weekend strike team** sheet for one short co-op session, debrief, and hand out XP.

## Related (complementary, not overlapping)

This pack pairs with the free **Family Tech Agreement Kit**, which handles
conversations and agreements about screens and technology. The two cover
different ground: that kit is about *how the household uses tech together*;
this pack is about *how the household runs*. Neither step on the other.

## License

MIT — see `LICENSE`. Built and maintained by **Asdale Dynamics, LLC**.
Part of a family of beginner-friendly, local-first guides and tools from
Dylan Asdale's free AI education hub: <https://dylanasdale.github.io>.
