import { PrismaClient } from '@prisma/client';
import { withPGVector } from 'prisma-extension-pgvector';


const prisma = new PrismaClient().$extends(withPGVector({
    modelName: 'vector',
    vectorFieldName: 'embedding'
}));

// createManyAndReturn
try {
    const newManyWithVectors = await prisma.vector.createManyAndReturn({
        data: [
            { testfield: 'a', embedding: [1,2,3]},
            { testfield: 'z', embedding: [4,5,6]},
            { testfield: 'b', embedding: [4,5,6]},
            { testfield: 'y', embedding: [7,8,9]},
            { testfield: 'd', embedding: [2,1,3]},
            { testfield: 'x', embedding: [11,14,13]}
        ]
    })
    console.log('Created many with vectors', newManyWithVectors)
} catch (/** @type any */ e) {
    console.log('Error inserting native many');
    console.log(e.message);
}

// findMany
try {
    const gotEmAll = await prisma.vector.findMany({});
    console.log('findMany found all ', gotEmAll);

    const metaFooVector = await prisma.vector.findMany({
        where: {
            testfield: { in: ['a','z']}
        }
    });
    console.log('Found testfield with a or z', metaFooVector)

    const selectNoVector = await prisma.vector.findMany({
        where: {
            testfield: { in: ['a','z']}
        },
        select: {
            testfield: true,
            metadata: true
        }
    });
    console.log('Selected not vector with testfield a or z', selectNoVector)

    const selectVector = await prisma.vector.findMany({
        where: {
            testfield: { in: ['a','z']}
        },
        select: {
            testfield: true,
            metadata: true,
            embedding: true
        }
    });
    console.log('Selected not vector', selectVector);

    const fiveBy = await prisma.vector.findMany({
        from: [20,20,20],
        orderBy: { embedding: 'L2' },
        take: 4
    });
    console.log('5 by distance', fiveBy);

    const fiveSorted = await prisma.vector.findMany({
        from: [20,20,20],
        orderBy: [{ embedding: 'L2' }, { testfield: 'asc' }],
        take: 4
    })
    console.log('5 sorted', fiveSorted);
} catch (/** @type any */ e) {
    console.log('Error finding many');
    console.log(e.message);
}