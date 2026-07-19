# ADR 0006 — Soft-delete uses RxDB's native `_deleted`

**Status:** accepted

## Context

[[../architecture/rxdb-constraints]] and [[../architecture/sync]] require logical
deletion: a `_deleted` flag, never physical removal. RxDB **adds `_deleted` to
every schema automatically** and excludes `_deleted:true` docs from default
queries. The domain `Resource` originally also carried its own `#_deleted`
(exposed as `.deleted`, set by `markAsDeleted()`).

Question: who owns persisted deletion, and how does the repository delete?

## Decision

**The repository deletes via RxDB's native `_deleted`.** `delete(id)` loads the
doc and calls `doc.remove()`; RxDB flips `_deleted` and keeps the row for sync.
The infra `_deleted` field is **not declared** in `ResourceSchema` — RxDB owns
it.

**Amended 2026-07-19: deletion is not modeled in the domain at all.** The
domain `Resource` carries no `_deleted`/`deleted` state and no `markAsDeleted()`
method. The `DeleteResource` use-case delegates straight to
`repository.delete(id)`. Deleted docs are invisible to default queries, so a
second delete on the same id surfaces naturally as not-found.

## Consequences

- `list`/`getById`/`ofCategory` never filter `_deleted` by hand — RxDB's default
  query excludes it.
- `ResourceDocType` (the persisted-row interface) omits `_deleted`; nobody
  hand-sets it outside the delete path.
- Only one `_deleted` exists anywhere: RxDB's. The domain has none.

## Alternatives rejected

- **Mapper hand-sets `_deleted:true` + `upsert`** — redundant with RxDB's native
  soft-delete and easy to get wrong.
- **Domain-held `deleted` flag + `markAsDeleted()`** (the original shape) —
  duplicates RxDB state in the domain, and persisting it requires the rejected
  hand-set path anyway.
