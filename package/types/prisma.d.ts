import { Prisma } from '@prisma/client';

/**
 * Extended types from Prisma to be used in generic models and queries.
 */

/**
 * Default args passed to query callback.
 */
export type PrismaQueryArgs = Prisma.Extension.DynamicQueryExtensionArgs;

/**
 * Model methods available in Prisma. (e.g. `prisma.node` or `prisma.user`)
 */
export type PrismaModelProps = Prisma.TypeMap['meta']['modelProps'];

// Types to dynamically acquire method `args` and `result` types through type mapping.
export type PrismaModelTypeMap<TModelName extends PrismaModelProps> =
  Pick<Prisma.TypeMap['model'], TModelName>;
export type PrismaModelFunction<TModelName extends PrismaModelProps,
  FnName extends Prisma.PrismaAction> =
    PrismaModelTypeMap<TModelName>[TModelName]['operations'][FnName];

/**
 * Arguments of a base Prisma Client method (e.g. `prisma.node.findFirst`)
 */
export type PrismaModelFunctionArgs<TModelName extends PrismaModelProps,
  FnName extends Prisma.PrismaAction> =
    PrismaModelFunction<TModelName, FnName>['args'];
/**
 * Result of a base Prisma Client method (e.g. `prisma.node.findFirst`)
 */
export type PrismaModelFunctionResult<TModelName extends PrismaModelProps,
  FnName extends Prisma.PrismaAction> =
    PrismaModelFunction<TModelName, FnName>['result'];

/**
 * Get the model scalars.
 * 
 * This works because `findUnique` returns a typed javascript object.
 */
export type PrismaModelType<TModelName extends PrismaModelProps> =
  Prisma.Result<TModelName, {}, 'findFirst'>;