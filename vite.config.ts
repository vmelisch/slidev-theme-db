import { createHighlighter } from 'shiki'
import { setupTableCaptions } from './markdown.ts'
import { highlighting } from './setup/shiki.ts'

// Shipped WITH the theme: Slidev merges vite.config from every root (theme +
// addons + deck), so installing this theme is enough — no need to copy a file.
//
// Inline code syntax highlighting. Write inline code as:  `{lang} the code`
//   e.g.  `{json} {"a": 1}`
// The leading `{lang}` token selects the language; everything after the first
// space is highlighted with Shiki and rendered inside a normal inline <code>,
// with the same SQL grammar and colours as fenced code (setup/shiki.ts).
//
// Untagged inline code is highlighted too when it is clearly one of:
//  - SQL: it has an UPPERCASE SQL word (`NULL`, `GROUP BY`, `TRUE AND UNKNOWN`)
//    or is a lone comparison operator (`<>`, `<=>`). Uppercase only, so that
//    code from other languages (`std::set`, `end()`, `{lines:true}`) stays plain.
//  - a function call, `next()` or `child.next()`: the name in function blue.
//
// A deck can still override LANGS or the rule by defining its own
// vite.config.ts (the deck's config merges last and wins).
const LANGS = ['json', 'yaml', 'c', 'cpp', 'python']

const AUTO_SQL = /\b(?:TRUE|FALSE|UNKNOWN|NULL|EXPLAIN|ANALYZE|COUNT|AVG|SUM|MIN|MAX|COALESCE|SELECT|FROM|WHERE|HAVING|GROUP\s+BY|ORDER\s+BY|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|USING|LIMIT|OFFSET|UNION|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INTO|VALUES|SET|BETWEEN|IN|NOT|AND|OR|IS|LIKE|ILIKE|AS|CASE|WHEN|THEN|ELSE|END)\b/
const AUTO_SQL_OPS = /^(?:<=>|<>|<=|>=|!=|=|<|>)$/
const CALL = /^((?:[a-z_]\w*\.)*)([a-z_]\w*)(\s*\(.*\))$/i

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Vue compiles each slide as a template and condenses whitespace: it drops a
// text node that is only spaces at the start or end of an element (Shiki's
// span for a lone space), and shrinks runs of spaces to one. Protect exactly
// those spaces with &nbsp;; every other space stays a normal one, so long
// inline code can still wrap.
function keepSpaces(html: string): string {
  return html
    .replace(/>( +)</g, (_m, sp: string) => `>${'&nbsp;'.repeat(sp.length)}<`)
    .replace(/ {2,}/g, sp => `${'&nbsp;'.repeat(sp.length - 1)} `)
}

export default async () => {
  const { sql, light } = await highlighting()
  const highlighter = await createHighlighter({ themes: [light], langs: [...LANGS, sql] })
  const THEME = light.name

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
            const code = m ? m[2] : raw
            const bare = code.trim()
            const lang = m ? m[1] : (AUTO_SQL_OPS.test(bare) || AUTO_SQL.test(bare)) ? 'sql' : null

            // untagged function call: the name in function blue, the rest in
            // the colour of punctuation (as Shiki colours `()` in code)
            const call = !lang && bare.match(CALL)
            if (call) {
              const [, prefix, name, rest] = call
              const span = (color: string, text: string) => text ? `<span style="color:${color}">${escapeHtml(text)}</span>` : ''
              const inner = span('#4C4F69', prefix) + span('#1E66F5', name) + span('#7C7F93', rest)
              return `<code class="db-inline-code">${keepSpaces(inner)}</code>`
            }

            if (lang && highlighter.getLoadedLanguages().includes(lang)) {
              const inner = highlighter
                .codeToHtml(code, { lang, theme: THEME })
                .replace(/^<pre[^>]*><code[^>]*>/, '')
                .replace(/<\/code><\/pre>\s*$/, '')
              return `<code class="db-inline-code">${keepSpaces(inner)}</code>`
            }
            // plain inline code: unhighlighted, but its spaces kept too. (Slidev
            // renders markdown asynchronously, so the default rule may return
            // a promise of the HTML.)
            const plain = fallback
              ? fallback(tokens, idx, options, env, self)
              : self.renderToken(tokens, idx, options)
            return typeof plain === 'string' ? keepSpaces(plain) : Promise.resolve(plain).then(keepSpaces)
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
