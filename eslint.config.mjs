import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
//   extends: [
//   '@nuxt/eslint-config'
//   ],
  rules: {
    // Global
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
