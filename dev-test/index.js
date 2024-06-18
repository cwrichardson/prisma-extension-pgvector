import { PrismaClient } from '@prisma/client';
import { withPGVector } from 'prisma-extension-pgvector';


const prisma = new PrismaClient().$extends(withPGVector({
    modelName: 'vector',
    vectorFieldName: 'embedding'
}));

// create
try {
    const newWithAVector = await prisma.vector.create({
        data: { embedding: [1, 2, 3], metadata: 'foobar'}
    });
    console.log('Inserted a vector ', newWithAVector);

    const selectedNoVector = await prisma.vector.create({
        data: { metadata: 'with select', embedding: [1,2,3] },
        select: { metadata: true }
    });
    console.log('create with select w/out vector', selectedNoVector);

    // // This does (and should) error, because `id` 1 was
    // // created above.
    // const selectedVector = await prisma.vector.create({
    //     data: { id: 1, embedding: [1,2,3], metadata: 'foo' },
    //     select: { embedding: true, metadata: true }
    // });
    // console.log('create with select w/vector', selectedVector);

    const selectedVector = await prisma.vector.create({
        data: { id: 20, embedding: [1,2,3], metadata: 'foo' },
        select: { embedding: true, metadata: true }
    });
    console.log('create with select w/vector', selectedVector);

} catch (/** @type any */ e) {
    console.log('Error inserting non-vector');
    console.log(e.message);
}

// createManyAndReturn
try {
    const newManyWithVectors = await prisma.vector.createManyAndReturn({
        data: [
            { metadata: 'foo', embedding: [11,12,13]},
            { metadata: 'barfoo', embedding: [11,14,13]},
        ]
    })
    console.log('Created many with vectors', newManyWithVectors)
} catch (/** @type any */ e) {
    console.log('Error inserting native many');
    console.log(e.message);
}