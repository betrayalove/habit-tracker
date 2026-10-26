import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,cjs}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.jest } },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'error' },
  },
  { files: ['**/*.d.ts'], rules: { '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }] } },
);
