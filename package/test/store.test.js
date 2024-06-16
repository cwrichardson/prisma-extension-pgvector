import { describe, expect, it } from 'vitest';
import prisma from './helpers/prisma';

describe('store', async () => {
    describe('createVector', () => {
        it('should return a `vectorEntry` when given an `id` and a `vector`'), async () => {
            const vectorEntry = await prisma.vector.createVector({
                data: {
                    id: 1,
                    embedding: [1, 2, 3]
                }
            });

            expect(vectorEntry).toStrictEqual({
                id: 1,
                emedding: [1,2,3]
            });
        },
        it('should return a `vectorEntry` when given just a `vector`'), async () => {
            const vectorEntry = await prisma.vector.createVector({
                data: {
                    embedding: [5,6,7]
                }
            });

            expect(vectorEntry).toEqual(expect.objectContaining({
                embedding: [5,6,7]
            }));
        },
        it('should error if given an `id` and `id` already exists'), async () => {
            expect(async () => await prisma.vector.createVector({
                data: { id: 1, embedding: [8,9,10] }
            })).toThrowError();
        }
    }),
    describe('updateVector', () => {
        it('should update a vector'), async () => {
            const newVector = await prisma.vector.updateVector({
                data: { embedding: [7,8,9] },
                where: { id: 1 }
            })

            expect(newVector).toStrictEqual({
                id: 1,
                embedding: [7, 8, 9]
            })
        }
    })
})