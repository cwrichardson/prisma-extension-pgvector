# Prisma PGVector Client Extension

`prisma-extension-pgvector` is a wrapper around the `pgvector-node` package
that provides a convenient, type-safe way to interact with databases which
support the `pgvector` vector-similarity search for Postgres databases.

Learn more in the [`pgvector`](https://github.com/pgvector/pgvector) and
[`pgvector-node`](https://github.com/pgvector/pgvector-node/) docs.

## Quick Start

### 1. Install dependencies

```bash
npm i @prisma/client pgvector prisma-extension-pgvector
npm i -D prisma
npx prisma init
```

### 2. Add vector support to your `prisma.schema`

At the moment vector is a preview feature, so we need to enable it

```prisma highlight=3,9;add
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [vector]
}
```

### 3. Add a vector field to your model

Or create a whole new model for your vectors.

```prisma highlight=3;add
model Item {
    id      String                  @id @default(cuid())
    vector  Unsupported("vector")?
}
```

Then create or update your client (usually `prisma migrate dev`).

### 4. Extend the client

Add the extension to your Prisma instantiation, and specify the name of the
model which has the vector field, as well as the name of the field.

```js
const prisma = new PrismaClient().$extends(withPGVector({
    modelName: 'item',
    vectorFieldName: 'vector'
}));
```

## Queries

Model-specific methods for the unsupported vector field type are
[documented here](./src/model-extensions/EXTENSIONS.md).  You can get an array
of vectors from the database by id with, for example,

```js
const vectors = await prisma.vector.getVectorsById({
  where: {
    id: { in: [ 1 ] }
  }
})
```

You can also perform nearest a nearest neighbor search:

```js
const neighbors = await prisma.vector.findNearestNeighbors({
  from: [1, 1, 1],
  orderBy: 'L2'
})
```

Valid distance metrics for `orderBy` are `L2` (default), `InnerProduct`,
`Cosine`, `L1`. See [PGVector Querying](https://github.com/pgvector/pgvector?tab=readme-ov-file#querying).

## Native Prisma methods

Some of the native Prisma client methods have been overridden to support
the vector field. Full documentation [is here](./src/model-extensions/OVERRIDES.md).

Currently there is support for `create`, `createManyAndReturn`, and
`findMany`.

Other native methods do not support the setting or retrieving of the vector
field (yet!). For example, while you can `createManyAndReturn`, `createMany`
will currently result in an error if you try and set your vector field.

If you have a need for one of the other ones to be supported, feel free to
submit an issue, or, better, [write one yourself](../README.md#contributing)!