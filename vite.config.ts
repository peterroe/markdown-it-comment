import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  // keep the same name as your github repos
  base: '/markdown-it-comment/',
  mode: 'production',
  build: {
    outDir: './docs',
  },
})
