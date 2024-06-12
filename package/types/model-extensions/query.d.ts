import { Prisma } from "@prisma/client/scripts/default-index";

import { PrismaModelType } from "$types/prisma";
import { vector, vectorEntry } from "$types/vector";
import { configArgs, idFieldKey, idFieldType } from "$types/index";
import { distanceTypeMap } from "src/helpers/distance-types";
import { distanceType } from "$types/helpers";

type getVectorsByIdWhere<T, A> = {
    [K in idFieldKey<T>]: { in: Array<idFieldType<T, K>> }
};

type orderByArgs = keyof typeof distanceTypeMap;

// getVectorsById
export interface getVectorsByIdArgs<T, A> {
    where: getVectorsByIdWhere<T, A>
}
export type getVectorsByIdResult<T, A> = vectorEntry[];

// findNearestNeighbors
export interface findNearestNeighborsArgs<T, A> {
    orderBy?: distanceType | undefined;
    from: vector;
    where?: getVectorsByIdWhere | undefined;
    take?: number | undefined;
}
export type findNearestNeighborsResults = Array<vectorEntry>;