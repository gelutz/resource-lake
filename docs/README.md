# ResourceLake — Documentation

Structured design docs for ResourceLake. These are the source material for
generating specs and tickets later. Cross-references use `[[wikilink]]` style
so the tree is Obsidian-readable and machine-parseable.

ResourceLake is an offline-first, multi-platform (web + mobile) resource store
in the spirit of [Raindrop.io](https://raindrop.io): save any link/text/media,
categorize it, organize it, and act on it later. It is currently a **learning
tool**, not a product. Learning priorities, in order: **Nx > RxDB > DDD > Angular**.

## Doc layout

```
docs/
  README.md                    ← index, links everything (this file)
  vision.md                    ← what/why/scope, cut-list
  glossary.md                  ← ubiquitous language
  architecture/
    layering.md                ← domain/app/infra/ui + dependency rule
    nx-boundaries.md           ← type/scope tags, eslint enforcement
    rxdb-constraints.md        ← no-relations, soft-delete, sync facts
    sync.md                    ← Supabase replication approach
  contexts/
    resources.md               ← Resource aggregate, Highlight
    organization.md            ← Collection tree, Tag, Category
  decisions/
    0001-tag-as-entity.md      ← ADRs
    0002-buy-sync-supabase.md
    0003-cut-archive.md
    0004-category-fixed-enum.md
```

## Reading order

1. [[vision]] — what we're building and what we deliberately cut
2. [[glossary]] — the ubiquitous language; read before the context docs
3. [[architecture/rxdb-constraints]] — the DB facts that bend the whole design
4. [[architecture/layering]] + [[architecture/nx-boundaries]] — how code is structured
5. [[contexts/resources]] + [[contexts/organization]] — the domain model
6. [[architecture/sync]] — replication
7. `decisions/` — the ADRs recording why each choice was made

## Index

### Vision & language

- [[vision]] — scope, goals, non-goals, cut-list
- [[glossary]] — ubiquitous language

### Architecture

- [[architecture/rxdb-constraints]] — RxDB has no relations, forces soft-delete + timestamp sync
- [[architecture/layering]] — domain / application / infra / ui layering and the dependency rule
- [[architecture/nx-boundaries]] — Nx `type:`/`scope:` tags and eslint boundary enforcement
- [[architecture/sync]] — offline-first replication via Supabase

### Bounded contexts

- [[contexts/resources]] — the **Resources** core context: `Resource` aggregate, `Highlight`
- [[contexts/organization]] — the **Organization** context: `Collection` tree, `Tag`, `Category`

### Decisions (ADRs)

- [[decisions/0001-tag-as-entity]] — Tag is an entity, not a value object
- [[decisions/0002-buy-sync-supabase]] — buy sync (Supabase plugin), don't build a backend
- [[decisions/0003-cut-archive]] — cut permanent-copy / page archive from v1
- [[decisions/0004-category-fixed-enum]] — Category is a fixed, system-defined enum entity
