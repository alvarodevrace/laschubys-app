# unit-testing Specification

## Purpose

Vitest-based unit coverage of LasChubys-Front core services and pure utilities, executed with `bun run test:ci` (runner: vitest, builder: `@angular/build:unit-test`). This spec is the contract for change `add-core-unit-specs` and governs what the added test suites MUST verify.

## Requirements

### Requirement: CartService Unit Spec

The change MUST add `src/app/core/services/cart.service.spec.ts` covering CartService via TestBed with a mocked `PLATFORM_ID`, asserting signals and computed state without touching real localStorage.

#### Scenario: Add, update, and remove items

- GIVEN an empty cart
- WHEN an item is added, then updated, then removed
- THEN the cart items signal reflects each mutation
- AND computed `count` and `total` recompute accordingly

#### Scenario: Clear and toggle drawer

- GIVEN a cart containing items
- WHEN `clear()` is called
- THEN the cart is emptied
- AND `open()`, `close()`, and `toggle()` update the drawer state signal

#### Scenario: localStorage load and persist

- GIVEN `PLATFORM_ID` is mocked so localStorage is available
- WHEN the service initializes and then mutates the cart
- THEN it loads persisted state on construction and writes on mutation

### Requirement: SeoService Unit Spec

The change MUST add `src/app/core/services/seo.service.spec.ts` covering `setPage` and `setJsonLd` with mocked `Title`, `Meta`, and `DOCUMENT`. Assertions MUST use spies, never live DOM.

#### Scenario: setPage writes title, meta, and canonical

- GIVEN `Title` and `Meta` are mocked with spies
- WHEN `setPage()` is called with a title and description
- THEN `Title.setTitle` is called with the title
- AND `Meta` writes the description tag and canonical URL

#### Scenario: setJsonLd creates then updates the script

- GIVEN a mocked `DOCUMENT` whose `createElement` returns a script element
- WHEN `setJsonLd()` is called the first time
- THEN a JSON-LD script is appended to the document head
- AND a second call updates the existing script instead of duplicating it

### Requirement: productColor Pure-Function Spec

The change MUST add `src/app/shared/ui/product-visuals.spec.ts` covering `productColor()` as a plain `describe`/`it` suite with no TestBed.

#### Scenario: Deterministic mapping

- GIVEN the product palette
- WHEN `productColor()` is called twice with the same product
- THEN it returns the same color both times

#### Scenario: Palette integrity

- GIVEN an unknown or edge-case product value
- WHEN `productColor()` is called
- THEN it returns a color from the defined palette without throwing

### Requirement: Strict TDD Execution

All specs in this change MUST follow RED → GREEN → REFACTOR with `bun run test:ci` as the execution gate, per `strict_tdd: true` in `openspec/config.yaml`.

#### Scenario: Red first

- GIVEN a spec is written before the behavior it asserts exists
- WHEN `bun run test:ci` runs
- THEN the spec fails (RED), confirming the test is meaningful

#### Scenario: Green

- GIVEN the spec exists and the target behavior satisfies it
- WHEN `bun run test:ci` runs
- THEN the suite passes (GREEN)

#### Scenario: No scope creep

- GIVEN this change is a pipeline smoke test
- WHEN the specs are implemented
- THEN only the three spec files are added
- AND production code is modified only if a spec exposes a real defect, tracked separately
