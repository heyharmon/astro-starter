import type { AstroIntegration } from 'astro'

const RUNTIME_IMPORT = `import '@agentic-cms/edit-runtime'`

export function agenticEdit(): AstroIntegration {
  return {
    name: '@agentic-cms/edit-runtime',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        injectScript('page', RUNTIME_IMPORT)
      },
    },
  }
}

export default agenticEdit
