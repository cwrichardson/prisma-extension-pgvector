import { includeIgnoreFile } from '@eslint/compat';
import pluginJs from '@eslint/js';
import stylistcJs from '@stylistic/eslint-plugin-js';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vitest from 'eslint-plugin-vitest';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitIgnorePath = path.resolve(__dirname, '.gitignore');
const packageIngorePaths = path.resolve(`${__dirname}/package/`, '.gitignore');
const devTestIngorePaths = path.resolve(`${__dirname}/dev-test/`, '.gitignore');

export default [
	includeIgnoreFile(gitIgnorePath),
	includeIgnoreFile(packageIngorePaths),
	includeIgnoreFile(devTestIngorePaths),
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.stylistic,
	{
		files: [
			'**/*.component-{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx',
			'**/test/**/*.test.mjs'
		],
		plugins: {
			vitest
		},
		rules: {
			...vitest.configs.recommended.rules,
			// _lots_ of the vitest syntax is unused expressions
			'@typescript-eslint/no-unused-expressions': 'off'
		}
	},
	{
		plugins: {
			'@stylistic/js': stylistcJs
		},
		languageOptions: {
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 'latest'
			},
			globals: {
				...globals.node
			}
		},
		/** @todo see if any of these rules need to be put back */
		// rules: {
		// 	indent: ['error', 'tab'],
		// 	quotes: ['error', 'single'],
		// 	semi: ['warn', 'always', { omitLastInOneLineBlock: true }],
		// 	'no-case-declarations': 0,
		// 	'no-undef': 'error',
		// 	'no-unused-vars': [
		// 		'warn',
		// 		{
		// 			'vars': 'all',
		// 			'args': 'after-used',
		// 			'ignoreRestSiblings': true,
		// 			'argsIgnorePattern': '^_'
		// 		}
		// 	]
		// }
	},
];