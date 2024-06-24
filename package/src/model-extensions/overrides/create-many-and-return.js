import { Prisma } from '@prisma/client';

/**
 * Extend the default `create` method to support vectors in our model.
 * 
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/overrides').createManyAndReturnArgs<T, A>} props
 * @returns {Promise<import('$types/model-extensions/overrides').createManyAndReturnResult<T, A>>}
 */
export default async function (props) {
	const {
		configArgs, parentContext,
		data = [{}],
		select = null,
		...args
	} = props;

	const ctx = Prisma.getExtensionContext(this);
	const baseCreateManyAndReturn = ctx?.$name
		? parentContext[ctx.$name].createManyAndReturn
		: () => {};

	/** @type {import('$types/index').configArgs} */
	const {
		vectorFieldName,
		idFieldName = 'id'
	} = configArgs;

	const hasVectorData = data.some((/** @type any */ d) =>
		Object.prototype.hasOwnProperty.call(d, vectorFieldName));

	// if we're not adding vector data, or including it in the return, just
	// run the native Prisma client query. If no specified return value with
	// `select`, append an empty vector field to the object.
	// @todo make this work if the vector field has a default value in the
	//       schema
	if (! (hasVectorData
	  || Object.prototype.hasOwnProperty.call(select, vectorFieldName))) {
		const rows = await baseCreateManyAndReturn({
			data: data,
			select: select,
			...args
		})
			.then((/** @type Object[] */ rawRows) => {
				if (select) return rawRows;
				return (rawRows.map((r) => ({ ...r, [vectorFieldName]: null })));
			});

		return rows;
	}
	// run the normal create first, so we have a full model object, then
	// update with the vector
	else if (hasVectorData) {
		const selectVector = (select && select?.[vectorFieldName]);

		// remove the vector from any select clause
		if (selectVector) {
			delete select[vectorFieldName];
		}

		const baseData = data.map(obj => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const {[vectorFieldName]: _, ...baseProps } = obj;
			return baseProps;
		});

		return ctx.__$transaction(async () => {
			const rowsWithoutVectors = await baseCreateManyAndReturn({
				data: baseData,
				select: select,
				...args
			});
			await ctx.updateManyVectors({
				data: data.map((obj, i) => ({
					[idFieldName]: rowsWithoutVectors[i][idFieldName],
					[vectorFieldName]: obj[vectorFieldName]
				}))
			});

			if (select && !selectVector) {
				return rowsWithoutVectors;
			} else {
				// rowWithoutVector will be the native results (with or
				// without any select), so we just append the vector
				return (rowsWithoutVectors.map((
					/** @type Object */ r,
					/** @type number */ i) => ({
					...r,
					[vectorFieldName]: data[i][vectorFieldName]
				})));
			};

		});
	}
	// we're creating an entry with no vector data, but including the vector
	// field in the return. Weird, but maybe there's a default.
	/** @todo handle this case */
	else {
		return Promise.reject('Boo!');
	}
}