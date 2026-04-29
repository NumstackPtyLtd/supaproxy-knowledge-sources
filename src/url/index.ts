import type { KnowledgeSourcePlugin, ValidationResult, TextChunk, ChunkOptions } from '../types.js'
import { chunkText } from '../chunker.js'

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export const urlPlugin: KnowledgeSourcePlugin = {
  type: 'url',
  name: 'URL',
  description: 'Fetch and extract text content from a web page.',

  configSchema: {
    fields: [
      { name: 'name', label: 'Source name', type: 'text', required: true, placeholder: 'Product docs', helpText: 'A short identifier for this source' },
      { name: 'url', label: 'URL', type: 'text', required: true, placeholder: 'https://docs.example.com/page', helpText: 'The web page to fetch content from' },
    ],
  },

  async validate(config): Promise<ValidationResult> {
    if (!config.url) return { ok: false, error: 'URL is required' }
    try {
      new URL(config.url)
    } catch {
      return { ok: false, error: 'Invalid URL format' }
    }
    if (!config.name) return { ok: false, error: 'Source name is required' }
    return { ok: true }
  },

  async fetch(config): Promise<string> {
    const res = await globalThis.fetch(config.url, {
      signal: AbortSignal.timeout(30000),
      headers: { 'User-Agent': 'SupaProxy/1.0' },
    })
    if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`)
    const html = await res.text()
    return stripHtml(html)
  },

  chunk(text: string, options?: ChunkOptions): TextChunk[] {
    return chunkText(text, options)
  },
}
