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
            description: 'Dedicated GraphQL network inspector following DevTools standards',
            devtools_page: 'chrome/devtools.html',
            icons: {
              '128': 'icons/icon-128.png',
            },
            permissions: [],
            host_permissions: ['https://api.iconify.design/*'],
            author: 'Mario Ferrero',
            minimum_chrome_version: '140',
          },
          null,
          2,
        ),
      })
    },
  }
}
