// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    '@pinia/nuxt'
  ],
  ui: {
    icons: ['heroicons', 'simple-icons'],
    safelistColors: ['primary', 'red', 'orange', 'green']
  },
  devtools: {
    enabled: true
  },
  typescript: {
    strict: false
  },
  supabase: {
    // redirect: false
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: ['/signup', '/reset-password', '/confirm'],
      cookieRedirect: false
    }
  },
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**']
  },
  eslint: {
    config: {
      stylistic: {
        indent: 'tab',
        semi: false,
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  imports: {
    dirs: ['stores']
  }
})
