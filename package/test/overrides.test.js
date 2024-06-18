import { describe, expect, it } from 'vitest';
import prisma from './helpers/prisma';

describe('overrides', async () => {
    describe('create', () => {
        it('should should create and return complete records, when `vectorField` not provided', async () => {
            const vector = await prisma.vector.create({
                data: { metadata: 'foo' }
            });

            expect(vector).toStrictEqual({
                id: 1,
                metadata: 'foo',
                testfield: null,
                embedding: null
            })
        }),
        it.skip('should should create and return complete records, when provided `vectorField`', async () => {
            const vector = await prisma.vector.create({
                data: {
                    metadata: 'foo',
                    embedding: [1,2,3]
                }
            });

            expect(vector).toStrictEqual({
                id: 1,
                metadata: 'foo',
                testfield: null,
                embedding: [ 1, 2, 3]
            })
        }),
        it.skip('`select`ing non-`vectorField` fields works', async () => {
            const vector = await prisma.vector.create({
                data: {
                    metadata: 'foo',
                    embedding: [1,2,3]
                },
                select: {
                    metadata: true
                }
            });

            expect(vector).toStrictEqual({
                metadata: 'foo'
            })
        }),
        it.skip('`select`ing `vectorField` fields works', async () => {
            const vector = await prisma.vector.create({
                data: {
                    metadata: 'foo',
                    embedding: [1,2,3]
                },
                select: {
                    metadata: true,
                    embedding: true
                }
            });

            expect(vector).toStrictEqual({
                metadata: 'foo',
                embedding: [1,2,3]
            })
        }),
        it.skip('should accept a specified `id`', async () => {
            const vector = await prisma.vector.create({
                data: {
                    id: 5,
                    metadata: 'foo',
                    embedding: [1,2,3]
                }
            });

            expect(vector).toStrictEqual({
                id: 5,
                metadata: 'foo',
                testfield: null,
                embedding: [ 1, 2, 3]
            })
        })
    }),
    describe('createManyAndReturn', () => {
        it('creates many when no `vectorField` supplied', async () => {
            const vectors = await prisma.vector.createManyAndReturn({
                data: [
                    { metadata: 'foo' },
                    { metadata: 'bar' }
                ]
            });

            expect(vectors).toStrictEqual([
                {
                    id: 1,
                    metadata: 'foo',
                    testfield: null,
                    embedding: null
                },
                {
                    id: 2,
                    metadata: 'bar',
                    testfield: null,
                    embedding: null
                }
            ])
        }),
        it.skip('creates many when `vectorField` is supplied', async () => {
            const vectors = await prisma.vector.createManyAndReturn({
                data: [
                    { metadata: 'foo', embedding: [1,2,3] },
                    { metadata: 'bar', embedding: [4,5,6] }
                ]
            });

            expect(vectors).toStrictEqual([
                {
                    id: 1,
                    metadata: 'foo',
                    testfield: null,
                    embedding: [1,2,3]
                },
                {
                    id: 2,
                    metadata: 'bar',
                    testfield: null,
                    embedding: [4,5,6]
                }
            ])
        })
    })
})