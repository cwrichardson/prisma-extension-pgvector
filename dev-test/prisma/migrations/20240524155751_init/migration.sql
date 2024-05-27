-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "Vector" (
    "id" SERIAL NOT NULL,
    "embedding" vector(3),

    CONSTRAINT "Vector_pkey" PRIMARY KEY ("id")
);
