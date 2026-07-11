# RxDB Constraints

The database bends the whole design. Read this before [[../contexts/resources]]
and [[../contexts/organization]]. Facts below are from the RxDB docs
(schema + replication).

## Fact 1 — No relations

RxDB has **no foreign keys, no joins, no collection references** at the schema
level. There is no relational integrity from the DB.

**Consequences for the model:**
- References between aggregates are stored as **plain id fields / id arrays**
  and resolved in application code, not by the DB.
  - `Resource.collectionId: string`
  - `Resource.categoryId: string` (fixed enum value — see [[../decisions/0004-category-fixed-enum]])
  - `Resource.tagIds: string[]`
  - `Collection.parentId: string | null` (the tree is a self-referencing id)
- **Denormalize deliberately.** Reads that would be joins become either extra
  reactive queries or denormalized copies. Decide per query.
- **Invariants that span aggregates cannot be enforced by the DB.** They live in
  the domain/application layer (e.g. "can't delete a Collection that has
  children" is app logic, not a DB constraint).

## Fact 2 — Sync forces soft-delete + timestamp ordering

RxDB replication requires:
- Every syncable document is **deterministically sortable by last write time** →
  every collection carries `updatedAt` (ISO `date-time` string).
- Deletion is **logical**: a `_deleted` flag, never physical removal. See
  [[../glossary#soft-delete]].
- Conflicts are resolved **client-side** by a conflict handler after the server
  rejects a push (default: master wins).

**Consequences for the model:**
- "Delete" is a **command that sets state**, modeled explicitly in the domain.
- Every entity has `id`, `updatedAt`, `_deleted`. Treat these as an infra-level
  envelope, kept **out of the pure domain entity** where possible (mapped in the
  repository). See [[layering]].

## Schema rules to respect (per RxDB schema docs)

- **Primary key**: one required, unique, indexed **string** field. Use `id`.
  (Composite keys possible but avoid for v1.)
- **No `Date` objects** — store ISO strings with `"format": "date-time"`.
- **Indexes** only on `string | integer | number`. Indexed strings need
  `maxLength`; indexed numbers need `minimum`/`maximum`/`multipleOf`.
- `additionalProperties: false` at top level (RxDB sets this). Schema is closed.
- Field names match `^[a-zA-Z][a-zA-Z0-9_]*$`.
- **Nested objects** allowed; a `type: "object"` with no properties = arbitrary
  JSON blob (useful for `Highlight` payloads and type-specific resource bodies).
- **Versioning + `migrationStrategies`** required for any schema change in
  production.

## Design stance

Keep these constraints in the **infra layer** ([[layering]]). The domain model
should read as if relations existed (methods like `resource.moveTo(collection)`);
the repository translates to id-fields and soft-delete envelopes. RxDB never
appears in the domain lib.
