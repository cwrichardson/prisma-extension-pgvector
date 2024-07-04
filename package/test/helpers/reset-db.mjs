import prisma from './prisma.mjs';

export default async () => {
	await prisma.$transaction([
		prisma.vector.deleteMany(),
		prisma.$executeRawUnsafe('ALTER SEQUENCE "Vector_id_seq" RESTART WITH 1')
	]);
};