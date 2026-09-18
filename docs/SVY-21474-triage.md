# Triage Report — SVY-21474

**Verdict:** PROCEED

## Reported problem

The `FoundsetList` component (`customrenderedcomponents-foundsetlist`) does not render
any entries even though the foundset contains records. Reported as a **Blocker** and
linked as *caused by* SCCC-3502 ("Upgrade / Test 2026.09"), i.e. surfaced during
the 2026.09 upgrade regression testing.

## Root-cause assessment

This is a genuine regression introduced during the Angular signal-inputs migration
(SVY-21298). The cause is a single dropped assignment.

- In `baselist.component.ts:12`, `data` is now a **read-only** signal input:
  `readonly data = input<Array<any>>(undefined as any);`
- `FoundsetList.loadDataFromFoundset()` (`foundsetlist.component.ts:223-234`) still
  builds the sanitized rows into a **local** `const data = [];` array (lines 225-229)
  but never assigns them anywhere. The local `data` is dead code.
- The template renders from the input signal:
  `@for (entry of data(); track entry)` (`foundsetlist.html:8`).
- Since the runtime does not push `data` to `FoundsetList` (its data source is the
  `foundset` input, not `data`), `data()` stays `undefined` and the `@for` produces
  nothing — hence no entries render, regardless of how many records exist.

### Pre-migration behaviour (proof)

At commit `4c730aa` (pre-migration) `data` was a plain mutable field
(`@Input() data: Array<any>`), and `loadDataFromFoundset()` ended with
`this.data = data;`. That assignment is what populated the list. The migration to a
read-only `input()` removed the ability to assign, and the assignment line was lost
rather than replaced with a writable signal.

## Ticket premise check

The ticket describes only the symptom ("not rendering") and proposes no solution, so
there is no premise to challenge on approach. The premise that this is a real defect in
the component code is **correct** — verified against git history and the current source.
The symptom maps to exactly one code path (`foundset` → `loadDataFromFoundset` →
`data()` in template), so the divergence test does not trip; no reporter input is needed.

`CustomList` is **not** affected: its `data` input is pushed directly by the Servoy
runtime and is never reassigned internally, so its read-only-input template binding
works as intended.

## Approaches considered

1. **Convert the local list into writable local state (recommended).**
   Introduce an internal writable signal (e.g. `protected data = signal<Array<any>>([])`
   on `BaseList`, or a foundset-local signal) that `loadDataFromFoundset()` populates,
   and have the template read that signal. This restores the pre-migration data flow in
   a signal-idiomatic, OnPush/zoneless-friendly way.
   - Pros: minimal, targeted, matches the original design intent; keeps `CustomList`'s
     input-driven `data` working (needs care so both subclasses read the right source).
   - Cons: must reconcile that `CustomList` uses `data` as an *input* while `FoundsetList`
     needs it as *internal* state — likely a `linkedSignal`/separate internal signal split
     rather than reusing the same `input()` for both.

2. **Keep `data` as the input, push via `servoyApi().apply('data', ...)`.**
   - Pros: reuses the existing input.
   - Cons: wrong semantics — `data` is derived from the foundset viewport, not a
     round-tripped property; adds server chatter and latency for purely client-side
     rendering data. Not appropriate.

3. **No code change needed.**
   - Rejected: the component is objectively broken post-migration (confirmed by source
     read + git history). Records exist, template reads an unpopulated signal, nothing
     renders. This is a real Blocker regression.

## Recommendation

Proceed with **Approach 1**. Restore the dropped data assignment by giving `FoundsetList`
a writable internal signal that `loadDataFromFoundset()` sets, and bind the template's
`@for` to that signal. Ensure the fix does not break `CustomList`, whose `data` remains a
runtime-pushed input — the cleanest split is a dedicated internal signal for the foundset
rows rather than overloading the shared `data` input for two different roles. Also review
whether the `@for ... track entry` (tracking by object identity) should track by
`_svyRowId` to avoid re-render churn, since row objects are rebuilt on every
`loadDataFromFoundset()`.

## Git history findings

- `236c757` / `fde3210` — "SVY-21298 migrate to ESLint flat config, Vitest, standalone
  components, signal inputs" (Gabi Boros, 2026-08-14). This commit turned `data` into a
  read-only `input()` and is where the `this.data = data;` assignment was lost.
- `4c730aa` (SVY-20006) — pre-migration `loadDataFromFoundset()` ended with
  `this.data = data;`, proving the assignment was the mechanism that populated the list.
- Linked SCCC-3502 "Upgrade / Test 2026.09" is the incident that surfaced this during
  upgrade testing, consistent with a migration regression.
