import prisma from './prisma';

export default async () => {
    await prisma.$transaction([
        prisma.vector.deleteMany(),
        prisma.$executeRawUnsafe(`ALTER "Vector_id_seq" RESTART WITH 1`)
    ])
}