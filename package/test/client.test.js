import { describe, expect, it } from 'vitest';
import prisma from './helpers/prisma';

describe('client', () => {
	describe('$getConfig', () => {
		it('should return the config`', () => {
			expect(prisma.$getConfig()).toStrictEqual({
				modelName: 'vector',
				vectorFieldName: 'embedding'
			});
		});
	});
});