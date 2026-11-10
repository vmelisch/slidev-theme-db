// Shiki setup for fenced code blocks (```lang ... ```) and magic-move blocks.
// vite.config.ts highlights inline code with the same grammar and colours (see
// `highlighting()` below), so inline and fenced code look the same.
//
// NB: no `import { defineShikiSetup } from '@slidev/types'` on purpose — it's
// only a type helper, and Slidev calls this default export as `setup(ctx)`.
// The grammar and the colour themes are Shiki's own bundled ones, adjusted
// below, so no extra deps are needed.
import { bundledLanguages, bundledThemes } from 'shiki'

// Code marks: wrap exact character ranges of a fenced block so a slide can
// recolour that text, e.g. at a click. Inside the code, write ⟦name:text⟧: the
// markers are removed and `text` is wrapped in <span class="code-mark mark-name">.
//
//   WHERE salary > ⟦paren:(⟧
//
// A mark looks like the code around it until something recolours it, typically
// a gsap timeline at a click. A mark can span several syntax-coloured tokens,
// so recolour the tokens inside it too:
//
//   tl.to('.mark-paren, .mark-paren span', { color: '#f9c611' })
//
// A mark must stay within one line. Magic-move blocks don't run Shiki
// transformers, so marks only work in plain fenced blocks.
const MARK = /⟦([\w-]+):([^⟧\n]*)⟧/g

interface Decoration { start: number, end: number, properties: Record<string, string> }

export const codeMarks = {
  name: 'tud-db:code-marks',
  preprocess(code: string, options: { decorations?: Decoration[] }) {
    if (!code.includes('⟦'))
      return
    const marks: Decoration[] = []
    let out = ''
    let last = 0
    for (const m of code.matchAll(MARK)) {
      out += code.slice(last, m.index)
      const start = out.length
      out += m[2]
      marks.push({ start, end: out.length, properties: { class: `code-mark mark-${m[1]}` } })
      last = m.index! + m[0].length
    }
    out += code.slice(last)
    // Shiki reads the decorations from these options when it renders
    options.decorations = [...(options.decorations ?? []), ...marks]
    return out
  },
}

// SQL: Shiki's grammar, with a few rules added. Being grammar rules, they
// apply only where SQL code is parsed, never inside comments or strings.
//  - NULL, TRUE, FALSE and UNKNOWN are constants (the grammar knows only NULL,
//    as a keyword, and reads `IS NOT NULL` as a single keyword: here the
//    keyword part and the constant are told apart).
//  - EXPLAIN and ANALYZE are keywords.
//  - A name right before `(` is a function call: `ceil(x)`, `jsonb_agg(…)`;
//    so are common function names on their own, as in an inline `AVG` (the
//    grammar knows functions only before `(`).
//  - The join words are keywords on their own too, as in an inline `LEFT` or
//    in `LEFT JOIN LATERAL` (the grammar knows INNER, LEFT, RIGHT, FULL, OUTER
//    and NATURAL only as part of `… JOIN`, and LATERAL not at all).
//    These rules come last, so the grammar's own reading of a word, such as
//    the keyword in `IN (` or the type in `DECIMAL(10, 2)`, takes precedence;
//    and `left(name, 3)` stays a function call.
const CONSTANTS = 'NULL|TRUE|FALSE|UNKNOWN'
const FUNCTIONS = 'COUNT|AVG|SUM|MIN|MAX|COALESCE|ROUND|ABS|CEIL|FLOOR|SUBSTRING|TRIM|UPPER|LOWER|CONCAT'
const JOIN_WORDS = 'INNER|LEFT|RIGHT|FULL|OUTER|NATURAL|LATERAL'
const SQL_RULES_FIRST = [
  {
    match: `(?i:\\b(IS(?:\\s+NOT)?|NOT)\\s+(${CONSTANTS})\\b)`,
    captures: { 1: { name: 'keyword.other.sql' }, 2: { name: 'constant.language.sql' } },
  },
  { match: `(?i:\\b(?:${CONSTANTS})\\b)`, name: 'constant.language.sql' },
  { match: '(?i:\\b(?:EXPLAIN|ANALYZE)\\b)', name: 'keyword.other.sql' },
]
const SQL_RULES_LAST = [
  { match: '\\b[A-Za-z_][A-Za-z0-9_]*(?=\\()', name: 'support.function.sql' },
  { match: `(?i:\\b(?:${FUNCTIONS})\\b)`, name: 'support.function.sql' },
  { match: `(?i:\\b(?:${JOIN_WORDS})\\b)`, name: 'keyword.other.sql' },
]

// Colours: catppuccin-latte (light) and -mocha (dark), upright throughout (the
// template's code has no italics; Shiki's catppuccin sets some, e.g. on
// function names), with two SQL changes: numbers green, so that they differ
// from the orange constants (catppuccin colours both orange); and the table
// name after CREATE TABLE plain text, not a blue function name.
interface ThemeRule { scope?: string | string[], settings: { foreground?: string, fontStyle?: string } }
interface Theme { name: string, tokenColors?: ThemeRule[], [key: string]: unknown }

function variant(base: Theme, name: string, c: { constant: string, number: string, text: string }): Theme {
  const upright = (base.tokenColors ?? []).map((rule) => {
    const style = rule.settings.fontStyle
    if (!style?.includes('italic'))
      return rule
    return { ...rule, settings: { ...rule.settings, fontStyle: style.replace('italic', '').trim() } }
  })
  return {
    ...base,
    name,
    tokenColors: [
      ...upright,
      { scope: 'constant.language.sql', settings: { foreground: c.constant } },
      { scope: 'constant.numeric.sql', settings: { foreground: c.number } },
      { scope: 'entity.name.function.sql', settings: { foreground: c.text } },
    ],
  }
}

/** The theme's SQL grammar and its light and dark code colours (loaded once). */
export const highlighting = (() => {
  let loaded: Promise<{ sql: any, light: Theme, dark: Theme }> | undefined
  return () => loaded ??= (async () => {
    const [[sql], latte, mocha] = await Promise.all([
      bundledLanguages.sql().then(m => m.default as any[]),
      bundledThemes['catppuccin-latte']().then(m => m.default as unknown as Theme),
      bundledThemes['catppuccin-mocha']().then(m => m.default as unknown as Theme),
    ])
    return {
      sql: { ...sql, patterns: [...SQL_RULES_FIRST, ...sql.patterns, ...SQL_RULES_LAST] },
      light: variant(latte, 'tud-db-light', { constant: '#fe640b', number: '#059669', text: '#4c4f69' }),
      dark: variant(mocha, 'tud-db-dark', { constant: '#fab387', number: '#34d399', text: '#cdd6f4' }),
    }
  })()
})()

export default async () => {
  const { sql, light, dark } = await highlighting()
  return {
    themes: { light, dark },
    // replaces Shiki's `sql` with the extended grammar above
    langs: [sql],
    transformers: [codeMarks],
  }
}
