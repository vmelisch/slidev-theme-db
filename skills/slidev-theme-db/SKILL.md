---
name: slidev-theme-db
description: >-
  Author and edit Slidev slide markdown (.md) for decks that use the
  slidev-theme-db theme (headmatter `theme: db` or `theme: slidev-theme-db`),
  a clone of the TU Dresden / Dresden Database Research Group PowerPoint
  template. Covers the layouts (cover, default, two-cols-header, two-cols-grid),
  heading/sub-header spacing, lists, inline `{lang}` code highlighting, fenced
  code blocks (captions, per-slide/per-block size, line numbers, `⟦name:text⟧`
  code marks recoloured per click), template-styled
  tables (captions, equal/reach width helpers), the `::takeaway` callout for
  rhetorical questions / one-sentence summaries, Mermaid diagrams (brand styling
  and per-click reveal via gsap), the Comark curly-brace gotcha, and design
  tokens. Use whenever writing or modifying slides for a `theme: db` deck, or when
  asked about its layouts, tables, code styling, callouts, diagrams, or colours.
---

# slidev-theme-db

A Slidev theme cloning the **TU Dresden – Dresden Database Research Group (DDRG)**
PowerPoint template (`DB_theme`). This skill is the authoring reference for
writing decks with it.

> **Animations:** this theme **auto-loads the `slidev-addon-gsap` addon** (via its
> `slidev.defaults.addons`), so click-driven timelines, reveals, arrows and
> magic-move are available in every `theme: db` deck with no setup. The
> **`slidev-addon-gsap` skill** is the reference for that API — use it whenever a
> slide needs animation; the two skills compose.

## Setup (per deck)

Headmatter (first `---` block):
```yaml
---
theme: db          # short form; or the full name slidev-theme-db
---
```
The theme supplies these defaults (override in your own headmatter if needed):
`canvasWidth: 960` for the 720pt-wide PowerPoint slide, so **1pt == 4/3 px**
(a PowerPoint size of N pt is `calc(N * var(--db-pt))`, never `Npx` — see the type
scale under Design tokens), Noto Sans via Google Fonts, light colour scheme, **Comark enabled**, and
`addons: [slidev-addon-gsap]` (so the gsap addon loads automatically).

> Do **not** add `addons: [gsap]` just for animations — it's already loaded. Only
> add an `addons:` block if you need *other* addons, and if you do, **re-list
> `slidev-addon-gsap`** in it (a headmatter `addons:` replaces the theme default,
> it doesn't merge).

> **Dev note:** slide **.md** edits hot-reload. Edits to the **theme files**
> (under `slidev-theme-db/`, symlinked into `node_modules`) do **not** — restart
> the dev server (`r` in its terminal) after changing the theme.

## ⚠️ Comark curly-brace gotcha — read first

Comark treats `{…}` as attribute syntax. So **literal `{ }` in slide text must
live inside backticks/code**, or that slide crashes loudly. JSON, objects, etc.
go in inline code or a fenced block:
- ✅ `` `{json} {"a": 1}` `` · ✅ a fenced ```` ```json ```` block
- ❌ a bare `{"a": 1}` in prose or a table cell

## Layouts

```yaml
layout: cover            # "Titelfolie": navy band (vector mosaic + logos) + title/subtitle
```
```md
# Big title
Subtitle line (the paragraph right after the H1)
```

> ⚠️ **The first slide defaults to `layout: cover`** when no `layout:` is given
> (Slidev behaviour) — so it gets the navy DDRG banner. If your opening slide is
> content (a query, a diagram…), set `layout: default` explicitly in the
> headmatter, or its content is squashed under the cover band.

```yaml
layout: default          # "Titel und Inhalt": title + single content column
```

```yaml
layout: two-cols-header  # "Zwei Inhalte": full-width title + two columns
columns: 2fr 3fr         # optional; any CSS grid tracks. Default 1fr 1fr (50/50)
```
```md
# Title
::left::
…left…
::right::
…right…
```

```yaml
layout: two-cols-grid    # two columns as a ROW GRID — paired items auto-align
columns: 55fr 45fr       # optional
```
```md
# Title
::grid::
<div> row1 left </div>
<div> row1 right </div>
<div> row2 left </div>
<div> row2 right </div>
```
Each top-level `<div>` in `::grid::` is a cell, filling left→right→left→right;
grid rows align across columns, so paired headings line up and stay aligned.
Cells are top-aligned; add `class="self-center"` (or `self-start/-end/-stretch`)
to vertically center one cell's content.

Use `two-cols-grid` when items across columns must line up vertically; use plain
`two-cols-header` when the columns are independent. `cover` is standalone (no
footer); `default` / `two-cols-*` show the DDRG logo + footer band.

## Headings & sub-header spacing

- `#` → page title (black, 22pt).
- `##` / `###` → blue sub-headers (15pt).
- Body text → 13pt near-black.

**Spacing above sub-headers is automatic and you don't manage it:** a `##`/`###`
that follows other content gets an 11px gap (the template's 27.9pt from a bullet's
baseline to the next sub-header's); the **first** sub-header in a column
(or right under the page title) sits flush. This is **wrap-proof** — wrapping a
section in a `<div>` (e.g. as a GSAP animation anchor) does *not* collapse the
gap. So never add manual spacing before a sub-header.

## Lists

- Unordered (`-`): level 1 → `•`, level 2 → `▪` (indented, slightly smaller).
- Ordered (`1.`): same indentation/spacing, with numbers.
- A code block **indented** under a bullet becomes part of that bullet; a block
  at the **left margin** is independent.

## Inline code highlighting — `` `{lang} …` ``

Tag inline code with `{lang}` to syntax-highlight it:
```md
- e.g., `{json} {"name": "Daniel Krueger", "salary": 4867}`
- `{sql} profile ->> 'city'`
```
Languages: `json`, `yaml`, `sql`, `c`, `cpp`, `python`. Inline code in table
cells/headings keeps its colours but drops the grey pill background.

Untagged inline code is highlighted only when it is clearly one of:
- **SQL**: it contains an UPPERCASE SQL word (`` `NULL` ``, `` `GROUP BY` ``,
  `` `TRUE AND UNKNOWN = UNKNOWN` ``) or is a lone comparison operator
  (`` `<>` ``, `` `<=>` ``). Lowercase words never trigger it, so code from other
  languages (`` `std::set` ``, `` `{lines:true}` ``) stays plain; tag lowercase
  SQL explicitly: `` `{sql} sum(revenue)` ``.
- **a function call**: `` `next()` ``, `` `child.next()` `` — the name in
  function blue.

Anything else stays plain.

## Code colours (SQL)

Inline and fenced code share one grammar and palette (`setup/shiki.ts`):
catppuccin-latte, **upright** throughout, with SQL adjusted so each kind of word
has its own colour:

| what | colour | e.g. |
| --- | --- | --- |
| keywords | purple `#8839ef` | `SELECT`, `IS NOT`, `EXPLAIN ANALYZE` |
| functions | blue `#1e66f5` | `COUNT`, `ceil(x)`, any `name(` |
| constants | orange `#fe640b` | `NULL`, `TRUE`, `FALSE`, `UNKNOWN` |
| numbers | green `#059669` | `750`, `3.14` |
| strings | green `#40a02b` | `'flop'` |
| operators | teal `#179299` | `=`, `<>`, `>=` |
| comments | grey `#7c7f93` | `-- default branch` |

These are grammar rules, so they never apply inside comments or strings: the
`NULL` in `-- gives NULL` stays comment grey.

## Code blocks (fenced)

- Highlighted; the box **shrinks to fit** the code.
- A block inside a `data-morph` element (cross-slide morph) never scrolls:
  while the morph resizes its box, the code overflows instead of flashing a
  scrollbar.
- **No ligatures** (inline or fenced): Fira Code's programming ligatures are
  off, so `<>`, `<=`, `!=` show the characters as typed, not ◇ ≤ ≠.
- No background and no left inset: the code text lines up with the text, captions
  and tables around it. `{class:'with-bg'}` adds a faint box with a 10px inset.
- **Caption** above the block via the fence label:
  ````md
  ```python [A friendly greeting]
  def greet(name): ...
  ```
  ````
- **Line numbers:** add `{lines:true}`. The gutter is tightened with a faint
  vertical separator between numbers and code (theme-styled — nothing to do).
  ````md
  ```sql {lines:true}
  SELECT 1;
  ```
  ````
- **Click-stepped highlighting:** `{1|2|3|all}` highlights one line group per
  click; combine with numbers: ```` ```sql {1|2|3|all}{lines:true} ````.
- **Per-slide font size:** `codeSize: 13px` in slide frontmatter (default 11pt
  ≈ 14.7px; shrink to squeeze a long listing).
- **Per-block font size:** wrap one block in a div overriding the variable
  (blank lines inside so the code still parses):
  ````md
  <div style="--slidev-code-font-size: 14px">

  ```python
  def greet(name): ...
  ```

  </div>
  ````

### Code marks — recolour exact parts of a block at a click

Line highlighting (`{2|3}`) works on whole lines. To recolour **part** of a line
(a subquery, a pair of parentheses), mark it with `⟦name:text⟧` inside the
fenced block. The theme's Shiki transformer (`setup/shiki.ts`) strips the
markers and wraps `text` in `<span class="code-mark mark-name">`; the rendered
(and copied) code is plain and looks unchanged:
````md
```sql
SELECT name
FROM employees
WHERE salary > ⟦paren:(⟧
  ⟦inner:SELECT AVG(salary)⟧
  ⟦inner:FROM employees⟧
⟦paren:)⟧;
```
````
Recolour the text with a gsap timeline at the click you want. A mark can span
several syntax-coloured tokens, so target the tokens inside it as well; each
fades from its own syntax colour:
```ts
tl.step()
  .to('.mark-inner, .mark-inner span', { color: '#1f8299', duration: 0.4 }) // --db-accent3
  .step()
  .to('.mark-paren, .mark-paren span', { color: '#f9c611', duration: 0.4 }) // --db-accent4
  .step()
```
Gotchas:
- A mark must stay **within one line**; mark each line separately (same name).
- **Magic-move blocks** don't run Shiki transformers — marks only work in plain
  fenced blocks (the markers would show literally).
- A deck's own `setup/shiki.ts` that returns `transformers` **replaces** the
  theme's list (Slidev merges setups shallowly) — re-add marks there if needed.

## GSAP addon (auto-loaded) — interaction gotchas

This theme bundles **`slidev-addon-gsap`** (see its skill for the full
`useTl`/`usePos`/`useTwo` API). A few interaction points that aren't obvious and
cost real debugging time:

- **`useTwo` anchors need `usePos()` instantiated in the same slide.** The
  `'.sel@anchor'` strings passed to `mkArrow`/`mkPath`/`mkCircle` resolve through a
  global registry that is only installed inside `usePos()`'s `onMounted`. Call it
  even if you never use the returned `pos` — otherwise every anchor silently
  resolves to `(0,0)` and all shapes pile up at the slide's top-left corner:
  ```ts
  const tl  = useTl()
  const two = useTwo()
  usePos()   // ← registers the anchor resolver; without it every anchor → (0,0)
  ```
  (The gsap skill's *"no `pos()` wrapper needed"* means don't wrap each anchor in
  `pos(...)` — it does **not** mean you can skip calling `usePos()`.)
- **`two.back` draws behind the slide's opaque content** and is invisible on a
  `theme: db` slide — use `two.front` for arrows/shapes meant to be seen.
- In a slide `<script setup>`, **`$clicks` / `$slidev` / `$nav` are auto-injected**
  — don't re-declare them (`const { $clicks } = useSlideContext()` → "already
  declared"); just use `$clicks`. And **don't `import { gsap } from 'gsap'`** —
  it's a transitive dep, unresolvable from the deck root; use the `useTl` timeline
  methods (or plain DOM) instead.
- Driving **async content** (a Mermaid SVG) with `useTl` needs a wait/seek dance —
  see the next section.

## Diagrams — Mermaid (and animating them)

Slidev's **built-in Mermaid** (```` ```mermaid ````) works under `theme: db` and
is the right tool for graphs/trees (query plans, DAGs) — don't hand-draw boxes
with divs + arrows. Colour nodes to brand with `classDef`/`class` using the
design tokens below. Layout tips that bit us:

- A long linear chain overflows **vertically** — use `flowchart LR` so it spreads
  across the wide 16:9 slide.
- **Bold** htmlLabels get clipped on the right edge (Mermaid under-measures bold
  width) — add `"flowchart":{"padding":18}` to the `%%{init:…}%%` directive.
- Then size with the Slidev block option `{scale: …}` (≈`0.52` fit a 7-node LR
  chain across the slide; `0.6` clipped the last node).

**Per-click reveal** of a Mermaid diagram (build it up node-by-node with the gsap
addon's `useTl`) is possible but sharp-edged, because Slidev renders Mermaid into
a **Shadow DOM**, asynchronously:

- Reach the SVG through the host's shadow root, **not** the light DOM:
  `(root.querySelector('.mermaid') as HTMLElement).shadowRoot`.
- Render is async → poll `shadowRoot.querySelector('g.node')` with **`setTimeout`**
  (not `requestAnimationFrame` — rAF stalls under headless-screenshot virtual
  time). `useTl`'s `step()` registers the click count reactively, so building the
  timeline late is fine; but its slide-enter seek already ran on the empty
  timeline, so finish with `(tl as any).seek('step-' + ($clicks.value ?? 0))`.
- Node ids are `<randomDiagramId>-flowchart-<name>-<n>` → match with
  `[id*="flowchart-<name>-"]` (contains, **not** `^=`). Edges:
  `.edgePaths path.flowchart-link`, emitted in declaration order.
- Pass the resolved **element refs** to `useTl`'s `.to()` — its scoping only does
  light-DOM `querySelectorAll`, which can't see into shadow DOM. GSAP animates
  element refs across the boundary fine. Hide them first with plain
  `el.style.opacity = '0'`, then reveal per step.

See the **`slidev-addon-gsap`** skill for the `useTl`/`usePos`/`useTwo` API.

## Tables

Plain Markdown tables get the template look automatically (borderless, white bold
header with rules, zebra rows, centered cells, small, content-width). On top of that:

| You want… | How |
| --- | --- |
| Column alignment | Centered by default; `:--` left, `--:` right per column |
| Title above | `[My title]{.table-caption}` line above the table |
| Note below | `[My note]{.table-footer}` line below the table |
| Fixed / fractional width | `<div class="table-w" style="width: 360px">` · `class="table-w w-2/3"` · `class="table-w"` (full) |
| Two+ tables equal width | wrap them in `<div class="table-equal">` |
| Spill into the other column | `<div class="table-reach" style="--reach: 120px">` |

> When wrapping a table (or code block) in a `<div>`, leave **blank lines**
> inside the div so the Markdown still parses.

## Callout — `::takeaway` (rhetorical questions / one-sentence summaries)

The **preferred element for a rhetorical question or a one-sentence takeaway**
(the "so what?" line that caps a slide). "F1" style: a coloured **left rule** fitted
to the text height + a small uppercase **eyebrow label**, no fill, no symbol,
upright body text. Authored as an **MDC block** (needs `mdc: true`, which the theme
sets):
```md
::takeaway{label="Question"}
Why translate source code if SIMDe already works?
::
```
Props:
- **`label`** — the eyebrow text. Default `"Key Takeaway"`. Use `"Question"`,
  `"Problem"`, `"Watch out"`, … Set `label=""` to hide the eyebrow (bare ruled aside).
- **`color`** — the rule + eyebrow colour, so a problem reads differently from a
  takeaway. Brand keywords `blue` (default) · `navy` · `teal` · `green` · `yellow`
  · `red`/`orange` · `purple`, or any raw CSS colour. E.g. a red problem callout:
  ```md
  ::takeaway{label="Problem" color="red"}
  Porting to each of these by hand is **tedious**.
  ::
  ```
- **`size`** — overall scale. The body text matches the slide's default text size
  by default; set e.g. `size="1.15em"` (or a bare number `size="1.15"`, read as em)
  to enlarge the whole callout. All spacing is em-based, so it stays vertically
  balanced at any size — don't hand-tweak the padding.

Inline markdown works inside (`**bold**`, `` `code` `` — code stays a touch
lighter). Prefer this over a blockquote for a highlighted takeaway; keep `>` for a
genuine low-key side-note (see below). Component: `components/Takeaway.vue`, styled
as `.db-takeaway` in `styles/db-theme.css` (accent via `--tk-accent`; the small
asymmetric em top/bottom padding offsets the eyebrow cap-height vs body baseline so
the rule is optically centred — leave it be).

> Adding/renaming a component file (like `Takeaway.vue`) needs a **dev-server
> restart** to register — editing an existing component or its CSS hot-reloads.

## Other text features

- **Inline math** `$A \cup B$` (KaTeX) is sized to match the body text and keeps
  the line height of the bullet it sits in.
- **ASCII arrows** in plain text become Unicode: `-->` → →, `<--` → ←, `<-->` → ↔.
  (Only in prose; code like SQL `->`/`->>` is never touched.)
- **Blockquote** `> note` renders as a muted italic aside with a leading en-dash —
  a *quiet* side-note. For a highlighted takeaway, use `::takeaway` above instead.

## Vertical spacing tweaks (per spot, no theme edits)

- **Add space:** a spacer div — `<div class="h-4" />` (`h-2`≈8px, `h-4`≈16px,
  `h-8`≈32px, or exact `h-[12px]`).
- **Remove space** (normal flow only): `<div class="-mt-4" />`. (Does not work
  inside a `table-equal` grid.)

## Design tokens

Slide is **720×405pt**, rendered on a 960×540px canvas (`--db-pt` = 4/3 px).
Type scale (CSS vars on `:root`, sizes from the PowerPoint template):

| token | pt | use |
| --- | --- | --- |
| `--db-fs-cover-title` | 28 | cover / `section-num` title |
| `--db-fs-section-title` | 24 | `section` title |
| `--db-fs-subtitle` | 14 | cover / section subtitle |
| `--db-fs-title` | 22 | content slide title (h1) |
| `--db-fs-heading` | 15 | blue sub-header (h2/h3) |
| `--db-fs-body` | 13 | body text, 1st-level bullets |
| `--db-fs-small` | 12 | 2nd-level bullets, page number |
| `--db-fs-code` | 11 | code blocks |
| `--db-fs-caption` | 11 | table / code captions |
| `--db-fs-table` | 10 | table cells |

Brand colours (CSS vars on `:root`):

| token | hex | use |
| --- | --- | --- |
| `--db-navy` | `#001450` | cover background |
| `--db-text` | `#4c4d4d` | muted text (footer note, page number) |
| `--db-text-soft` | `#171616` | body/title text |
| `--db-heading-blue` | `#2f57b2` | content sub-headers (h2/h3) |
| `--db-accent1` | `#40b498` | teal-green |
| `--db-accent2` | `#b1d285` | light green |
| `--db-accent3` | `#1f8299` | blue-teal (links) |
| `--db-accent4` | `#f9c611` | yellow |
| `--db-accent5` | `#ea4f30` | red-orange |
| `--db-accent6` | `#994781` | purple |
| `--db-table-stripe` | `#dbdbdb` | zebra rows |
| `--db-table-rule` | `#b9b9b9` | table / separator rules |

## Conventions

- Keep literal `{ }` inside code (Comark) — the #1 cause of a crashed slide.
- Don't hand-space sub-headers; the theme does it (and it's wrap-proof).
- Use the table helper classes rather than inline table CSS.
- Leave blank lines inside any `<div>` that wraps Markdown.
- Restart the dev server after editing theme files; slide .md hot-reloads.
- For animation/`<script setup>` gotchas (`usePos()`, injected `$clicks`, no
  `gsap` import), see **GSAP addon — interaction gotchas** above.
