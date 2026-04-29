# @supaproxy/knowledge-sources

Plugin package for SupaProxy knowledge source types. Each source type implements the `KnowledgeSourcePlugin` interface.

## Architecture

```
src/
├── types.ts              KnowledgeSourcePlugin, ConfigField, TextChunk, ChunkOptions
├── registry.ts           PluginRegistry (list, get, register, schemas)
├── chunker.ts            Shared text chunking utility (word-based, overlap)
├── url/                  Fetch and extract text from a web page
│   └── index.ts          urlPlugin
├── confluence/           Fetch page content from Confluence
│   └── index.ts          confluencePlugin
├── inline/               Direct text input
│   └── index.ts          inlinePlugin
└── index.ts              Re-exports + auto-registration
```

## Adding a new source type

1. Create `src/my-source/index.ts` implementing `KnowledgeSourcePlugin`
2. Export from `src/index.ts`
3. Auto-register in `src/index.ts`

## Code rules

- Each plugin is a single exported object, not a class
- Config schemas drive dashboard form rendering
- `validate()` checks config before fetching
- `fetch()` returns raw text content
- `chunk()` splits text into embeddable chunks (use shared `chunkText` utility)
