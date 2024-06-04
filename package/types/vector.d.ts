import { PrismaModelType } from '$types/prisma';

/**
 * TODO: Would be better to import these from pgvector, but they don't seem
 *       to export them in the node module.
 * 
 * TODO: Add support for other vector types (half, sparse, etc...)
 */
type vectorComponent = number;
export type vector = vectorComponent[];

/** for use in queryRaw */
export type vectorEntry = {
    [K in `${idFieldName}`]: K extends PrismaModelType
      ? string | undefined
      : never;
    [P in `${vectorFieldName}`]: P extends PrismaModelType ? vector : never;
}

/**
 * For extending model and query extensions to support the named vector field
 */
export type vectorFieldExtension = {
    [K in `${vectorFieldName}`]: K extends PrismaModelType ? string : never;
}