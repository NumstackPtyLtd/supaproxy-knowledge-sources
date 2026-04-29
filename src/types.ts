export interface ConfigField {
  name: string
  label: string
  type: 'text' | 'password' | 'select' | 'textarea'
  required: boolean
  placeholder?: string
  helpText?: string
  options?: string[]
}

export interface ChunkOptions {
  maxTokens?: number     // default 500
  overlap?: number       // default 50 tokens
}

export interface TextChunk {
  text: string
  index: number
  metadata?: Record<string, string>
}

export interface ValidationResult {
  ok: boolean
  error?: string
}

export interface KnowledgeSourcePlugin {
  readonly type: string          // 'url', 'confluence', 'file', 'inline'
  readonly name: string
  readonly description: string
  readonly configSchema: { fields: ConfigField[] }

  validate(config: Record<string, string>): Promise<ValidationResult>
  fetch(config: Record<string, string>): Promise<string>      // returns raw text
  chunk(text: string, options?: ChunkOptions): TextChunk[]     // or use shared chunker
}
