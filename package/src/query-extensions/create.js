import { Prisma } from '@prisma/client';
import { toSql } from 'pgvector';

/**
 * Extend the default `create` method to support vectors in our model.
 * 
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/query').createQueryArgs<T>} args
 * @returns {import('$types/query').createQueryResult<T, A>}
 */
export default async function ({ model, operation, args, query, vectorFieldName }) {
    const ctx = Prisma.getExtensionContext(this);

    // if we're not adding vector data, or including it in the return, just
    // run the native Prisma client query
    if (! (args?.data.hasOwnProperty(vectorFieldName) || args?.select.hasOwnProperty(vectorFieldName))) {
        return query(args);
    }
    // normal case ... we're inserting a vector. If we're _only_ inserting
    // a vector, just do it. Otherwise, run a transaction to insert the vector
    // first & then update the record with the rest of the data
    else if (args?.data.hasOwnProperty(vectorFieldName)) {
        const dataParams = Object.keys(args.data);
        const vector = toSql(args.data[vectorFieldName]);

        if (dataParams.length === 1) {
            return ctx.$parent[ctx.$name].$queryRawUnsafe(`INSERT INTO ${model} (${vectorFieldName}) VALUES $1::vector`, vector);
        } else {
            return ctx.$parent[ctx.$name].__$transaction
        }
    }
    // we're creating an entry with no vector data, but including the vector
    // field in the return. Weird, but maybe there's a default.
    else {
        return Promise.reject('Boo!');
    }
}
/* export default async function ({ data, ...args }) {
    const ctx = Prisma.getExtensionContext(this);

    return ctx.create({
        data: { ...data },
        ...args
    })
} */