import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';

import { PrismaClient } from '@prisma/client';
import { withPGVector } from '../../src/index.js';

const prisma = new PrismaClient().$extends(withPGVector({
    modelName: 'vector',
    vectorFieldName: 'embedding'
}));

function generateDatabaseURL(/** @type string */ schema) {
    if (!process.env.DATABASE_URL) {
        throw new Error('Please provide a DATABASE_URL environment variable.');
    }

    const url = new URL(process.env.DATABASE_URL);

    url.searchParams.set('schema', schema);

    return url.toString();
}

export default {
    name: 'prisma',
    transformMode: 'ssr',
    async setup() {
        // random name for schema
        const schema = randomUUID();
        const databaseURL = generateDatabaseURL(schema);

        //deploy the test migration
        execSync('pnpx prisma migrate deploy --schema ./test/prisma/schema.prisma');

        return {
            async teardown() {
                await prisma.$executeRawUnsafe(
                    `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
                );
                await prisma.$disconnect();
            }
        }
    }
}