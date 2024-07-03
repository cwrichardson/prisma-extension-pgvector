import { Prisma } from '@prisma/client';
import { toSql } from 'pgvector';

/**
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/store').updateManyVectorsArgs<T, A>} args
 * @returns {Promise<import('$types/model-extensions/store').updateManyVectorsResult<T, A>>}
 */
// @ts-expect-error configArgs not part of function definition
export default async function ({ data, configArgs }) {
	const ctx = Prisma.getExtensionContext(this);

	const {
		vectorFieldName,
		idFieldName = 'id'
	} = configArgs;
    
	/**
     * Construct UPDATE template for use in queryRaw.
     * 
     *  WITH update_values (id, vector) AS
     *  (
     *    VALUES
     *      ($1, $2::vector),
     *      ...
     *  )
     *  UPDATE "<modelName>"
     *  SET <vectorFieldName> = ud.vector
     *  FROM update_values ud
     *  WHERE ud.id = "<modelName>".<idFieldName>
     */
	const queryUpdate = 'WITH update_values (id, vector) AS (VALUES (';
	const queryClose =
      `::vector)) UPDATE "${Prisma.raw(ctx.$name || '').strings[0]}" `
      + `SET ${Prisma.raw(vectorFieldName).strings[0]} = ud.vector `
      + 'FROM update_values ud WHERE ud.id = '
      + `"${Prisma.raw(ctx.$name || '').strings[0]}".`
      + `${Prisma.raw(idFieldName).strings[0]}`;
    
	const queryStrings = [queryUpdate];
	const queryValues = [];

	for (let i=0; i < data.length - 1; i++) {
		if (!data[i][idFieldName]) {
			throw new Error(
				`UpdateManyVectors requires every object to have an ${idFieldName}`
			);
		}
		queryStrings.push(', ', '::vector), (');
		queryValues.push(data[i][idFieldName], toSql(data[i][vectorFieldName]));
	}

	queryStrings.push(', ', queryClose);
	if (!data[data.length - 1][idFieldName]) {
		throw new Error(
			`UpdateManyVectors requires every object to have an ${idFieldName}`
		);
	}
	queryValues.push(data[data.length - 1][idFieldName],
		toSql(data[data.length - 1][vectorFieldName]));

	const query = Prisma.sql(queryStrings, ...queryValues);

	const record = await ctx.__$executeRaw(query)
		.then(( /** @type number */ rows) => ({
			count: rows
		}));
  
	return record;
}