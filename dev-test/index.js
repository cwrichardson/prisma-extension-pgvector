import { PrismaClient } from '@prisma/client';
import { withPGVector } from 'prisma-extension-pgvector';


const prisma = new PrismaClient().$extends(withPGVector({
    modelName: 'vector',
    vectorFieldName: 'embedding'
}));

try {
    const insertedVector = await prisma.vector.createVector({
        data: {
            embedding: [1, 2, 3]
        }
    });
    console.log(insertedVector);

    const idSpecified = await prisma.vector.createVector({
        data: {
            id: 25,
            embedding: [4, 5, 6]
        }
    })
} catch (/** @type any */ e) {
    console.log('Error inserting single vector');
    console.log(e.message);
    console.log(e.meta);
}