# Client Extension API Reference

## New Methods

These methods operate only on the configured `vector` and `id` fields. For
use with the native Prisma methods, see the [Overrides Documentation](./OVERRIDES.md).

## Store Methods

### `createVector()`

`createVector` creates a new database record.

#### Options

| Name        | Type              | Requyred | Description  |
| ----------- | ----------------- | -------- | ------------------------------------------------|
| `data`      | `createDataArgs`  | **Yes**  | Wraps the configured `vector` and `id` fields in a type so they can be provided when creating new records |

#### Return Type

| Return type      | Example                        | Description                 |
| ---------------- | ------------------------------ | --------------------------- |
| `vectorEntry`    | `{ id: 1, vector: [1, 2, 3] }` | A typed vectorEntry object. |

#### Examples

##### Create a single new vector record

```ts
const insertedVector = await prisma.vector.createVector({
    data: { embedding: [1, 2, 3] }
})
```

##### Create a single recoord with a specific ID

```ts
const insertedVector = await prisma.vector.createVector({
    data: {
        id: 25,
        embedding: [4, 5, 6]
    }
})
```

### `updateVector()`

`updateVector` update a database record with a given `id`.

#### Options

| Name        | Type              | Requyred | Description  |
| ----------- | ----------------- | -------- | ------------------------------------------------|
| `data`      | `updateDataArgs`  | **Yes**  | The native `data` narrowed to just the `id` and `vector` fields. |
| `where`     | `updateWhereArgs` | **Yes**  | The native Prisma `where` narrowed to just the `id` field. |

#### Return Type

| Return type      | Example                        | Description                 |
| ---------------- | ------------------------------ | --------------------------- |
| `vectorEntry`    | `{ id: 1, vector: [1, 2, 3] }` | A typed vectorEntry object. |

#### Examples

##### Change the vector for a single record

```ts
const insertedVector = await prisma.vector.update({
    data: { embedding: [1, 2, 3] },
    where: { id: 1 }
})
```

##### Create a single recoord with a specific ID

```ts
const insertedVector = await prisma.vector.createVector({
    data: {
        id: 25,
        embedding: [4, 5, 6]
    }
})
```

### `createManyVectors()`

`createManyVectors` creates multiple new database records in a single go.

#### Options

| Name        | Type                          | Requyred | Description  |
| ----------- | ----------------------------- | -------- | ------------------------------------------------|
| `data`      | `Enumerable<createDataArgs>`  | **Yes**  | Wraps the configured `vector` and `id` fields in a type so they can be provided when creating new records |

#### Return Type

| Return type      | Example                      | Description                               |
| ---------------- | ---------------------------- | ----------------------------------------- |
| `BatchPayload`   | `{ count: 3 }`               | A count of the number of records created. |

#### Examples

##### Create several new records

```ts
const countVectors = await prisma.vector.createManyVectors({
    data: [
        { embedding: [1, 2, 3] },
        { embedding: [1, 3, 2] },
        { id: 12, embedding: [2, 1, 3] }
    ]
})
```

### `createManyVectorsAndReturn()`

`createManyVectorsAndReturn` creates multiple new database records and returns the resulting objects.

#### Options

| Name        | Type                          | Requyred | Description  |
| ----------- | ----------------------------- | -------- | ------------------------------------------------|
| `data`      | `Enumerable<createDataArgs>`  | **Yes**  | Wraps the configured `vector` and `id` fields in a type so they can be provided when creating new records |

#### Return Type

| Return type      | Example                              | Description                               |
| ---------------- | ------------------------------------ | ----------------------------------------- |
| `vectorEntry[]`   | `[ { id: 1, embedding: [1,2,4] } ]` | A typed array of `vectorEntry`s           |

#### Examples

##### Create and return several new records

<CodeWithResult expanded="{true}">

<cmd>

```ts
const vectors = await prisma.vector.createManyVectorsAndReturn({
    data: [
        { embedding: [1, 2, 3] },
        { embedding: [1, 3, 2] },
        { id: 12, embedding: [2, 1, 3] }
    ]
})
```

</cmd>

<cmdResult>

```json no-copy
[
    { "id": 1, "embedding": [1, 2, 3] },
    { "id": 2, "embedding": [1, 3, 2] },
    { "id": 12, "embedding": [2, 1, 3] }
]
```

</cmdResult>

</CodeWithResult>

### `updateManyVectors()`

<Admonition type="info">

**Note**: The semantics of `updateManyVectors` differ from usual Prisma semantics. Please read carefully.

</Admonition>

`updateManyVectors` updates multiple records' `vector`s based on the `id` and `vector` in the `data` argument.

#### Options

| Name        | Type                          | Requyred | Description  |
| ----------- | ----------------------------- | -------- | ------------------------------------------------|
| `data`      | `Enumerable<createDataArgs>`  | **Yes**  | Wraps the configured `vector` and `id` fields in a type. |

#### Return Type

| Return type      | Example                              | Description                               |
| ---------------- | ------------------------------------ | ----------------------------------------- |
| `BatchPayload`   | `{ count: 2 }`                       | A count of the number of records updated. |

#### Examples

##### Change the vector for 2 records at the same time

```ts
const countChanges = await prisma.vector.updateManyVectors({
    data: [
        { id: 1, embedding: [1, 2, 3] },
        { id: 23, [1, 3, 2] }
    ]
})
```