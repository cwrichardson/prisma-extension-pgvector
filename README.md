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

XXX Finish build & test steps, but then move this to a different section and do the QuickStart as npm.

## Contributing

XXX

### TODO

- Override default model queries
- Support other vector types (e.g., halfvector)
- Support indexing, if possible

### Testing locally

Get the `pgvector` Docker image.

```bash
docker pull pgvector/pgvector:pg16
```

Then run the container with the username and password configured in `packages/test/.env`.

```bash
docker run --name pgv-extension-node-test-env -e POSTGRES_USERNAME=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DATABASE=pgv-test -p 5432:5432 -d pgvector/pgvector:pg16
```

and then inside `package/test`, deploy the database (**NB**: Do NOT run `prisma init`, as it will overwrite the custom migration):

```bash
pnpx prisma migrate deploy
```

Now you can run the `vitest` tests with `pnpm`:

```bash
pnpm run test
```

## External Reading

- [Prisma — Client extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions)
- [Prisma — Shared extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions/shared-extensions)