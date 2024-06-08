import { PrismaClient } from '@prisma/client';
import { withPGVector } from 'prisma-extension-pgvector';


const prisma = new PrismaClient().$extends(withPGVector({
    modelName: 'vector',
    vectorFieldName: 'embedding'
}));

// create
try {
    const newNotAVector = await prisma.vector.create({
        data: { metadata: 'foobar'}
    });
    console.log('Inserted not a vector ', newNotAVector);
    
    const newWithAVector = await prisma.vector.create({
        data: { embedding: [1, 2, 3], metadata: 'foobar'}
    });
    console.log('Inserted not a vector ', newWithAVector);

    const selectedNoVector = await prisma.vector.create({
        data: { metadata: 'with select', embedding: [1,2,3] },
        select: { metadata: true }
    });
    console.log('create with select w/out vector', selectedNoVector);

    const selectedVector = await prisma.vector.create({
        data: { id: 1, embedding: [1,2,3], metadata: 'foo' },
        select: { embedding: true, metadata: true }
    });
    console.log('create with select w/vector', selectedVector);

} catch (/** @type any */ e) {
    console.log('Error inserting non-vector');
    console.log(e.message);
}

// create single vectors
try {
    const insertedVector = await prisma.vector.createVector({
        data: {
            embedding: [1, 2, 3]
        }
    });
    console.log('Inserted single vector', insertedVector);
    
    const idSpecified = await prisma.vector.createVector({
        data: {
            id: 25,
            embedding: [4, 5, 6]
        }
    })
    console.log('Inserted single vector with id', idSpecified);

} catch (/** @type any */ e) {
    console.log('Error inserting single vector');
    console.log(e.message);
}

// create multiple vectors in one go
try {
    const count = await prisma.vector.createManyVectors({
        data: [
            { id: 2, embedding: [10,11,12]},
            { embedding: [7,8,9] }
        ]
    })
    console.log('Many inserts, 1st has an id', count);

    const count2 = await prisma.vector.createManyVectors({
        data: [
            { embedding: [13,14,15] },
            { id: 3, embedding: [16,17,18]}
        ]
    })
    console.log('Many inserts, last has an id', count2);

    const count3 = await prisma.vector.createManyVectors({
        data: [
            { embedding: [19,20,21]},
            { embedding: [22,23,24] }
        ]
    })
    console.log('Many inserts, none have an id', count3);

    const count4 = await prisma.vector.createManyVectors({
        data: [
            { id: 4, embedding: [25,26,27]},
            { id: 5, embedding: [28,29,30] }
        ]
    })
    console.log('Many inserts, all have an id', count4);

    const count5 = await prisma.vector.createManyVectors({
        data: [
            { embedding: [34,35,36]},
            { id: 6, embedding: [31,32,33]},
            { embedding: [37,37,39] }
        ]
    })
    console.log('Many inserts, middle an id', count5);


} catch (/** @type any */ e) {
    console.log('Error in createMany');
    console.log(e.message)
}

// create multiple vectors and return
try {
    const vectors = await prisma.vector.createManyVectorsAndReturn({
        data: [
            { id: 7, embedding: [10,11,12]},
            { embedding: [7,8,9] }
        ]
    })
    console.log('Many inserts, 1st has an id', vectors);

} catch (/** @type any */ e) {
    console.log('Error in createMany');
    console.log(e.message)
}

// query
try {
    const found = await prisma.vector.getVectorsById({
        where: {
            id: { in: [ 1 ]}
        }
    });
    console.log('Found!', found)

} catch (/** @type any */ e) {
    console.log('Error in query');
    console.log(e.message)
}