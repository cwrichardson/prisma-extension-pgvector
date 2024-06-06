import { Prisma } from "@prisma/client/scripts/default-index";

import { PrismaModelType } from "$types/prisma";
import { vectorEntry } from "$types/vector";
import { configArgs, idFieldKey, idFieldType } from "$types/index";

type getVectorsByIdWhere<T, A> = {
    [K in idFieldKey<T>]: { in: Array<idFieldType<T, K>> }
};

// getVectorsById
export interface getVectorsByIdArgs<T, A> {
    where: getVectorsByIdWhere<T, A>
}
export type getVectorsByIdResult<T, A> = vectorEntry[];