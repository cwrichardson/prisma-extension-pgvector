import pluginJs from '@eslint/js';
import stylistcJs from '@stylistic/eslint-plugin-js';
import tseslint from 'typescript-eslint';


export default [
  pluginJs.configs.recommended,
  {
    plugins: {
      '@stylistic/js': stylistcJs
    },
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022
      }
    },
    rules: {
      indent: ['error', 'tab'],
      quotes: ['error', 'single'],
      semi: ['warn', 'always', { omitLastInOneLineBlock: true }],
      'no-case-declarations': 0,
      'no-undef': 'error',
      'no-unused-vars': [
        'warn',
        {
          'vars': 'all',
          'args': 'after-used',
          'ignoreRestSiblings': true,
          'argsIgnorePattern': '^_'
        }
      ]
    }
  },
  ...tseslint.configs.recommended,
];