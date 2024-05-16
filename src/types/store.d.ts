import type { Prisma } from '@prisma/client';
import { PrismaModelType } from './prisma';

// create
export type createArgs<T, A, V> = {
    data?: myProp extends keyof Prisma.Args<T, 'create'>['data']
      ? Omit<Prisma.Args<T, 'create'>['data'], V> | { [V]: PrismaModelType }
      : Prisma.Args<T, 'create'>['data'];
} & Omit<Prisma.Args<T, 'create'>, 'data'>;

export type createResult<T, A> = Prisma.Result<T, A, 'create'>;