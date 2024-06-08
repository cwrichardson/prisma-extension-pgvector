import PrismaDefault,
  { type PrismaClient,
    type Prisma
} from '@prisma/client/scripts/default-index.d.ts';

import { Types } from '@prisma/client/runtime/library.d.ts';
import {
  createVectorArgs,
  createVectorResult,
  createManyVectorsArgs,
  createManyVectorsResult,
  createManyVectorsAndReturnArgs,
  createManyVectorsAndReturnResult,
  updateVectorArgs,
  updateVectorResult
} from '$types/model-extensions/store.d.ts';
import {
  createArgs,
  createResult
} from '$types/model-extensions/override.d.ts';
import { getVectorsByIdArgs, getVectorsByIdResult } from './model-extensions/query';

export { PrismaModelProps, PrismaModelType } from '$types/prisma.d.ts';

interface PGVectorInitArgs {
    /**
     * Name of model that has the vector field
     */
    modelName: PrismaModelProps;
    /**
     * Name of the field to store the vector. Would be good if we could
     * get this from Prisma types somehow, but ... I can't see how, as
     * unsupported field types don't appear in the models.
     */
    vectorFieldName: string;
    /**
     * Name of the field used as unique ID
     */
    idFieldName?: PrismaModelType;
}

export type configArgs = Omit<PGVectorInitArgs, 'modelName'>;
export type idFieldKey<T> = T extends configArgs['idFieldName']
  ? T extends undefined ? 'id' : `${idFieldName}` : never;
export type vectorFieldKey<T> = T extends configArgs['vectorFieldName']
  ? `${vectorFieldName}` : never;
export type idFieldType<T, K extends idFieldKey> = Pick<PrismaModelType<T>, K>;


// new model methods
export type PGVectorStoreMethods = {
    createVector<T, A>(this: T, args: createVectorArgs<T, A>):
      Prisma.PrismaPromise<createVectorResult<T, A>>;
    createManyVectors<T, A>(this: T, args: createManyVectorsArgs<T, A>):
      Prisma.PrismaPromise<createManyVectorsResult<T, A>>;
    createManyVectorsAndReturn<T, A>(this: T, args: createManyVectorsAndReturnArgs<T, A>):
      Prisma.PrismaPromise<createManyVectorsAndReturnResult<T, A>>;
    updateVector<T, A>(this: T, args: updateVectorArgs<T, A>):
      Prisma.PrismaPromise<updateVectorResult<T, A>>;
}
export type PGVectorQueryMethods = {
    getVectorsById<T, A>(this: T, args: getVectorsByIdArgs<T, A>):
      Prisma.PrismaPromise<getVectorsByIdResult<T, A>>;
}

// base model override methods
export type PGVectorOverrides = {
    create<T, A>(this: T, args: createArgs<T, A>):
      Prisma.PrismaPromise<createResult<T, A>>;
}

export type PGVectorModelMethods = PGVectorStoreMethods & PGVectorQueryMethods
  & PGVectorOverrides;

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
    readonly [K in (I['modelName'] extends infer U ? U : never)]: PGVectorModelMethods
  }, {}, {}>
  & Types.Extensions.InternalArgs<{}, {}, {}, {}>
  & Types.Extensions.DefaultArgs>;

/**
 * Types for helper functions to wrap config args.
 */
export declare function addProps<T extends keyof any>(
  methods: Record<T, Function>,
  configArgs: configArgs
): Partial<Record<T, Function>>;

export declare function addPropsWithContext<T extends keyof any>(
  methods: Record<T, Function>,
  configArgs: PGVectorInitArgs,
  parentContext: PrismaClient 
): Partial<Record<T, Function>>;