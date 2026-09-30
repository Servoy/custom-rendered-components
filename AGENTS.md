# AGENTS.md

## Project Overview

Servoy component package (`@servoy/customrenderedcomponents`) — an Angular 22 library providing custom-rendered list components for the Servoy platform.

## Directory Structure

- `customrenderedcomponents/` — Angular workspace root (contains `angular.json`, `package.json`)
- `customrenderedcomponents/projects/customrenderedcomponents/src/` — library source code
- `customrenderedcomponents/META-INF/MANIFEST.MF` — Servoy package manifest

## Tech Stack

- Angular 22.1, TypeScript 6.0
- Standalone components with signal inputs (`input()`)
- OnPush change detection
- ESLint 10 flat config (`eslint.config.js`)
- Vitest via `@angular/build:unit-test`
- ng-packagr for library builds
- `@servoy/public` for base classes and Servoy integration

## Components

### BaseList (`baselist.component.ts`)

Abstract base directive extending `ServoyBaseComponent<HTMLDivElement>`. Provides shared logic for both list components:

- HTML sanitization (trusted vs sanitized rendering via `servoyApi().trustAsHtml()`)
- Entry rendering with caching (`getEntryRenderer`, `defaultRenderer`)
- Sortable.js integration (`initSortable`) for drag/drop/sort between lists
- Responsive layout calculation (`getLayoutStyle`)
- Tooltip handling via `TooltipService`
- All shared signal inputs: `data`, `entryRendererFunction`, `styleClass`, `selectionClass`, `dragEnabled`, `dropEnabled`, `sortableEnabled`, `dragSortableOptions`, `onClick`, `onRightClickMethodID`, `onDoubleClickMethodID`, `onSortEnd`, `onDrop`

### CustomRenderedComponentsCustomList (`customlist/`)

Selector: `customrenderedcomponents-customlist`

A flat data list component. Data is provided directly via the `data` input (array of objects). Supports:

- Entry click/right-click/double-click with server-side API calls (`servoyApi().callServerSideApi`)
- Custom entry style class via `entryStyleClassFunction`
- Selection tracking via `selectedIndex`
- Drag-and-drop between lists (add/remove/sort with SortableJS)
- Double-click delay pattern (250ms timeout to distinguish single vs double click)

### CustomRenderedComponentsFoundsetList (`foundsetlist/`)

Selector: `customrenderedcomponents-foundsetlist`

A foundset-backed list component. Data is loaded from a Servoy `IFoundset` and automatically refreshes via `FoundsetChangeListener`. Supports:

- Infinite scroll (loads extra records when scrolling near bottom)
- Multi-select with Ctrl/Shift keys
- Reverse order rendering
- First/last item HTML slots with dedicated click handlers
- Tooltip data provider per row
- Same drag/drop/sort capabilities as CustomList but operating on foundset records

### SortableOptions (`sortableoptions.ts`)

Custom object type (extends `BaseCustomObject`) defining drag/sort configuration: `dragType`, `multiDrag`, `group`, `handle`, `animation`, `selectedClass`.

### CustomRenderedComponentsModule (`customrenderedcomponents.module.ts`)

Re-export barrel NgModule. Registers `SortableOptions` custom object types with `SpecTypesService` and mounts SortableJS plugins (MultiDrag, Swap).

## Architecture

### Inheritance

```
ServoyBaseComponent<HTMLDivElement>  (@servoy/public)
  └── BaseList                      (shared logic directive)
        ├── CustomRenderedComponentsCustomList
        └── CustomRenderedComponentsFoundsetList
```

### Data Flow

1. **CustomList**: Servoy runtime pushes `data` array via signal input → `svyOnChanges` clears cache → template re-renders via `@for`
2. **FoundsetList**: Servoy runtime pushes `foundset` via signal input → `svyOnChanges` registers `FoundsetChangeListener` → listener calls `loadDataFromFoundset()` which reads `foundset.viewPort.rows` → sanitizes and stores in local `data` signal

### Servoy Integration

- `servoyApi()` signal provides runtime services: `getMarkupId()`, `isInAbsoluteLayout()`, `trustAsHtml()`, `callServerSideApi()`, `apply()`, `isInDesigner()`
- `elementRef()` signal provides the host DOM element (available after view init)
- Components are registered in `MANIFEST.MF` via `NG2-Components` attribute
- Server-side method calls go through `servoyApi().callServerSideApi('callMethod', [methodName, ...args])`
- Data mutations are pushed back via `servoyApi().apply('propertyName', value)`

### SortableJS Integration

Both components use SortableJS for drag-and-drop. The `initSortable()` method in BaseList:
- Creates a `Sortable` instance on the native element
- Configures group names, pull/put modes, multi-drag
- Wires up `onAdd` (item dropped in), `onRemove` (item dragged out), `onEnd` (sort within same list)
- Data transfer between lists uses `DataTransfer.setData()` with serialized entries/records

### Change Detection

- All components use `OnPush` change detection
- 2 remaining `cdRef.detectChanges()` calls handle external callbacks (SortableJS `onAdd`, foundset change listener) that run outside Angular's awareness
- These will be removed when the Servoy runtime supports zoneless

## Jira API

For anything Jira — reading, creating, updating, commenting on, linking, searching (JQL),
assigning or transitioning issues — load the **`servoy-jira`** skill (global opencode skill)
and follow its instructions. It holds the connection details (base URL, `ATLASSIAN_AUTH_BASIC`
auth), the per-OS command recipes and the ADF templates. Always load the skill first rather
than hand-rolling the REST calls.

## Commands

All commands run from `customrenderedcomponents/`:

```bash
npm run build        # Production build (ng build --configuration production)
npm run lint         # ESLint (ng lint)
npm run test         # Unit tests via Vitest (ng test --no-watch)
npm run test:watch   # Tests in watch mode
```

## Code Conventions

- Component selector prefix: `customrenderedcomponents-` (kebab-case)
- Directive selector prefix: `customrenderedcomponents` (camelCase)
- Max line length: 200
- Brace style: 1tbs
- All ESLint rules downgraded to warnings via `eslint-plugin-only-warn`
- No comments unless explicitly requested
- Use `input()` signals, not `@Input()` decorators
- Use `inject()` for services, not constructor injection
- Components must be `standalone: true` with explicit `imports`
- Base class: `ServoyBaseComponent` — access `servoyApi()`, `elementRef()`, `name()` as signals

## Verification Checklist

After any code change:
1. `npm run build` — must pass with zero errors
2. `npm run lint` — zero errors (warnings acceptable)
3. `npm run test` — all tests pass (currently no test files exist)
