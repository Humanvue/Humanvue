# Retirement Plan v2: tab module contract

v2 is a single-file, offline HTML app (vanilla JS, no frameworks, no build step besides
inlining). `build.py` inlines `core.js`, then every file in `tabs/` (alphabetical), into
`index.html`. All personal numbers live only in the user's device data, never in these files:
the repo is PUBLIC. Tab modules hold general, educational content only.

## Registering a tab
Each file in `tabs/` is plain JS (no import/export, no top-level `return`), wrapped in an IIFE:

```js
(()=>{
  function view(){ return `<div class="stack">...</div>`; }   // returns an HTML string
  function bind(){ /* attach handlers after the HTML is in the page */ }
  TABS2.push({id:'invest', name:'Investing', order:40, view, bind});
})();
```

## Globals you may use (defined in core.js)
- `S` : app state object. Keep your tab's own state under `S[id]` (e.g. `S.invest={...}`), create
  it lazily, and call `save()` after you change it. Then call `render()` to redraw (it re-runs
  your `view` and `bind`). For text inputs that should not lose focus, update the result area
  yourself instead of calling render() on every keystroke (render on `change`, or redraw only
  your own output element with innerHTML).
- `save()`, `render()`, `$(sel)` (querySelector), `$$(sel)` (querySelectorAll as array)
- `esc(str)` HTML-escape. ALWAYS escape any user-entered text.
- `money0(n)` -> "$1,234"; `money2(n)` -> "$1,234.56"; `fmtK(n)` -> "$1.2k" / "$1.25M"; `pct1(x)` -> "12.3%"
- `lineChart(cfg)` -> SVG string. cfg = {labels:[...x labels...], series:[{name, values:[...], color, dash:bool, fill:bool}], yfmt:fn, height:px (default 260), stack:bool}
  Colors: use CSS vars as strings: 'var(--s1)' .. 'var(--s7)', 'var(--duty)', 'var(--study)', 'var(--accent)', 'var(--bad)', 'var(--good)'.
- `ageAt(dateOrYear)` -> the user's age (born June 1982). `plan2()` -> object with the user's
  current shared choices (read only), if you want to tie examples to them.

## CSS classes available
Layout: `.stack` (vertical gap), `.row` (flex row, wraps), `.grid2` / `.grid3` (responsive columns),
`.panel` (card), `.panel-in` (inner card), `.tiles` + `.tile` (stat tiles: `.eyebrow-s` label,
`.tbig` big number, `.small.muted` sub).
Text: `h2`, `h3`, `.eyebrow-s` (small caps label), `.small`, `.muted`, `.pos` (green), `.neg` (red),
`.warnbox` (amber note), `.goodbox` (green note).
Lists: `.pl-list` + `.pl-row` (two-column row: left text, right `.amt`). `ul.small` normal list.
Controls: `.btn`, `.btn.sm`, `.btn.primary`, `.seg` (button group; mark selected with class `on`
and `aria-pressed="true"`), `label.f` wrapping a label text then an `<input>`/`<select>`
(full-width field), `.fields` (responsive grid of label.f), `details > summary`.
Tables: `<div class="tbl-wrap"><table class="mtbl">...` (numbers right-aligned automatically in td.num).
Color code (the user's): 🟩 green/olive `var(--duty)` = military; 🟦 blue `var(--study)` = nursing
and school; 🟨 gold `var(--accent)` = personal and money. Side-colored cards: add class
`duty`, `study` or `money` to a `.panel` to get a colored left border.

## Writing rules
- Plain language for a busy reader (a nurse and soldier), short sentences, no em dashes.
- Facts must be current (2026) and checked with WebSearch. Put a `// Sources:` comment block at
  the top of the file listing URLs, and show a short "Sources" line in the UI (site names + year).
- Educational framing, not personalized advice. No product affiliate links. Links: plain https.
- Must work offline except for links. No external scripts, fonts or images (use inline SVG or
  emoji sparingly if you want an illustration).
- Keep it responsive (works at 360px wide and at 1440px).
- Never include the user's personal data (names, addresses, balances) in the file.
