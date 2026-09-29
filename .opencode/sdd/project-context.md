# Project Context — Custom Rendered Components

## Package identity

- **NPM package:** `@servoy/customrenderedcomponents`
- **Angular workspace:** `customrenderedcomponents/`
- **Library source:** `customrenderedcomponents/projects/customrenderedcomponents/src/`
- **Servoy specs:** `customrenderedcomponents/customlist/customlist.spec`, `customrenderedcomponents/foundsetlist/foundsetlist.spec`
- **Manifest:** `customrenderedcomponents/META-INF/MANIFEST.MF`

## Tech stack

- Angular 22.1, TypeScript 6.0
- Standalone components with signal inputs (`input()`)
- OnPush change detection
- ESLint 10 flat config
- Vitest via `@angular/build:unit-test`
- ng-packagr for library builds
- `@servoy/public` for base classes and Servoy integration
- SortableJS for drag-and-drop

## Components

| Component | Selector | Source |
|-----------|----------|--------|
| BaseList (directive) | — | `src/baselist.component.ts` |
| CustomRenderedComponentsCustomList | `customrenderedcomponents-customlist` | `src/customlist/customlist.component.ts` |
| CustomRenderedComponentsFoundsetList | `customrenderedcomponents-foundsetlist` | `src/foundsetlist/foundsetlist.component.ts` |
| SortableOptions | — | `src/sortableoptions.ts` |
| CustomRenderedComponentsModule | — | `src/customrenderedcomponents.module.ts` |

## Inheritance

```
ServoyBaseComponent<HTMLDivElement>  (@servoy/public)
  └── BaseList                      (shared logic directive)
        ├── CustomRenderedComponentsCustomList
        └── CustomRenderedComponentsFoundsetList
```

## Code conventions

- Component selector prefix: `customrenderedcomponents-` (kebab-case)
- Use `input()` signals, not `@Input()` decorators
- Use `inject()` for services, not constructor injection
- Components must be `standalone: true`
- Access base class signals with `()`: `this.servoyApi()`, `this.elementRef()`, `this.name()`
- No comments unless explicitly requested
- Max line length: 200, brace style: 1tbs

## Commands (run from `customrenderedcomponents/`)

```bash
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (no-watch)
```

## Verification

After any code change:
1. `npm run build` — zero errors
2. `npm run lint` — zero errors (warnings acceptable)
3. `npm run test` — all tests pass
