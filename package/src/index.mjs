// no Prisma to import until client is build
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Prisma } from '@prisma/client';

import * as store from './model-extensions/store/index.mjs';
import * as query from './model-extensions/query/index.mjs';
import * as overrides from './model-extensions/overrides/index.mjs';

/**
 * HOF to pass config args down to model methods
 * 
 * @type {import('$types/index.d.ts').addProps}
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
 * @type {import('$types/index.d.ts').addPropsWithContext}
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
 * @type {import('$types/index.d.ts').withPGVector}
 */
export const withPGVector = (args) => Prisma.defineExtension(function (
	// no Prisma to import until client is build
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	/** @type {import('@prisma/client').PrismaClient} */ client) {

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
	methods['__$transaction'] = async (/** @type {any} */ ...args) => client.$transaction(...args);
	methods['__$queryRaw'] = async (/** @type {any} */ ...args) => client.$queryRaw(...args);
	methods['__$executeRaw'] = async (/** @type {any} */ ...args) => client.$executeRaw(...args);

	return client.$extends({
		name: 'prisma-extension-pgvector',
		model: Object.fromEntries([[args.modelName, methods]]),
		client: {
			$getConfig: () => args
		},
	});
});