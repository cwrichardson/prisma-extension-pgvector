-- Extend search_path for this session;
DO $$
    BEGIN
        EXECUTE 'SET search_path TO '||current_setting('search_path')||',extension';
    END
$$;

-- CreateTable
CREATE TABLE "Vector" (
    "id" SERIAL NOT NULL,
    "metadata" JSONB,
    "testfield" TEXT,
    "embedding" vector(3),

    CONSTRAINT "Vector_pkey" PRIMARY KEY ("id")
);