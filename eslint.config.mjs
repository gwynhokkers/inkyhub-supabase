import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
//   extends: [
//   '@nuxt/eslint-config'
//   ],
  rules: {
    // Global
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'],
    // Vue
    'vue/multi-word-component-names': 0,
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: {
          max: 5
        }
      }
    ],
    'vue/no-v-html': 0
  }
})
