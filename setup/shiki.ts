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

const codeMarks = {
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

export default () => ({
  themes: {
    light: 'catppuccin-latte',
    dark: 'catppuccin-mocha',
  },
  transformers: [codeMarks],
})
