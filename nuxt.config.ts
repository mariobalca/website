export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  modules: ['@nuxt/eslint', '@nuxt/fonts'],
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },

  // Server only. Set at runtime with NUXT_TAMABLE_API_URL, NUXT_TAMABLE_READ_KEY,
  // NUXT_TAMABLE_WEBHOOK_SECRET and NUXT_FORGE_DEPLOY_HOOK_URL, never baked into the build.
  runtimeConfig: {
    tamableApiUrl: 'https://api.tamable.app/api/v1',
    tamableReadKey: '',
    tamableWebhookSecret: '',
    forgeDeployHookUrl: '',
    public: {
      siteUrl: 'https://mariobalca.com',
    },
  },

  fonts: {
    families: [
      { name: 'IBM Plex Sans', weights: [400, 500, 600], styles: ['normal', 'italic'] },
      { name: 'JetBrains Mono', weights: [400, 500] },
    ],
  },

  typescript: {
    strict: true,
  },
})
