// Slate code theme for Shiki, passed to Nextra through
// mdxOptions.rehypePrettyCodeOptions in next.config.mjs. Nextra paints the
// code block itself (#1e293b in dark mode, see app/globals.css); this file
// colours only the tokens. Every colour is a Tailwind slate or 300-step hue,
// measured against #1e293b (WCAG 2.2 SC 1.4.3 needs 4.5:1):
//   #e2e8f0 11.87  #cbd5e1 9.85  #94a3b8 5.71  #6ee7b7 9.60  #fcd34d 10.15
//   #f9a8d4 8.07   #7dd3fc 8.77  #c4b5fd 7.92  #fdba74 8.67  #fca5a5 7.71
// The site is dark only, so the same theme fills Nextra's light and dark slots.

const slate = {
  name: 'slate',
  type: 'dark',
  colors: {
    'editor.background': '#1e293b',
    'editor.foreground': '#e2e8f0'
  },
  tokenColors: [
    { settings: { foreground: '#e2e8f0' } },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: '#94a3b8', fontStyle: 'italic' }
    },
    {
      scope: ['keyword', 'storage', 'storage.type', 'keyword.operator.new', 'keyword.operator.expression'],
      settings: { foreground: '#6ee7b7' }
    },
    {
      scope: ['string', 'string.template', 'punctuation.definition.string', 'markup.inline.raw'],
      settings: { foreground: '#fcd34d' }
    },
    {
      scope: ['constant.numeric', 'constant.language', 'constant.character', 'constant.other', 'support.constant'],
      settings: { foreground: '#f9a8d4' }
    },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call', 'variable.function'],
      settings: { foreground: '#7dd3fc' }
    },
    {
      scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class'],
      settings: { foreground: '#c4b5fd' }
    },
    {
      scope: ['entity.name.tag', 'markup.heading'],
      settings: { foreground: '#6ee7b7' }
    },
    {
      scope: ['entity.other.attribute-name', 'support.type.property-name', 'meta.object-literal.key'],
      settings: { foreground: '#fdba74' }
    },
    {
      scope: ['punctuation', 'keyword.operator', 'meta.brace'],
      settings: { foreground: '#cbd5e1' }
    },
    {
      scope: ['markup.deleted', 'invalid'],
      settings: { foreground: '#fca5a5' }
    },
    {
      scope: ['markup.inserted'],
      settings: { foreground: '#6ee7b7' }
    },
    {
      scope: ['markup.bold'],
      settings: { fontStyle: 'bold' }
    },
    {
      scope: ['markup.italic'],
      settings: { fontStyle: 'italic' }
    }
  ]
}

export default slate
