import { idFieldKey, idFieldType, vectorFieldKey } from '$types/index';

/**
 * TODO: Would be better to import these from pgvector, but they don't seem
 *       to export them in the node module.
 * 
 * TODO: Add support for other vector types (half, sparse, etc...)
 */

type vectorComponent = number;
export type vector = vectorComponent[];

/** for use in queryRaw */
export type vectorEntry<T> = {
    [idFieldKey<T>]: idFieldType<T, idFieldKey<T>>;
    [vectorFieldKey<T>]: vector;
}