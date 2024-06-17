import { describe, expect, it } from 'vitest';
import prisma from './helpers/prisma';

describe('store', async () => {
    describe('createVector', () => {
        it('should return a `vectorEntry` when given an `id` and a `vector`', async () => {
            await expect(prisma.vector.createVector({
                data: {
                    id: 1,
                    embedding: [1, 2, 3]
                }
            })).resolves.toStrictEqual({
                id: 1,
                embedding: [1,2,3]
            });
        }),
        it('should return a `vectorEntry` when given just a `vector`', async () => {
            await expect(prisma.vector.createVector({
                data: {
                    embedding: [5,6,7]
                }
            })).resolves.toEqual(expect.objectContaining({
                embedding: [5,6,7]
            }));
        }),
        it('should error if given an `id` and `id` already exists', async () => {
            await expect(prisma.vector.createVector({
                data: { id: 1, embedding: [1,2,3] }
            }).then(() => prisma.vector.createVector({
                data: {id: 1, embedding: [8,9,10] }
            }))).rejects.toThrowError();
        })
    }),
    describe('createManyVectors', () => {
        it('should create vectors and return count', async () => {
            const countObj = await prisma.vector.createManyVectors({
                data: [
                    { embedding: [1,2,3] },
                    { embedding: [4,5,6] }
                ]
            });

            expect(countObj).toStrictEqual({ count: 2 });
        }),
        it('should create vectors and ids and return count', async () => {
            const countObj = await prisma.vector.createManyVectors({
                data: [
                    { id: 10, embedding: [1,2,3] },
                    { id: 11, embedding: [4,5,6] }
                ]
            });

            expect(countObj).toStrictEqual({ count: 2 })
        }),
        it('should support id specified in only middle of 3 or more', async () => {
            const countObj = await prisma.vector.createManyVectors({
                data: [
                    { embedding: [1,2,3] },
                    { id: 20, embedding: [4,5,6] },
                    { embedding: [7,8,9] }
                ]
            });

            expect(countObj).toStrictEqual({ count: 3 })
        })
    }),
    describe('updateVector', () => {
        it('should update a vector', async () => {
            const newVector = await prisma.vector.updateVector({
                data: { embedding: [7,8,9] },
                where: { id: 1 }
            })

            expect(newVector).toStrictEqual({
                id: 1,
                embedding: [7, 8, 9]
            })
        }),
        it('requires id in where', async () => {
            // @ts-expect-error
            await expect(prisma.vector.updateVector({
                data: { embedding: [1,2,3]}
            })).rejects.toThrowError('where: { <idFieldName>: <id>  } is required')
        }),
        it('requires data', async () => {
            // @ts-expect-error
            await expect(prisma.vector.updateVector({
                where: { id: 1 }
            })).rejects.toThrowError('data object is required.')
        })
    })
})