import { Prisma } from '@prisma/client';
import { fromSql, toSql } from 'pgvector';

/**
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/query').getVectorsByIdArgs<T, A>} args
 * @returns {Promise<import('$types/model-extensions/query').getVectorsByIdResult<T, A>>}
 */
// @ts-ignore
export default async function ({ where, configArgs}) {
    const ctx = Prisma.getExtensionContext(this);
    const {
        idFieldName = 'id',
        vectorFieldName
    } = configArgs;

    // @ts-ignore
    const ids = where[idFieldName]?.in;

    if (! Array.isArray(ids)) return Promise
    .reject(new Error(`getVectorsById expected array of ids, got ${typeof ids}`))

    /**
     * Construst the selector:
     * 
     * SELECT <idFieldName>,
     *   COALESCE (<vectorFieldName>::text, '') AS <vectorFieldName>
     * FROM <modelName> WHERE <idFileldName> = ANY(ARRAY[
     * 
     * Need the `::text` to cast the unknown column type into something
     * supported. Need the `COALESCE ... AS` to deal with case where
     * a record exists but the vector column is empty (i.e., NOT NULL was
     * not specified in the schema).
     */
    const querySelect = `
        SELECT
            ${Prisma.raw(idFieldName).strings[0]},
            COALESCE (${Prisma.raw(vectorFieldName).strings[0]}::text, '')
                AS ${Prisma.raw(vectorFieldName).strings[0]}
        FROM "${Prisma.raw(ctx.$name || '').strings[0]}"
        WHERE ${Prisma.raw(idFieldName).strings[0]} = ANY(ARRAY[
    `;
    console.log('QuerySelect', querySelect)

    const queryStrings = [querySelect];
    for (let i = 0; i < ids.length - 1; i++) {
        queryStrings.push(',');
    }
    queryStrings.push('])');

    const query = Prisma.sql(queryStrings, ...ids);

    // @ts-ignore
    const result = await ctx.__$queryRaw(query)
    .then((/** @type {import('$types/vector').vectorEntry[]} */ rows) => (
        rows.map((/** @type {import('$types/vector').vectorEntry} */row) => ({
            ...row,
            [vectorFieldName]: fromSql(row[vectorFieldName])
        })
    )));

    return result;
}