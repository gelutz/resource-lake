# Context: Organization

Owns the ways a [[resources#aggregate-resource|Resource]] is organized:
[[../glossary#collection|Collection]] (tree), [[../glossary#tag|Tag]],
[[../glossary#category|Category]]. Nx `scope:organization`
([[../architecture/nx-boundaries]]).

## Aggregate: Collection

A user-created folder. Forms a **nested tree** via a self-referencing parent id
(RxDB has no relations — the tree is plain ids, [[../architecture/rxdb-constraints]]).

| Field       | Type                   | Notes |
|-------------|------------------------|-------|
| `id`        | string (uuid)          | primary key |
| `name`      | string                 | |
| `parentId`  | string \| null          | null = root collection |
| `color`     | string \| null          | optional UI color |
| `order`     | number                 | sibling ordering |
| `createdAt` | string (ISO date-time) | |
| `updatedAt` | string (ISO date-time) | sync ordering ([[../architecture/sync]]) |
| `_deleted`  | boolean                | soft-delete ([[../glossary#soft-delete]]) |

### Behavior
- `rename(name)`
- `moveUnder(parent)` — reparent; must reject cycles.
- `markDeleted()`

### Invariants (enforced in application, not DB)
- **No cycles** in the parent chain.
- Deleting a collection with children: decide policy in the use-case
  (cascade soft-delete, or reparent children to root). The DB will **not**
  protect this — [[../architecture/rxdb-constraints]].

## Aggregate: Tag

A **user-created** label. An **entity** with identity — so it can be renamed and
merged and have those changes propagate. See [[../decisions/0001-tag-as-entity]].

| Field       | Type                   | Notes |
|-------------|------------------------|-------|
| `id`        | string (uuid)          | primary key; Resources store this in `tagIds` |
| `name`      | string                 | unique-ish (enforced in app) |
| `color`     | string \| null          | optional |
| `createdAt` | string (ISO date-time) | |
| `updatedAt` | string (ISO date-time) | |
| `_deleted`  | boolean                | soft-delete |

### Behavior
- `rename(name)` — identity stays, `name` changes; Resources referencing the id
  are unaffected (they point at `id`, not name). This is *why* Tag is an entity.
- Merge is a **use-case**, not a method: `MergeTags(sourceId, targetId)` rewrites
  `tagIds` across affected Resources, then soft-deletes the source. Cross-aggregate
  → lives in application ([[../architecture/layering]]).

## Entity: Category

*What kind of content* a resource is. **Fixed, system-defined** population:
`text | video | audio | image`. Users cannot create categories. An entity with
identity but a closed set. See [[../decisions/0004-category-fixed-enum]].

| Field  | Type                                | Notes |
|--------|-------------------------------------|-------|
| `id`   | `text \| video \| audio \| image`    | stable enum id; primary key |
| `label`| string                              | display name |
| `icon` | string                              | UI icon key |

- Seeded, not user-editable. May not even need its own RxDB collection — can be
  a **static domain constant** the Resource validates against. Decide in the
  spec; leaning static.
- Distinct from Resource `type` (payload shape) — see
  [[resources#aggregate-resource]].

## Use-cases (application layer)

- `CreateCollection` / `RenameCollection` / `MoveCollection` / `DeleteCollection`
- `CreateTag` / `RenameTag` / `MergeTags` / `DeleteTag`
- (Category: none — fixed set.)

## Cross-context note

Organization entities are referenced **by id** from [[resources]]. Renaming a
Tag or moving a Collection does **not** touch Resource documents (they hold ids),
which is exactly why Tag-as-entity and the id-reference model work together —
[[../architecture/rxdb-constraints]].
