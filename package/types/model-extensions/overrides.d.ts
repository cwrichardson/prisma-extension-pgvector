import type { Prisma } from '@prisma/client';

import { configArgs } from '$types/index';
import { vectorFieldExtension } from './vector';
import { PrismaClient } from '@prisma/client/scripts/default-index';

type extendedDataArgs<
  T,
  A extends Prisma.Exact<T, 'create'>['data'],
  VF extends keyof A
> = Pick<Prisma.Exact<T, 'create'>['data'] | { [P in VF]: never },
  (keyof A) | vectorFieldExtension[VF]>;

type extendedSelectArgs<
  T,
  A extends Prisma.Exact<T, 'create'>['select'],
  VF extends keyof A
> = Pick<Prisma.Exact<T, 'create'>['select'] | { [P in VF]: never },
  (keyof A) | vectorFieldExtension[VF]>;

type createExtendedArgs<
  T,
  A extends Prisma.Exact<A, Prisma.Args<T, 'create'>>,
  VF
> = {
    data?: extendedDataArgs<A, VF>,
    select?: extendedSelectArgs<A, VF>
} & Omit<Prisma.Exact<A, Prisma.Args<T, 'create'>>, 'data' | 'select'>;

export type createArgs<T, A extends createExtendedArgs> = 
  createQueryExtendedArgs<A, configArgs['vectorFieldName']>
  & { configArgs: configArgs }
  & { parentContext: PrismaClient };
export type createResult<T, A> = Prisma.PrismaPromise;