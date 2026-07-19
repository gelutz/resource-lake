# ADR 0006 — Soft-delete uses RxDB's native `_deleted`

**Status:** accepted

## Context

[[../architecture/rxdb-constraints]] and [[../architecture/sync]] require logical
deletion: a `_deleted` flag, never physical removal. RxDB **adds `_deleted` to
every schema automatically** and excludes `_deleted:true` docs from default
queries. The domain `Resource` (`libs/resources/domain/.../Resource.ts`) also
carries its own `#_deleted` (exposed as `.deleted`, set by `markAsDeleted()`).

Question: who owns persisted deletion, and how does the repository delete?

## Decision

**The repository deletes via RxDB's native `_deleted`.** `delete(id)` loads the
doc and calls `doc.remove()`; RxDB flips `_deleted` and keeps the row for sync.
The infra `_deleted` field is **not declared** in `ResourceSchema` — RxDB owns
it. The mapper is the only place the two names meet: `toDomain` reads
`doc._deleted` into the domain `deleted` constructor param.

Domain `markAsDeleted()` remains the **in-memory** state transition for
use-cases; the **persistence** of deletion is `doc.remove()`, not a hand-set
flag.

## Consequences

- `list`/`getById`/`ofCategory` never filter `_deleted` by hand — RxDB's default
  query excludes it.
- `ResourceDocType` (the persisted-row interface) omits `_deleted`; nobody
  hand-sets it outside the delete path.
- Two `_deleted`s never coexist in one object — domain class and RxDB doc are
  bridged only by the mapper.

## Alternatives rejected

- **Mapper hand-sets `_deleted:true` + `upsert`** — redundant with RxDB's native
  soft-delete and easy to get wrong.
