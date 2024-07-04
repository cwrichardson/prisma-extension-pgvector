// no Prisma to import until client is build
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Prisma } from '@prisma/client';

/**
 * Extend the default `create` method to support vectors in our model.
 * 
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/overrides.d.ts').findManyArgs<T, A>} props
 * @returns {Promise<import('$types/model-extensions/overrides.d.ts').findManyResult<T, A>>}
 */
export default async function (props) {
	const {
		configArgs, parentContext,
		select = undefined,
		orderBy = undefined,
		from = undefined,
		...args
	} = props;

	const ctx = Prisma.getExtensionContext(this);
	const baseFindMany = ctx?.$name
		? parentContext[ctx.$name].findMany
		: () => {
			// do nothing
		};

	/** @type {import('$types/index.d.ts').configArgs} */
	const {
		vectorFieldName,
		idFieldName = 'id'
	} = configArgs;

	// separate any vector distance ordering from the native orderBy args
	/** @type {import('$types/prisma.d.ts').OrderByInput<T, A>} */
	let nativeOrderBy;
	/** @type string | undefined */
	let wantVectorDistance;

	if (orderBy) {
		if (!Array.isArray(orderBy)) {
			if (Object.keys(orderBy)[0] === vectorFieldName) {
				nativeOrderBy = undefined;
				wantVectorDistance = Object.values(orderBy)[0];
			} else {
				nativeOrderBy = orderBy;
				wantVectorDistance = undefined;
			}
		} else {
			nativeOrderBy = orderBy.reduce((acc, input) => {
				if (Object.keys(input)[0] !== vectorFieldName) {
					return [ ...acc, input ];
				} else {
					wantVectorDistance = Object.values(input)[0];
					return acc;
				}
			}, []);
		}
	}

	if (wantVectorDistance && !from) {
		throw new Error('Can\'t sort by vector distance without providing `from`');
	}

	const wantVectors = (!select || select?.[vectorFieldName]);

	// remove the vector from any select clause
	const selectVector = (select && select?.[vectorFieldName]);
	if (selectVector) {
		delete select[vectorFieldName];
	}

	// if we're selecting, and it doesn't include the id, we'll
	// need to add it if vector is included in response, and remove
	// it after the fact
	let removeSelectId = false;
	if (select && !select?.[idFieldName]) {
		removeSelectId = true;
	}

	// if `id` isn't in the select, add it to get the vectors
	const nativeSelect = (removeSelectId)
		? { ...select, [idFieldName]: true }
		: select;

	// if we're neither sorting by vector distance, nor including the vector
	// in the returned object, just run the native Prisma client query.
	if (!wantVectors && !wantVectorDistance) {
		const rows = await baseFindMany({
			select: select,
			orderBy: orderBy,
			...args
		});

		return rows;
	}
	// we want the vector field, but aren't sorting by it
	else if (wantVectors && !wantVectorDistance) {
		return ctx.__$transaction(async () => {
			const rowsWithoutVectors = await baseFindMany({
				select: nativeSelect,
				orderBy: nativeOrderBy,
				...args
			});
			const vectorData = await ctx.getVectorsById({
				where: {
					id: {
						in: rowsWithoutVectors.map((
							/** @type {{ [x: string]: any; }} */ v) => (
							v[idFieldName]))
					}
				}
			});

			if (!removeSelectId) {
				return rowsWithoutVectors.map((
					/** @type Object */ row,
					/** @type number */ i) => (Object.assign({},
					row, vectorData[i])));
			} else {
				const rows = rowsWithoutVectors
					.map((
						/** @type Object */ row,
						/** @type number */ i) => {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						const { [idFieldName]: _, ...returnObj } =
                            Object.assign({}, row, vectorData[i]);

						return returnObj;
					});

				return rows;
			};
		});
	}
	// doing nearest neighbor sort
	else {
		return ctx.__$transaction(async () => {
			const rowsWithoutVectors = await baseFindMany({
				select: nativeSelect,
				orderBy: nativeOrderBy,
				...args
			});
			const vectorData = await ctx.findNearestNeighbors({
				from: from,
				orderBy: wantVectorDistance,
				where: {
					id: {
						in: rowsWithoutVectors.map((
							/** @type {{ [x: string]: any; }} */ v) => (
							v[idFieldName]))
					}
				}
			});

			if (!removeSelectId) {
				return vectorData.map((
					/** @type {{ [x: string]: any; }} */ datum
				) => ({
					...datum,
					...rowsWithoutVectors.find((
						/** @type {{ [x: string]: any; }} */
						r) => r[idFieldName] === datum[idFieldName])
				}));
			} else {
				const rows = vectorData.map((
					/** @type {{ [x: string]: any; }} */ datum
				) => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { [idFieldName]: _, ...returnObj} = {
						...datum,
						...rowsWithoutVectors.find((
							/** @type {{ [x: string]: any; }} */
							r) => r[idFieldName] === datum[idFieldName])
					};

					return returnObj;
				});

				return rows;
			}
		});
	}
}