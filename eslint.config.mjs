import { includeIgnoreFile } from '@eslint/compat';
import pluginJs from '@eslint/js';
import stylistcJs from '@stylistic/eslint-plugin-js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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