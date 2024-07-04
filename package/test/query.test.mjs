import {
	beforeEach,
	describe,
	expect,
	expectTypeOf,
	it
} from 'vitest';

import prisma from './helpers/prisma.mjs';

describe('query', () => {
	describe('getVectorsById', () => {
		it('should find and return a `vectorEntry`', async () => {
			const vector = await prisma.vector.createManyVectors({
				data: [
					{ id: 25, embedding: [1,2,3] },
					{ id: 45, embedding: [1,2,3] }
				]
			})
				.then(async () => {
					return await prisma.vector.getVectorsById({
						where: { id: { in: [ 25 ]}}
					});
				});

			expect(vector).toStrictEqual([{ id: 25, embedding: [1,2,3] }]);
		});
		it('should find and return multiple `vectorEntry`s', async () => {
			const vectors = await prisma.vector.createManyVectors({
				data: [
					{ id: 25, embedding: [1,2,3] },
					{ id: 45, embedding: [1,2,3] }
				]
			})
				.then(async () => {
					return await prisma.vector.getVectorsById({
						where: { id: { in: [ 25, 45 ]}}
					});
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
				.then(async () => {
					return await prisma.vector.getVectorsById({
						where: { id: { in: [ 1 ]}}
					});
				});

			expectTypeOf(vector).toBeArray();
			expect(vector).toHaveLength(0);
		}),
		it('should find some when some exist', async () => {
			const vector = await prisma.vector.createManyVectors({
				data: [
					{ id: 25, embedding: [1,2,3] },
					{ id: 45, embedding: [1,2,3] }
				]
			})
				.then(async () => {
					return await prisma.vector.getVectorsById({
						where: { id: { in: [ 1, 25, 45 ]}}
					});
				});

			expect(vector).toStrictEqual([
				{ id: 25, embedding: [1,2,3] },
				{ id: 45, embedding: [1,2,3] }
			]);
		});
	}),
	describe('findNearestNeighbors', () => {
		beforeEach(async () => {
			await prisma.vector.createManyVectors({
				data: [
					{ id: 1, embedding: [1,2,3] },
					{ id: 2, embedding: [4,5,6] },
					{ id: 3, embedding: [7,8,9] },
					{ id: 4, embedding: [1,2,3] },
					{ id: 5, embedding: [4,5,6] },
					{ id: 6, embedding: [7,8,9] },
					{ id: 7, embedding: [1,2,3] },
					{ id: 8, embedding: [4,5,6] },
					{ id: 9, embedding: [7,8,9] }
				]
			});
		}),
		it('should find 2 if we take 2', async () => {
			await expect(prisma.vector.findNearestNeighbors({
				from: [1,2,3],
				take: 2
			})).resolves.toStrictEqual([
				{ id: 1, embedding: [1,2,3] },
				{ id: 4, embedding: [1,2,3] }
			]);
		}),
		it('should find nearest given specific ids', async () => {
			await expect(prisma.vector.findNearestNeighbors({
				from: [1,2,3],
				where: { id: { in: [ 2, 3, 4, 7, 8 ] } }
			})).resolves.toStrictEqual([
				{ id: 4, embedding: [1,2,3] },
				{ id: 7, embedding: [1,2,3] },
				{ id: 2, embedding: [4,5,6] },
				{ id: 8, embedding: [4,5,6] },
				{ id: 3, embedding: [7,8,9] }
			]);
		}),
		it('should find by inner product', async () => {
			await expect(prisma.vector.findNearestNeighbors({
				from: [1,2,3],
				orderBy: 'InnerProduct',
				take: 2
			})).resolves.toStrictEqual([
				{ id: 1, embedding: [1,2,3] },
				{ id: 4, embedding: [1,2,3] }
			]);
		});
		it('should find by inner product, given specific ids', async () => {
			await expect(prisma.vector.findNearestNeighbors({
				from: [1,2,3],
				orderBy: 'InnerProduct',
				where: { id: { in: [ 6, 7, 8] } },
				take: 2
			})).resolves.toStrictEqual([
				{ id: 7, embedding: [1,2,3] },
				{ id: 8, embedding: [4,5,6] }
			]);
		});
	});
});