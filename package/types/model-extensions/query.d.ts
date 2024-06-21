import { Prisma } from '@prisma/client/scripts/default-index';

import { vector, vectorEntry } from '$types/vector';
import { configArgs, idFieldKey } from '$types/index';
import { distanceType } from '$types/helpers';

type inArg<T, A, I extends keyof A> = Prisma.Exact<T, 'update'>['where'][I]['in'];

type getVectorsByIdWhere<T, A, I extends keyof A> = {
    [I in idFieldKey<T>]: { in: inArg }
};

// getVectorsById
export interface getVectorsByIdArgs<T, A> {
    where: getVectorsByIdWhere<T, A, configArgs['idFieldName']>
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