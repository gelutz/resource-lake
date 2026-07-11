# Sync (Offline-First Replication)

How multi-device offline-first works. **Buy, don't build** — see
[[../decisions/0002-buy-sync-supabase]]. Facts from the RxDB replication docs.

## Model

RxDB replication is **git-like**: each device keeps local state, reads/writes
work fully offline, and changes merge on reconnect.

- **Checkpoint iteration** — on connect/reconnect the client sends a
  [[../glossary#checkpoint|checkpoint]] and pulls all newer documents.
- **Event stream** — once caught up, the client observes a live stream of
  server changes.

## Requirements the data model must satisfy

These are already baked into [[rxdb-constraints]]; restated here because sync is
*why* they exist:

- Every syncable document is **deterministically sortable by last write time** →
  `updatedAt` (ISO `date-time`) on every collection.
- Deletion is **logical** via `_deleted` — never physical. See
  [[../glossary#soft-delete]].
- **Conflicts resolved client-side** by a conflict handler after the server
  rejects a push. Default: master (server) wins. Pick per-collection behavior
  consciously; default is fine for v1 single-user/multi-device.

## Why Supabase

Buying sync means we do **not** hand-write the three replication handlers
(pull / push / pullStream). The RxDB **Supabase replication plugin** provides
the server contract; we only configure it. This keeps sync from eating the
project, matching the **Nx > RxDB > DDD** priority where sync is learned last.
See [[../decisions/0002-buy-sync-supabase]].

Alternatives considered and rejected for v1: custom HTTP handlers (max work),
CouchDB, Firestore, WebRTC P2P.

## Where it lives

Replication is **infra-layer only** ([[layering]]). It sits behind the
repository seam:
- Domain/application know nothing about sync.
- The `type:infra scope:sync` lib owns replication setup, auth/session, and the
  conflict handler.
- App shells start/stop replication at composition time.

## Storage adapters (per platform)

Same replication logic, different local storage:
- **Web** — Dexie (IndexedDB).
- **Mobile** — SQLite (Capacitor).

Only the storage adapter wiring differs between `apps/web` and `apps/mobile`;
schemas, mappers, and replication config are shared libs. See
[[nx-boundaries]].

## Build order

Sync is built **last**, after a local-only vertical slice works end-to-end. See
the build plan in [[../vision]] and the layering seams in [[layering]] that make
adding sync a non-invasive change.
