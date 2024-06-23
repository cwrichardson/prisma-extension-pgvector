import type { Prisma } from '@prisma/client';
import { configArgs, idFieldKey } from '$types/index';
import { vectorEntry, vectorFieldExtension } from '$types/vector';

/**
 * pgvector "storing" methods
 * @see https://github.com/pgvector/pgvector?tab=readme-ov-file#storing
 * 
 * createVector
 * updateVector
 * createManyVectors
 * createManyVectorsAndReturn
 * updateManyVectors
 */

/**
 * Strip data down to justid field and add the vector field
 */
type createDataArgs<T, A,
  I extends keyof A,
  VFName extends keyof A> = Pick<Prisma.Exact<T, 'create'>['data'],
    idFieldKey[I]>
      & { [K in keyof vectorFieldExtension[VFName]]: vectorFieldExtension[K] };
type updateDataArgs<T, A,
  I extends keyof A,
  VFName extends keyof A> = Pick<Prisma.Exact<T, 'update'>['data'],
    idFieldKey[I]>
      & { [K in keyof vectorFieldExtension[VFName]]: vectorFieldExtension[K] };

/**
 * Strip where down to just id field for update
 */
type updateWhereArgs<T, A, I extends keyof A> =
  Pick<Prisma.Exact<T, 'update'>['where'], idFieldKey[I]>;

// createVector
export type createVectorArgs<T, A> = {
  data: createDataArgs<T, A, configArgs['idFieldName'],
    configArgs['vectorFieldName']>
};
export type createVectorResult<T> = vectorEntry<T>;

// updateVector
export type updateVectorArgs<T, A> = {
  data: updateDataArgs<T, A, configArgs['idFieldName'],
    configArgs['vectorFieldName']>;
  where: updateVectorArgs<T, A, configArgs['idFieldName']>;
};
export type updateVectorResult<T> = vectorEntry<T>;

// createManyVectors
// we use the native return value, because it's just a count, so we don't
// have to worry about the vector field not being included in the model
export type createManyVectorsArgs<T, A> = {
  data: Array<createDataArgs<T, A, configArgs['idFieldName'],
    configArgs['vectorFieldName']>>
};
export type createManyVectorsResult<T, A> = Prisma.Result<T, A, 'createMany'>;

// createManyVectorsAndReturn
export type createManyVectorsAndReturnArgs<T, A> = {
  data: Array<createDataArgs<T, A, configArgs['idFieldName'],
    configArgs['vectorFieldName']>>
};
export type createManyVectorsAndReturnResult<T> = Array<vectorEntry<T>>;

// updateManyVectors
export type updateManyVectorsArgs<T, A> = {
  data: Array<updateDataArgs<T, A, configArgs['idFieldName'],
  configArgs['vectorFieldName']>>
};
export type updateManyVectorsResult<T, A> = Prisma.Result<T, A, 'updateMany'>;