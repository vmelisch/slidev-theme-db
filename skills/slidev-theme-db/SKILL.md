---
name: slidev-theme-db
description: >-
  Author and edit Slidev slide markdown (.md) for decks that use the
  slidev-theme-db theme (headmatter `theme: db` or `theme: slidev-theme-db`),
  a clone of the TU Dresden / Dresden Database Research Group PowerPoint
  template. Covers the layouts (cover, default, two-cols-header, two-cols-grid),
  heading/sub-header spacing, lists, inline `{lang}` code highlighting, fenced
  code blocks (captions, per-slide/per-block size, line numbers), template-styled
  tables (captions, equal/reach width helpers), the Comark curly-brace gotcha,
  and design tokens. Use whenever writing or modifying slides for a `theme: db`
  deck, or when asked about its layouts, tables, code styling, or colours.
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
`canvasWidth: 720` so **1px == 1pt** (use plain px values that match PowerPoint
pt), Noto Sans via Google Fonts, light colour scheme, **Comark enabled**, and
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
that follows other content gets a 24px gap; the **first** sub-header in a column
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
Languages: `json`, `yaml`, `sql`, `c`, `cpp`, `python`. Plain `` `code` `` (no
tag) is left as-is. Inline code in table cells/headings keeps its colours but
drops the grey pill background.

## Code blocks (fenced)

- Highlighted; the box **shrinks to fit** the code.
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
- **Per-slide font size:** `codeSize: 14px` in slide frontmatter (default 11px).
- **Per-block font size:** wrap one block in a div overriding the variable
  (blank lines inside so the code still parses):
  ````md
  <div style="--slidev-code-font-size: 14px">

  ```python
  def greet(name): ...
  ```

  </div>
  ````

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

## Other text features

- **ASCII arrows** in plain text become Unicode: `-->` → →, `<--` → ←, `<-->` → ↔.
  (Only in prose; code like SQL `->`/`->>` is never touched.)
- **Blockquote** `> note` renders as a muted italic aside with a leading en-dash.

## Vertical spacing tweaks (per spot, no theme edits)

- **Add space:** a spacer div — `<div class="h-4" />` (`h-2`≈8px, `h-4`≈16px,
  `h-8`≈32px, or exact `h-[12px]`).
- **Remove space** (normal flow only): `<div class="-mt-4" />`. (Does not work
  inside a `table-equal` grid.)

## Design tokens

Slide is **720×405pt**. Brand colours (CSS vars on `:root`):

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
