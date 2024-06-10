import type { Prisma } from '@prisma/client';

import { configArgs } from '$types/index';
import { vectorFieldExtension } from './vector';
import { PrismaClient } from '@prisma/client/scripts/default-index';

/**
 * Extensions for parts of larger native arguments
 */

// create({ data: {} }) extended with vectorField
type extendedCreateDataArgs<TModel, Args, VFName> = {
  [K in keyof Args]: Args[K] extends Prisma.Exact<TModel, 'create'>['data']
    ? Args[K]
    : never;
  } & { [K in keyof vectorFieldExtension[VFName]]: vectorFieldExtension[K] 
};

// <method>({ select: {} }) extended with vectorField
type extendedSelectArgs<TModel, Args, VFName> = {
    [K in keyof Args]: Args[K] extends Prisma.Exact<TModel, 'create'>['select']
      ? Args[K]
      : never;
} & { [K in keyof vectorFieldExtension[VFName]]: { [K]: boolean }};

/**
 * Extended args and return objects for override functions
 */

// create
export type createArgs<TModel, Args> = {
    data: extendedCreateDataArgs<T, Args['data'],
      configArgs['vectorFieldName']>,
    select?: extendedSelectArgs<T, Args['select'],
      configArgs['vectorFieldName']>,
} & Omit<Prisma.Exact<A, Prisma.Args<T, 'create'>>, 'data' | 'select'>;
export type createResult<T, A> = Prisma.PrismaPromise;

// createManyAndReturn
export type createManyAndReturnArgs<TModel, Args> = {
    data: Array<extendedCreateDataArgs<TModel, Args['data'],
      configArgs['vectorFieldName']>>,
    select?: extendedSelectArgs<TModel, Args['select'],
      configArgs['vectorFieldName']>,
} & Omit<Prisma.Exact<A, Prisma.Args<T, 'createManyAndReturn'>>,
  'data' | 'select'>;
export type createManyAndReturnResult<T, A> = Prisma.PrismaPromise;