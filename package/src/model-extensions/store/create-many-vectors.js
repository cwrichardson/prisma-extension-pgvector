import { Prisma } from '@prisma/client';
import { toSql } from 'pgvector';

import { createManyQueryBuilder } from '../../../src/helpers/create-many-query-builder.js';

/**
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/store').createManyVectorsArgs<T, A>} args
 * @returns {Promise<import('$types/model-extensions/store').createManyVectorsResult<T, A>>}
 */
// @ts-expect-error configArgs not part of function signature
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
		queryType: 'count',
		// @ts-expect-error
		modelName: ctx.$name,
		idFieldName: idFieldName,
		vectorFieldName: vectorFieldName,
		ids: ids,
		vectors: vectors
	});

	// @ts-expect-error model methods don't exist until instantiated
	const record = await ctx.__$executeRaw(query)
		.then(( /** @type number */ rows) => ({
			count: rows
		}));
    
	return record;
}