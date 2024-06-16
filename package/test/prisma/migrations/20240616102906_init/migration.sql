-- CreateExtensionSchema
CREATE SCHEMA IF NOT EXISTS "extension";

-- make usable by everyone
GRANT usage ON SCHEMA extension TO public;
GRANT execute ON all functions IN SCHEMA extension TO public;
ALTER default privileges IN SCHEMA extension
    GRANT execute ON functions TO public;
ALTER default privileges IN SCHEMA extension
    GRANT usage ON types TO public;

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector" SCHEMA extension;

-- set search_path for this session
SET search_path = public,extension;

-- CreateTable
CREATE TABLE "Vector" (
    "id" SERIAL NOT NULL,
    "metadata" JSONB,
    "testfield" TEXT,
    "embedding" vector(3),

    CONSTRAINT "Vector_pkey" PRIMARY KEY ("id")
);