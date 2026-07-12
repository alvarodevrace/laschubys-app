# AGENTS.md — Las Chubys Frontend

> Instrucciones de proyecto para Kimi Code operando en `LasChubys-Front`.
> Lee siempre `KIMI.md` y `agents/KIMI-AGENTS.md` antes de este archivo.

## Proyecto

| Campo           | Valor                                                                      |
| --------------- | -------------------------------------------------------------------------- |
| Nombre          | Las Chubys — Frontend                                                      |
| Repo            | https://github.com/alvarodevrace/laschubys-app                             |
| Stack           | Angular 21 SSR, Tailwind CSS 4, Spartan NG, Lucide Angular, Motion, Sentry |
| Package manager | Bun 1.3.14                                                                 |
| Rama default    | `develop`                                                                  |

## Agentes que operan aquí

| Agente     | Rol en este proyecto                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
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
- No lifecycle hooks (`ngOnInit`, `ngOnChanges`, `ngOnDestroy`). Usar `effect()` + `DestroyRef`.
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
rama feature (feature/LCH-N-nombre) → commits locales → build OK → merge local a develop
→ avisa a TRIN: "listo en develop local — rama: feature/LCH-N-nombre"
→ TRIN push develop → llama a NOVA → PR develop → main → Álvaro aprueba → deploy Dokploy
```

- Nunca push directo a `main` ni `develop`.
- Nombres de rama: `feature/LCH-N-nombre-corto`.
- Commits en español, descriptivos, preferiblemente conventional commits.

## Reglas de frontera

- PIXEL no mergea su propio PR sin QA de NOVA.
- AURA entrega shells listos para que PIXEL integre la lógica.
- NOVA solo reporta; si encuentra bug, crea ticket/comentario y asigna a PIXEL.
- No instalar dependencias sin justificar y sin actualizar `bun.lockb`.

## Memoria del proyecto

- Decisiones técnicas: `vault/laschubys/20-Tech/decisions/`.
- Especificaciones de producto: `vault/laschubys/30-Product/specs/`.
- Log diario: `vault/laschubys/10-Log/LOG.md`.
