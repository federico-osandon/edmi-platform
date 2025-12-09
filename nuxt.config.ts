// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  future: {
    compatibilityVersion: 4,
  },
  nitro: {
    externals: {
      inline: ['drizzle-orm'],
    },
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['better-sqlite3'],
    },
  },
})
