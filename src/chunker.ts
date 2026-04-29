import type { TextChunk, ChunkOptions } from './types.js'

const DEFAULT_MAX_TOKENS = 500
const DEFAULT_OVERLAP = 50

// Simple word-based chunking (1 token ≈ 1 word for estimation)
export function chunkText(text: string, options?: ChunkOptions): TextChunk[] {
  const maxTokens = options?.maxTokens ?? DEFAULT_MAX_TOKENS
  const overlap = options?.overlap ?? DEFAULT_OVERLAP
  const words = text.split(/\s+/).filter(Boolean)
  const chunks: TextChunk[] = []
  let i = 0
  let index = 0

  while (i < words.length) {
    const end = Math.min(i + maxTokens, words.length)
    chunks.push({
      text: words.slice(i, end).join(' '),
      index: index++,
    })
    i = end - overlap
    if (i >= words.length) break
    if (end === words.length) break
  }

  return chunks
}
