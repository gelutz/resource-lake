# Glossary — Ubiquitous Language

The shared vocabulary. Use these exact terms in code, specs, and tickets.

## Resource
The central thing being stored. A saved link, text snippet, image, or file.
Aggregate root of the [[contexts/resources]] context. Holds its own
[[#highlight|Highlights]]. References one [[#category|Category]], one
[[#collection|Collection]], and many [[#tag|Tags]] by id.

**Resource type** (`link | text | image | file`) — the *shape of the payload*,
i.e. how the resource is stored/rendered. Distinct from Category.

## Category
*What kind of content* a resource is, from a **fixed, system-defined** set:
`text | video | audio | image`. Exactly **one** per resource. Closed enum,
users cannot create categories. Implemented as a **static domain enum**
(`ResourceCategory`), not a persisted entity — no RxDB collection.
See [[decisions/0004-category-fixed-enum]].

> Note: Category (semantic content kind) ≠ Resource type (payload shape). A
> `link` resource can have category `video` (a YouTube URL).

## Tag
A **user-created** label. Open set, many per resource, renameable and
mergeable. An **entity** with identity — renaming a tag must update it
everywhere. See [[decisions/0001-tag-as-entity]]. Lives in
[[contexts/organization]].

## Collection
A user-created folder for resources. Forms a **nested tree** (a collection has
an optional parent collection). Aggregate root in [[contexts/organization]].

## Highlight
A marked-up excerpt within a resource (e.g. highlighted text). **Owned by** its
Resource — it has no life independent of the resource. Modeled as a nested
value inside the Resource aggregate, not its own collection. See
[[contexts/resources]].

## Aggregate / Aggregate root
DDD term. A cluster of objects treated as one unit for consistency, with a
single entry point (the root). Here: `Resource` (owning its Highlights) and
`Collection` are roots. See [[architecture/layering]].

## Repository
An interface (defined in the **domain** layer, beside the aggregate it serves —
see [[decisions/0005-repository-ports-in-domain]]) for loading/saving an
aggregate, implemented in the infra layer over RxDB. Keeps the domain ignorant
of the database. See [[architecture/layering]].

## Soft-delete
Deletion is a flag (`_deleted` / logical delete), never a physical row removal.
Forced by RxDB replication. Deletion is a **repository operation**
(`repository.delete(id)` → RxDB `doc.remove()`); the domain entity does not
carry deletion state. See [[decisions/0006-soft-delete-via-rxdb-deleted]] and
[[architecture/rxdb-constraints]].

## Checkpoint
RxDB replication term: a marker of "last synced write" used to pull only newer
documents. See [[architecture/sync]].

## Bounded context
A boundary within which a model is consistent. Contexts here:
**Resources** ([[contexts/resources]]), **Organization**
([[contexts/organization]]), and **Sync/Identity** ([[architecture/sync]]).
