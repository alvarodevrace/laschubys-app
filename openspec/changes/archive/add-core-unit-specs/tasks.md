# Tasks: Add Core Unit Specs (Vitest + Angular Testing Utilities)

## Review Workload Forecast

| Field                   | Value                                                |
| ----------------------- | ---------------------------------------------------- |
| Estimated changed lines | ~400–440 added (spec files only)                     |
| 400-line budget risk    | Medium (estimate straddles budget)                   |
| Chained PRs recommended | Yes — conditional: only if final diff >400           |
| Suggested split         | PR1 Cart → PR2 Seo → PR3 productColor + verification |
| Delivery strategy       | ask-on-risk (assumed)                                |
| Chain strategy          | pending (user/orchestrator)                          |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: Medium

Focused run form (builder-supported): `bun run test:ci --include=<spec-path>`.

### Suggested Work Units

| Unit | Goal                          | Likely PR | Focused test command                                 | Runtime harness              | Rollback boundary     |
| ---- | ----------------------------- | --------- | ---------------------------------------------------- | ---------------------------- | --------------------- |
| 1    | cart.service.spec.ts green    | PR 1      | --include=src/app/core/services/cart.service.spec.ts | Full `bun run test:ci` in CI | Delete spec file only |
| 2    | seo.service.spec.ts green     | PR 2      | --include=src/app/core/services/seo.service.spec.ts  | Full `bun run test:ci` in CI | Delete spec file only |
| 3    | product-visuals.spec.ts green | PR 3      | --include=src/app/shared/ui/product-visuals.spec.ts  | Full `bun run test:ci` in CI | Delete spec file only |

**Defect rule (design)**: a RED exposing a real production defect is REPORTED, tracked separately — never fixed here. Zero production edits.

## Phase 1: CartService Spec

- [x] 1.1 RED — Create `src/app/core/services/cart.service.spec.ts`: `makeProduct()` fixture + Map-backed fake localStorage (`vi.fn` spies, seeded BEFORE `TestBed.inject` — field initializer reads storage). Browser describe: add/update/remove, computed count/total, open/close/toggle, load-on-construction, persist-on-mutation. Server describe (`PLATFORM_ID:'server'`): returns `[]`, never touches storage. Verify: focused run executes. (~200 lines)
- [x] 1.2 GREEN — All cart cases pass against existing CartService. Verify: focused run exits 0. (~0)
- [x] 1.3 REFACTOR — In-file fixture/fake cleanup; no production edits. Verify: focused run green. (~±10)

## Phase 2: SeoService Spec

- [x] 2.1 RED — Create `src/app/core/services/seo.service.spec.ts`: fake DOCUMENT (tag registry; createElement stubs), spies on real `Title.setTitle` + `Meta.updateTag`. Cover `setPage` (title, description/og/twitter, canonical href with dev `siteUrl` `http://localhost:4321`) and `setJsonLd` create-then-update (2nd call updates existing node, no duplicate). Verify: focused run. (~150 lines)
- [x] 2.2 GREEN — All seo cases pass. Verify: focused run exits 0. (~0)
- [x] 2.3 REFACTOR — In-file fake cleanup. Verify: focused run green. (~±10)

## Phase 3: productColor Spec

- [x] 3.1 RED — Create `src/app/shared/ui/product-visuals.spec.ts`, plain `describe`/`it` (no TestBed): table-driven `it.each` ids; determinism (`toBe` same object), palette membership, edge ids `''`/`'zzz'` return palette entry without throwing. Verify: focused run. (~70 lines)
- [x] 3.2 GREEN — All palette cases pass. Verify: focused run exits 0. (~0)
- [x] 3.3 REFACTOR — Table/typing cleanup. Verify: focused run green. (~±5)

## Phase 4: Final Verification

- [x] 4.1 Full suite green together: `bun run test:ci` — app.spec.ts + 3 new specs. (~0)
- [x] 4.2 `bun run typecheck` green (AGENTS.md gate). (~0)
- [x] 4.3 `git status`: only 3 spec files added, zero production changes; finalize defect report. (~0)
