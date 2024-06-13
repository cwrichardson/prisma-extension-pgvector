# Client Extension API Reference

## New Methods

These methods operate only on the configured `vector` and `id` fields. For
use with the native Prisma methods, see the [Overrides Documentation](./OVERRIDES.md).

## Store Methods

### `createVector()`

`createVector` creates a new database record.

#### Options

| Name        | Type              | Required | Description  |
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

| Name        | Type              | Required | Description  |
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

| Name        | Type                          | Required | Description  |
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

| Name        | Type                          | Required | Description  |
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

| Name        | Type                          | Required | Description  |
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

## Query Methods

### `getVectorsById()`

`getVectorsById` returns an array of `vectorEntry`s given an array of `id`s

#### Options

| Name        | Type                          | Required | Description                                     |
| ----------- | ----------------------------- | -------- | ------------------------------------------------|
| `where`     | `getVectorsByIdWhere`         | **Yes**  | A `where` object narrowed to just the `id` key, and requiring (and only supporting) the `in` filter condition. |

#### Return Type

| Return type      | Example                              | Description                               |
| ---------------- | ------------------------------------ | ----------------------------------------- |
| `vectorEntry[]`   | `[ { id: 1, embedding: [1,2,4] } ]` | A typed array of `vectorEntry`s           |

#### Examples

##### Get a single vector by `id`

```ts
const vector = await prisma.vector.getVectorsById({
    where: { id: { in: [ 1 ] } }
})
```

### `findNearestNeighbors()`

`findNearestNeighbors` performs a nearest-neighbor [pgvector query](https://github.com/pgvector/pgvector?tab=readme-ov-file#querying).

#### Options

| Name        | Type                          | Required | Description  |
| ----------- | ----------------------------- | -------- | ------------------------------------------------|
| `from`      | `vector`                      | **Yes**  | The `vector` from which distance is being calculated |
| `where`     | `getVectorsByIdWhere`         | No       | A `where` object narrowed to just the `id` key, and requiring (and only supporting) the `in` filter condition. |
| `orderBy`   | `distanceType`                | No       | The distance function to use for finding neighbors. Default is `L2`. |
| `take`      | `PositiveIntege`              | No       | How many records to return |

<Admonition type="info">

**Note**: The semantics of `take` are slightly different than elsewhere in Prisma; however, the option name has been used here instead of the perhaps more accurate `limit` both for congruity's sake, and because the intent is to better mimic `take` functionality in the future.

</Admonition>

#### `distanceType`

| Value          | Description |
| -------------  | ----------- |
| `L2`           | (default) returns nearest neighbors by Euclidean distance
| `InnerProduct` | Calculates negative inner product; returns neigbors in DESC order (i.e., in order, because the calculation is negative — see [pgvector Distances](https://github.com/pgvector/pgvector?tab=readme-ov-file#distances))
| `Cosine`       | Calculates cosine distance; returns neighbors in DESC order (i.e., in order, because the calculation needs to be subtracted from 1 — see [pgvector Distances](https://github.com/pgvector/pgvector?tab=readme-ov-file#distances))
| `L1`           | returns nearest neighbors by taxicab distance

<Admonition type="info">

**Note**: The extension does not mandate that the `vector` field be required. If it is not, and some vectors are empty, then you may get unexpected results — particularly with `Cosine` and `InnerProduct` distance. See [this example](#nan-example)

</Admonition>

#### Return Type

| Return type      | Example                              | Description                               |
| ---------------- | ------------------------------------ | ----------------------------------------- |
| `vectorEntry[]`   | `[ { id: 1, embedding: [1,2,4] } ]` | A typed array of `vectorEntry`s           |

#### Examples

##### Find 2 closest neighbors to `[1,2,3]`

<CodeWithResult expanded="{true}">

<cmd>

```ts
const vectors = await prisma.vector.findNearestNeighbors({
        from: [1, 2, 3],
        take: 2
    })
```

</cmd>

<cmdResult>

```json no-copy
[
  { "id": 1060, "embedding": [ 1, 2, 3 ] },
  { "id": 1066, "embedding": [ 1, 2, 3 ] }
]
```

</cmdResult>

</CodeWithResult>

##### Sort specific vectors with `id` `2`, `3`, `4`, `25` by distance from `[1,2,3]`

<CodeWithResult expanded="{true}">

<cmd>

```ts
const vectors = await prisma.vector.findNearestNeighbors({
        from: [1, 2, 3],
        where: { id: { in: [ 2,3,4,25 ] }}
    })
```

</cmd>

<cmdResult>

```json no-copy
[
  { "id": 25, "embedding": [ 4, 5, 6 ] },
  { "id": 2, "embedding": [ 10, 11, 12 ] },
  { "id": 3, "embedding": [ 16, 17, 18 ] },
  { "id": 4, "embedding": [ 25, 26, 27 ] }
]
```

</cmdResult>

</CodeWithResult>

##### Find 5 nearest neighbors to `[1,2,3]` using inner product as the distance metric

<CodeWithResult expanded="{true}">

<cmd>

```ts
const vectors = await prisma.vector.findNearestNeighbors({
        from: [1, 2, 3],
        orderBy: 'InnerProduct',
        take: 5
    })
```

</cmd>

<cmdResult>

```json no-copy
[
  { "id": 25, "embedding": [ 4, 5, 6 ] },
  { "id": 2, "embedding": [ 10, 11, 12 ] },
  { "id": 3, "embedding": [ 16, 17, 18 ] },
  { "id": 4, "embedding": [ 25, 26, 27 ] }
]
```

</cmdResult>

</CodeWithResult>

##### <a name='nan-example'></a>Find 5 nearest neighbors to `[1,2,3]` from the set of vectors with ids `1`, `2`, `3`, `4`, `5`, `6`, `7` using inner product as the distance metric

<CodeWithResult expanded="{true}">

<cmd>

```ts
const vectors = await prisma.vector.findNearestNeighbors({
        from: [1, 2, 3],
        orderBy: 'InnerProduct',
        where: { id: in: {[ 1,2,3,4,5,6,7 ]}}
        take: 5
    })
```

</cmd>

<cmdResult>

```json no-copy
[
  { "id": 1, "embedding": [ NaN ] },
  { "id": 7, "embedding": [ 10, 11, 12 ] },
  { "id": 2, "embedding": [ 10, 11, 12 ] },
  { "id": 3, "embedding": [ 16, 17, 18 ] },
  { "id": 4, "embedding": [ 25, 26, 27 ] }
]
```

</cmdResult>

</CodeWithResult>