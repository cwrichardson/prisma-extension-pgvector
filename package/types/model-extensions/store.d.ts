import type { Prisma } from '@prisma/client';
import { configArgs } from '$types/model-extensions';
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
type reducedDataArgs<T, A extends Prisma.Args<T, 'create'>['data'],
  I extends keyof A,
  VF extends keyof A> = Pick<A, idField[I] | vectorFieldExtension[VF]>;

// createVector
export type createVectorArgs<T, A extends createArgs> = {
  data: reducedDataArgs<A, configArgs['idFieldName'], configArgs['vectorFieldName']>
} & { configArgs: configArgs };
export type createVectorResult<T, A> = vectorEntry;

// createManyVectors
export type createManyVectorArgs<T, A extends createArgs> = {
  data: Array<reducedDataArgs<A, configArgs['idFieldName'], configArgs['vectorFieldName']>>
} & { configArgs: configArgs };
export type createManyVectorsResult<T, A> = Prisma.Result<T, A, 'createMany'>;