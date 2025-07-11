import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...compat.extends('next'),
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('prettier'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
]