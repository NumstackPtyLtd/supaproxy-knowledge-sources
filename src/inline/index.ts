import type { KnowledgeSourcePlugin, ValidationResult, TextChunk, ChunkOptions } from '../types.js'
import { chunkText } from '../chunker.js'

export const inlinePlugin: KnowledgeSourcePlugin = {
  type: 'inline',
  name: 'Inline text',
  description: 'Provide text content directly as a knowledge source.',

  configSchema: {
    fields: [
      { name: 'name', label: 'Source name', type: 'text', required: true, placeholder: 'Company FAQ', helpText: 'A short identifier for this source' },
      { name: 'content', label: 'Content', type: 'textarea', required: true, placeholder: 'Paste your text content here...', helpText: 'The text content to use as a knowledge source' },
    ],
  },

  async validate(config): Promise<ValidationResult> {
    if (!config.name) return { ok: false, error: 'Source name is required' }
    if (!config.content) return { ok: false, error: 'Content is required' }
    return { ok: true }
  },

  async fetch(config): Promise<string> {
    return config.content
  },

  chunk(text: string, options?: ChunkOptions): TextChunk[] {
    return chunkText(text, options)
  },
}
