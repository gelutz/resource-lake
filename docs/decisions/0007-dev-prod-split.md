# ADR 0007 — Dev/prod split: engine parity + dev-only RxDB guards

**Status:** accepted

## Context

The app had no dev/prod differentiator. RxDB ships a **dev-mode plugin** (schema
checks, warnings — slow, must not ship) and separate **schema validators**
(`validate-ajv`). We want those guards in dev without diverging from what prod
runs. Build is **rspack** (`apps/resource-lake/rspack.config.ts`, Angular
rspack builder), so Angular devkit's `environment.ts` / `fileReplacements`
does not apply, and Vite's `import.meta.env` does not exist.

## Decision

- **Same storage engine both envs.** Dexie (IndexedDB) in dev AND prod. Envs
  differ only in guards and (later) replication — never the engine. Test what
  you ship. Rejected the original localstorage-dev / Dexie-prod idea: different
  RxDB storage engines have different query/index quirks, so bugs would hide in
  the gap.
- **Env flag = `process.env.NODE_ENV !== 'production'`** (amended 2026-07-19;
  was `import.meta.env.DEV` under the earlier Vite assumption). Rspack's
  builtin DefinePlugin replaces `process.env.NODE_ENV` from the build mode:
  `nx serve` → dev, `nx build` → prod, dead-branch eliminated in the prod
  bundle. Framework-agnostic, no Angular import — safe at the composition root.
- **Dev-only guards:** when `devMode`, register `RxDBDevModePlugin` (once, before
  `createRxDatabase`) and wrap storage in `wrappedValidateAjvStorage`. Prod runs
  bare Dexie.

## Consequences

- Prod bundle tree-shakes dev-mode + ajv out via the `NODE_ENV` dead branch.
- Bad doc shapes throw loudly in dev, silently accepted engine stays identical
  in prod.
- Wiring detail of *where* the flag is read + guards applied → see [[0008-rxdb-composition-seam]].

## Alternatives rejected

- **localstorage dev / Dexie prod** — engine-gap risk; you'd ship an untested
  engine.
- **Angular `environment.ts` + `fileReplacements`** — devkit-only mechanism,
  dead under the rspack builder.
- **Vite `import.meta.env.DEV`** — the original pick; premise was an
  Analog + Vite build that never materialized. Undefined under rspack.
