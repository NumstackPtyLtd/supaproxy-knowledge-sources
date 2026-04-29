// Types
export type {
  KnowledgeSourcePlugin,
  ConfigField,
  ChunkOptions,
  TextChunk,
  ValidationResult,
} from './types.js'

// Chunker
export { chunkText } from './chunker.js'

// Registry
export { registry } from './registry.js'

// Plugins
export { urlPlugin } from './url/index.js'
export { confluencePlugin } from './confluence/index.js'
export { inlinePlugin } from './inline/index.js'

// Auto-register all built-in plugins
import { registry } from './registry.js'
import { urlPlugin } from './url/index.js'
import { confluencePlugin } from './confluence/index.js'
import { inlinePlugin } from './inline/index.js'

registry.register(urlPlugin)
registry.register(confluencePlugin)
registry.register(inlinePlugin)
