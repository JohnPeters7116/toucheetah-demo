import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // GitHub Pages serves the app from a subpath and can't serve a dev server.
  // Using a relative base keeps asset URLs working from any repo name.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'images/logo/logo.png',
        'images/stops/*.jpg',
        'images/pins/*.png',
        'images/ui/*.png',
        'audio/*.mp3'
      ],
        manifest: {
          name: 'Tour Cheetah London',
          short_name: 'Tour Cheetah',
          description: 'Self-guided Santander Cycles audio tour of London',
          theme_color: '#2c3e50',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          start_url: './',
          icons: [
            {
              src: 'images/logo/icon-192.png',
              sizes: '192x192',
              type: 'image/png'
          },
          {
            src: 'images/logo/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'images/logo/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,mp3,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.tfl\.gov\.uk\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tfl-api',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: /^https:\/\/tiles\.openfreemap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'openfreemap-tiles',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  }
});
