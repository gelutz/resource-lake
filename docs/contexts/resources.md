# Context: Resources (core)

The core bounded context. Owns the [[../glossary#resource|Resource]] aggregate
and the [[../glossary#highlight|Highlight]] it contains. Nx `scope:resources`
([[../architecture/nx-boundaries]]).

## Aggregate: Resource

The central entity. Aggregate **root** that owns its Highlights.

### Fields

| Field          | Type                                  | Notes |
|----------------|---------------------------------------|-------|
| `id`           | string (uuid)                         | primary key ([[../architecture/rxdb-constraints]]) |
| `type`         | `link \| text \| image \| file`        | **payload shape** — how it's stored/rendered |
| `title`        | string                                | user-facing title |
| `excerpt`      | string                                | short description / snippet |
| `cover`        | string (url) \| null                   | thumbnail/preview image |
| `body`         | object (type-specific)                | url for `link`; text for `text`; blob ref for `image`/`file` |
| `categoryId`   | `text \| video \| audio \| image`      | the one Category — see [[organization#category]] |
| `collectionId` | string \| null                         | one Collection (denormalized ref) — [[organization#collection]] |
| `tagIds`       | string[]                              | many Tags (denormalized refs) — [[organization#tag]] |
| `highlights`   | Highlight[]                           | **owned**, nested (see below) |
| `createdAt`    | string (ISO date-time)                | |
| `updatedAt`    | string (ISO date-time)                | sync ordering ([[../architecture/sync]]) |
| `_deleted`     | boolean                               | soft-delete envelope ([[../glossary#soft-delete]]) |

> `type` (payload shape) is **not** `categoryId` (semantic kind). A `link`
> resource pointing at YouTube has `type: "link"`, `categoryId: "video"`. See
> [[organization#category]] and [[../decisions/0004-category-fixed-enum]].

> `updatedAt` / `_deleted` are an **infra envelope**. The pure domain entity
> should not carry sync plumbing; the repository maps it ([[../architecture/layering]]).

### Behavior (domain methods, not setters)

- `moveTo(collection)` — reassign `collectionId`.
- `addTag(tag)` / `removeTag(tag)` — mutate `tagIds`.
- `recategorize(category)` — change the Category (validated against the fixed set).
- `addHighlight(...)` / `removeHighlight(id)` — manage owned Highlights.
- `markDeleted()` — soft-delete command ([[../glossary#soft-delete]]).

### Invariants

- Exactly **one** `categoryId`, always from the fixed set.
- `collectionId` may be null (unfiled) but if set must reference a real
  Collection — enforced in the **application** use-case, not the DB
  ([[../architecture/rxdb-constraints]]).

## Owned entity: Highlight

A marked-up excerpt inside a Resource. **No independent lifecycle** → modeled as
a nested value in the Resource aggregate, **not** its own RxDB collection.

| Field       | Type                    | Notes |
|-------------|-------------------------|-------|
| `id`        | string                  | unique within the resource |
| `text`      | string                  | the highlighted content |
| `note`      | string \| null           | optional annotation |
| `anchor`    | object                  | position/selection payload (arbitrary JSON) |
| `createdAt` | string (ISO date-time)  | |

Created/removed only **through** its Resource root — never loaded or saved on
its own. This is the aggregate-boundary teaching example
([[../architecture/layering]]).

## Use-cases (application layer)

- `SaveResource` (create/update)
- `MoveResourceToCollection`
- `TagResource` / `UntagResource`
- `RecategorizeResource`
- `AddHighlight` / `RemoveHighlight`
- `DeleteResource` (soft-delete)

## Cross-context references

Resource references [[organization]] entities (Collection, Tag, Category) **by
id only** — no direct object links, per [[../architecture/rxdb-constraints]].
Resolving those ids into objects is an application/UI concern.
