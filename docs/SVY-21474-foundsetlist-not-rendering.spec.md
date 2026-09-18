# Spec: SVY-21474 — FoundsetList not rendering entries

## 1. Goal

Restore rendering of entries in the `customrenderedcomponents-foundsetlist`
(`CustomRenderedComponentsFoundsetList`) component. When the bound `foundset` contains
records, the list must render one `.list-item` per viewport row, exactly as it did before
the Angular signal-inputs migration (SVY-21298).

The fix must not alter or regress `CustomRenderedComponentsCustomList`, whose `data`
input is pushed directly by the Servoy runtime.

## 2. Background

During the SVY-21298 migration (commits `236c757` / `fde3210`), `BaseList.data` was
converted from a mutable `@Input() data: Array<any>` into a read-only signal input:

```ts
readonly data = input<Array<any>>(undefined as any);
```

`FoundsetList.loadDataFromFoundset()` still builds the sanitized rows into a **local**
`const data = []` array (`foundsetlist.component.ts:225-229`) but never assigns them
anywhere — the local array is dead code. The template renders from the input signal
(`foundsetlist.html:8`: `@for (entry of data(); track entry)`), but the runtime never
pushes `data` to `FoundsetList` (its data source is `foundset`, not `data`). So `data()`
stays `undefined` and the `@for` renders nothing.

Pre-migration (commit `4c730aa`), `loadDataFromFoundset()` ended with `this.data = data;`.
That assignment was the mechanism that populated the list; it was lost, not replaced, when
`data` became a read-only input.

`CustomList` is unaffected: its `data` input is runtime-pushed and only read (never
reassigned internally), so its read-only-input binding works correctly. It also uses
`data()` in its drag/drop handlers (`this.data().concat([])`, `servoyApi().apply('data', …)`),
which must keep referring to the runtime input.

Root cause, git history, and the approved approach are documented in
`docs/SVY-21474-triage.md` (verdict: PROCEED, Approach 1).

## 3. Design

### 3.1 Split the two roles of `data`

Today `data` serves two incompatible roles:

- **CustomList:** an *input* pushed by the runtime and read by the template and drag handlers.
- **FoundsetList:** *internal* state derived from the foundset viewport.

These must not share one symbol. Keep `BaseList.data` as the read-only runtime input
(used by `CustomList`). Give `FoundsetList` a dedicated **writable internal signal** for
its sanitized viewport rows, and bind its template to that signal.

### 3.2 FoundsetList internal rows signal

In `foundsetlist.component.ts`, add a private writable signal:

```ts
protected readonly rows = signal<Array<any>>([]);
```

Name it something distinct from the inherited `data` input (e.g. `rows`) so there is no
ambiguity between the input and the internal state, and no accidental shadowing of the
base-class member.

`loadDataFromFoundset()` populates it from the sanitized viewport rows:

```ts
private loadDataFromFoundset() {
    if (this.foundset()) {
        const rows = [];
        for (const row of this.foundset().viewPort.rows) {
            rows.push(this.getSanitizedData(row));
        }
        this.cache = [];
        this.rows.set(rows);
        this.initSortable(this.setData, this.onAdd, null as any, this.onSort, 'shared-foundsetlist');
    }
}
```

### 3.3 Template binding

Change `foundsetlist.html:8` to iterate the internal signal instead of the input:

```html
@for (entry of rows(); track entry._svyRowId) {
```

The row order and indexing are unchanged: `rows()` holds the sanitized viewport rows in
the same order as `foundset().viewPort.rows`, so the `$index`-based handlers
(`onEntryClick`, `onEntryRightClick`, `onEntryDoubleClick`, `getEntryStyleClass`,
`getTooltip`) and `[attr.data-idx]="$index"` continue to map correctly to the foundset
viewport, exactly as before.

### 3.4 `track` expression

The triage flags whether `@for … track entry` should track by `_svyRowId`. Because
`loadDataFromFoundset()` rebuilds every row object on each foundset change,
`track entry` (object identity) forces a full teardown/rebuild of all rows on every
viewport update. Servoy foundset viewport rows carry a stable `_svyRowId` (already used
in `setData` at `foundsetlist.component.ts:256`), so tracking by `_svyRowId` lets Angular
reuse DOM nodes for unchanged rows. **Recommendation:** track by `entry._svyRowId`.

If any sanitized row can lack `_svyRowId`, fall back to `track $index` rather than
introducing runtime errors; confirm during implementation that `getSanitizedData` preserves
`_svyRowId` (it iterates own enumerable properties, so it should).

### 3.5 Change detection

`loadDataFromFoundset()` is invoked from `svyOnChanges` and from the `foundsetListener`
callback. The listener already calls `this.cdRef.detectChanges()` after
`loadDataFromFoundset()` (`foundsetlist.component.ts:219`); setting a signal there is
compatible and the existing `detectChanges()` remains until the runtime is zoneless. No
change needed to the change-detection strategy.

## 4. Implementation plan

1. `foundsetlist.component.ts`
   - Add `protected readonly rows = signal<Array<any>>([]);` (reuse the already-imported
     `signal`).
   - In `loadDataFromFoundset()`, build the sanitized rows and call `this.rows.set(rows)`
     (restoring the dropped assignment in signal form). Remove the dead local `data` array.
2. `foundsetlist.html`
   - Change `@for (entry of data(); track entry)` to
     `@for (entry of rows(); track entry._svyRowId)` (line 8).
3. Do **not** touch `baselist.component.ts` `data` input or `customlist.component.ts`
   (its `data()` usages must keep referring to the runtime input).
4. Verify `getSanitizedData` preserves `_svyRowId`; if not, use `track $index` in the
   template instead.

## 5. Acceptance criteria

- [ ] With a `foundset` containing N viewport records, `FoundsetList` renders N
      `.list-item` elements.
- [ ] Entries update when the foundset viewport changes (rows added/updated/removed, size
      change) via the `FoundsetChangeListener`.
- [ ] Infinite scroll still loads and renders extra records when scrolling near the bottom.
- [ ] `$index`-based interactions remain correct: single click (selection + `onClick`),
      Ctrl/Shift multi-select, right-click, double-click, tooltip, and per-row style class
      all target the correct foundset record.
- [ ] `reverseOrder`, `firstItemHtml`, and `lastItemHtml` still render and behave as before.
- [ ] Drag/drop/sort (`setData`, `onAdd`, `onSort`) still operate against the correct
      foundset records.
- [ ] `CustomList` is unchanged and continues to render from its runtime-pushed `data`
      input, including its drag/drop `apply('data', …)` round-trips.
- [ ] `npm run build` passes with zero errors.
- [ ] `npm run lint` passes with zero errors (warnings acceptable).
- [ ] `npm run test` passes.

## 6. Out of scope

- Any change to `CustomList` behavior or its `data` input.
- Any change to `BaseList.data` input or the shared `svyOnChanges` cache-clearing logic.
- Reworking the sanitization pipeline (`getSanitizedData`).
- Removing the remaining `cdRef.detectChanges()` calls (deferred until the runtime is
  zoneless, per AGENTS.md).
- Server-side (`.spec` / Servoy runtime) changes.

## 7. Open questions

| Question | Owner | Status |
|----------|-------|--------|
| Do all sanitized foundset rows always carry a stable `_svyRowId` suitable for `track`? | Dev | Confirm during implementation; fall back to `track $index` if not |
| Should the internal signal be named `rows` (proposed) or another name to avoid confusion with the `data` input? | Dev | Proposed `rows`; open to reviewer preference |
