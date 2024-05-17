import { PrismaClient } from '@prisma/client';
import { withPGVector } from 'prisma-extension-pgvector';

const prisma = new PrismaClient().$extends(withPGVector({
    modelName: 'vector',
    vectorFieldName: 'embedding'
}));