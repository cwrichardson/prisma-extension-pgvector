/**
 * TODO: Would be better to import these from pgvector, but they don't seem
 *       to export them in the node module.
 * 
 * TODO: Add support for other vector types (half, sparse, etc...)
 */
type vectorComponent = number;

export type vector = vectorComponent[];

/**
 * For extending model and query extensions to support the named vector field
 */
export type vectorFieldExtension = {
    [`${vectorFieldName}`]: string;
}