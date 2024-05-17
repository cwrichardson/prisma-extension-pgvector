import PrismaDefault, { type Prisma } from '@prisma/client/scripts/default-index';

import { PrismaModelProps, PrismaModelType } from './prisma';
import { Types } from '@prisma/client/runtime/library';
import { createArgs, createResult } from './store';

type PGVectorInitArgs = {
    /**
     * Name of model that has the vector field
     */
    modelName: PrismaModelProps;
    /**
     * Name of the field to store the vector
     */
    vectorFieldName: PrismaModelType;
}

export type PGVectorStoreMethods = {
    create<T, A>(this: T, args: createArgs<T, A, V>): Prisma.PrismaPromise<createResult<T, A>>;
}

export type PGVectorMethods = PGVectorStoreMethods;

/**
 * Extends Prisma Client with PGVector
 * 
 * @example
 * const prisma = new PrismaClient().$extends(withPGVector({
 *  modelName: 'Document',
 *  vectorFieldName: 'embed'
 * }))
 */
export declare function withPGVector<I extends PGVectorInitArgs>(args: I):
  (client: any) => PrismaDefault.PrismaClientExtends<Types.Extensions.InternalArgs<{}, {
    [K in (I['modelName'] extends ReadonlyArray<infer U> ? U : never )]: PGVectorMethods
  }, {}, {}>
  & Types.Extensions.InternalArgs<{}, {}, {}, {}>
  & Types.Extensions.DefaultArgs>;