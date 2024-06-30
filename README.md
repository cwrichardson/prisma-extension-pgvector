# Prisma PGVector Client Extension

`prisma-extension-pgvector` is a wrapper around the `pgvector-node` package
that provides a convenient, type-safe way to interact with databases which
support the `pgvector` vector-similarity search for Postgres databases.

See [the package docs](./package/README.md) for installation and usage.

## Goals

The target for release 1.0 is the minimal feature set to enable using the
package with [LangChain](https://www.langchain.com). The current LangChain
[Prisma vector store](https://js.langchain.com/v0.2/docs/integrations/vectorstores/prisma)
is missing critical functionality for even using LangChain (e.g., it 
doesn't work with their [reindexing](https://js.langchain.com/v0.2/docs/how_to/indexing)
capability), and generally doesn't integrate particularly well if you're
already using Pirsma.

## Contributing

**You can help!** Jump on the TODO list, and give us a hand!

### TODO

#### Current (v1.x)

Roughly in order of priority:

- Make override unit tests work
- - Currently, the unit tests do some hackery to deal with the fact that
    prisma overwrites the search_path (see [setting a schema clobbers the postgresql search_path instead of prepending to search_path](https://github.com/prisma/prisma/issues/14662)).
    In our unit tests, each test suite runs as a different postgres schema,
    so that we can run in parallel. We work around this issue by setting
    `search_path` in `test_schema_config.sql` before each Prisma invocation.
    This works fine, except in the case where the overrides run
    transactions that make multiple calls, in which scenario, it seems the
    search path is lost before the second (internal) call.
- Fix the `@todo`s in the codebase
- CJS support?
- - We build and export a cjs version which is included in the package. Not
    sure if that's required in 2024, but if it is, then should figure out a
    way to test it.

#### Future (v2.x+)
- Support other vector types (e.g., halfvector)
- Support indexing, if possible

### Testing locally

Both `dev-test` and the automated unit tests run on Docker, so make sure you
have [Docker Desktop](https://www.docker.com/products/docker-desktop/)
installed and running.

Inside [`dev-test`](./dev-test/), feel free to fiddle around in `index.js`
to play with features, including any new ones you implement. There are a
number of shortcuts for Docker commands as npm scripts.

To ensure any pull requests you make are accepted, make sure to run linting
and unit testing locally. From the top level you can

```bash
pnpm lint
pnpm test:unit
```

## External Reading

- [Prisma — Client extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions)
- [Prisma — Shared extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions/shared-extensions)