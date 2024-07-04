import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest';

import prisma from './helpers/prisma.mjs';

describe('overrides', () => {
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
			});
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
			});
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
			});
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
			});
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
			});
		});
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
			]);
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
			]);
		});
	}),
	describe('findMany', () => {
		beforeEach(async () => {
			await prisma.vector.createManyAndReturn({
				data: [
					{ testfield: 'a', embedding: [1,2,3]},
					{ testfield: 'z', embedding: [4,5,6]},
					{ testfield: 'b', embedding: [4,5,6]},
					{ testfield: 'y', embedding: [7,8,9]},
					{ testfield: 'd', embedding: [2,1,3]},
					{ testfield: 'x', embedding: [11,14,13]}
				]
			});
		}),
		it.skip('should find everything and include `vectorField', async () => {
			const vectors = await prisma.vector.findMany({});

			expectTypeOf(vectors).toBeArray();
			expect(vectors).toHaveLength(6);
			/** @todo fix lint when we remove skip from test */
			// eslint-disable-next-line vitest/valid-expect
			expect(vectors).to.include.members([
				expect.objectContaining({ testfield: 'a', embedding: [1,2,3], metadata: null }),
				expect.objectContaining({ testfield: 'z', embedding: [4,5,6], metadata: null }),
				expect.objectContaining({ testfield: 'b', embedding: [4,5,6], metadata: null }),
				expect.objectContaining({ testfield: 'y', embedding: [7,8,9], metadata: null }),
				expect.objectContaining({ testfield: 'd', embedding: [2,1,3], metadata: null }),
				expect.objectContaining({ testfield: 'x', embedding: [11,14,13], metadata: null }),
			]);
		}),
		it.skip('should work as normal without `vectorField`', async () => {
			const vectors = await prisma.vector.findMany({
				where: {
					testfield: { in: ['a','z']}
				},
				select: {
					testfield: true,
					metadata: true
				}
			});

			expectTypeOf(vectors).toBeArray();
			expect(vectors).toHaveLength(2);
			/** @todo fix lint when we remove skip from test */
			// eslint-disable-next-line vitest/valid-expect
			expect(vectors).to.include.members([
				{ testfield: 'a', metadata: null },
				{ testfield: 'z', metadata: null },
			]);
		}),
		it.skip('should `orderBy` `vectorField`', async () => {
			const vectors = await prisma.vector.findMany({
				from: [20,20,20],
				orderBy: { embedding: 'L2' },
				take: 4
			});

			expect(vectors).toStrictEqual([
				{ id: 4, embedding: [ 7, 8, 9 ], metadata: null, testfield: 'y' },
				{ id: 2, embedding: [ 4, 5, 6 ], metadata: null, testfield: 'z' },
				{ id: 3, embedding: [ 4, 5, 6 ], metadata: null, testfield: 'b' },
				{ id: 1, embedding: [ 1, 2, 3 ], metadata: null, testfield: 'a' }
			]);
		}),
		it.skip('should `orderBy` correctly with multiple `orderBy`s', async () => {
			const vectors = await prisma.vector.findMany({
				from: [20,20,20],
				orderBy: [{ embedding: 'L2' }, { testfield: 'asc' }],
				take: 4
			});

			expect(vectors).toStrictEqual([
				{ id: 6, embedding: [ 11, 14, 13 ], metadata: null, testfield: 'x' },
				{ id: 3, embedding: [ 4, 5, 6 ], metadata: null, testfield: 'b' },
				{ id: 1, embedding: [ 1, 2, 3 ], metadata: null, testfield: 'a' },
				{ id: 5, embedding: [ 2, 1, 3 ], metadata: null, testfield: 'd' }
			]);
		});
	});
});