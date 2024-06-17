import { configDefaults, defineWorkspace } from 'vitest/config';

export default defineWorkspace([
    './*',
    {
        extends: './vitest.config.js',
        test: {
            exclude: [
                ...configDefaults.exclude,
                '**/*.component-{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx'
            ],
            name: 'unit',
            environment: './test/prisma/prisma-test-environment.js',
            setupFiles: ['./test/helpers/setup.js']
        }
    },
    {
        extends: './vitest.config.js',
        test: {
            include: [ '**/*.component-{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx' ],
            name: 'component',
            environment: './test/prisma/prisma-test-environment.js',
            setupFiles: ['./test/helpers/setup.js']
        }
    }
])