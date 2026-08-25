# Proposal: Add Core Unit Specs (Vitest + Angular Testing Utilities)

## Intent

The frontend has a single unit spec (`src/app/app.spec.ts`). Core business logic — cart state, SEO/meta management, and product visual mapping — ships untested, so regressions surface late in QA/CI. This change adds focused unit specs for 2 core services and 1 pure utility, using the existing runner (`bun run test:ci`) and repo conventions (signals, zoneless, standalone, `inject()`).

## Scope

### In Scope

- `src/app/core/services/cart.service.spec.ts` — CartService: add/update/remove/clear, computed `count`/`total`, open/close/toggle, localStorage load/persist (mocked `PLATFORM_ID`).
- `src/app/core/services/seo.service.spec.ts` — SeoService: `setPage` title + meta/canonical writes, `setJsonLd` script create/update (mocked `Meta`/`Title`/`DOCUMENT`).
- `src/app/shared/ui/product-visuals.spec.ts` — `productColor()` determinism and palette integrity.

### Out of Scope

- `core/config/environment.ts`: module-level SSR/browser branch is evaluated at import time and needs module mocking — deferred.
- Coverage thresholds, Playwright e2e, refactoring of services under test.

## Capabilities

> Contract with sdd-spec. `openspec/specs/` is empty (only `.gitkeep`).

### New Capabilities

- `unit-testing`: Vitest-based unit coverage of core services and pure utilities, per `testing.unit` in `openspec/config.yaml`.

### Modified Capabilities

- None

## Approach

Follow the existing `app.spec.ts` pattern: `TestBed.configureTestingModule` with `imports`/`providers` + `compileComponents()` in `beforeEach`. Services use `TestBed.inject()` plus fakes for `PLATFORM_ID`, `Meta`, `Title`, `DOCUMENT`; assert via spies, not live DOM. `productColor()` is pure — plain `describe`/`it`, no TestBed. No production code changes unless a test exposes a real defect (then a minimal, separately tracked fix). Verify with `bun run test:ci`.

## Affected Areas

| Area                                         | Impact | Description             |
| -------------------------------------------- | ------ | ----------------------- |
| `src/app/core/services/cart.service.spec.ts` | New    | CartService behavior    |
| `src/app/core/services/seo.service.spec.ts`  | New    | SeoService behavior     |
| `src/app/shared/ui/product-visuals.spec.ts`  | New    | Palette + color mapping |

## Risks

| Risk                                                  | Likelihood | Mitigation                                           |
| ----------------------------------------------------- | ---------- | ---------------------------------------------------- |
| DOM-dependent SEO assertions brittle under SSR config | Med        | Mocked `DOCUMENT`; assert via spies only             |
| Zoneless env gaps in `ng test`                        | Low        | Services/pure functions only, no component rendering |

## Rollback Plan

Spec files only — `git revert` the change commit; no production or config impact. Runner unchanged.

## Dependencies

- None external. `@angular/core/testing` and `@angular/platform-browser` are already in the stack.

## Success Criteria

- [ ] 3 new spec files, each covering happy path + at least one edge case
- [ ] `bun run test:ci` green locally and in CI
- [ ] No production code modified (defects found are tracked separately)
