import { Sql } from "@prisma/client/runtime/library";

import { idFieldType } from ".";
import { PrismaModelProps, PrismaModelType } from "./prisma";
import { vector } from "./vector";

/**
 * Internal: used for building the Prisma sql query for
 * `createManyVectors` and `createManyVectorsAndReturn`.
 * 
 * @param string[] args.vectors - an array of strings instead
 *      of vectors, as we pass it after calling `toSql`.
 */
export interface createManyQueryBuilder {
    (args: {queryType?: 'count' | 'return',
    modelName: PrismaModelProps,
    vectorFieldName: string,
    idFieldName: PrismaModelType,
    ids: idFieldType[],
    vectors: string[]}): Sql;
}