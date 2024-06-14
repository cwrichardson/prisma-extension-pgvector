import { configDefaults, defineWorkspace } from 'vitest/config';

export default defineWorkspace([
    './*',
    {
        extends: './vitest.config.js',
        test: {
            exclude: [
                ...configDefaults.exclude,
                '**/*.e2e-{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx'
            ],
            name: 'unit',
            environment: './test/prisma/prisma-test-environment.js'
        }
    },
    {
        extends: './vitest.config.js',
        test: {
            include: [ '**/*.e2e-{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx' ],
            name: 'e2e',
            environment: './test/prisma/prisma-test-environment.js'
        }
    }
])