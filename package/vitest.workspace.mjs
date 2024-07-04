import { configDefaults, defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	'./*',
	{
		extends: './vitest.config.mjs',
		test: {
			exclude: [
				...configDefaults.exclude,
				'**/*.component-{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx'
			],
			name: 'unit',
			environment: './test/prisma/prisma-test-environment.mjs',
			setupFiles: ['./test/helpers/setup.mjs']
		}
	},
	{
		extends: './vitest.config.mjs',
		test: {
			include: [ '**/*.component-{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx' ],
			name: 'component',
			environment: './test/prisma/prisma-test-environment.mjs',
			setupFiles: ['./test/helpers/setup.mjs']
		}
	}
]);