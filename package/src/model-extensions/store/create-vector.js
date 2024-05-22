import { Prisma } from '@prisma/client';

/**
 * @template T - ctx
 * @template A - Args
 * @template V - vector column
 * 
 * @this {T}
 * @param {import('$types/store').createArgs<T, A, V>} args
 * @returns {Promise<import('$types/store').createResult<T, A>>}
 */
export default async function ({ data, ...args }) {
    const ctx = Prisma.getExtensionContext(this);

    return ctx.create({
        data: { ...data },
        ...args
    })
}