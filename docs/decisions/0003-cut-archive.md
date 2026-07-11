# ADR 0003 — Cut permanent-copy / page archive from v1

**Status:** accepted

## Context

Raindrop stores a **permanent copy**: a full snapshot of the saved page, so the
content survives even if the original URL dies. It's a signature feature.

Implementing it needs a **server-side fetcher** (render/scrape the page) plus
**blob storage** for the snapshot, plus handling of images/assets. None of that
fits an offline-first, buy-the-backend, learning-focused v1
([[../decisions/0002-buy-sync-supabase]]).

## Decision

**Cut permanent-copy / archive from v1.** Resources store metadata + a `body`
payload only ([[../contexts/resources]]), not a page snapshot.

## Consequences

- No server-side fetch/scrape pipeline, no blob-archive storage in v1.
- If the original URL dies, the resource keeps title/excerpt/cover but not full
  content. Acceptable for a learning tool ([[../vision]]).
- Leaves room to add later behind the same infra seam without touching the
  domain model.

## Alternatives rejected

- **Client-side archive** (save page from the browser) — messy, partial, and
  doesn't work on mobile; still needs blob storage.
- **Build it in v1** — scope creep against the stated learning priorities.
