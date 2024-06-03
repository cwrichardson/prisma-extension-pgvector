import type { Prisma } from '@prisma/client';

import { PrismaQueryArgs } from './prisma';
import { vectorFieldExtension } from './vector';

// extended Prisma query args ({ model, operation, args, query })
export type queryArgs<T extends PrismaQueryArgs> = T
  & { vectorFieldName: string };

type createQueryExtendedArgs<T extends PrismaQueryArgs, VF extends keyof T> = {
    data: T['data'] & vectorFieldExtension[VF];
}

export type createQueryArgs<T extends queryArgs> = {
    args: createQueryExtendedArgs<T, typeof queryArgs['vectorFieldName']>
      & Omit<Prisma.Args<T, 'create'>, 'data'>
} & Omit<queryArgs, 'args'>
export type createQueryResult<T, A> = Prisma.PrismaPromise;