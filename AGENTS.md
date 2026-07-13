# AGENTS.md — Las Chubys Frontend

> Instrucciones de proyecto para Kimi Code operando en `LasChubys-Front`.
> Lee siempre `../../KIMI.md`, `../../agents/KIMI-AGENTS.md` y `../../vault/laschubys/00-Index/INDEX.md` antes de este archivo.

## Proyecto

| Campo            | Valor                                                                      |
| ---------------- | -------------------------------------------------------------------------- |
| Nombre           | Las Chubys — Frontend                                                      |
| Repo             | https://github.com/alvarodevrace/laschubys-app                             |
| Stack            | Angular 21 SSR, Tailwind CSS 4, Spartan NG, Lucide Angular, Motion, Sentry |
| Package manager  | Bun 1.3.14                                                                 |
| Rama default     | `main`                                                                     |
| Rama integración | `develop`                                                                  |

## Agentes que operan aquí

| Agente     | Rol en este proyecto                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| KIMI-TRIN  | Orquestador. Abre/mergea PRs, coordina QA, nunca aprueba su propio PR.             |
| KIMI-PIXEL | Dueño del código Angular. Implementa features, corrige bugs, optimiza performance. |
| KIMI-AURA  | Diseña shells visuales nuevos en Figma → Angular. Nunca escribe lógica de negocio. |
| KIMI-NOVA  | QA: Playwright, Lighthouse, typecheck, build. Nunca modifica código productivo.    |

## Stack y convenciones técnicas

- Angular 21 con SSR (`@angular/ssr`).
- Componentes standalone por defecto. No usar NgModules.
- Signals para estado; `input()` / `output()` functions; `inject()` para DI.
- Zoneless: `provideZonelessChangeDetection()`; no usar `zone.js`.
- Control flow nativo: `@if`, `@for`, `@switch`.
- OnPush obligatorio en componentes.
- Evitar lifecycle hooks (`ngOnInit`, `ngOnChanges`, `ngOnDestroy`); preferir `effect()` + `DestroyRef`. Existen componentes legacy que aún los usan y deben migrarse progresivamente.
- Spartan NG para componentes de UI base.
- Tailwind CSS 4 para estilos.
- Estructura actual:
  ```
  src/app/
    core/           # auth, config, content, models, services globales
    features/       # una carpeta por feature: admin, auth, blog, cart, checkout, home, linktree, media-kit, placeholder, shop, static
    shared/         # animations, components, services, shell, ui
  ```
- Scope Rule: código usado por 2+ features vive en `shared/`; lo demás queda en su feature.

## Scripts obligatorios antes de entregar

```bash
bun run typecheck
bun run test:ci
bun run build
```

## Flujo Git (LEY DE RAMAS)

```
rama feature (feature/LCH-N-nombre) → commits locales → build OK
→ push feature/LCH-N-nombre
→ PR feature → develop
→ NOVA QA pass + CI verde
→ Álvaro aprueba → merge a develop
→ PR develop → main
→ Álvaro aprueba → merge → deploy Dokploy
```

- Nunca push directo a `main` ni `develop`.
- Nunca merge a `develop` sin QA de NOVA.
- Nombres de rama: `feature/LCH-N-nombre-corto`.
- TRIN nunca aprueba su propio PR; solo Álvaro aprueba.
- Commits en español, descriptivos, preferiblemente conventional commits.

## Reglas de frontera

- PIXEL no mergea su propio PR; Álvaro (o quien él delegue) es el único approver.
- AURA entrega shells listos para que PIXEL integre la lógica.
- NOVA solo reporta; si encuentra bug, crea ticket/comentario y asigna a PIXEL.
- No instalar dependencias sin justificar y sin actualizar `bun.lockb`.

## Ritual de cierre

1. Crear dump en `../../vault/laschubys/temp/YYYY-MM-DD-<AGENTE>.md`.
2. Migrar memorias relevantes de Engram a `../../vault/laschubys/10-Log/LOG.md` o `../../vault/laschubys/20-Tech/decisions/`.
3. Comentar ticket en Planka y mover a Done si aplica.

## Memoria del proyecto

- Decisiones técnicas: `../../vault/laschubys/20-Tech/decisions/`.
- Especificaciones de producto: `../../vault/laschubys/30-Product/specs/`.
- Log diario: `../../vault/laschubys/10-Log/LOG.md`.
