import { Prisma } from '@prisma/client';

import * as store from './model-extensions/store/index.js';

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
                newArgs = [ ...args[0], { configArgs: additionalProps }]
            }
            // args.configArgs = additionalProps;
            // const newArgs = {...args[0], configArgs: additionalProps}
            return method.call(this, newArgs)
          }
      }
  }, {});

/**
 * Initialize PGVector as Prisma Extension
 * 
 * @type {import('$types/index').withPGVector}
 */
// @ts-expect-error
export const withPGVector = (args) => Prisma.defineExtension(function (client) {

    const extensionMethods = {
        ...store
    }
    const extensionMethodsWithProps = addProps(extensionMethods, args);

    /**
     * Append client level methods to our model, for internal use
     */
    // @ts-expect-error
    extensionMethodsWithProps.__$transaction = async (/** @type {any} */ ...args) => client.$transaction(...args)
    // @ts-expect-error
    extensionMethodsWithProps['__$queryRaw'] = async (/** @type {any} */ ...args) => client.$queryRaw(...args)
    // @ts-expect-error
    extensionMethodsWithProps['__$executeRaw'] = async (/** @type {any} */ ...args) => client.$executeRaw(...args)

    return client.$extends({
        name: 'prisma-extension-pgvector',
        model: Object.fromEntries([[args.modelName, extensionMethodsWithProps]]),
        client: {
            $getConfig: () => args
        }
    })
})