// no Prisma to import until client is build
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Prisma } from '@prisma/client';
import { fromSql, toSql } from 'pgvector';

/**
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/store.d.ts').updateVectorArgs<T, A>} args
 * @returns {Promise<import('$types/model-extensions/store.d.ts').updateVectorResult<T>>}
 */
// @ts-expect-error configArgs not part of function definition
export default async function ({ data, where, configArgs }) {
	const ctx = Prisma.getExtensionContext(this);

	const {
		vectorFieldName,
		idFieldName = 'id'
	} = configArgs;

	if (!data?.[vectorFieldName]) throw new Error('data object is required.');
	if (!where?.[idFieldName]) throw new Error('where: { <idFieldName>: <id>  } is required');

	const vector = toSql(data[vectorFieldName]);
	const id = where[idFieldName];
    
	/**
     * Initialize the return object
     * Reverse the `toSql` we did earlier to get a standardized form, rather
     * than just taking the submitted data as Prisma does with their
     * PostGIS example.
     * 
     * @see https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/custom-and-type-safe-queries#41-adding-an-extension-to-create-pointofinterest-records
     */
	const /** @type {import('$types/vector.d.ts').vectorEntry<T>} */ v = {
		[idFieldName]: id,
		[vectorFieldName]: fromSql(vector)
	};

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
      `::vector WHERE ${Prisma.raw(idFieldName).strings[0]} = `;

	const query = Prisma.sql([queryUpdate, queryWhere, ''], vector, id);

	const record = await ctx.__$queryRaw(query)
		.then(() => v);
    
	return record;
}