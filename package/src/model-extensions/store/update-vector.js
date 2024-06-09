import { Prisma } from '@prisma/client';
import { fromSql, toSql } from 'pgvector';

/**
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/store').updateVectorArgs<T, A>} args
 * @returns {Promise<import('$types/model-extensions/store').updateVectorResult<T, A>>}
 */
// @ts-ignore
export default async function ({ data, configArgs }) {
    const ctx = Prisma.getExtensionContext(this);

    const {
        vectorFieldName,
        idFieldName = 'id'
    } = configArgs;

    const vector = toSql(data[vectorFieldName]);
    const id = data[idFieldName];
    
    /**
     * Initialize the return object
     * Reverse the `toSql` we did earlier to get a standardized form, rather
     * than just taking the submitted data as Prisma does with their
     * PostGIS example.
     * 
     * @see https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/custom-and-type-safe-queries#41-adding-an-extension-to-create-pointofinterest-records
     */
    const /** @type {import('$types/vector').vectorEntry} */ v = {
        [idFieldName]: id,
        [vectorFieldName]: fromSql(vector)
    }

    /**
     * Construct UPDATE template for use in queryRaw.
     * 
     *  UPDATE "<modelName>"
     *  SET <vectorFieldName> = $1::vector
     *  WHERE <idFieldName> = $2
     */
    const queryUpdate =
      `UPDATE "${Prisma.raw(ctx.$name || '').strings[0]}" `
      + `SET ${Prisma.raw(vectorFieldName).strings[0]} = `;
    const queryWhere =
      `::vector WHERE ${Prisma.raw(idFieldName).strings[0]} = `

    const query = Prisma.sql([queryUpdate, queryWhere, ""], vector, id);

    // model methods don't exist until instantiated
    // @ts-ignore
    const record = await ctx.__$queryRaw(query)
    .then(() => v);
    
    return record;
}