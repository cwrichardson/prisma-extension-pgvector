import type { Prisma } from '@prisma/client';
import { PrismaModelType } from '$types/model-extensions/prisma';
import { configArgs } from '$types/model-extensions';
import { Prisma } from '@prisma/client/scripts/default-index';
import { vectorFieldExtension } from '$types/vector';

/**
 * pgvector "storing" methods
 * @see https://github.com/pgvector/pgvector?tab=readme-ov-file#storing
 * 
 * createVector
 * 
 * TODO:
 * upsertVector
 * updateVector
 * deleteVector
 */

type idField = { [`${idFieldName}`] };

type storeArgs<T extends Prisma.Args<T, 'create'>> = T & { configArgs: configArgs};

/**
 * Strip data down to just the vector and id fields
 */
type reducedDataArgs<T, A extends Prisma.Args<T, 'create'>['data'],
  I extends keyof A,
  VF extends keyof A> = Pick<A, idField[I] | vectorFieldExtension[VF]>;

// createVector
export type createVectorArgs<T, A extends storeArgs> = {
  data: reducedDataArgs<A, configArgs['idFieldName'], configArgs['vectorFieldName']>
} & { configArgs: configArgs };
export type createVectorResult<T, A> = Prisma.Result<T, A, '$queryRawUnsafe'>;

  // model.create['data'] minus everything except the id field, which must match the idfieldname below, if it's specified
    // plus data[vectorFieldName] (which doesn't exist in the prisma type)
  // omit all other model.create args
  // add configArgs which includes vectorFieldName an an optional id field name, and arbitrary other parameters, all from type PGVectorInitArgs
/* export type createVectorArgs<T, A> = {
  data: {
    [vectorFieldName]: string;
    [idFieldName]: string;
  };
  configArgs: configArgs
}
export type createVectorResult<T, A> = Prisma.Result<T, A, 'create'>; */

/* export type createVectorArgs<T, A> = {
    data?: V extends keyof Prisma.Args<T, 'create'>['data']
      ? Omit<Prisma.Args<T, 'create'>['data'], V> | { [V]: PrismaModelType }
      : Prisma.Args<T, 'create'>['data'];
} & Omit<Prisma.Args<T, 'create'>, 'data'>;

export type createResult<T, A> = Prisma.Result<T, A, 'create'>; */