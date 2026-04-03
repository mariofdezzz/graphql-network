import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { manifest } from './plugins/manifest'

export default defineConfig({
  plugins: [vue(), tailwindcss(), manifest()],
  resolve: {
    alias: [
      {
        // Redirect bare 'monaco-editor' to the core API only.
        // Regex is required — a string alias does prefix matching and would
        // also intercept 'monaco-editor/esm/...' deep imports.
        find: /^monaco-editor$/,
        replacement: fileURLToPath(
          new URL('node_modules/monaco-editor/esm/vs/editor/editor.api', import.meta.url),
        ),
      },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
})
