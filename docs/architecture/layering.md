# Layering & Dependency Rule

The DDD/clean-architecture backbone. Four layers per bounded context. This is
where the **DDD** learning goal lands, and it is enforced physically by Nx —
see [[nx-boundaries]].

## The four layers

| Layer         | Nx `type:` | Knows about                       | Never imports                    |
|---------------|-----------|-----------------------------------|----------------------------------|
| **domain**    | `domain`  | nothing (pure TS)                 | rxdb, angular, infra, application, ui |
| **application** | `application` | domain                      | rxdb, angular, infra, ui         |
| **infra**     | `infra`   | domain, application               | angular, ui                      |
| **ui**        | `ui`      | domain, application               | infra                            |

## The dependency rule

Dependencies point **inward**: `ui → application → domain` and
`infra → application → domain`. The **domain never depends on anything**.

- **domain** — entities + value objects + business rules. `Resource`,
  `Collection`, `Tag`, `Category`, `Highlight` with behavior
  (`resource.moveTo(collection)`, `resource.addHighlight(...)`,
  `tag.rename(...)`). Also defines the **repository interfaces** (ports) —
  see [[../decisions/0005-repository-ports-in-domain]]. Pure TypeScript,
  unit-testable with zero setup. **No RxDB import here** — see
  [[rxdb-constraints]].
- **application** — use-cases orchestrating the domain: `SaveResource`,
  `MoveResourceToCollection`, `RenameTag`, `MergeTags`. Depends only on domain.
- **infra** — implements the repository interfaces over RxDB. Holds the RxDB
  **schemas**, the entity ⇄ document **mappers**, and the **replication** setup.
  This is the only layer that imports `rxdb`. See [[sync]].
- **ui** — Angular components, signals, routing. Calls use-cases. Never touches
  infra or RxDB directly.

## Dependency inversion (the key lesson)

The repository **interface** is defined in `domain` (the innermost layer — see
[[../decisions/0005-repository-ports-in-domain]]); the **implementation** lives
in `infra` (the outer layer). The app project wires the
concrete implementation in at composition time. This is why the domain can stay
ignorant of RxDB while still being persisted — and why swapping RxDB storage
(Dexie on web, SQLite on mobile) touches only infra + app wiring.

## Aggregates

- **`Resource`** is an aggregate root that **owns its `Highlight`s** (nested,
  no independent lifecycle). See [[../contexts/resources]].
- **`Collection`** is an aggregate root; the tree is modeled by `parentId`.
- **`Tag`** is its own small aggregate. **`Category`** is *not* an aggregate —
  it is a static domain enum (`ResourceCategory`), never persisted. See
  [[../contexts/organization]] and [[../decisions/0004-category-fixed-enum]].

Cross-aggregate invariants (e.g. "deleting a Collection with children") are
enforced in **application use-cases**, not the DB — RxDB gives no referential
integrity ([[rxdb-constraints]]).

## Lib shape per context

```
libs/
  <context>/domain        type:domain       scope:<context>
  <context>/application    type:application  scope:<context>
  <context>/infra          type:infra        scope:<context>
  <context>/ui             type:ui           scope:<context>
  shared/util              type:util         scope:shared
```

The `tools/gen` `domain-lib` generator should evolve to scaffold this quad with
correct tags in one shot — see [[nx-boundaries]].
