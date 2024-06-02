import type { Prisma } from '@prisma/client';
import { configArgs } from '$types/index';
import { vectorEntry, vectorFieldExtension } from '$types/vector';

/**
 * pgvector "storing" methods
 * @see https://github.com/pgvector/pgvector?tab=readme-ov-file#storing
 * 
 * createVector
 * 
 * TODO:
 * upsertVector
 * updateVector
 * createManyVectors
 */

type idField = { [`${idFieldName}`] };
type createArgs<T extends Prisma.Args<T, 'create'>> = T & { configArgs: configArgs};

/**
 * Strip data down to just the vector and id fields
 */
type createDataArgs<T, A extends Prisma.Args<T, 'create'>['data'],
  I extends keyof A,
  VF extends keyof A> = Pick<A, (idField[I] | undefined) | vectorFieldExtension[VF]>;
type updateDataArgs<T, A extends Prisma.Args<T, 'create'>['data'],
  I extends keyof A,
  VF extends keyof A> = Pick<A, idField[I] | vectorFieldExtension[VF]>;

// createVector
export type createVectorArgs<T, A extends createArgs> = {
  data: createDataArgs<A, configArgs['idFieldName'], configArgs['vectorFieldName']>
} & { configArgs: configArgs };
export type createVectorResult<T, A> = vectorEntry;

// updateVector
export type updateVectorArgs<T, A extends createArgs> = {
  data: updateDataArgs<A, configArgs['idFieldName'], configArgs['vectorFieldName']>
} & { configArgs: configArgs };
export type updateVectorResult<T, A> = vectorEntry;

// createManyVectors
export type createManyVectorArgs<T, A extends createArgs> = {
  data: Array<createDataArgs<A, configArgs['idFieldName'], configArgs['vectorFieldName']>>
} & { configArgs: configArgs };
export type createManyVectorsResult<T, A> = Prisma.Result<T, A, 'createMany'>;