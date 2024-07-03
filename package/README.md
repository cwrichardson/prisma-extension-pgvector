# Prisma PGVector Client Extension

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/cwrichardson/prisma-extension-pgvector/test.yaml?logo=vitest&label=CI)

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

## Schema

The [`model`](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)
you use for the vector store must include an ID field, [as with all Prisma
models](https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-an-id-field).
Any ID usable for a generic Prisma `model` should be usable with
`prisma-extension-pgvector`, but it **must** resolve to either a `number` or
`string` type.

Additionally, the `model` must have a Vector Field of type `Unsupported`
`vector`. The field may be optional in the schema, but one must be defined.
You can also specify a Vector Field of specific or arbitary length. (e.g.,
`vector Unsupported("vector")` or `vector Unsupported("vector(1536)")`).

<Admonition type="info">

**Note**: While it is permissable to have the Vector Field as optional
(e.g., `vector Unsupported("vector")?`), if you perform distance queries
and some records in your database actually have no vector data, you may get
unexpected results.

</Admonition>

The documentation is built around the following schema:

```prisma file=schema.prisma showLineNumbers
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [vector]
}

model Vector {
  id  Int @id @default(autoincrement())
  metadata  Json?
  testfield String?
  embedding Unsupported("vector(3)")?
}
```

## Instantiating Prisma Client with pgvector extension

### Installation requirements

In addition addition to the usual Prisma installation, and of course
`prisma-extension-pgvector`, you will need to install
[`pgvector`](https://www.npmjs.com/package/pgvector).

```bash
npm install prisma --save-dev
npm install @prisma/client
npm install pgvector
npm install prisma-extension-pgvector
```

### Instantiation arguments

When you instantiate a Prisma client with `prisma-extension-pgvector`,
you need to specify which `model` has the Vector Field, the name of the
Vector Field, and the name of the ID field (`idFieldName` is optional, 
and will default to `id`).

```js
import { PrismaClient } from '@prisma/client';
import { withPGVector } from 'prisma-extension-pgvector';

const prisma = new PrismaClient().$extends(withPGVector({
    modelName: 'vector',
    vectorFieldName: 'embedding',
    idFieldName: 'id'
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