// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'
import stylistic from '@stylistic/eslint-plugin'

import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // stylistic.configs.all,
  stylistic.configs.recommended,

  // {
  //   files: ['**/*.{js,jsx,ts,tsx}'],
  //   plugins: {
  //     react,
  //   },
  //   rules: {
  //     ...react.configs.recommended.rules,
  //     'react/react-in-jsx-scope': 'off',
  //     'react/prop-types': 'off',
  //   },
  //   settings: {
  //     react: {
  //       version: 'detect',
  //     },
  //   },
  // },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  ...storybook.configs['flat/recommended'],
])

export default eslintConfig
