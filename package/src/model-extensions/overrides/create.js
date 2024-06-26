import { Prisma } from '@prisma/client';

/**
 * Extend the default `create` method to support vectors in our model.
 * 
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/overrides').createArgs<T, A>} props
 * @returns {Promise<import('$types/model-extensions/overrides').createResult<T, A>>}
 */
export default async function (props) {
	const {
		configArgs, parentContext,
		...args
	} = props;

	const ctx = Prisma.getExtensionContext(this);
	const baseCreate = ctx?.$name
		? parentContext[ctx.$name].create
		: () => {
			// do nothing
		};

	const {
		vectorFieldName,
		idFieldName = 'id'
	} = configArgs;

	// if we're not adding vector data, or including it in the return, just
	// run the native Prisma client query. If no specified return value with
	// `select`, append an empty vector field to the object.
	/** @todo make this work if the vector field has a default value in the
	       schema */
	const dataHasVectorField = args?.data && Object.prototype
	  .hasOwnProperty.call(args?.data, vectorFieldName);
	if (! (dataHasVectorField || (args?.select && Object.prototype
	  .hasOwnProperty.call(args?.select, vectorFieldName)))) {
		const row = await baseCreate(args)
			.then((/** @type Object */ rawRow) => {
				if (args?.select) return rawRow;
				return ({ ...rawRow, [vectorFieldName]: null });
			});

		return row;
	}
	// run the normal create first, so we have a full model object, then
	// update with the vector
	else if (dataHasVectorField) {
		const select = args?.select;
		const selectVector = (select && args.select?.[vectorFieldName]);

		// remove the vector from any select clause
		if (selectVector) {
			delete args.select?.[vectorFieldName];
		}

		// remove the vector from the data clause
		const vector = args.data[vectorFieldName];
		delete args.data[vectorFieldName];

		// if we're selecting, and it doesn't include the id, we add the
		// id now, because we need it to do the vector update, and then
		// remove it before the final return
		let removeSelectId = false;
		if (select && !args.select?.[idFieldName]) {
			args.select[idFieldName] = true;
			removeSelectId = true;
		}

		return ctx.__$transaction(async () => {
			const rowWithoutVector = await baseCreate(args);

			const updatedVector = await ctx.updateVector({
				data: {
					[idFieldName]: rowWithoutVector[idFieldName],
					[vectorFieldName]: vector
				},
				where: {
					[idFieldName]: rowWithoutVector[idFieldName]
				}
			});

			// remove id if we added it internally, earlier
			if (removeSelectId) {
				delete rowWithoutVector[idFieldName];
			}

			if (select && !selectVector) {
				return rowWithoutVector;
			} else if (!select) {
				return ({ ...rowWithoutVector, ...updatedVector });
			} else {
				// rowWithoutVector will be the native results of the
				// select, which may or may not include the ID field.
				// remove ID from updatedVector before appending
				return ({
					...rowWithoutVector,
					[vectorFieldName]: updatedVector[vectorFieldName]
				});
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