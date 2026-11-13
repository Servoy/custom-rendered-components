import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ServoyApiTesting, ServoyPublicService, ServoyPublicServiceTestingImpl, ServoyPublicTestingModule, IFoundset, runOnPushChangeDetection } from '@servoy/public';

// vi.hoisted keeps the shared state in scope for the hoisted vi.mock factory below.
const { createdInstances, createSpy } = vi.hoisted(() => {
    const instances: any[] = [];
    const spy = vi.fn((_el: HTMLElement, opts: any) => {
        const instance = { options: opts, destroy: vi.fn() };
        instances.push(instance);
        return instance;
    });
    return { createdInstances: instances, createSpy: spy };
});
vi.mock('sortablejs', () => {
    class MultiDrag {}
    class Swap {}
    const Sortable: any = { create: createSpy, mount: vi.fn() };
    return { default: Sortable, MultiDrag, Swap };
});

import { CustomRenderedComponentsFoundsetList } from './foundsetlist.component';

function createMockFoundset(rows: any[], options: Partial<IFoundset> = {}): IFoundset {
    return {
        foundsetId: 1,
        serverSize: rows.length,
        viewPort: { startIndex: 0, size: rows.length, rows },
        selectedRowIndexes: [0],
        sortColumns: '',
        multiSelect: false,
        findMode: false,
        hasMoreRows: false,
        loadRecordsAsync: vi.fn().mockResolvedValue(undefined),
        loadExtraRecordsAsync: vi.fn().mockResolvedValue(undefined),
        loadLessRecordsAsync: vi.fn().mockResolvedValue(undefined),
        notifyChanged: vi.fn(),
        sort: vi.fn().mockResolvedValue(undefined),
        requestSelectionUpdate: vi.fn().mockResolvedValue(undefined),
        setPreferredViewportSize: vi.fn(),
        getRecordRefByRowID: vi.fn().mockImplementation((id: string) => ({ ref: id })),
        columnDataChangedByRowId: vi.fn(),
        removeChangeListener: vi.fn(),
        addChangeListener: vi.fn().mockImplementation(() => () => {}),
        ...options
    } as any;
}

function makeSortableEvent(partial: any = {}): any {
    return {
        item: document.createElement('div'),
        from: document.createElement('div'),
        to: document.createElement('div'),
        oldIndex: 0,
        newIndex: 1,
        oldIndicies: [],
        newIndicies: [],
        clone: null,
        pullMode: undefined,
        originalEvent: { dataTransfer: { getData: vi.fn(), setData: vi.fn() } },
        ...partial
    };
}

describe('FoundsetList drag/sortable and handler logic', () => {
    let component: CustomRenderedComponentsFoundsetList;
    let componentRef: ComponentRef<CustomRenderedComponentsFoundsetList>;
    let fixture: ComponentFixture<CustomRenderedComponentsFoundsetList>;
    let servoyApi: ServoyApiTesting;

    beforeEach(async () => {
        createdInstances.length = 0;
        createSpy.mockClear();
        await TestBed.configureTestingModule({
            imports: [CustomRenderedComponentsFoundsetList, ServoyPublicTestingModule],
            providers: [
                ServoyPublicServiceTestingImpl,
                { provide: ServoyPublicService, useExisting: ServoyPublicServiceTestingImpl }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CustomRenderedComponentsFoundsetList);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        servoyApi = new ServoyApiTesting();
        componentRef.setInput('servoyApi', servoyApi);
    });

    describe('svyOnChanges', () => {
        it('bails out while in the designer', () => {
            vi.spyOn(servoyApi, 'isInDesigner').mockReturnValue(true);
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }]);
            componentRef.setInput('foundset', foundset);
            component.svyOnChanges({ foundset: { currentValue: foundset, previousValue: undefined, firstChange: true, isFirstChange: () => true } });
            expect(foundset.addChangeListener).not.toHaveBeenCalled();
        });

        it('removes the listener from the previous foundset before switching', () => {
            const prev = createMockFoundset([{ dp1: 'P', _svyRowId: 'p' }]);
            const next = createMockFoundset([{ dp1: 'N', _svyRowId: 'n' }]);
            componentRef.setInput('foundset', next);
            component.svyOnChanges({ foundset: { currentValue: next, previousValue: prev, firstChange: false, isFirstChange: () => false } });
            expect(prev.removeChangeListener).toHaveBeenCalled();
            expect(next.addChangeListener).toHaveBeenCalled();
        });

        it('adds and removes the reverse-order class on the element', async () => {
            componentRef.setInput('data', []);
            await runOnPushChangeDetection(fixture);
            const el = component.elementRef()!.nativeElement;
            component.svyOnChanges({ reverseOrder: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false } });
            expect(el.classList.contains('svy-extra-listcomponent-reverse')).toBe(true);
            component.svyOnChanges({ reverseOrder: { currentValue: false, previousValue: true, firstChange: false, isFirstChange: () => false } });
            expect(el.classList.contains('svy-extra-listcomponent-reverse')).toBe(false);
        });
    });

    describe('onElementScroll / infinite scroll', () => {
        it('loads extra records when scrolled near the bottom and more rows exist', () => {
            const foundset = createMockFoundset(
                [{ dp1: 'A', _svyRowId: '1' }],
                { hasMoreRows: true, serverSize: 100 }
            );
            componentRef.setInput('foundset', foundset);
            const el = component.getNativeElement();
            Object.defineProperty(el, 'scrollTop', { value: 0, configurable: true });
            Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });
            Object.defineProperty(el, 'offsetHeight', { value: 90, configurable: true });
            component.onElementScroll({});
            expect(foundset.loadExtraRecordsAsync).toHaveBeenCalledWith(70, false);
        });

        it('does not load extra records when there are no more rows', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }], { hasMoreRows: false, serverSize: 1 });
            componentRef.setInput('foundset', foundset);
            const el = component.getNativeElement();
            Object.defineProperty(el, 'scrollTop', { value: 0, configurable: true });
            Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });
            Object.defineProperty(el, 'offsetHeight', { value: 90, configurable: true });
            component.onElementScroll({});
            expect(foundset.loadExtraRecordsAsync).not.toHaveBeenCalled();
        });

        it('handles reverse-order scroll offset', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }], { hasMoreRows: true, serverSize: 100 });
            componentRef.setInput('foundset', foundset);
            componentRef.setInput('reverseOrder', true);
            const el = component.getNativeElement();
            Object.defineProperty(el, 'scrollTop', { value: -5, configurable: true });
            Object.defineProperty(el, 'scrollHeight', { value: 100, configurable: true });
            Object.defineProperty(el, 'offsetHeight', { value: 90, configurable: true });
            component.onElementScroll({});
            expect(foundset.loadExtraRecordsAsync).toHaveBeenCalled();
        });
    });

    describe('onEntryClick selection', () => {
        it('requests single selection on a plain click', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }, { dp1: 'B', _svyRowId: '2' }]);
            componentRef.setInput('foundset', foundset);
            const event = { ctrlKey: false, shiftKey: false, target: document.createElement('div') } as unknown as MouseEvent;
            component.onEntryClick(1, event);
            expect(foundset.requestSelectionUpdate).toHaveBeenCalledWith([1]);
        });

        it('toggles a row into the selection with ctrl in multiSelect mode', () => {
            const foundset = createMockFoundset(
                [{ dp1: 'A', _svyRowId: '1' }, { dp1: 'B', _svyRowId: '2' }, { dp1: 'C', _svyRowId: '3' }],
                { multiSelect: true, selectedRowIndexes: [0] }
            );
            componentRef.setInput('foundset', foundset);
            const event = { ctrlKey: true, shiftKey: false, target: document.createElement('div') } as unknown as MouseEvent;
            component.onEntryClick(2, event);
            expect(foundset.requestSelectionUpdate).toHaveBeenCalledWith([0, 2]);
        });

        it('removes a row from the selection with ctrl when already selected', () => {
            const foundset = createMockFoundset(
                [{ dp1: 'A', _svyRowId: '1' }, { dp1: 'B', _svyRowId: '2' }],
                { multiSelect: true, selectedRowIndexes: [0, 1] }
            );
            componentRef.setInput('foundset', foundset);
            const event = { ctrlKey: true, shiftKey: false, target: document.createElement('div') } as unknown as MouseEvent;
            component.onEntryClick(1, event);
            expect(foundset.requestSelectionUpdate).toHaveBeenCalledWith([0]);
        });

        it('selects a contiguous range with shift in multiSelect mode', () => {
            const foundset = createMockFoundset(
                [{ dp1: 'A', _svyRowId: '1' }, { dp1: 'B', _svyRowId: '2' }, { dp1: 'C', _svyRowId: '3' }, { dp1: 'D', _svyRowId: '4' }],
                { multiSelect: true, selectedRowIndexes: [1] }
            );
            componentRef.setInput('foundset', foundset);
            const event = { ctrlKey: false, shiftKey: true, target: document.createElement('div') } as unknown as MouseEvent;
            component.onEntryClick(3, event);
            expect(foundset.requestSelectionUpdate).toHaveBeenCalledWith([1, 2, 3]);
        });

        it('selects a backward range with shift', () => {
            const foundset = createMockFoundset(
                [{ dp1: 'A', _svyRowId: '1' }, { dp1: 'B', _svyRowId: '2' }, { dp1: 'C', _svyRowId: '3' }],
                { multiSelect: true, selectedRowIndexes: [2] }
            );
            componentRef.setInput('foundset', foundset);
            const event = { ctrlKey: false, shiftKey: true, target: document.createElement('div') } as unknown as MouseEvent;
            component.onEntryClick(0, event);
            expect(foundset.requestSelectionUpdate).toHaveBeenCalledWith([0, 1, 2]);
        });

        it('schedules the single-click handler when a double-click handler is set', () => {
            vi.useFakeTimers();
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }]);
            componentRef.setInput('foundset', foundset);
            const onClick = vi.fn();
            componentRef.setInput('onClick', onClick);
            componentRef.setInput('onDoubleClickMethodID', () => {});
            const event = { ctrlKey: false, shiftKey: false, target: document.createElement('div') } as unknown as MouseEvent;
            component.onEntryClick(0, event);
            expect(component.timeoutID).not.toBeNull();
            vi.advanceTimersByTime(260);
            expect(onClick).toHaveBeenCalled();
            vi.useRealTimers();
        });

        it('cancels the pending single-click on a double click', () => {
            vi.useFakeTimers();
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }]);
            componentRef.setInput('foundset', foundset);
            componentRef.setInput('onClick', () => {});
            componentRef.setInput('onDoubleClickMethodID', () => {});
            const event = { ctrlKey: false, shiftKey: false, target: document.createElement('div') } as unknown as MouseEvent;
            component.onEntryClick(0, event);
            component.onEntryClick(0, event);
            expect(component.timeoutID).toBeNull();
            vi.useRealTimers();
        });

        it('calls the click handler immediately without a double-click handler', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }]);
            componentRef.setInput('foundset', foundset);
            const onClick = vi.fn();
            componentRef.setInput('onClick', onClick);
            const event = { ctrlKey: false, shiftKey: false, target: document.createElement('div') } as unknown as MouseEvent;
            component.onEntryClick(0, event);
            expect(onClick).toHaveBeenCalledWith({ dp1: 'A', _svyRowId: '1' }, 1, '', event);
        });
    });

    describe('onEntryRightClick / onEntryDoubleClick', () => {
        it('calls the right-click handler with the 1-based index', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }]);
            componentRef.setInput('foundset', foundset);
            const onRight = vi.fn();
            componentRef.setInput('onRightClickMethodID', onRight);
            const el = document.createElement('div');
            el.setAttribute('data-target', 'dp1');
            const event = { target: el, preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as MouseEvent;
            component.onEntryRightClick(0, event);
            expect(onRight).toHaveBeenCalledWith({ dp1: 'A', _svyRowId: '1' }, 1, 'dp1', event);
        });

        it('does nothing on right-click when no handler is set', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }]);
            componentRef.setInput('foundset', foundset);
            const event = { target: document.createElement('div'), preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as MouseEvent;
            expect(() => component.onEntryRightClick(0, event)).not.toThrow();
        });

        it('calls the double-click handler with the record', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }]);
            componentRef.setInput('foundset', foundset);
            const onDouble = vi.fn();
            componentRef.setInput('onDoubleClickMethodID', onDouble);
            const event = { target: document.createElement('div') } as unknown as Event;
            component.onEntryDoubleClick(0, event);
            expect(onDouble).toHaveBeenCalledWith({ dp1: 'A', _svyRowId: '1' }, 1, '', event);
        });
    });

    describe('onFirstItemClicked / onLastItemClicked', () => {
        it('calls the first-item handler with the data-target', () => {
            const first = vi.fn();
            componentRef.setInput('onFirstItemClick', first);
            const el = document.createElement('div');
            el.setAttribute('data-target', 'slot');
            const event = { target: el } as unknown as MouseEvent;
            component.onFirstItemClicked(event);
            expect(first).toHaveBeenCalledWith(event, 'slot');
        });

        it('does nothing for the first item when no handler is set', () => {
            const event = { target: document.createElement('div') } as unknown as MouseEvent;
            expect(() => component.onFirstItemClicked(event)).not.toThrow();
        });

        it('calls the last-item handler', () => {
            const last = vi.fn();
            componentRef.setInput('onLastItemClick', last);
            const event = { target: document.createElement('div') } as unknown as MouseEvent;
            component.onLastItemClicked(event);
            expect(last).toHaveBeenCalledWith(event, '');
        });
    });

    describe('getEntryStyleClass', () => {
        it('appends the selection class for a selected row', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }], { selectedRowIndexes: [0] });
            componentRef.setInput('foundset', foundset);
            componentRef.setInput('selectionClass', 'sel');
            const result = component.getEntryStyleClass(0, { dp1: 'A' });
            expect(result).toContain('sel');
        });

        it('uses the entryStyleClassDataProvider value', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: '1' }]);
            componentRef.setInput('foundset', foundset);
            componentRef.setInput('entryStyleClassDataProvider', ['row-cls']);
            const result = component.getEntryStyleClass(0, { dp1: 'A' });
            expect(result).toContain('row-cls');
        });
    });

    describe('setData (foundset records)', () => {
        it('serializes the dragged record refs into the dataTransfer', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: 'a' }, { dp1: 'B', _svyRowId: 'b' }]);
            componentRef.setInput('foundset', foundset);
            const dragEl = document.createElement('div');
            dragEl.setAttribute('data-idx', '1');
            const dataTransfer = { setData: vi.fn() } as unknown as DataTransfer;
            (component as any).setData(dataTransfer, dragEl);
            expect(foundset.getRecordRefByRowID).toHaveBeenCalledWith('b');
            expect(dataTransfer.setData).toHaveBeenCalledWith('records', JSON.stringify([{ ref: 'b' }]));
        });
    });

    describe('onAdd (foundset)', () => {
        it('invokes onDrop and reloads data from the foundset', async () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: 'a' }, { dp1: 'B', _svyRowId: 'b' }]);
            componentRef.setInput('foundset', foundset);
            const onDrop = vi.fn().mockResolvedValue(undefined);
            componentRef.setInput('onDrop', onDrop);
            const evt = makeSortableEvent({
                oldIndex: 0,
                newIndex: 1,
                oldIndicies: [],
                newIndicies: [],
                originalEvent: { dataTransfer: { getData: () => JSON.stringify([{ ref: 'a' }]) } }
            });
            (component as any).onAdd(evt);
            await Promise.resolve();
            expect(onDrop).toHaveBeenCalled();
            const [, oldIdx, newIdx] = onDrop.mock.calls[0];
            expect(oldIdx).toEqual([1]);
            expect(newIdx).toEqual([2]);
        });
    });

    describe('onSort (foundset)', () => {
        it('fires onSortEnd with 1-based indices for an intra-list sort', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: 'a' }, { dp1: 'B', _svyRowId: 'b' }, { dp1: 'C', _svyRowId: 'c' }]);
            componentRef.setInput('foundset', foundset);
            const onSortEnd = vi.fn();
            componentRef.setInput('onSortEnd', onSortEnd);
            const evt = makeSortableEvent({ oldIndex: 0, newIndex: 2, oldIndicies: [], newIndicies: [], pullMode: undefined });
            (component as any).onSort(evt);
            expect(onSortEnd).toHaveBeenCalled();
            const [, oldIdx, newIdx] = onSortEnd.mock.calls[0];
            expect(oldIdx).toEqual([1]);
            expect(newIdx).toEqual([3]);
        });

        it('ignores a cross-list drag (pullMode true)', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: 'a' }]);
            componentRef.setInput('foundset', foundset);
            const onSortEnd = vi.fn();
            componentRef.setInput('onSortEnd', onSortEnd);
            const evt = makeSortableEvent({ pullMode: true });
            (component as any).onSort(evt);
            expect(onSortEnd).not.toHaveBeenCalled();
        });

        it('ignores a clone drag (pullMode clone)', () => {
            const foundset = createMockFoundset([{ dp1: 'A', _svyRowId: 'a' }]);
            componentRef.setInput('foundset', foundset);
            const onSortEnd = vi.fn();
            componentRef.setInput('onSortEnd', onSortEnd);
            const evt = makeSortableEvent({ pullMode: 'clone' });
            (component as any).onSort(evt);
            expect(onSortEnd).not.toHaveBeenCalled();
        });
    });

    describe('foundset change listener', () => {
        it('reloads data for a relevant change and ignores irrelevant ones', async () => {
            let listener: any;
            const foundset = createMockFoundset(
                [{ dp1: 'A', _svyRowId: '1' }],
                { addChangeListener: vi.fn().mockImplementation((cb: any) => { listener = cb; return () => {}; }) }
            );
            componentRef.setInput('foundset', foundset);
            component.svyOnChanges({ foundset: { currentValue: foundset, previousValue: undefined, firstChange: true, isFirstChange: () => true } });
            await runOnPushChangeDetection(fixture);

            foundset.viewPort.rows = [{ dp1: 'A', _svyRowId: '1' }, { dp1: 'B', _svyRowId: '2' }];
            foundset.viewPort.size = 2;
            listener({ serverFoundsetSizeChanged: true });
            await runOnPushChangeDetection(fixture);
            expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(2);

            const before = fixture.nativeElement.querySelectorAll('.list-item').length;
            listener({ someUnrelatedChange: true });
            await runOnPushChangeDetection(fixture);
            expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(before);
        });
    });
});


