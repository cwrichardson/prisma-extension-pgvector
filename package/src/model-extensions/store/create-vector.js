import { Prisma } from '@prisma/client';
import { fromSql, toSql } from 'pgvector';

/**
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/store').createVectorArgs<T, A>} args
 * @returns {Promise<import('$types/model-extensions/store').createVectorResult<T, A>>}
 */
export default async function ({ data, configArgs }) {
    const ctx = Prisma.getExtensionContext(this);

    const {
        vectorFieldName,
        idFieldName = 'id'
    } = configArgs;

    const vector = toSql(data[vectorFieldName]);
    const id = data[idFieldName] ? data[idFieldName] : null;

    /**
     * Construct INSERT template for use in queryRaw. Either
     * 
     *  INSERT INTO "<modelName>" (<vectorFieldName)
     *  VALUES ($1::vector)
     * 
     * or
     * 
     *  INSERT INTO "<modelName>" (<idFieldName, <vectorFieldName>)
     *  VALUES ($1, $2::vector)
     * 
     * @see https://github.com/prisma/prisma/issues/13162#issuecomment-1769316967
     * 
     * As discussed there, `Prisma.raw` is used directly inside of a string
     * passed to `Prisma.sql`; however, that doesn't actually work, as 
     * `sql` requires an array of strings, and `raw` returns an object, so we
     * jump through some hoops here to construct the query. Probably there's
     * a better way to do this.
     */
    let queryInsert =
      `INSERT INTO "${Prisma.raw(ctx.$name || '').strings[0]}" `;
    let queryStrings;
    let values;

    if (id) {
        queryInsert += Prisma.raw(`(${idFieldName}, ${vectorFieldName})`)
          .strings[0] + ' VALUES (';
        queryStrings = [ queryInsert, ', ', '::vector)' ]
        values = [ data[idFieldName], vector ];
    } else {
        queryInsert += Prisma.raw(`(${vectorFieldName})`)
          .strings[0] += ' VALUES (';
        queryStrings = [ queryInsert, '::vector)' ]
        values = [ vector ];
    }

    const query = Prisma.sql(queryStrings, ...values);
    console.log(query);

    return ctx.__$queryRaw(query);

    const record = await ctx.__$queryRawUnsafe(query)
    .then(( /** @type Object[] */ rowData) => [idFieldName, vectorFieldName]
        .reduce((acc, /** @type keyof typeof rowData[0] */ record) => (
                record in rowData[0] && (acc[record] = rowData[0][record]),
                acc
        ), {})
    )
    .then(( /** @type Object */ rowObject) => ({
        // @ts-ignore
        ...rowObject, [vectorFieldName]: fromSql(rowObject[vectorFieldName])
    }))
    
    return record;
}