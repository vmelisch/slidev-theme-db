import { createHighlighter } from 'shiki'
import { setupTableCaptions } from './markdown.ts'
import { sqlKeywords } from './setup/shiki.ts'

// Shipped WITH the theme: Slidev merges vite.config from every root (theme +
// addons + deck), so installing this theme is enough — no need to copy a file.
//
// Inline code syntax highlighting. Write inline code as:  `{lang} the code`
//   e.g.  `{json} {"a": 1}`
// The leading `{lang}` token selects the language; everything after the first
// space is highlighted with Shiki and rendered inside a normal inline <code>.
//
// Common SQL keywords/constants/functions (e.g. `NULL`, `TRUE`, `COUNT`) are
// automatically detected and highlighted with the theme's SQL grammar.
//
// A deck can still override THEME, LANGS, or the rule by defining its own
// vite.config.ts (the deck's config merges last and wins).
const THEME = 'catppuccin-latte'
const LANGS = ['json', 'yaml', 'sql', 'c', 'cpp', 'python']

const AUTO_SQL = /\b(TRUE|FALSE|UNKNOWN|NULL|EXPLAIN|ANALYZE|COUNT|AVG|SUM|MIN|MAX|COALESCE|SELECT|FROM|WHERE|HAVING|GROUP\s+BY|ORDER\s+BY|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|USING|LIMIT|OFFSET|UNION|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INTO|VALUES|SET|BETWEEN|IN|NOT|AND|OR|IS|LIKE|ILIKE|AS|CASE|WHEN|THEN|ELSE|END)\b/i
const AUTO_SQL_OPS = /^(?:<=>|<>|<=|>=|!=|=|<|>)$/

function isAutoSql(code: string): boolean {
  const trimmed = code.trim()
  return AUTO_SQL_OPS.test(trimmed) || AUTO_SQL.test(trimmed)
}

export default async () => {
  const highlighter = await createHighlighter({ themes: [THEME], langs: LANGS })

  return {
    slidev: {
      markdown: {
        // runs after Slidev's own markdown-it plugins, so our rule wins
        markdownSetup(md: any) {
          setupTableCaptions(md)
          const fallback = md.renderer.rules.code_inline
          md.renderer.rules.code_inline = (tokens: any[], idx: number, options: any, env: any, self: any) => {
            const raw = String(tokens[idx].content)
            const m = raw.match(/^\{([\w-]+)\}\s+([\s\S]+)$/)
            let lang = m ? m[1] : null
            let code = m ? m[2] : raw

            // Auto-detect common SQL keywords/constants when untagged
            if (!lang && isAutoSql(code)) {
              lang = 'sql'
            }

            // Auto-detect function calls like `next()` or `child.next()` when untagged -> blue upright
            const fnMatch = !lang && code.trim().match(/^((?:[a-zA-Z_]\w*\.)*)([a-zA-Z_]\w*)\s*(\(.*?\))$/)
            if (fnMatch) {
              const prefix = fnMatch[1]
              const fnName = fnMatch[2]
              const rest = fnMatch[3].replace(/ /g, '&nbsp;')
              let inner = ''
              if (prefix) {
                inner += `<span style="color:#4C4F69;--shiki-light:#4C4F69;--shiki-dark:#CDD6F4">${prefix}</span>`
              }
              inner += `<span style="color:#1E66F5;--shiki-light:#1E66F5;--shiki-dark:#89B4FA">${fnName}</span>`
              inner += `<span style="color:#7C7F93;--shiki-light:#7C7F93;--shiki-dark:#9399B2">${rest}</span>`
              return `<code class="db-inline-code">${inner}</code>`
            }

            if (lang && highlighter.getLoadedLanguages().includes(lang)) {
              let inner = highlighter
                .codeToHtml(code, { lang, theme: THEME, transformers: [sqlKeywords] })
                .replace(/^<pre[^>]*><code[^>]*>/, '')
                .replace(/<\/code><\/pre>\s*$/, '')

              // Preserve all spaces across tokens so Vue's template compiler never condenses/strips them
              inner = inner.replace(/<span([^>]*)>([^<]*)<\/span>/g, (_m, attrs, text) => {
                return `<span${attrs}>${text.replace(/ /g, '&nbsp;')}</span>`
              })

              return `<code class="db-inline-code">${inner}</code>`
            }
            return fallback
              ? fallback(tokens, idx, options, env, self)
              : self.renderToken(tokens, idx, options)
          }

          // ASCII arrows -> unicode, in plain TEXT only. Code spans/blocks are
          // separate token types, so SQL `->` / `->>` is never touched.
          // Markdown's typographer turns `--` into an en-dash (`–`) before this
          // runs, so we match the hyphen, en-dash and em-dash forms.
          const DASH = '(?:--|–|—)' // -- or – or —
          const reBoth = new RegExp(`<${DASH}>`, 'g')
          const reRight = new RegExp(`${DASH}>`, 'g')
          const reLeft = new RegExp(`<${DASH}`, 'g')
          md.core.ruler.push('db-arrows', (state: any) => {
            for (const tok of state.tokens) {
              if (tok.type !== 'inline' || !tok.children) continue
              for (const child of tok.children) {
                if (child.type === 'text') {
                  child.content = child.content
                    .replace(reBoth, '↔')
                    .replace(reRight, '→')
                    .replace(reLeft, '←')
                }
              }
            }
          })
        },
      },
    },
  }
}
