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
| `excerpt`      | string                                | short description / snippet *(planned)* |
| `cover`        | string (url) \| null                   | thumbnail/preview image *(planned)* |
| `payload`      | string (type-specific)                | url for `link`; text for `text`; blob ref for `image`/`file` |
| `category`     | `text \| video \| audio \| image`      | the one Category (static enum) — see [[organization#category]] |
| `collectionId` | string \| null                         | one Collection (denormalized ref) — [[organization#collection]] *(planned)* |
| `tagIds`       | string[]                              | many Tags (denormalized refs) — [[organization#tag]] *(planned)* |
| `highlights`   | Highlight[]                           | **owned**, nested (see below) *(planned)* |
| `createdAt`    | string (ISO date-time)                | set by the factory at creation |

> `type` (payload shape) is **not** `category` (semantic kind). A `link`
> resource pointing at YouTube has `type: "link"`, `category: "video"`. See
> [[organization#category]] and [[../decisions/0004-category-fixed-enum]].

> `updatedAt` / `_deleted` are an **infra envelope** and do **not** exist on the
> domain entity. RxDB owns `_deleted`
> ([[../decisions/0006-soft-delete-via-rxdb-deleted]]); the repository stamps
> `updatedAt` on every `save()` ([[../architecture/layering]]).

### Behavior (domain methods, not setters)

- `changeTitle(title)` — rename the resource.
- `moveTo(collection)` — reassign `collectionId`. *(planned)*
- `addTag(tag)` / `removeTag(tag)` — mutate `tagIds`. *(planned)*
- `recategorize(category)` — change the Category (validated against the fixed set). *(planned)*
- `addHighlight(...)` / `removeHighlight(id)` — manage owned Highlights. *(planned)*

Deletion is **not** a domain method — it is a repository operation
(`repository.delete(id)`), see [[../decisions/0006-soft-delete-via-rxdb-deleted]].

### Invariants

- Exactly **one** `category`, always from the fixed set (validated at construction).
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
- `DeleteResource` — delegates to `repository.delete(id)` (soft-delete via RxDB
  `doc.remove()`, [[../decisions/0006-soft-delete-via-rxdb-deleted]])

## Cross-context references

Resource references [[organization]] entities (Collection, Tag, Category) **by
id only** — no direct object links, per [[../architecture/rxdb-constraints]].
Resolving those ids into objects is an application/UI concern.
