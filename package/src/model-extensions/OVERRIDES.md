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