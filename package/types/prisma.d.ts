import { Prisma } from '@prisma/client';
import { vectorEntry } from './vector';
import { GetInputType } from './helpers';

/**
 * Extended types from Prisma to be used in generic models and queries.
 */

/**
 * Default args passed to query callback.
 * @todo for when we add client-level queries
 */
// export type PrismaQueryArgs = Prisma.Extension.DynamicQueryExtensionArgs;

/**
 * Model methods available in Prisma. (e.g. `prisma.node` or `prisma.user`)
 */
export type PrismaModelProps = Prisma.TypeMap['meta']['modelProps'];

/**
 * All the fields in the model
 */
export type PrismaModelFields<TModelName extends PrismaModelProps> =
  Prisma.Result<TModelName, Record<never, never>, 'findFirst'>;

/**
 * Extend results from create, which give us the internal model 
 * object or an untyped object (if select or include), with
 * the vector field.
 */
export type Vector<TModelName extends PrismaModelProps, Args> =
  Prisma.Result<TModelName, Args, 'create'>
  & Partial<vectorEntry>

/**
 * Get the base `orderBy` inputs
 */
export type OrderByInput<TModelName extends PrismaModelProps, Args> =
  GetInputType<Prisma.Exact<Prisma.Args<TModelName, Args, 'findFirst'>['orderBy']>>;