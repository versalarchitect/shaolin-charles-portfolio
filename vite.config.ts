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
    port: 3001,
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
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
    reportCompressedSize: false,
    target: ['chrome107', 'firefox104', 'safari16', 'edge107'],
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-slot'],
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
