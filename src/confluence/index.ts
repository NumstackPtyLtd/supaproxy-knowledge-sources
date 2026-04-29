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

export const confluencePlugin: KnowledgeSourcePlugin = {
  type: 'confluence',
  name: 'Confluence',
  description: 'Fetch page content from Atlassian Confluence.',

  configSchema: {
    fields: [
      { name: 'base_url', label: 'Confluence base URL', type: 'text', required: true, placeholder: 'https://your-domain.atlassian.net', helpText: 'Your Confluence instance URL' },
      { name: 'email', label: 'Email', type: 'text', required: true, placeholder: 'user@example.com', helpText: 'Atlassian account email' },
      { name: 'api_token', label: 'API token', type: 'password', required: true, placeholder: 'Your Confluence API token', helpText: 'Generate from id.atlassian.com/manage-profile/security/api-tokens' },
      { name: 'page_id', label: 'Page ID', type: 'text', required: true, placeholder: '123456', helpText: 'The Confluence page ID to fetch' },
    ],
  },

  async validate(config): Promise<ValidationResult> {
    if (!config.base_url) return { ok: false, error: 'Confluence base URL is required' }
    if (!config.email) return { ok: false, error: 'Email is required' }
    if (!config.api_token) return { ok: false, error: 'API token is required' }
    if (!config.page_id) return { ok: false, error: 'Page ID is required' }
    try {
      new URL(config.base_url)
    } catch {
      return { ok: false, error: 'Invalid base URL format' }
    }
    return { ok: true }
  },

  async fetch(config): Promise<string> {
    const baseUrl = config.base_url.replace(/\/$/, '')
    const url = `${baseUrl}/wiki/api/v2/pages/${config.page_id}?body-format=storage`
    const auth = Buffer.from(`${config.email}:${config.api_token}`).toString('base64')

    const res = await globalThis.fetch(url, {
      signal: AbortSignal.timeout(30000),
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    })
    if (!res.ok) throw new Error(`Confluence API error: ${res.status} ${res.statusText}`)

    const data = await res.json() as { body?: { storage?: { value?: string } } }
    const storageValue = data.body?.storage?.value
    if (!storageValue) throw new Error('No content found in Confluence page')

    return stripHtml(storageValue)
  },

  chunk(text: string, options?: ChunkOptions): TextChunk[] {
    return chunkText(text, options)
  },
}
