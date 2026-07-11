# Nx Module Boundaries

How Nx **physically enforces** the layering in [[layering]]. This is the primary
**Nx** learning goal — do this before building features, so the architecture is
enforced from day one.

## Tag taxonomy

Every lib is tagged on two axes in its `project.json`:

### `type:` — the layer (from [[layering]])
- `type:domain` — pure domain, no dependencies
- `type:feature` — application / use-cases
- `type:infra` — RxDB, repositories, replication
- `type:ui` — Angular components
- `type:util` — shared helpers, cross-cutting, dependency-free
- `type:app` — the deployable app shells (web, mobile)

### `scope:` — the bounded context (from [[../glossary#bounded-context]])
- `scope:resources` — the [[../contexts/resources]] core context
- `scope:organization` — the [[../contexts/organization]] context
- `scope:sync` — replication / identity ([[sync]])
- `scope:shared` — usable by any context
- `scope:app` — app shells

## Enforcement rule

Wire `@nx/enforce-module-boundaries` in the root eslint config with
`depConstraints`. Two independent rule sets — **type** rules encode the
dependency direction, **scope** rules encode context isolation.

```jsonc
// depConstraints (sketch — full version lives in eslint config)
[
  // --- type / layer direction ---
  { "sourceTag": "type:app",     "onlyDependOnLibsWithTags": ["type:ui","type:feature","type:infra","type:util"] },
  { "sourceTag": "type:ui",      "onlyDependOnLibsWithTags": ["type:feature","type:domain","type:util"] },
  { "sourceTag": "type:infra",   "onlyDependOnLibsWithTags": ["type:feature","type:domain","type:util"] },
  { "sourceTag": "type:feature", "onlyDependOnLibsWithTags": ["type:domain","type:util"] },
  { "sourceTag": "type:domain",  "onlyDependOnLibsWithTags": ["type:util"] },
  { "sourceTag": "type:util",    "onlyDependOnLibsWithTags": ["type:util"] },

  // --- scope / context isolation ---
  { "sourceTag": "scope:resources",    "onlyDependOnLibsWithTags": ["scope:resources","scope:shared"] },
  { "sourceTag": "scope:organization", "onlyDependOnLibsWithTags": ["scope:organization","scope:shared"] },
  { "sourceTag": "scope:sync",         "onlyDependOnLibsWithTags": ["scope:sync","scope:shared"] },
  { "sourceTag": "scope:shared",       "onlyDependOnLibsWithTags": ["scope:shared"] }
]
```

**Effect:** `type:domain` importing `rxdb`-bearing `type:infra` = **lint error**.
The dependency rule from [[layering]] is no longer a convention — Nx breaks the
build if you violate it. This is the Nx payoff.

## Acceptance check (do this first)

Prove the rule works before writing features:
1. Scaffold a `type:domain` lib and a `type:infra` lib.
2. Import infra from domain on purpose.
3. `nx lint` **must fail**. If it passes, the constraint is misconfigured.

## Evolve the generator

`tools/gen`'s existing `domain-lib` generator already writes `type:`/`scope:`
tags. Grow it to scaffold the **four-lib quad** (domain/application/infra/ui)
for a new context in one run, each with the correct tag pair. The generator is
the highest-leverage tool for keeping the architecture consistent — see
[[layering]].

## Cross-platform sharing

`apps/web` and `apps/mobile` are both `type:app` `scope:app`. They depend on the
same context libs and differ only in the RxDB storage adapter they wire in
([[sync]], [[rxdb-constraints]]). This is the concrete proof of the Nx
code-sharing thesis from [[../vision]].
