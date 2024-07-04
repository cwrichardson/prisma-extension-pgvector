// no Prisma to import until client is build
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Prisma } from '@prisma/client';
import { fromSql } from 'pgvector';

/**
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/query.d.ts').getVectorsByIdArgs<T, A>} args
 * @returns {Promise<import('$types/model-extensions/query.d.ts').getVectorsByIdResult<T>>}
 */
// @ts-expect-error configArgs not part of function signature
export default async function ({ where, configArgs}) {
	const ctx = Prisma.getExtensionContext(this);

	const {
		idFieldName = 'id',
		vectorFieldName
	} = configArgs;

	
	const ids = where[idFieldName]?.in;

	if (! Array.isArray(ids)) return Promise
		.reject(new Error(`getVectorsById expected array of ids, got ${typeof ids}`));

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

	const queryStrings = [querySelect];
	for (let i = 0; i < ids.length - 1; i++) {
		queryStrings.push(',');
	}
	queryStrings.push('])');

	const query = Prisma.sql(queryStrings, ...ids);

	const result = await ctx.__$queryRaw(query)
		.then((/** @type {import('$types/vector.d.ts').vectorEntry<T>[]} */ rows) => (
			rows.map((/** @type {import('$types/vector.d.ts').vectorEntry<T>} */row) => ({
				...row,
				[vectorFieldName]: fromSql(row[vectorFieldName])
			})
			)));

	return result;
}