import { Prisma } from '@prisma/client';
import { toSql } from 'pgvector';

/**
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/store').createVectorArgs<T, A>}
 * @returns {Promise<import('$types/model-extensions/store').createVectorResult<T, A>>}
 */
export default async function ({ data, configArgs }) {
    const ctx = Prisma.getExtensionContext(this);

    const {
        vectorFieldName,
        idFieldName = 'id'
    } = configArgs;

    const vector = toSql(data[vectorFieldName]);
    const 

    return ctx.create({
        data: { ...data },
        ...args
    })
}