import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

/** Markdown -> safe HTML at build time. Raw HTML in the source is stripped by the sanitiser. */
export function renderMarkdown(md: string): string {
  const html = marked.parse(md, { async: false, gfm: true }) as string
  return sanitizeHtml(html, {
    allowedTags: ['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'hr', 'br', 'code', 'pre'],
    allowedAttributes: { a: ['href', 'title', 'rel'], img: ['src', 'alt', 'width', 'height', 'loading'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      h1: 'h2',
      a: (tag, attribs) => ({ tagName: 'a', attribs: { ...attribs, ...(attribs.href?.startsWith('http') ? { rel: 'noopener' } : {}) } }),
      img: (tag, attribs) => ({ tagName: 'img', attribs: { ...attribs, loading: 'lazy' } }),
    },
  })
}
