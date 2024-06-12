import { Prisma } from '@prisma/client';
import { fromSql, toSql } from 'pgvector/utils';
import { distanceTypeMap } from '../../../src/helpers/distance-types.js';

/**
 * @template T - ctx
 * @template A - args
 * 
 * 
 * @todo make sure take is an integer and deal with negative take
 * 
 * @this {T}
 * 
 * @param {import('$types/model-extensions/query').findNearestNeighborsArgs<T, A>} args
 * @returns {Promise<import('$types/model-extensions/query').findNearestNeighborsResults>}
 */
// @ts-ignore
export default async function ({orderBy = 'L2', from, where, take, configArgs}) {
    const ctx = Prisma.getExtensionContext(this);
    const {
        idFieldName = 'id',
        vectorFieldName
    } = configArgs;

    const ids = (where && where?.[idFieldName])
        ? where[idFieldName]?.in
        : undefined;
    const operator = distanceTypeMap[orderBy];

    // return in reverse order for InnerProduct (which is negative)
    // and Cosine (which should be subtracted from 1)
    const reverse = (orderBy === 'InnerProduct' || orderBy === 'Cosine')
        ? 'DESC '
        : '';

    /**
     * Construst the selector:
     * 
     * SELECT <idFieldName>,
     *  COALESCE (<vectorFieldName>::text, '') AS <vectorFieldName>
     * FROM <modelName>
     * WHERE <idFileldName> = ANY(ARRAY[ ...ids ])
     * ORDER BY <vecrotFieldName> <orderByOperator> <from>
     * LIMIT <take>
     * 
     * Need the `::text` to cast the unknown column type into something
     * supported.
     *
     */
    let querySelect = `
        SELECT
            ${Prisma.raw(idFieldName).strings[0]},
            COALESCE (${Prisma.raw(vectorFieldName).strings[0]}::text, '')
                AS ${Prisma.raw(vectorFieldName).strings[0]}
        FROM "${Prisma.raw(ctx.$name || '').strings[0]}"
    `;
    const orderSql = `
        ORDER BY ${Prisma.raw(vectorFieldName).strings[0]}
            ${operator} 
    `
    
    const queryStrings = [];
    
    if (ids) {
        querySelect += `
            WHERE ${Prisma.raw(idFieldName).strings[0]} = ANY(ARRAY[
        `;
        queryStrings.push(querySelect);

        for (let i = 0; i < ids.length - 1; i++) {
            queryStrings.push(',');
        }
        queryStrings.push(']) ' + orderSql)
    } else {
        querySelect += orderSql;
        queryStrings.push(querySelect);
    }

    const values = ids ? [ ...ids, toSql(from)] : [ toSql(from) ];

    if (take) {
        queryStrings.push(`::vector ${reverse} LIMIT `, '');
        values.push(take);
    } else {
        queryStrings.push(`::vector ${reverse}`);
    }

    const query = Prisma.sql(queryStrings, ...values);

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