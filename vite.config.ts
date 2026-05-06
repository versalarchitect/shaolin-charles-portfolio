import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  root: __dirname,

  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@predictive/ui': path.resolve(__dirname, '../../libs/shared/ui/src/index.ts'),
    },
  },

  server: {
    port: 3000,
    host: true,
  },

  css: {
    transformer: 'lightningcss',
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
    ],
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
    reportCompressedSize: false,
    target: ['chrome107', 'firefox104', 'safari16', 'edge107'],
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules/react-dom/') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'animation-vendor'
          }
          if (id.includes('node_modules/lucide-react/') || id.includes('node_modules/@radix-ui/')) {
            return 'ui-vendor'
          }
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'i18n-vendor'
          }
          if (id.includes('node_modules/@supabase/')) {
            return 'supabase-vendor'
          }

          // Gamification core: stores + libs (state management, sounds, explorer)
          if (
            id.includes('src/stores/progress.ts') ||
            id.includes('src/stores/bookmarks.ts') ||
            id.includes('src/stores/notifications.ts') ||
            id.includes('src/stores/ratings.ts') ||
            id.includes('src/lib/explorer.ts') ||
            id.includes('src/lib/sounds.ts')
          ) {
            return 'gamification-core'
          }

          // Curriculum data: large static dataset (44KB source), changes infrequently
          if (id.includes('src/data/curriculum.ts')) {
            return 'curriculum-data'
          }
        },
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0] || ''
          const info = fileName.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          } else if (/woff|woff2|ttf|eot/.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },

  envPrefix: 'VITE_',
})
