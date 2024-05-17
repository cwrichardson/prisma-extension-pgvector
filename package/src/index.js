import { Prisma } from '@prisma/client';

import * as store from './store/index.js';

/**
 * Initialize PGVector as Prisma Extension
 * 
 * @type {import('$types/index').withPGVector}
 */
export const withPGVector = (args) => Prisma.defineExtension(function (client) {
    const extensionMethods = {
        ...store,
        // @ts-expect-error
        __$transaction: async (/** @type {any} */ ...args) => client.$transaction(...args)
    }

    return client.$extends({
        name: 'prisma-extension-pgvector',
        model: Object.fromEntries([args.modelName, extensionMethods])
    })
})