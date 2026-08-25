# Design: Add Core Unit Specs (Vitest + Angular Testing Utilities)

## Technical Approach

Add 3 co-located spec files exercising existing production code under the repo runner `bun run test:ci` (`ng test --watch=false` → `@angular/build:unit-test`, default include `**/*.spec.ts`, Node + jsdom). Services use `TestBed.configureTestingModule` + `TestBed.inject`; `productColor()` is a pure, table-driven suite. All assertions go through spies/fakes — no live DOM, no real localStorage. No production-code changes.

## Architecture Decisions

| #   | Decision                  | Options                                                                                                 | Tradeoff                                                                                                            | Chosen                                                                                                                                            |
| --- | ------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| D1  | Spec placement            | Co-located `*.spec.ts` next to targets vs `src/specs/` central dir                                      | Co-located matches `app.spec.ts` and the builder's default glob; central dir needs glob config and breaks proximity | Co-located                                                                                                                                        |
| D2  | CartService platform mock | `{ provide: PLATFORM_ID, useValue: 'browser'                                                            | 'server' }` vs real platform token                                                                                  | Real token is non-deterministic across environments; `isPlatformBrowser()` is `platformId === 'browser'`, so `useValue` fully controls the branch | Mocked token, two describe blocks |
| D3  | localStorage isolation    | `vi.stubGlobal('localStorage', Map-backed fake)` + `vi.unstubAllGlobals()` vs jsdom's real localStorage | Real storage leaks state between tests; the fake exposes `vi.fn` spies and stays deterministic                      | Stubbed fake                                                                                                                                      |
| D4  | SeoService DOM mocking    | Hand-rolled fake `DOCUMENT` (`head`/`createElement`/`querySelector`) vs jsdom real DOM                  | Spec bans live-DOM assertions; a fake keeps every assert spy-based                                                  | Fake DOCUMENT                                                                                                                                     |
| D5  | Test fixtures             | Tiny per-file `makeProduct()` (duplicated) vs shared `specs/helpers.ts`                                 | A shared helper is a 4th file, violating the spec's "only the three spec files" constraint                          | Per-file duplication                                                                                                                              |

## Data Flow

```
bun run test:ci ──► @angular/build:unit-test ──► vitest (jsdom)
                                              ├─ cart.service.spec.ts    → TestBed(CartService + PLATFORM_ID) + fake localStorage
                                              ├─ seo.service.spec.ts     → TestBed(SeoService) + fake DOCUMENT, spies on Title/Meta
                                              └─ product-visuals.spec.ts → plain describe/it (no TestBed)
```

## File Changes

| File                                         | Action | Description                                                             |
| -------------------------------------------- | ------ | ----------------------------------------------------------------------- |
| `src/app/core/services/cart.service.spec.ts` | Create | Mutations, `count`/`total` computed, drawer state, storage load/persist |
| `src/app/core/services/seo.service.spec.ts`  | Create | `setPage` title/meta/canonical, `setJsonLd` create-then-update          |
| `src/app/shared/ui/product-visuals.spec.ts`  | Create | `productColor()` determinism + palette integrity                        |

No production files modified or deleted.

## Interfaces / Contracts (test-only fakes, in-file)

Cart spec helpers (critical detail: `CartService` reads storage in its **field initializer**, so seed the fake _before_ `TestBed.inject(CartService)`):

```ts
function makeProduct(id = 'p1'): ProductPick {
  /* minimal fixture */
}
function createFakeStorage() {
  // Map-backed, spy-assertable
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((k: string) => store.get(k) ?? null),
    setItem: vi.fn((k: string, v: string) => {
      store.set(k, v);
    }),
    removeItem: vi.fn((k: string) => {
      store.delete(k);
    }),
    clear: vi.fn(() => store.clear()),
  };
}
```

Seo spec fake document (registry keyed by tag; second `setJsonLd` call must find the existing node, never `createElement` twice):

```ts
function createFakeDocument() {
  const created = new Map<string, unknown[]>();
  return {
    head: { appendChild: vi.fn() },
    createElement: vi.fn((tag: string) => {
      const el = { tagName: tag, setAttribute: vi.fn(), attributes: {} as Record<string, string> };
      (created.get(tag) ?? created.set(tag, []).get(tag))!.push(el);
      return el;
    }),
    querySelector: vi.fn(
      (sel: string) =>
        (sel.includes('script') ? created.get('script') : created.get('link'))?.[0] ?? null,
    ),
  };
}
```

`setPage` canonical assertions use dev `environment.siteUrl` (`http://localhost:4321`): under jsdom, `environment.ts` takes the browser branch, so `new URL()` is deterministic and needs no module mock. Spies: `vi.spyOn(title, 'setTitle')` / `vi.spyOn(meta, 'updateTag')` on the real injected `Title`/`Meta` services.

## Testing Strategy

| Layer               | What                                                                                                                                                                                                                                                                                          | Approach                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Unit — Cart         | `addItem` (new + existing increments), `updateQty` (≤0 removes), `removeItem`, `clearCart`; `count`/`total` recompute; `open/close/toggle`; load-on-construction (seed fake first); persist-on-mutation via `setItem` spy; `PLATFORM_ID:'server'` path returns `[]` and never touches storage | 2 describe blocks: browser (fake storage) and server (no storage, no throw) |
| Unit — Seo          | `setPage`: `setTitle` with title, `updateTag` for description/og/twitter, canonical `setAttribute('href', url)`; `setJsonLd`: 1st call appends one script to `head`, 2nd call updates the same node                                                                                           | Spy assertions on fake DOCUMENT                                             |
| Unit — productColor | Table-driven `it.each` of ids: same id → same `ProductVisual` object (`toBe`); result is a member of `productPalette`; edge ids `''` (sum 0) and `'zzz'` return a palette entry without throwing                                                                                              | Plain `describe`/`it`, no TestBed                                           |

## TDD Sequencing (strict_tdd)

Production code already exists, so RED here proves the specs are wired and meaningful rather than driving new behavior. Gate = full `bun run test:ci` runs.

1. **RED**: create the 3 spec files; run `bun run test:ci`. Expected: specs execute and pass against existing behavior. A genuine mismatch is a real defect → RED, recorded and tracked separately (not fixed in this change, per proposal).
2. **GREEN**: all 3 suites pass; final `bun run test:ci` + `bun run typecheck` green (AGENTS.md delivery gate).
3. **REFACTOR**: test-only cleanup — fixture/fake extraction inside each file. Zero production edits.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. Rollback: `git revert` the spec commit; runner and production untouched.

## Open Questions

None.
