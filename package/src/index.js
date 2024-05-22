import { Prisma } from '@prisma/client';

import * as store from './model-extensions/store/index';

/**
 * HOF to attach config args to methods
 * 
 * @param {import('$types/index.js').configArgs} configArgs
 * @returns {Function}
 */
const withConfigArgs = (configArgs) => {
    return (/** @type Function */ func) => {
        return (/** @type any[] */ ...args) => {
            const newArgs = [...args, configArgs];
            func(...newArgs);
        }
    }
}

/**
 * Initialize PGVector as Prisma Extension
 * 
 * @type {import('$types/index').withPGVector}
 */
export const withPGVector = (args) => Prisma.defineExtension(function (client) {
    /**
     * add config args to methods
     * 
     * @type {import('$types/index').addProps}
     */
    const addProps = (methods, additionalProps) =>
      Object.entries(methods).reduce((acc, [name, method]) => {
        return {
            ...acc,
            [name]: withConfigArgs(additionalProps)(method)
        }
    }, {});

    const extensionMethods = {
        ...store
    };
    const extensionMethodsWithProps = addProps(extensionMethods, args);
    // @ts-expect-error
    extensionMethodsWithProps['__$transaction'] = async (/** @type {any} */ ...args) => client.$transaction(...args)

    // const queryMethods = {
    //     ...store
    // };
    // 
    // const extensionQueryMethods = Object.entries(queryMethods)
    // .reduce((accumulator, [name, fn]) => {
    //     return {
    //         ...accumulator,
    //         [name]: ({ ...prismaArgs }) => /** @type {import('$types/query').queryArgs} */ queryMethods[name]({
    //             ...prismaArgs,
    //             vectorFieldName: args.vectorFieldName
    //         })
    //     }
    // }, {});

    return client.$extends({
        name: 'prisma-extension-pgvector',
        model: { [args.modelName]: extensionMethodsWithProps },
        // query: { [args.modelName]: extensionQueryMethods }
    })
})