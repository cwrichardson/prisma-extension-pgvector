import { beforeEach } from 'vitest';

import resetDb from './reset-db';
import { beforeAll } from 'vitest';
import prisma from './prisma';

beforeAll(async () => {
	await prisma.$executeRawUnsafe(`
        DO $$
            BEGIN
                EXECUTE 'SET search_path TO '||current_setting('search_path')||',extension';
            END
        $$;
    `);
});

beforeEach(async () => {
	await resetDb();
});