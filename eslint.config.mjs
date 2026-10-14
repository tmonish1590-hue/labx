import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

export default defineConfig([
  globalIgnores(['.next/**', 'coverage/**', 'node_modules/**', 'next-env.d.ts']),
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // These effects hydrate client-only saved trial data after SSR.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
