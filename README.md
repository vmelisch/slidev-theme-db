# slidev-theme-db

A [Slidev](https://sli.dev) theme cloning the **TU Dresden – Dresden Database
Research Group (DDRG)** PowerPoint template (`DB_theme`, by Martin Hahmann):
branding (TU Dresden + DDRG logos, footer with page number), Noto Sans, the DB
colour palette, syntax-highlighted code, and template-styled tables — out of the box.

## Install

```bash
# sibling folder (local dev):
pnpm add -D link:../slidev-theme-db
# …or from Git:
pnpm add -D github:<org>/slidev-theme-db
```

```yaml
---
theme: db          # short form; or the full name: slidev-theme-db
---
```

The theme sets sensible defaults (`canvasWidth: 720` so 1px == 1pt, Noto Sans,
light scheme, Comark on); override any in your own headmatter.

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
