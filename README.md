# slidev-theme-db

A [Slidev](https://sli.dev) theme cloning the **TU Dresden – Dresden Database
Research Group (DDRG)** PowerPoint template (`DB_theme`, by Martin Hahmann):
branding (TU Dresden + DDRG logos, footer with page number), Noto Sans, the DB
colour palette, syntax-highlighted code, and template-styled tables — out of the box.

## Install

Add the theme **and the gsap addon** (the theme auto-enables the addon, but the
deck must list it so it's installed and importable):

```bash
pnpm add -D github:vmelisch/slidev-theme-db github:maxkurze1/slidev-addon-gsap
```

```yaml
---
theme: db          # short form; or the full name: slidev-theme-db
---
```

That's all — **no `addons:` line needed**: the theme enables `slidev-addon-gsap`
via its defaults, so `import { useTl } from 'slidev-addon-gsap'` works in any
slide. The theme also sets `canvasWidth: 720` (1px == 1pt), Noto Sans, light
scheme, and Comark on; override any in your own headmatter.

> Easiest start: copy the `first-steps` starter deck, which already lists both
> packages — then just `pnpm install`.

## Example deck

````md
---
theme: db
layout: cover
---

# Week 8: JSON in SQL

Practical Course: SQL, Summer Semester 2026

---
layout: two-cols-header
columns: 55fr 45fr
---

# Introduction to JSON

::left::

## JSON building blocks

- Object: unordered key-value pairs
  - *e.g.,* `{json} {"name": "Daniel Krueger", "salary": 4867}`
- Values can be: string, number, `null`, object, array

::right::

[Tab. 1: Employees]{.table-caption}

| id | name |
|:--:|:-----|
| 1  | Daniel Krueger |
| 2  | Sofia Weber |

---
layout: default
---

# Access operators

- `{sql} ->` returns `jsonb`, `{sql} ->>` returns `text`

```sql {1|2|all}{lines:true}
SELECT profile ->> 'city' AS city
FROM employees
WHERE (profile ->> 'salary')::int > 4000;
```
````

> **Heads-up:** Comark treats `{…}` as attributes, so literal `{ }` must go
> inside backticks/code (as above) — a bare `{"a": 1}` in prose crashes the slide.

## Authoring reference

Full conventions — every layout, lists, inline `{lang}` highlighting, code-block
options, the table helper classes, design tokens, and the gotchas — live in the
**[`slidev-theme-db` skill](./skills/slidev-theme-db/SKILL.md)**. It's an
[Agent Skill](https://sli.dev): copy or symlink it into a deck's `.claude/skills/`
and Claude Code applies it automatically when you write `theme: db` slides.

```bash
cp -r node_modules/slidev-theme-db/skills/slidev-theme-db .claude/skills/
```

## Maintaining the theme

- `components/DbFrame.vue` — shared chrome (logo, footer, padding).
- `layouts/` — `cover`, `default`, `two-cols-header`, `two-cols-grid` (wrap `DbFrame`).
- `styles/db-theme.css` — tokens, typography, lists, tables (keyed on `.db-default`).
- `setup/shiki.ts` (fenced) and the `THEME` in `vite.config.ts` (inline `{lang}`) —
  the **two** highlighters; keep them in sync (both `catppuccin-latte`).
- Link the theme with `link:` (not `file:`), and **restart** the dev server after
  editing theme files (Vite doesn't hot-reload `node_modules`).
