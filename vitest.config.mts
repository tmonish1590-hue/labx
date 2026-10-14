import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'lib/**/*.spec.ts', 'app/**/*.test.ts', 'app/**/*.spec.ts'],
    exclude: ['node_modules', '.next', 'coverage'],
    passWithNoTests: false,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      include: ['lib/**/*.ts', 'app/api/**/*.ts'],
      exclude: ['lib/**/*.test.ts', 'lib/**/*.spec.ts', 'app/**/*.test.ts', 'app/**/*.spec.ts'],
      thresholds: { lines: 80, functions: 80, branches: 70, statements: 80 },
      reportsDirectory: './coverage',
    },
  },
})
