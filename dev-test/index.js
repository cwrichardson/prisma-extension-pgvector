import { PrismaClient } from '@prisma/client';
import { withPGVector } from 'prisma-extension-pgvector';

const prisma = new PrismaClient().$extends(withPGVector({
    modelName: 'vector',
    vectorFieldName: 'embedding'
}));

const insertedVector = await prisma.vector.createVector({
    data: {
        embedding: [1, 2, 3]
    }
});

console.log(insertedVector);