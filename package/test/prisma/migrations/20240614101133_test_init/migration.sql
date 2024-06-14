-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "Vector" (
    "id" SERIAL NOT NULL,
    "metadata" JSONB,
    "testfield" TEXT,
    "embedding" vector(3),

    CONSTRAINT "Vector_pkey" PRIMARY KEY ("id")
);
