import { PrismaClient } from '@prisma/client'
import { withPGVector } from '../../src/index.js';

const prisma = new PrismaClient().$extends(withPGVector({
    modelName: 'vector',
    vectorFieldName: 'embedding'
}));

export default prisma;