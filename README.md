# @supaproxy/knowledge-sources

[![npm version](https://img.shields.io/npm/v/@supaproxy/knowledge-sources)](https://www.npmjs.com/package/@supaproxy/knowledge-sources)
[![license](https://img.shields.io/npm/l/@supaproxy/knowledge-sources)](./LICENSE)

Plugin package for [SupaProxy](https://supaproxy.com) knowledge source types. Knowledge sources feed content into SupaProxy workspaces so the AI agent can answer questions using your documentation, wikis, and other text.

Each plugin knows how to fetch content from a specific source, validate credentials, and chunk text for embedding.

## Installation

```bash
npm install @supaproxy/knowledge-sources
```

## Quick start

```typescript
import { registry, chunkText } from '@supaproxy/knowledge-sources'

// All built-in plugins are auto-registered on import.

// List available source types
console.log(registry.types()) // ['url', 'confluence', 'inline']

// Fetch content from a URL source
const urlPlugin = registry.get('url')

const validation = await urlPlugin.validate({ url: 'https://docs.example.com' })
if (validation.ok) {
  const rawText = await urlPlugin.fetch({ url: 'https://docs.example.com' })
  const chunks = urlPlugin.chunk(rawText, { maxTokens: 500, overlap: 50 })
  console.log(`Created ${chunks.length} chunks`)
}

// Use the shared chunker directly
const chunks = chunkText('A long document...', { maxTokens: 300, overlap: 30 })
```

## API reference

### `KnowledgeSourcePlugin`

The interface every knowledge source type must implement.

```typescript
interface KnowledgeSourcePlugin {
  readonly type: string          // Unique identifier: 'url', 'confluence', etc.
  readonly name: string          // Human-readable name
  readonly description: string   // Short description
  readonly configSchema: { fields: ConfigField[] }

  validate(config: Record<string, string>): Promise<ValidationResult>
  fetch(config: Record<string, string>): Promise<string>       // Returns raw text
  chunk(text: string, options?: ChunkOptions): TextChunk[]      // Split into chunks
}
```

### `TextChunk`

```typescript
interface TextChunk {
  text: string
  index: number
  metadata?: Record<string, string>
}
```

### `ChunkOptions`

```typescript
interface ChunkOptions {
  maxTokens?: number   // Default: 500
  overlap?: number     // Default: 50 tokens
}
```

### `ValidationResult`

```typescript
interface ValidationResult {
  ok: boolean
  error?: string
}
```

### `ConfigField`

```typescript
interface ConfigField {
  name: string
  label: string
  type: 'text' | 'password' | 'select' | 'textarea'
  required: boolean
  placeholder?: string
  helpText?: string
  options?: string[]
}
```

### `chunkText(text, options?)`

Shared utility for word-based text chunking with configurable overlap. Available as a standalone export for use outside of plugins.

```typescript
import { chunkText } from '@supaproxy/knowledge-sources'

const chunks = chunkText(longDocument, { maxTokens: 400, overlap: 40 })
// Returns TextChunk[] with sequential indices
```

### Registry methods

| Method | Returns | Description |
|--------|---------|-------------|
| `registry.list()` | `KnowledgeSourcePlugin[]` | All registered plugins |
| `registry.get(type)` | `KnowledgeSourcePlugin` | Get plugin by type (throws if not found) |
| `registry.has(type)` | `boolean` | Check if a plugin type is registered |
| `registry.types()` | `string[]` | List all registered type identifiers |
| `registry.schemas()` | `Array<{type, name, description, configSchema}>` | Config schemas for dashboard forms |
| `registry.register(plugin)` | `void` | Register a custom plugin |

## Available plugins

| Plugin | Type | Description |
|--------|------|-------------|
| URL | `url` | Fetches and extracts text content from a web page URL. |
| Confluence | `confluence` | Pulls content from Atlassian Confluence pages and spaces. Requires Confluence API credentials. |
| Inline | `inline` | Accepts raw text directly. Useful for pasting documentation or custom content that does not live at a URL. |

## Adding a new source type

Create a file that implements `KnowledgeSourcePlugin`:

```typescript
import type { KnowledgeSourcePlugin } from '@supaproxy/knowledge-sources'
import { chunkText } from '@supaproxy/knowledge-sources'

export const myPlugin: KnowledgeSourcePlugin = {
  type: 'my-source',
  name: 'My Source',
  description: 'Fetches content from my custom source',
  configSchema: {
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true },
      { name: 'spaceId', label: 'Space ID', type: 'text', required: true },
    ],
  },

  async validate(config) {
    // Validate credentials and connectivity
    return { ok: true }
  },

  async fetch(config) {
    // Fetch raw text from the source
    return 'The full text content...'
  },

  chunk(text, options) {
    // Use the shared chunker or implement custom chunking
    return chunkText(text, options)
  },
}
```

Then register it:

```typescript
import { registry } from '@supaproxy/knowledge-sources'
import { myPlugin } from './my-plugin.js'

registry.register(myPlugin)
```

## Contributing

See the [SupaProxy contributing guide](https://github.com/NumstackPtyLtd/supaproxy) for development workflow, code standards, and PR process.

## License

MIT
