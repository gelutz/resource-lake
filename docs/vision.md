# Vision

## What

ResourceLake is an **offline-first resource store**: save any link or piece of
text/media, categorize it, organize it into collections, tag it, and act on it
later. Modeled on [Raindrop.io](https://raindrop.io).

## Why

Primarily a **learning tool**. It is not (yet) a differentiated product. The
point is to learn, in priority order:

1. **Nx** — monorepo, code sharing across platforms, module-boundary enforcement
2. **RxDB** — offline-first reactive local database and replication
3. **DDD** — clean architecture, bounded contexts, domain purity, dependency inversion
4. **Angular** — current Angular (signals, standalone, new control flow)

The architecture rigor is a *means to the learning end*, not premature
enterprise ceremony. See [[architecture/layering]] for how the learning goals
map onto structure.

## Platforms

- **Web** — Angular SPA. RxDB storage: Dexie (IndexedDB).
- **Mobile** — Capacitor shell reusing every lib. RxDB storage: SQLite.

Shared domain/application/ui code lives in Nx libs; the app projects are thin
shells that pick a storage adapter. See [[architecture/nx-boundaries]].

## Core capabilities (v1 scope)

- Save a **Resource**: link, text, image, or file. See [[contexts/resources]].
- Assign exactly one **Category** (`text | video | audio | image`) — see [[decisions/0004-category-fixed-enum]].
- Apply many **Tags** (user-created, renameable/mergeable) — see [[decisions/0001-tag-as-entity]].
- Organize into a nested **Collection** tree. See [[contexts/organization]].
- Add **Highlights** to a resource (owned sub-parts of a resource).
- **Offline-first**: all reads/writes local; background sync across devices via
  Supabase. See [[architecture/sync]] and [[decisions/0002-buy-sync-supabase]].

## Non-goals / cut-list

- **Permanent copy / page archive** — Raindrop stores a full snapshot of the
  saved page. Cut from v1: needs a server-side fetcher + blob storage, which is
  scope creep for a learning project. See [[decisions/0003-cut-archive]].
- **Custom sync backend** — not building replication server logic; buying it via
  Supabase. See [[decisions/0002-buy-sync-supabase]].
- **Sharing / collaboration / multi-user** — single user, multi-device only.
- **Full-text search infra, recommendations, browser extension** — out of v1.

## Guiding constraint

The database (RxDB) has **no relations** and forces **soft-delete + timestamp
ordering**. This is the single largest force on the domain model — read
[[architecture/rxdb-constraints]] before the context docs.
