import pkg from '../package.json'
import type { Plugin } from 'vite'

export function manifest(): Plugin {
  return {
    name: 'manifest-version',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(
          {
            manifest_version: 3,
            name: 'GraphQL Network',
            version: pkg.version,
            description: 'Extensión de DevTools para monitorear peticiones GraphQL',
            devtools_page: 'chrome/devtools.html',
            permissions: [],
          },
          null,
          2,
        ),
      })
    },
  }
}
