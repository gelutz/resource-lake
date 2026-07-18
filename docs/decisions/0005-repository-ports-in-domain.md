# ADR 0005 — Repository ports live in the domain layer

**Status:** accepted

## Context

[[../architecture/layering]] originally placed repository **interfaces**
(ports) in the **application** layer, with implementations in **infra**. In
practice the first port, `Resources` (`libs/resources/domain/.../resources.ts`),
was written in the **domain** layer, next to the `Resource` aggregate it
persists.

Question: do ports belong to application (clean-architecture convention) or to
domain (DDD convention)?

## Decision

**Repository interfaces are part of the domain layer.** A repository is a
domain concept — "the collection of all `Resource`s" — expressed in the
ubiquitous language, so its contract sits beside the aggregate it serves.
Application use-cases depend on the domain port; infra implements it.

## Consequences

- Dependency direction unchanged: `application → domain` and `infra → domain`
  both remain inward. Nothing new is allowed or forbidden by
  [[../architecture/nx-boundaries]].
- The generic `Repository<T, Id>` base interface also lives in domain
  (`libs/resources/domain/.../Repository.ts`).
- Application libs shrink to pure use-case orchestration; they define no
  persistence contracts of their own.
- [[../architecture/layering]] updated to match: ports are listed under
  **domain**, not application.

## Alternatives rejected

- **Ports in application** — the clean-architecture default. Works, but splits
  the domain vocabulary across two layers: the aggregate in domain, "all
  aggregates of this kind" in application. DDD reads the repository contract as
  part of the model itself.
