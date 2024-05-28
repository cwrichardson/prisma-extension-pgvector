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
     * Initialize the return object
     * Reverse the `toSql` we did earlier to get a standardized form, rather
     * than just taking the submitted data as Prisma does with their
     * PostGIS example.
     * 
     * @see https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/custom-and-type-safe-queries#41-adding-an-extension-to-create-pointofinterest-records
     */
    const /** @type {import('$types/vector').vectorEntry} */ v = {
        [vectorFieldName]: fromSql(vector)
    }

    /**
     * Construct INSERT template for use in queryRaw. Either
     * 
     *  INSERT INTO "<modelName>" (<vectorFieldName>)
     *  VALUES ($1::vector)
     *  RETURNING <idFieldName>
     * 
     * or
     * 
     *  INSERT INTO "<modelName>" (<idFieldName>, <vectorFieldName>)
     *  VALUES ($1, $2::vector)
     *  RETURNING <idFieldName>
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
    const queryClose =
      `::vector) RETURNING ${Prisma.raw(idFieldName).strings[0]}`;

    if (id) {
        queryInsert += Prisma.raw(`(${idFieldName}, ${vectorFieldName})`)
          .strings[0] + ' VALUES (';
        queryStrings = [ queryInsert, ', ', queryClose ]
        values = [ data[idFieldName], vector ];
    } else {
        queryInsert += Prisma.raw(`(${vectorFieldName})`)
          .strings[0] += ' VALUES (';
        queryStrings = [ queryInsert, queryClose ]
        values = [ vector ];
    }

    const query = Prisma.sql(queryStrings, ...values);

    // model methods don't exist until instantiated
    // @ts-ignore
    const record = await ctx.__$queryRaw(query)
    .then(( /** @type Object[] */ rowData) => ({
        ...v,
        ...rowData[0]
    }));
    
    return record;
}