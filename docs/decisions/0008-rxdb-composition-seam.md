# ADR 0008 — RxDB composition seam: infra factory, app injects storage

**Status:** accepted

## Context

`createRxDatabase` must run once and produce the collection the repository wraps.
Question: who creates the database, who chooses the storage engine, and where do
the dev guards from [[0007-dev-prod-split]] get applied — while keeping infra
framework-free ([[../architecture/layering]]) and mobile a zero-infra-change
swap ([[../architecture/sync]])?

## Decision

- **Infra exposes an async factory** `createResourceDatabase({ storage, devMode })`.
  The app calls it once at bootstrap and registers the `Resources` repo in
  Angular DI (`apps/.../app.config.ts`). Infra stays framework-free; the app is
  the composition root.
- **App owns engine choice, factory owns dev guards.** The app builds the bare
  storage (`getRxStorageDexie()` on web, SQLite later on mobile) and reads
  `devMode = process.env.NODE_ENV !== 'production'` (see
  [[0007-dev-prod-split]]), then passes `{ storage, devMode }`. The
  factory applies the dev-only ajv wrap + dev-mode plugin. Mobile passes a
  different storage + the same flag — infra unchanged.
- **Tests use `storage-memory`.** Infra tests call the same factory with the
  memory adapter (no IndexedDB polyfill). The write/read, soft-delete-excluded,
  and `updatedAt`-order assertions are engine-agnostic — a live demo of the
  storage-swap thesis.

## Consequences

- The app shell is the only env-aware, only storage-engine-aware spot.
- Swapping web↔mobile storage or dev↔prod guards touches app wiring + factory
  args only, never the repository or schema.
- RxDB imports stay in infra except `getRxStorageDexie` at the app composition
  root (unavoidable — it is the platform pick).

## Alternatives rejected

- **Module-level singleton in infra** — hidden global, import-order fragility,
  harder to inject memory storage in tests.
- **App fully wraps storage (ajv + dev-mode) itself** — leaks RxDB dev-plugin
  detail into the app shell.
