import PrismaDefault, { type Prisma } from '@prisma/client/scripts/default-index';

import { PrismaModelProps, PrismaModelType } from '$types/prisma';
import { Types } from '@prisma/client/runtime/library';
import { createVectorArgs, createVectorResult } from '$typs/model-extensions/store';

type PGVectorInitArgs = {
    /**
     * Name of model that has the vector field
     */
    modelName: PrismaModelProps;
    /**
     * Name of the field to store the vector
     */
    vectorFieldName: PrismaModelType;
    /**
     * Name of the field used as unique ID
     */
    idFieldName?: PrismaModelType;
}

export type configArgs = Omit<PGVectorInitArgs, 'modelName'>;

export declare function addProps<T extends keyof any>(
  methods: Record<T, Function>,
  configArgs: configArgs
): Partial<Record<T, Function>>;

export type PGVectorStoreMethods = {
    createVector<T, A>(this: T, args: createVectorArgs<T, A>): Prisma.PrismaPromise<createVectorResult<T, A>>;
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
    readonly [K in (I['modelName'] extends ReadonlyArray<infer U> ? U : never )]: PGVectorMethods
  }, {}, {}>
  & Types.Extensions.InternalArgs<{}, {}, {}, {}>
  & Types.Extensions.DefaultArgs>;