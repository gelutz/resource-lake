# ADR 0004 — Category is a fixed, system-defined enum entity

**Status:** accepted

## Context

Resources need a notion of *what kind of content* they are. This is separate
from the Resource `type` (payload shape: `link/text/image/file`) and from
user [[../contexts/organization#aggregate-tag|Tags]] (open, user-created).

Question: is "content kind" a user-created taxonomy (like Tags) or a fixed
system set?

## Decision

**Category is a fixed, system-defined set:** `text | video | audio | image`.
Users cannot create categories. Exactly **one** Category per Resource. Modeled
as an **entity** with identity, but with a **closed, seeded population**. See
[[../contexts/organization#entity-category]].

## Consequences

- Category ids are stable enum values (`text`/`video`/`audio`/`image`), safe to
  reference from `Resource.categoryId` ([[../contexts/resources]]).
- **Decided (2026-07-19): static domain constant** — the `ResourceCategory`
  enum in the domain lib. No RxDB collection: no user writes means nothing to
  seed or sync. `label`/`icon` display data is a UI map keyed by enum id.
- Clear separation of three orthogonal axes on a Resource:
  - **type** = payload shape (how stored/rendered)
  - **category** = content kind (fixed, one)
  - **tags** = user labels (open, many)
- Validation of `categoryId` against the fixed set is a **domain** rule
  (`resource.recategorize(...)`), not a DB constraint
  ([[../architecture/rxdb-constraints]]).

## Alternatives rejected

- **User-created categories** — that's what Tags already are
  ([[../decisions/0001-tag-as-entity]]); a second open taxonomy is redundant.
- **Category == Resource type** — conflates payload shape with semantic kind; a
  `link` can be a `video` (YouTube URL). Kept distinct.
