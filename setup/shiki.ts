// Default Shiki color scheme for fenced code blocks (```lang ... ```).
// Matches the inline-code highlighter (see vite.config.ts) and the chair's
// template, so inline and fenced code look the same.
//
// NB: no `import { defineShikiSetup } from '@slidev/types'` on purpose — it's
// only a type helper, and Slidev calls this default export as `setup(ctx)`.
// catppuccin-latte / -mocha are bundled with Shiki, so no extra deps needed.

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

const SQL_FUNCS = /^(COUNT|AVG|SUM|MIN|MAX|COALESCE|ROUND|ABS|CEIL|FLOOR|LENGTH|SUBSTRING|TRIM|UPPER|LOWER|CONCAT|NOW|DATE)$/i
const SQL_CONSTANTS = /^(TRUE|FALSE|UNKNOWN|NULL)$/i
const SQL_KEYWORDS = /^(EXPLAIN|ANALYZE)$/i
const SQL_ALL = /^(TRUE|FALSE|UNKNOWN|NULL|EXPLAIN|ANALYZE|COUNT|AVG|SUM|MIN|MAX|COALESCE|ROUND|ABS|CEIL|FLOOR|LENGTH|SUBSTRING|TRIM|UPPER|LOWER|CONCAT|NOW|DATE)$/i
const SQL_SPLIT = /\b(TRUE|FALSE|UNKNOWN|NULL|EXPLAIN|ANALYZE|COUNT|AVG|SUM|MIN|MAX|COALESCE|ROUND|ABS|CEIL|FLOOR|LENGTH|SUBSTRING|TRIM|UPPER|LOWER|CONCAT|NOW|DATE)\b/i

function getSqlStyle(w: string) {
  if (SQL_FUNCS.test(w)) return { color: '#1E66F5', light: '#1E66F5', dark: '#89B4FA' }
  if (SQL_CONSTANTS.test(w)) return { color: '#FE640B', light: '#FE640B', dark: '#FAB387' }
  return { color: '#8839EF', light: '#8839EF', dark: '#CBA6F7' }
}

export const sqlKeywords = {
  name: 'tud-db:sql-keywords',
  tokens(lines: any[]) {
    if ((this as any).options?.lang !== 'sql') return
    for (let l = 0; l < lines.length; l++) {
      const line = lines[l]
      const newTokens: any[] = []
      for (const token of line) {
        const trimmed = token.content.trim()
        const upper = trimmed.toUpperCase()

        // 0. Intercept numeric tokens -> light emerald green (#059669)
        if (/^\d+(\.\d+)?$/.test(trimmed)) {
          const leading = token.content.slice(0, token.content.indexOf(trimmed))
          const trailing = token.content.slice(token.content.indexOf(trimmed) + trimmed.length)
          if (leading) newTokens.push({ ...token, content: leading, fontStyle: 0, htmlStyle: { color: '#4C4F69', '--shiki-light': '#4C4F69', '--shiki-dark': '#CDD6F4' } })
          newTokens.push({
            ...token,
            content: trimmed,
            color: '#059669',
            fontStyle: 0,
            htmlStyle: { color: '#059669', '--shiki-light': '#059669', '--shiki-dark': '#34D399' },
          })
          if (trailing) newTokens.push({ ...token, content: trailing, fontStyle: 0, htmlStyle: { color: '#4C4F69', '--shiki-light': '#4C4F69', '--shiki-dark': '#CDD6F4' } })
          continue
        }

        // 1. Intercept NULL if Shiki tagged it as keyword purple (including combined tokens like "IS NOT NULL")
        if (/\bNULL\b/i.test(token.content)) {
          const s = getSqlStyle('NULL')
          const parts = token.content.split(/\b(NULL)\b/i)
          let currOffset = token.offset
          for (const part of parts) {
            if (!part) continue
            if (/^NULL$/i.test(part)) {
              newTokens.push({
                ...token,
                content: part,
                offset: currOffset,
                color: s.color,
                fontStyle: 0,
                htmlStyle: { color: s.color, '--shiki-light': s.light, '--shiki-dark': s.dark },
              })
            }
            else {
              newTokens.push({ ...token, content: part, offset: currOffset })
            }
            currOffset += part.length
          }
          continue
        }

        // 2. Intercept function tokens (AVG, COUNT, COALESCE, etc.) -> upright blue
        // and normalize misclassified identifiers (e.g. `movies` in `CREATE TABLE movies`) -> plain text upright
        const hasItalic = token.fontStyle === 1
          || token.htmlStyle?.['--shiki-light-font-style'] === 'italic'
          || token.htmlStyle?.['--shiki-dark-font-style'] === 'italic'
        const isBlue = (token.color?.toLowerCase() === '#1e66f5' || token.htmlStyle?.['--shiki-light']?.toLowerCase() === '#1e66f5')
        if (hasItalic && isBlue) {
          const s = SQL_ALL.test(trimmed)
            ? getSqlStyle(trimmed)
            : { color: '#4C4F69', light: '#4C4F69', dark: '#CDD6F4' }
          const leading = token.content.slice(0, token.content.indexOf(trimmed))
          const trailing = token.content.slice(token.content.indexOf(trimmed) + trimmed.length)
          if (leading) newTokens.push({ ...token, content: leading, fontStyle: 0, htmlStyle: { color: '#4C4F69', '--shiki-light': '#4C4F69', '--shiki-dark': '#CDD6F4' } })
          newTokens.push({
            ...token,
            content: trimmed,
            color: s.color,
            fontStyle: 0,
            htmlStyle: { color: s.color, '--shiki-light': s.light, '--shiki-dark': s.dark },
          })
          if (trailing) newTokens.push({ ...token, content: trailing, fontStyle: 0, htmlStyle: { color: '#4C4F69', '--shiki-light': '#4C4F69', '--shiki-dark': '#CDD6F4' } })
          continue
        }

        // 3. Intercept plain text tokens containing SQL words (TRUE, FALSE, UNKNOWN, EXPLAIN, ANALYZE, functions, etc.)
        const lightColor = token.htmlStyle?.['--shiki-light'] || token.htmlStyle?.color || token.color
        const isPlain = !lightColor || lightColor.toLowerCase() === '#4c4f69'
        if (isPlain && SQL_SPLIT.test(token.content)) {
          const parts = token.content.split(SQL_SPLIT)
          let currOffset = token.offset
          for (const part of parts) {
            if (!part) continue
            if (SQL_ALL.test(part)) {
              const s = getSqlStyle(part)
              newTokens.push({
                ...token,
                content: part,
                offset: currOffset,
                color: s.color,
                fontStyle: 0,
                htmlStyle: { color: s.color, '--shiki-light': s.light, '--shiki-dark': s.dark },
              })
            }
            else {
              newTokens.push({
                ...token,
                content: part,
                offset: currOffset,
                fontStyle: 0,
                htmlStyle: { color: '#4C4F69', '--shiki-light': '#4C4F69', '--shiki-dark': '#CDD6F4' },
              })
            }
            currOffset += part.length
          }
          continue
        }

        newTokens.push(token)
      }
      lines[l] = newTokens
    }
  },
}

export default () => ({
  themes: {
    light: 'catppuccin-latte',
    dark: 'catppuccin-mocha',
  },
  transformers: [codeMarks, sqlKeywords],
})
