# ADR 0002 — Buy sync (Supabase), don't build a backend

**Status:** accepted

## Context

The app is offline-first with multi-device sync ([[../architecture/sync]]).
RxDB replication requires a server implementing three handlers (pull, push,
pullStream) with checkpoints, soft-delete, and deterministic timestamp ordering.
Building those by hand is significant, sync-specific work.

Learning priority is **Nx > RxDB > DDD > Angular** ([[../vision]]); sync is the
**last** thing built. Spending the most effort on the lowest-priority, last-built
piece is backwards.

## Decision

**Buy sync via the RxDB Supabase replication plugin.** Do not hand-write
replication handlers or run a custom backend for v1.

## Consequences

- We configure the plugin, not author the protocol. Learning stays on RxDB
  *client* replication config + conflict handling, not server plumbing.
- Sync remains an **infra `scope:sync`** concern behind the repository seam
  ([[../architecture/layering]]) — domain/application untouched.
- A Supabase project/schema becomes a v1 dependency (auth + Postgres).
- If deeper server learning is wanted later, the same seam allows swapping to
  custom HTTP handlers without touching domain/application.

## Alternatives rejected

- **Custom HTTP replication handlers** — max learning, max work; disproportionate
  for a last-built, lowest-priority feature.
- **CouchDB / Firestore / WebRTC P2P** — more infra to run or a worse fit than a
  managed Postgres + auth.
