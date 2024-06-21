import { Prisma } from '@prisma/client';

import * as store from './model-extensions/store/index.js';
import * as query from './model-extensions/query/index.js';
import * as overrides from './model-extensions/overrides/index.js';

/**
 * HOF to pass config args down to model methods
 * 
 * @type {import('$types/index').addProps}
 */
const addProps = (methods, additionalProps) =>
	Object.entries(methods).reduce((acc, [name, method]) => {
		return {
			...acc,
			[name]: function ( /** @type any */ ...args) {
				let newArgs;

				if (!Array.isArray(args[0])) {
					// first argument is an object
					newArgs = { configArgs: additionalProps, ...args[0] };
				} else {
					// first argument is an array
					newArgs = [ ...args[0], { configArgs: additionalProps }];
				}

				return method.call(this, newArgs);
			}
		};
	}, {});

/**
 * HOF to pass config args and raw prisma context down to override methods
 * 
 * @type {import('$types/index.js').addPropsWithContext}
 */
const addPropsWithContext = (methods, additionalProps, context) =>
	Object.entries(methods).reduce((acc, [name, method]) => {
		return {
			...acc,
			[name]: function ( /** @type any */ ...args) {
				let newArgs;
  
				if (!Array.isArray(args[0])) {
					// first argument is an object
					newArgs = {
						configArgs: additionalProps,
						parentContext: context,
						...args[0]
					};
				} else {
					// first argument is an array
					newArgs = [
						...args[0],
						{ configArgs: additionalProps },
						{ parentContext: context }
					];
				}

				return method.call(this, newArgs);
			}
		};
	}, {});

/**
 * Initialize PGVector as Prisma Extension
 * 
 * @type {import('$types/index').withPGVector}
 */
export const withPGVector = (args) => Prisma.defineExtension(function (client) {

	const extensionMethods = {
		...store,
		...query
	};
	const extensionMethodsWithProps = addProps(extensionMethods, args);

	const extensionOverrideMethods = {
		...overrides
	};
	const extensionOverrideMethodsWithProps = addPropsWithContext(extensionOverrideMethods, args, client);

	const methods = {
		...extensionMethodsWithProps,
		...extensionOverrideMethodsWithProps
	};

	/**
     * Append client level methods to our model, for internal use
     */
	// @ts-expect-error extended methods not available until client created
	methods.__$transaction = async (/** @type {any} */ ...args) => client.$transaction(...args);
	// @ts-expect-error extended methods not available until client created
	methods['__$queryRaw'] = async (/** @type {any} */ ...args) => client.$queryRaw(...args);
	// @ts-expect-error extended methods not available until client created
	methods['__$executeRaw'] = async (/** @type {any} */ ...args) => client.$executeRaw(...args);

	return client.$extends({
		name: 'prisma-extension-pgvector',
		model: Object.fromEntries([[args.modelName, methods]]),
		client: {
			$getConfig: () => args
		},
	});
});