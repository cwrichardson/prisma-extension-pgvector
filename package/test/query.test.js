import { describe, expect, it } from 'vitest';
import prisma from './helpers/prisma';
import { expectTypeOf } from 'vitest';

describe('query', async () => {
    describe('getVectorsById', () => {
        it('should find and return a `vectorEntry`', async () => {
            const vector = await prisma.vector.createManyVectors({
                data: [
                    { id: 25, embedding: [1,2,3] },
                    { id: 45, embedding: [1,2,3] }
                ]
            })
            .then(async (_) => {
                return await prisma.vector.getVectorsById({
                    where: { id: { in: [ 25 ]}}
                })
            });

            expect(vector).toStrictEqual([{ id: 25, embedding: [1,2,3] }]);
        })
        it('should find and return multiple `vectorEntry`s', async () => {
            const vectors = await prisma.vector.createManyVectors({
                data: [
                    { id: 25, embedding: [1,2,3] },
                    { id: 45, embedding: [1,2,3] }
                ]
            })
            .then(async (_) => {
                return await prisma.vector.getVectorsById({
                    where: { id: { in: [ 25, 45 ]}}
                })
            });

            expect(vectors).toStrictEqual([
                { id: 25, embedding: [1,2,3] },
                { id: 45, embedding: [1,2,3] }
            ]);
        }),
        it('should return empty array if `id` not found', async () => {
            const vector = await prisma.vector.createManyVectors({
                data: [
                    { id: 25, embedding: [1,2,3] }
                ]
            })
            .then(async (_) => {
                return await prisma.vector.getVectorsById({
                    where: { id: { in: [ 1 ]}}
                })
            });

            expectTypeOf(vector).toBeArray;
            expect(vector).toHaveLength(0);
        }),
        it('should find some when some exist', async () => {
            const vector = await prisma.vector.createManyVectors({
                data: [
                    { id: 25, embedding: [1,2,3] },
                    { id: 45, embedding: [1,2,3] }
                ]
            })
            .then(async (_) => {
                return await prisma.vector.getVectorsById({
                    where: { id: { in: [ 1, 25, 45 ]}}
                })
            });

            expect(vector).toStrictEqual([
                { id: 25, embedding: [1,2,3] },
                { id: 45, embedding: [1,2,3] }
            ]);
        })
    })
})