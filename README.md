# Prisma PGVector Client Extension

`prisma-extension-pgvector` is a wrapper around the `pgvector-node` package
that provides a convenient, type-safe way to interact with databases which
support the `pgvector` vector-similarity search for Postgres databases.

Learn more in the [`pgvector`](https://github.com/pgvector/pgvector) and
[`pgvector-node`](https://github.com/pgvector/pgvector-node/) docs.

## Quick Start

### 1. Install dependencies

```bash
npm i @prisma/client prisma-extension-pgvector
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

Build the extension:

```
npm run build
```

Set up the example app:

```
cd example
npm install
npx prisma db push
```

Test the extension in the example app:
```
npm run dev
```

### Evolve the extension

The code for the extension is located in the [`index.ts`](./src/index.ts) file. Feel free to update it before publishing your Client extension to [npm](https://npmjs.com/).

## Learn more

- [Docs — Client extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions)
- [Docs — Shared extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions/shared-extensions)
- [Examples](https://github.com/prisma/prisma-client-extensions/tree/main)
- [Preview announcement blog post](https://www.prisma.io/blog/client-extensions-preview-8t3w27xkrxxn#introduction)