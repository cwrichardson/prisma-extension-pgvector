import { Prisma } from '@prisma/client';

/**
 * @type {import('$types/helpers').createManyQueryBuilder}
 */
export function createManyQueryBuilder({
    queryType = 'count',
    modelName,
    vectorFieldName,
    idFieldName,
    ids,
    vectors
}) {
    if (queryType !== 'count' && queryType !== 'return') {
        throw new Error('queryType must be "count" or "return"')
    }

    /**
     * Construct INSERT template for use in queryRaw.
     * 
     *  INSERT INTO "<modelName>" (<idFieldName>, <vectorFieldName>)
     *  VALUES ($1, $2::vector), {$3, $4::vector} ...
     * 
     * if `queryType` is "return", we append 
     * 
     *   RETURNING <idFieldName>
     * 
     * For discussion of `Prisma.raw`, @see createVector
     * 
     * This construction is a little gross and convoluted, primarily so we
     * can accept array elements whether or not the ID is set (and if not,
     * insert `default` into the raw string). Maybe should consider just
     * requiring that if id is specified for any, then must be specified
     * for all — but, even though that would be less convoluted construction,
     * it might well be more computationally intense to do that check,
     * given the large number of vectors which might be passed.
     */
    const queryInsert =
      `INSERT INTO "${Prisma.raw(modelName || '').strings[0]}" `
      + Prisma.raw(`(${idFieldName}, ${vectorFieldName})`).strings[0]
      + ' VALUES ('
      + ((ids[0] === null) ? 'default, ' : '');
    const afterVector = '::vector), (';
    const afterId = ', ';

    const queryStrings = [queryInsert];
    for (let i = 0; i < vectors.length - 1; i++) {
        // if no id, next value will be a vector
        if (ids[i] === null) {
            // next value is vector, and next ID is null '::vector), (default, '
            if (ids[i + 1] === null) {
                queryStrings.push((afterVector + 'default, '))
            } else {
                // next value is vector, and next ID exists '::vector, ('
                queryStrings.push(afterVector);
            }
        // next value will be an ID
        } else {
            // next value is ID, and next ID is null ', ', '::vector), (default, '
            if (ids[i + 1] === null) {
                queryStrings.push(afterId, (afterVector + 'default, '))
            } else {
                // next value is ID and next ID exists ', ', '::vector), ('
                queryStrings.push(afterId, afterVector);
            }
        }
    }

    const returning = queryType === 'return'
        ? ` RETURNING ${Prisma.raw(idFieldName).strings[0]}`
        : ''
    if (ids[ids.length - 1] === null) {
        queryStrings.push('::vector)' + returning);
    } else {
        queryStrings.push(', ', '::vector)' + returning);
    }

    // interleave IDs and vectors to use as values in the query
    const values = ids.map((_, i) => (
        (ids[i] === null) ? vectors[i] : ([ids[i], vectors[i]])
    )).flat();

    return Prisma.sql(queryStrings, ...values);
}