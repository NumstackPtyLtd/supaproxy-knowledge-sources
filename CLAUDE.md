# @supaproxy/knowledge-sources

Plugin package for SupaProxy knowledge source types. Each source type implements the `KnowledgeSourcePlugin` interface, providing a consistent way to fetch, validate, and chunk content from external sources for use in AI conversations.

See the [central hub](https://github.com/NumstackPtyLtd/supaproxy) for cross-repo governance, workflow, and conventions.

## Architecture

```
src/
├── types.ts              KnowledgeSourcePlugin, ConfigField, TextChunk, ChunkOptions, ValidationResult
├── registry.ts           PluginRegistry (list, get, register, schemas)
├── chunker.ts            Shared text chunking utility (word-based, overlap)
├── url/                  Fetch and extract text from a web page
│   └── index.ts          urlPlugin
├── confluence/           Fetch page content from Confluence
│   └── index.ts          confluencePlugin
├── inline/               Direct text input
│   └── index.ts          inlinePlugin
└── index.ts              Re-exports + auto-registration of built-in plugins
```

## Plugin pattern

Every knowledge source implements the `KnowledgeSourcePlugin` interface:

- `id`, `name`, `description`, `version`, `author`
- `configSchema` with fields the dashboard renders as a settings form
- `validate()` checks config before fetching
- `fetch()` returns raw text content
- `chunk()` splits text into embeddable chunks (use shared `chunkText` utility)

Built-in plugins are auto-registered on import via `registry.register()`.

## Adding a new source type

1. Create `src/my-source/index.ts` implementing `KnowledgeSourcePlugin`.
2. Export it from `src/index.ts`.
3. Auto-register it in `src/index.ts` with `registry.register()`.

## Build and test

```bash
pnpm install
pnpm build        # tsc, outputs to dist/
pnpm dev          # tsc --watch
pnpm clean        # rm -rf dist
```

No test suite currently. Tests should be added for new plugins.

## Publishing

```bash
pnpm build
# Version bump in package.json following semver
npm publish --access public
```

Published as `@supaproxy/knowledge-sources` on npm. Ships compiled `dist/` directory.

## Git workflow

- NEVER push directly to main. Always create a feature branch and open a PR.
- Branch naming: `feat/`, `fix/`, `chore/`, `docs/` prefixes.
- NEVER run destructive git commands (`git push --force`, `git reset --hard`, `git clean -f`).
- Squash merge to main via GitHub UI.

## Code rules

- No `any` types. No `as any` casts. Define interfaces for all parameters and return values.
- No hardcoded provider names, model IDs, or URLs.
- No em dashes or en dashes. Use commas, full stops, or semicolons.
- British English throughout (colour, organisation, behaviour).
- Straight quotes only. Sentence case for headings.
- Each plugin is a single exported object, not a class.
- Config schemas drive dashboard form rendering.
