import sanityConfig from '@sanity/eslint-config-studio'
import tseslint from 'typescript-eslint'

export default [
  ...sanityConfig,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
  },
]
