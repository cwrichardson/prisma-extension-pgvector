import type { Prisma } from '@prisma/client';

import { configArgs } from '$types/index';
import { vectorFieldExtension } from './vector';
import { PrismaClient } from '@prisma/client/scripts/default-index';

type extendedDataArgs<
  TModel,
  A extends Prisma.Exact<T, 'create'>['data'],
  VFName> = {
  [K in keyof A]: A[K];
} & { [K in keyof vectorFieldExtension[VFName]]: vectorFieldExtension[K] };

type extendedSelectArgs<
  T,
  A extends Prisma.Exact<T, 'create'>['select'],
  VFName> = {
    [K in keyof A]: A[K];
} & { [K in keyof vectorFieldExtension[VFName]]: { [K]: boolean }};

type createExtendedArgs<
  T,
  A extends Prisma.Exact<A, Prisma.Args<T, 'create'>>,
  VF
> = {
    data?: extendedDataArgs<A, VF>,
    select?: extendedSelectArgs<A, VF>
} & Omit<Prisma.Exact<A, Prisma.Args<T, 'create'>>, 'data' | 'select'>;

export type createArgs<T, A extends createExtendedArgs> = 
  createExtendedArgs<A, configArgs['vectorFieldName']>
  & { configArgs: configArgs }
  & { parentContext: PrismaClient };
export type createResult<T, A> = Prisma.PrismaPromise;