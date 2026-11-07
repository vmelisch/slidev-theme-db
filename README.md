# slidev-theme-db

A [Slidev](https://sli.dev) theme for the **TU Dresden Database Research Group**:
branding, Noto Sans, the DB colour palette, syntax-highlighted code, and
template-styled tables — out of the box.

## Install

Set up a Slidev deck as usual, then add this theme and the gsap addon as
dependencies:

```bash
pnpm create slidev # the standard Slidev scaffolder (skip if you have a deck)
pnpm add -D slidev-theme-tud-db slidev-addon-gsap
```

Then point the deck at the theme in `slides.md`:

```yaml
---
theme: tud-db
---
```

```bash
# live preview at localhost:3030
pnpm dev
```

No `addons:` line needed — the theme enables `slidev-addon-gsap` via its
defaults, so `import { useTl } from 'slidev-addon-gsap'` works in any slide. The
theme also sets `canvasWidth: 960` (the 720pt PowerPoint slide, so 1pt == 4/3 px), Noto Sans, light scheme, and
Comark on; override any in your own headmatter.

## Example

See [`examples/slides.md`](./examples/slides.md) for a small deck using the cover,
two-column, and content layouts.

## Authoring reference (skills for AI agents)

The theme and the gsap addon each ship an Agent Skill: a reference that an AI
coding agent (Claude Code, Gemini, …) reads before it writes slides.

- [`slidev-theme-db`](./skills/slidev-theme-db/SKILL.md) (this package): every
  layout, the table and code helpers (code marks, inline `{lang}` code), the
  colours, and the gotchas.
- `slidev-addon-gsap` (in the addon package): click-driven timelines (`useTl`),
  element anchors, arrows, and morphs within and across slides.

Copy both into the deck's repo, so the agent has them. Claude Code reads
`.claude/skills/`; for other agents use their project skills folder (e.g.
`.agents/skills/`):

```bash
mkdir -p .claude/skills
cp -r node_modules/slidev-theme-tud-db/skills/slidev-theme-db .claude/skills/
cp -r node_modules/slidev-addon-gsap/skills/slidev-addon-gsap .claude/skills/
```

Where the two disagree, the theme's skill wins for `theme: tud-db` decks. For
example, don't add `addons: - gsap` to the headmatter, as the gsap skill says:
the theme already loads the addon, and an `addons:` list replaces the theme's.

**Converting PowerPoint decks:** the `pptx-to-slidev` conversion skill builds on
these two skills. Copy both in before converting a deck; the conversion skill
covers the workflow and the style, and leaves layouts, code and animation to
them.

## Maintaining the theme

- `components/DbFrame.vue` — shared chrome (logo, footer, padding).
- `layouts/` — `cover`, `default`, `two-cols-header`, `two-cols-grid` (wrap `DbFrame`).
- `styles/db-theme.css` — tokens, typography, lists, tables (keyed on `.db-default`).
- `setup/shiki.ts` — code highlighting: the SQL grammar (Shiki's, plus a few
  rules) and the colour themes (catppuccin, upright, with SQL tweaks), built by
  `highlighting()`. Fenced code uses them through Slidev; `vite.config.ts` uses
  the same `highlighting()` for inline `{lang}` code, so the two never drift.
  It also holds the transformer behind `⟦name:text⟧` code marks (spans a
  slide's timeline can recolour).
- Link the theme with `link:` (not `file:`), and **restart** the dev server after
  editing theme files (Vite doesn't hot-reload `node_modules`).
