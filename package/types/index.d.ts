import { Types } from '@prisma/client/runtime/library.d.ts';
import PrismaDefault,
{ type Prisma } from '@prisma/client/scripts/default-index.d.ts';

import { PrismaModelFields } from '$types/prisma.d.ts';
import {
	createVectorArgs,
	createVectorResult,
	createManyVectorsArgs,
	createManyVectorsResult,
	createManyVectorsAndReturnArgs,
	createManyVectorsAndReturnResult,
	updateVectorArgs,
	updateVectorResult,
	updateManyVectorsArgs,
	updateManyVectorsResult
} from '$types/model-extensions/store.d.ts';
import {
	createArgs,
	createResult,
	createManyAndReturnArgs,
	createManyAndReturnResult
} from '$types/model-extensions/overrides.d.ts';
import {
	findManyArgs,
	findManyResult,
	findNearestNeighborsArgs,
	findNearestNeighborsResults,
	getVectorsByIdArgs,
	getVectorsByIdResult
} from '$types/model-extensions/query.d.ts';

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
    idFieldName?: PrismaModelFields;
}

export type configArgs = Omit<PGVectorInitArgs, 'modelName'>;
export type idFieldKey<T> = T extends configArgs['idFieldName']
  ? T extends undefined ? 'id' : `${idFieldName}` : never;
export type vectorFieldKey<T> = T extends configArgs['vectorFieldName']
  ? `${vectorFieldName}` : never;
export type idFieldType<T, K extends idFieldKey> = Pick<Prisma.Exact<T, 'findUnique'>['where'], K>;


// new model methods
export interface PGVectorStoreMethods {
    createVector<T, A>(this: T, args: createVectorArgs<T, A>):
      Prisma.PrismaPromise<createVectorResult<T, A>>;
    createManyVectors<T, A>(this: T, args: createManyVectorsArgs<T, A>):
      Prisma.PrismaPromise<createManyVectorsResult<T, A>>;
    createManyVectorsAndReturn<T, A>(this: T, args:
      createManyVectorsAndReturnArgs<T, A>):
        Prisma.PrismaPromise<createManyVectorsAndReturnResult<T, A>>;
    updateVector<T, A>(this: T, args: updateVectorArgs<T, A>):
      Prisma.PrismaPromise<updateVectorResult<T, A>>;
    updateManyVectors<T, A>(this: T, args: updateManyVectorsArgs<T, A>):
      Prisma.PrismaPromise<updateManyVectorsResult<T, A>>;
}
export interface PGVectorQueryMethods {
    findNearestNeighbors<T, A>(this: T, args: findNearestNeighborsArgs<T, A>):
      Prisma.PrismaPromise<findNearestNeighborsResults<T, A>>;
    getVectorsById<T, A>(this: T, args: getVectorsByIdArgs<T, A>):
      Prisma.PrismaPromise<getVectorsByIdResult<T, A>>;
}

// base model override methods
export interface PGVectorOverrides {
    create<T, A>(this: T, args: createArgs<T, A>):
      Prisma.PrismaPromise<createResult<T, A>>;
    createManyAndReturn<T, A>(this: T, args: createManyAndReturnArgs):
      Prisma.PrismaPromise<createManyAndReturnResult<T, A>>;
    findMany<T, A>(this: T, args: findManyArgs):
      Prisma.PrismaPromise<findManyResult<T, A>>;
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
  (client: unknown) => PrismaDefault.PrismaClientExtends<
    Types.Extensions.InternalArgs<
      // result
      Record<never, never>,
      // model
      {
        readonly [K in (I['modelName'] extends infer U ? U : never)]:
        PGVectorModelMethods
      },
      // query
      Record<never, never>,
      // client
      {
        $getConfig(): PGVectorInitArgs
      }
  >
  & Types.Extensions.InternalArgs<Record<never, never>,
    Record<never, never>,
    Record<never, never>,
    Record<never, never>>
  & Types.Extensions.DefaultArgs>;

/**
 * Types for helper functions to wrap config args.
 */
type methodType<T> = (this: T) => Prisma.PrismaPromise<unknown>;

export declare function addProps<T extends PGVectorModelMethods>(
  methods: Record<T, methodType<T>>,
  configArgs: configArgs
): Partial<Record<T, methodType<T>>>;

export declare function addPropsWithContext<T extends PGVectorModelMethods>(
  methods: Record<T, methodType<T>>,
  configArgs: PGVectorInitArgs,
  parentContext: unknown 
): Partial<Record<T, methodType<T>>>;