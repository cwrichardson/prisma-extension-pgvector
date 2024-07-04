// no Prisma to import until client is build
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Prisma } from '@prisma/client';
import { toSql } from 'pgvector';

import { createManyQueryBuilder } from '../../../src/helpers/create-many-query-builder.mjs';

/**
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/store.d.ts').createManyVectorsArgs<T, A>} args
 * @returns {Promise<import('$types/model-extensions/store.d.ts').createManyVectorsResult<T, A>>}
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
		modelName: ctx.$name,
		idFieldName: idFieldName,
		vectorFieldName: vectorFieldName,
		ids: ids,
		vectors: vectors
	});

	const record = await ctx.__$executeRaw(query)
		.then(( /** @type number */ rows) => ({
			count: rows
		}));
    
	return record;
}