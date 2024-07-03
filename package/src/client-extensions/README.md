# Client Extension Method Reference

## New Methods

### $getConfig()

`$getConfig` is a top level client method used as a helper, to return
the config args which were passed to `prisma-extension-pgvector` for use
in tools built on top of it.

#### Return Type

| Return type        | Example                                                 | Description                 |
| ------------------ | ------------------------------------------------------- | --------------------------- |
| `PGVectorInitArgs` | `{ modelName: 'vector', vectorFieldName: 'embedding' }` | A typed vectorEntry object. |