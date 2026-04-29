import pino from 'pino'
import type { KnowledgeSourcePlugin } from './types.js'

const log = pino({ name: 'knowledge-source-registry' })

class PluginRegistry {
  /** @internal */
  readonly plugins = new Map<string, KnowledgeSourcePlugin>()

  register(plugin: KnowledgeSourcePlugin): void {
    if (this.plugins.has(plugin.type)) {
      log.warn({ type: plugin.type }, 'Plugin already registered, replacing')
    }
    this.plugins.set(plugin.type, plugin)
    log.info({ type: plugin.type, name: plugin.name }, 'Knowledge source plugin registered')
  }

  get(type: string): KnowledgeSourcePlugin {
    const plugin = this.plugins.get(type)
    if (!plugin) throw new Error(`Knowledge source plugin not found: ${type}`)
    return plugin
  }

  has(type: string): boolean {
    return this.plugins.has(type)
  }

  types(): string[] {
    return Array.from(this.plugins.keys())
  }

  list(): KnowledgeSourcePlugin[] {
    return Array.from(this.plugins.values())
  }

  schemas(): Array<{
    type: string
    name: string
    description: string
    configSchema: KnowledgeSourcePlugin['configSchema']
  }> {
    return this.list().map((p) => ({
      type: p.type,
      name: p.name,
      description: p.description,
      configSchema: p.configSchema,
    }))
  }
}

export const registry = new PluginRegistry()
