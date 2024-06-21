import { Prisma } from '@prisma/client';
import { fromSql, toSql } from 'pgvector';

import { createManyQueryBuilder } from '../../../src/helpers/create-many-query-builder.js';

/**
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/store').createManyVectorsAndReturnArgs<T, A>} args
 * @returns {Promise<import('$types/model-extensions/store').createManyVectorsAndReturnResult<T, A>>}
 */
// @ts-ignore
export default async function ({ data, configArgs }) {
	const ctx = Prisma.getExtensionContext(this);

	const {
		vectorFieldName,
		idFieldName = 'id'
	} = configArgs;

	const vectors = data.map((entry) => toSql(entry[vectorFieldName]));
	const ids = data.map((entry) => entry[idFieldName]
		? entry[idFieldName]
		: null);

	const query = createManyQueryBuilder({
		queryType: 'return',
		// @ts-ignore
		modelName: ctx.$name,
		idFieldName: idFieldName,
		vectorFieldName: vectorFieldName,
		ids: ids,
		vectors: vectors
	});

	// model methods don't exist until instantiated
	// @ts-ignore
	const record = await ctx.__$queryRaw(query)
		.then((/** @type {import('$types/vector.js').vectorEntry}[] */ rows) => (
			rows.map((
				/** @type {import('$types/vector.js').vectorEntry} */ entry,
				/** @type number */ i) => ({
				[idFieldName]: entry[idFieldName],
				[vectorFieldName]: fromSql(vectors[i])
			})
			)
		));
    
	return record;
}