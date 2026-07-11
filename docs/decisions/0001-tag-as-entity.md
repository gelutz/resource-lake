# ADR 0001 — Tag is an entity, not a value object

**Status:** accepted

## Context

Tags classify resources. The DDD question: is a Tag a **value object** (defined
purely by its string value, no identity — like Raindrop, where a tag is just a
string on a bookmark) or an **entity** (has identity independent of its name)?

RxDB has no relations ([[../architecture/rxdb-constraints]]), which pushes toward
storing `tags: string[]` of names directly on the resource — the value-object route.

## Decision

**Tag is an entity** with a stable `id`. Resources reference tags by **id**
(`tagIds: string[]`), not by name. See [[../contexts/organization#aggregate-tag]].

## Consequences

- **Rename is cheap and correct.** `tag.rename(name)` changes only the Tag
  document; every Resource keeps its `id` reference and is unaffected. No bulk
  rewrite of resources on rename.
- **Merge is a use-case.** `MergeTags(source, target)` rewrites `tagIds` across
  affected resources then soft-deletes the source — a deliberate cross-aggregate
  operation in the application layer ([[../architecture/layering]]).
- Costs a second reactive lookup to render tag names from ids (acceptable;
  RxDB reactive queries make this cheap).
- Diverges from Raindrop's string-tag model on purpose — the learning value of
  entity identity + dependency inversion is the point ([[../vision]]).

## Alternatives rejected

- **Value object (string on resource):** rename means rewriting every resource
  that carries the string; merge is a find-replace with no identity. Simpler
  storage, worse semantics, less to learn.
