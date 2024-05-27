import { Prisma } from '@prisma/client';
import { toSql } from 'pgvector';

/**
 * @template T - ctx
 * @template A - args
 * 
 * @this {T}
 * @param {import('$types/model-extensions/store').createVectorArgs<T, A>} args
 * @returns {Promise<import('$types/model-extensions/store').createVectorResult<T, A>>}
 */
export default async function ({ data, configArgs }) {
    const ctx = Prisma.getExtensionContext(this);

    const {
        vectorFieldName,
        idFieldName = 'id'
    } = configArgs;

    const vector = toSql(data[vectorFieldName]);
    const id = data[idFieldName] ? data[idFieldName] : null;

    let fields;
    let values;

    if (id) {
        fields = `(${idFieldName}, ${vectorFieldName})`;
        values = `(${data[idFieldName]}, '${vector}'::vector)`;
    } else {
        fields = `(${vectorFieldName})`;
        values = `('${vector}'::vector)`;
    }

    const query = `INSERT INTO "${ctx.$name}" ${fields} VALUES ${values}`;

    console.log('--- QUERY ---', query)

    return ctx.__$queryRawUnsafe(query);
}