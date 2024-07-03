import { Sql } from '@prisma/client/runtime/library';

import { idFieldType } from '.';
import { PrismaModelFields, PrismaModelProps } from '$types/prisma.d.ts';

/**
 * Internal: used for building the Prisma sql query for
 * `createManyVectors` and `createManyVectorsAndReturn`.
 * 
 * @param string[] args.vectors - an array of strings instead
 *      of vectors, as we pass it after calling `toSql`.
 */
export type createManyQueryBuilder = (args: {
    queryType?: 'count' | 'return',
    modelName: PrismaModelProps,
    vectorFieldName: string,
    idFieldName: PrismaModelFields,
    ids: idFieldType[],
    vectors: string[]
}) => Sql;

export interface DistanceType {
    L2: string,
    InnerProduct: string,
    Cosine: string,
    L1: string
}
export type distanceType = keyof DistanceType;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

/** Get type Foo when the Prisma type is XOR<Enumerable<Foo>, Foo> */
export type GetInputType<T> = T extends (infer U)[] ? U : T;