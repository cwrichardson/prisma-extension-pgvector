# Client Method Overrides API Reference

## Overrides

[Unsupported field types](https://www.prisma.io/docs/orm/prisma-schema/data-model/unsupported-database-features#unsupported-field-types)
are not available in the generated Prisma client. These override methods
are provided as convenience wrappers around the standard methods. In general,
if you're not interacting with the `vector` field, they simply operate as
a pass-through to the generated methods. Conversely, if operating only on
the configured `vector` or `id` fields, they operate as pass-throughs to the
model specific [extension methods](EXTENSIONS.md). When interacting with both
supported fields and the `vector` field, they execute [sequential operations](https://www.prisma.io/docs/orm/prisma-client/queries/transactions#sequential-prisma-client-operations).

Below, only options which are modified from the native methods are documented;
other options are expected to operate normally. For example, in `create`, `data`
and `select` are documented. The undocumented `include`, `omit`, and
`relationLoadStrategy` are expected to work as per the Prisma documentation.

<Admonition type="info">

**Note**: Not all native methods are overridden. Non-overridden methods will behave as normal (i.e., not include the `vectorField` in any options or returns)

</Admonition>

### `create()`

Overrides the default [create](https://www.prisma.io/docs/orm/reference/prisma-client-reference#create) method.

#### Options

| Name        | Type              | Required | Description  |
| ----------- | ----------------- | -------- | ------------------------------------------------|
| `data`      | `XOR<(VectorCreateInput & vectorField),` <br />`(VectorUncheckedCreateInput> & vectorField)`  | **Yes**  | Wraps all the native model fields as well as the configured `vectorField` in a type. |
| `select`    | `XOR<(VectorSelect & vectorField), null>`                                                     | No       | Extends the native `select` with an additional `boolean` for the configured `vectorField` |

#### Return Type

| Return type               | Example                        | Description                 |
| ------------------------- | ------------------------------ | --------------------------- |
| JavaScript object (typed) | `Vector & vectorfield`         |                             |
| JavaScript object (plain) | `{ embedding: [1, 2, 3] }`     | Specified which properties to include, including the configured `vectorField` |

#### Examples

##### Create a single new record

<CodeWithResult expanded="{true}">

<cmd>

```ts
const newVector = await prisma.vector.create({
        data: { embedding: [1, 2, 3], metadata: 'foobar' }
    });
```

</cmd>

<cmdResult>

```json no-copy
{
    "id": 1,
    "embedding": [1, 2, 3],
    "metadata": 'foobar',
    "testfield": null
}
```

</cmdResult>

</CodeWithResult>

###### Remarks

Executes a native `create` followed by a [`createVector`](./EXTENSIONS.md/#createvector) as a transaction.

##### Create a single new record using only native fields

<CodeWithResult expanded="{true}">

<cmd>

```ts
const newVector = await prisma.vector.create({
        data: { metadata: 'foobar' }
    });
```

</cmd>

<cmdResult>

```json no-copy
{
    "id": 1,
    "embedding": null,
    "metadata": 'foobar',
    "testfield": null
}
```

</cmdResult>

</CodeWithResult>

###### Remarks

Passthrough to native `create`, appending the null `vectorField`.

##### Create a new vector record, but only include the metadata in the response

<CodeWithResult expanded="{true}">

<cmd>

```ts
const newVector = await prisma.vector.create({
        data: { metadata: 'foobar', embedding: [1, 2, 3] },
        select: { metadata: true }
    });
```

</cmd>

<cmdResult>

```json no-copy
{  "metadata": 'foobar' }
```

</cmdResult>

</CodeWithResult>

###### Remarks

Executes a native `create` followed by a [`createVector`](./EXTENSIONS.md/#createvector) as a transaction.

##### Create a new vector record, and return the metadata and the vector fields

<CodeWithResult expanded="{true}">

<cmd>

```ts
const newVector = await prisma.vector.create({
        data: { metadata: 'foobar', embedding: [1, 2, 3] },
        select: { metadata: true, embedding: true }
    });
```

</cmd>

<cmdResult>

```json no-copy
{  "metadata": 'foobar', embedding: [1, 2, 3] }
```

</cmdResult>

</CodeWithResult>

###### Remarks

Executes a native `create` followed by a [`createVector`](./EXTENSIONS.md/#createvector) as a transaction.

### `createManyAndReturn()`

Overrides the default [createManyAndReturn](https://www.prisma.io/docs/orm/reference/prisma-client-reference#createmanyandreturn) method.

#### Options

| Name        | Type              | Required | Description  |
| ----------- | ----------------- | -------- | ------------------------------------------------|
| `data`      | `Enumerable<extendedCreateDataArgs>`  | **Yes**  | Wraps all the native model fields as well as the configured `vectorField` in a type. |
| `select`    | `XOR<(VectorSelect & vectorField), null>`                                                     | No       | Extends the native `select` with an additional `boolean` for the configured `vectorField` |

#### Return Type

| Return type               | Example                        | Description                 |
| ------------------------- | ------------------------------ | --------------------------- |
| JavaScript array object (typed) | `<Vector & vectorfield>[]`         |                             |
| JavaScript array object (plain) | `[{ embedding: [1, 2, 3] }]`     | Specified which properties to include, including the configured `vectorField` |

#### Examples

##### Create a single new record

<CodeWithResult expanded="{true}">

<cmd>

```ts
const newVectors = await prisma.vector.createManyAndReturn({
    data: [
        { metadata: 'foo', embedding: [11,12,13] },
        { metadata: 'barfoo', embedding: [11,14,13] }
    ]
})
```

</cmd>

<cmdResult>

```json no-copy
[
    {
        "id": 1,
        "embedding": [11, 12, 13],
        "metadata": 'foo',
        "testfield": null
    },
    {
        "id": 2,
        "embedding": [11, 14, 13],
        "metadata": 'barfoo',
        "testfield": null
    }
]
```

</cmdResult>

</CodeWithResult>

###### Remarks

Executes a native `createManyAndReturn` followed by a [`updateManyVectors`](EXTENSIONS.md/#updatemanyvectors) as a transaction.

##### Create multiple new records using only native fields

<CodeWithResult expanded="{true}">

<cmd>

```ts
const newVectors = await prisma.vector.createManyAndReturn({
    data: [
        { metadata: 'foo' },
        { metadata: 'barfoo' }
    ]
})
```

</cmd>

<cmdResult>

```json no-copy
[
    {
        "id": 1,
        "embedding": null,
        "metadata": 'foo',
        "testfield": null
    },
    {
        "id": 2,
        "embedding": null,
        "metadata": 'barfoo',
        "testfield": null
    }
]
```

</cmdResult>

</CodeWithResult>

###### Remarks

Passthrough to native `createManyAndReturn`, appending the null `vectorField`.

### `findMany()`

Overrides the default [findMany](https://www.prisma.io/docs/orm/reference/prisma-client-reference#findmany) method.

#### Options

| Name        | Type                                                                             | Required | Description  |
| ----------- | -------------------------------------------------------------------------------- | -------- | ------------------------------------------------|
| `select`    | `XOR<VectorSelect`<br />` & [vectorFieldName]: boolean, null>`                   | No       | Specified which properties to include in the returned object, including the configured `vectorField`
| `orderBy`   | `XOR<Enumerable<extendedVector`<br />`OrderByInput>, extendedVectorOrderByInput` | No       | The standard `orderBy` args, extended with an object for `vectorFieldName`, which instead of `'asc'` or `'desc'` takes a [`distanceType`](EXTENSIONS.md#distancetype) |
| `from`      | `vector`                      | No `\|` **yes** | The `vector` from which distance is being calculated (**required** if and only if `vectorFieldName` is included in `orderBy`) |
| `take`      | `number \| PositiveInteger`              | No       | How many records to return. Must be a positive number if provided and `orderBy` includes `vectorFieldName` |

#### Return Type

| Return type               | Example                        | Description                 |
| ------------------------- | ------------------------------ | --------------------------- |
| JavaScript array object (typed) | `<Vector & vectorfield>[]`         |                             |
| JavaScript array object (plain) | `[{ embedding: [1, 2, 3] }]`     | Specified which properties to include, including the configured `vectorField` |
| Empty array                     | `[]`                             | No matching records found.

#### orderBy handling

<Admonition type="info">

**Good To Know**: If multiple `orderBy` objects are provided, any `vectorFieldName` `orderBy` will always be performed first, regardless of its order within the array.

**Note**: Because of this, if a `take` is specified, results may not be as naively expected. See the [`orderBy` and `take` example](#orderby-and-take).

</Admonition>

#### Examples

##### Get all `Vector` records where `testfield` is `a` or `z`

<CodeWithResult expanded="{true}">

<cmd>

```ts
const vectors = await prisma.vector.findMany({
    where: {
        testfield: { in: ['a','z'] }
    },
    select: {
        testfield: true,
        embedding: true
    }
})
```

</cmd>

<cmdResult>

```json no-copy
[
    {
        "embedding": [11, 12, 13],
        "testfield": "a"
    },
    {
        "embedding": [11, 14, 13],
        "testfield": "z"
    }
]
```

</cmdResult>

</CodeWithResult>

###### Remarks

Executes a native `findMany` followed by a [`getVectorsById`](EXTENSIONS.md/#getvectorsbyid) as a transaction. This is true, even if `idFieldName` isn't included in the results via `select`.

##### Get all `Vector` records sorted by `Cosine` distance, and returning `id`, `metadata`, and `embedding`

```ts
const vectors = await prisma.vector.findMany({
    select: {
        id: true,
        metadata: true,
        embedding: true
    }
    orderBy: {
        embedding: "Cosine"
    }
})
```

###### Remarks

Executes a native `findMany` followed by a [`getVectorsById`](EXTENSIONS.md/#getvectorsbyid) as a transaction. This is true, even if `idFieldName` isn't included in the results via `select`.

##### `orderBy` and `take`

Consider a database populated by

```ts
const newManyWithVectors = await prisma.vector.createManyAndReturn({
        data: [
            { testfield: 'a', embedding: [1,2,3]},
            { testfield: 'z', embedding: [4,5,6]},
            { testfield: 'b', embedding: [4,5,6]},
            { testfield: 'y', embedding: [7,8,9]},
            { testfield: 'd', embedding: [2,1,3]},
            { testfield: 'x', embedding: [11,14,13]}
        ]
    })
```

Then 

<CodeWithResult expanded="{true}">

<cmd>

```ts
const takeFour = await prisma.vector.findMany({
        from: [20,20,20],
        orderBy: { embedding: 'L2' },
        take: 4
    });
```

</cmd>

<cmdResult>

```json no-copy
[
    { id: 4, embedding: [ 7, 8, 9 ], metadata: null, testfield: 'y' },
    { id: 2, embedding: [ 4, 5, 6 ], metadata: null, testfield: 'z' },
    { id: 3, embedding: [ 4, 5, 6 ], metadata: null, testfield: 'b' },
    { id: 1, embedding: [ 1, 2, 3 ], metadata: null, testfield: 'a' }
]
```

</cmdResult>

</CodeWithResult>

If we add another `orderBy` for `testfield`, 

```ts
const takeFour = await prisma.vector.findMany({
        from: [20,20,20],
        orderBy: [{ testfield: 'asc'}, { embedding: 'L2' }],
        take: 4
    });
```

since we know that vector sorting always comes first, we might expect the result to be

```json no-copy
[
    { id: 4, embedding: [ 7, 8, 9 ], metadata: null, testfield: 'y' },
    { id: 3, embedding: [ 4, 5, 6 ], metadata: null, testfield: 'b' },
    { id: 2, embedding: [ 4, 5, 6 ], metadata: null, testfield: 'z' },
    { id: 1, embedding: [ 1, 2, 3 ], metadata: null, testfield: 'a' }
]
```

However, what we actually get is

```json no-copy
    { id: 6, embedding: [ 11, 14, 13 ], metadata: null, testfield: 'x' },
    { id: 3, embedding: [ 4, 5, 6 ], metadata: null, testfield: 'b' },
    { id: 1, embedding: [ 1, 2, 3 ], metadata: null, testfield: 'a' },
    { id: 5, embedding: [ 2, 1, 3 ], metadata: null, testfield: 'd' }
```

__What the heck is that__? What's happening here is the impact of the `take`, and the fact that this runs as a transaction under the covers, with a traditional `findMany` happening first. So, the native `findMany` `takes` `4` sorted by `testfield`:

```json no-copy
    { id: 1, metadata: null, testfield: 'a' },
    { id: 3, metadata: null, testfield: 'b' },
    { id: 5, metadata: null, testfield: 'd' },
    { id: 6, metadata: null, testfield: 'x' }
```

It then returns those four `id`s sorted by `L2` distance from `[20,20,20]` and then sorted by `testfield`. This example was designed to highlight the potential mis-expectation, but we could change it slightly to make the secondary order of `testfield` more obvious. If we updated `id` `1` to have vector `[4,5,6]`, then our result would be

```json no-copy
    { id: 6, embedding: [ 11, 14, 13 ], metadata: null, testfield: 'x' },
    { id: 1, embedding: [ 4, 5, 6 ], metadata: null, testfield: 'a' }, // <- `testfield` `a` now comes first
    { id: 3, embedding: [ 4, 5, 6 ], metadata: null, testfield: 'b' },
    { id: 5, embedding: [ 2, 1, 3 ], metadata: null, testfield: 'd' }
```