import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ServoyApiTesting, ServoyPublicService, ServoyPublicServiceTestingImpl, ServoyPublicTestingModule, runOnPushChangeDetection } from '@servoy/public';

// Mock sortablejs so no real drag engine runs. Sortable.create returns a stub whose
// options we can inspect; mount is a no-op; MultiDrag/Swap are plain classes.
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

import { CustomRenderedComponentsCustomList } from './customlist.component';

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

describe('CustomList drag/sortable logic', () => {
    let component: CustomRenderedComponentsCustomList;
    let componentRef: ComponentRef<CustomRenderedComponentsCustomList>;
    let fixture: ComponentFixture<CustomRenderedComponentsCustomList>;
    let servoyApi: ServoyApiTesting;

    beforeEach(async () => {
        createdInstances.length = 0;
        createSpy.mockClear();
        await TestBed.configureTestingModule({
            imports: [CustomRenderedComponentsCustomList, ServoyPublicTestingModule],
            providers: [
                ServoyPublicServiceTestingImpl,
                { provide: ServoyPublicService, useExisting: ServoyPublicServiceTestingImpl }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CustomRenderedComponentsCustomList);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;
        servoyApi = new ServoyApiTesting();
        componentRef.setInput('servoyApi', servoyApi);
    });

    it('does not create a Sortable instance when drag/drop/sort are all disabled', () => {
        (component as any).initSortable(vi.fn(), vi.fn(), vi.fn(), vi.fn(), 'group1');
        expect(createSpy).not.toHaveBeenCalled();
    });

    it('creates a Sortable instance with group pull/put when drag and drop are enabled', () => {
        componentRef.setInput('dragEnabled', true);
        componentRef.setInput('dropEnabled', true);
        componentRef.setInput('sortableEnabled', true);
        (component as any).initSortable(vi.fn(), vi.fn(), vi.fn(), vi.fn(), 'grp');
        expect(createSpy).toHaveBeenCalledTimes(1);
        const opts = createdInstances[0].options;
        expect(opts.sort).toBe(true);
        expect(opts.group.pull).toBe(true);
        expect(opts.group.put).toBe(true);
        expect(opts.group.name).toBe('grp');
        expect(typeof opts.setData).toBe('function');
    });

    it('uses clone pull mode when dragType is COPY', () => {
        componentRef.setInput('dragEnabled', true);
        componentRef.setInput('dragSortableOptions', { dragType: 'COPY' } as any);
        (component as any).initSortable(vi.fn(), vi.fn(), vi.fn(), vi.fn(), 'grp');
        expect(createdInstances[0].options.group.pull).toBe('clone');
    });

    it('applies custom group name, handle, animation and selectedClass from options', () => {
        componentRef.setInput('dragEnabled', true);
        componentRef.setInput('dropEnabled', true);
        componentRef.setInput('dragSortableOptions', { group: 'mygroup', handle: '.h', animation: 150, selectedClass: 'sel' } as any);
        (component as any).initSortable(vi.fn(), vi.fn(), vi.fn(), vi.fn(), 'grp');
        const opts = createdInstances[0].options;
        expect(opts.group.name).toBe('mygroup');
        expect(opts.handle).toBe('.h');
        expect(opts.animation).toBe(150);
        expect(opts.selectedClass).toBe('sel');
    });

    it('enables multiDrag with the dedicated selected class', () => {
        componentRef.setInput('dragEnabled', true);
        componentRef.setInput('dragSortableOptions', { multiDrag: true, multiDragKey: 'CTRL' } as any);
        (component as any).initSortable(vi.fn(), vi.fn(), vi.fn(), vi.fn(), 'grp');
        const opts = createdInstances[0].options;
        expect(opts.multiDrag).toBe(true);
        expect(opts.selectedClass).toBe('svyextra-listcomponent-dragselected');
        expect(opts.multiDragKey).toBe('CTRL');
    });

    it('wires onAdd/onRemove only when onDrop is provided', () => {
        componentRef.setInput('dragEnabled', true);
        componentRef.setInput('onDrop', () => Promise.resolve());
        const onAdd = vi.fn();
        const onRemove = vi.fn();
        (component as any).initSortable(vi.fn(), onAdd, onRemove, vi.fn(), 'grp');
        const opts = createdInstances[0].options;
        expect(opts.onAdd).toBe(onAdd);
        expect(opts.onRemove).toBe(onRemove);
    });

    it('wires onEnd only when onSortEnd is provided', () => {
        componentRef.setInput('dragEnabled', true);
        componentRef.setInput('onSortEnd', () => {});
        const onSortEnd = vi.fn();
        (component as any).initSortable(vi.fn(), vi.fn(), vi.fn(), onSortEnd, 'grp');
        expect(createdInstances[0].options.onEnd).toBe(onSortEnd);
    });

    it('destroys a previous Sortable instance before creating a new one', () => {
        componentRef.setInput('dragEnabled', true);
        (component as any).initSortable(vi.fn(), vi.fn(), vi.fn(), vi.fn(), 'grp');
        const first = createdInstances[0];
        (component as any).initSortable(vi.fn(), vi.fn(), vi.fn(), vi.fn(), 'grp');
        expect(first.destroy).toHaveBeenCalled();
        expect(createdInstances.length).toBe(2);
    });

    describe('removeSortableElementsFrom', () => {
        it('removes the dragged item from its current parent', () => {
            const container = document.createElement('div');
            const child = document.createElement('div');
            container.appendChild(child);
            const evt = makeSortableEvent({ item: child, clone: null });
            (component as any).removeSortableElementsFrom(evt, container);
            expect(container.contains(child)).toBe(false);
        });

        it('removes multiDrag elements when oldIndicies are present', () => {
            const container = document.createElement('div');
            const a = document.createElement('div');
            const b = document.createElement('div');
            container.appendChild(a);
            container.appendChild(b);
            const evt = makeSortableEvent({ oldIndicies: [{ multiDragElement: a, index: 0 }, { multiDragElement: b, index: 1 }] });
            (component as any).removeSortableElementsFrom(evt, container);
            expect(container.children.length).toBe(0);
        });

        it('leaves elements that are not children of the container alone', () => {
            const container = document.createElement('div');
            const other = document.createElement('div');
            const evt = makeSortableEvent({ item: other });
            expect(() => (component as any).removeSortableElementsFrom(evt, container)).not.toThrow();
        });
    });

    describe('restoreSortableElementsInto', () => {
        it('reinserts the dragged item at its original index', () => {
            const container = document.createElement('div');
            const existing = document.createElement('div');
            existing.className = 'existing';
            container.appendChild(existing);
            const dragged = document.createElement('div');
            dragged.className = 'dragged';
            const evt = makeSortableEvent({ item: dragged, oldIndex: 0 });
            (component as any).restoreSortableElementsInto(evt, container);
            expect(container.children[0]).toBe(dragged);
        });

        it('restores multiDrag elements highest-index first', () => {
            const container = document.createElement('div');
            const keep = document.createElement('div');
            container.appendChild(keep);
            const a = document.createElement('div');
            const b = document.createElement('div');
            const evt = makeSortableEvent({ oldIndicies: [{ multiDragElement: a, index: 0 }, { multiDragElement: b, index: 1 }] });
            (component as any).restoreSortableElementsInto(evt, container);
            expect(container.contains(a)).toBe(true);
            expect(container.contains(b)).toBe(true);
        });
    });

    describe('setData', () => {
        it('serializes the dragged entry into the dataTransfer', () => {
            componentRef.setInput('data', [{ dp1: 'A' }, { dp1: 'B' }]);
            const dragEl = document.createElement('div');
            dragEl.setAttribute('data-idx', '1');
            const dataTransfer = { setData: vi.fn() } as unknown as DataTransfer;
            (component as any).setData(dataTransfer, dragEl);
            expect(dataTransfer.setData).toHaveBeenCalledWith('entries', JSON.stringify([{ dp1: 'B' }]));
        });
    });

    describe('onAdd', () => {
        it('applies the merged data and calls onDrop', () => {
            componentRef.setInput('data', [{ dp1: 'A' }]);
            const onDrop = vi.fn().mockResolvedValue(undefined);
            componentRef.setInput('onDrop', onDrop);
            const applySpy = vi.spyOn(servoyApi, 'apply');
            const evt = makeSortableEvent({
                oldIndex: 0,
                newIndex: 0,
                oldIndicies: [],
                newIndicies: [],
                originalEvent: { dataTransfer: { getData: () => JSON.stringify([{ dp1: 'NEW' }]) } }
            });
            (component as any).onAdd(evt);
            expect(applySpy).toHaveBeenCalledWith('data', expect.arrayContaining([{ dp1: 'NEW' }]));
            expect(onDrop).toHaveBeenCalled();
        });
    });

    describe('onRemove', () => {
        it('removes the dragged entry and applies when pullMode is true', () => {
            componentRef.setInput('data', [{ dp1: 'A' }, { dp1: 'B' }]);
            const applySpy = vi.spyOn(servoyApi, 'apply');
            const evt = makeSortableEvent({ oldIndex: 0, oldIndicies: [], pullMode: true, from: document.createElement('div') });
            (component as any).onRemove(evt);
            expect(applySpy).toHaveBeenCalledWith('data', [{ dp1: 'B' }]);
        });

        it('does nothing when pullMode is not true', () => {
            componentRef.setInput('data', [{ dp1: 'A' }]);
            const applySpy = vi.spyOn(servoyApi, 'apply');
            const evt = makeSortableEvent({ oldIndex: 0, oldIndicies: [], pullMode: false });
            (component as any).onRemove(evt);
            expect(applySpy).not.toHaveBeenCalled();
        });
    });

    describe('sortEnd', () => {
        it('reorders data, applies and fires onSortEnd for an intra-list sort', () => {
            const data = [{ dp1: 'A' }, { dp1: 'B' }, { dp1: 'C' }];
            componentRef.setInput('data', data);
            const onSortEnd = vi.fn();
            componentRef.setInput('onSortEnd', onSortEnd);
            const applySpy = vi.spyOn(servoyApi, 'apply');
            const from = document.createElement('div');
            const evt = makeSortableEvent({ oldIndex: 0, newIndex: 2, oldIndicies: [], newIndicies: [], pullMode: undefined, from });
            (component as any).sortEnd(evt);
            expect(applySpy).toHaveBeenCalled();
            expect(onSortEnd).toHaveBeenCalled();
        });

        it('bails out for a cross-list move (pullMode true)', () => {
            componentRef.setInput('data', [{ dp1: 'A' }]);
            const onSortEnd = vi.fn();
            componentRef.setInput('onSortEnd', onSortEnd);
            const applySpy = vi.spyOn(servoyApi, 'apply');
            const evt = makeSortableEvent({ pullMode: true });
            (component as any).sortEnd(evt);
            expect(applySpy).not.toHaveBeenCalled();
            expect(onSortEnd).not.toHaveBeenCalled();
        });
    });

    describe('getEntryStyleClass', () => {
        it('appends the selection class for the selected index', () => {
            componentRef.setInput('data', [{ dp1: 'A' }, { dp1: 'B' }]);
            componentRef.setInput('selectionClass', 'sel');
            componentRef.setInput('selectedIndex', 1);
            const result = component.getEntryStyleClass({ dp1: 'B' }, 1);
            expect(result).toContain('sel');
        });

        it('uses the entryStyleClassFunction result', () => {
            componentRef.setInput('data', [{ dp1: 'A', cls: 'row-a' }]);
            componentRef.setInput('entryStyleClassFunction', (e: any) => e.cls);
            const result = component.getEntryStyleClass({ dp1: 'A', cls: 'row-a' }, 0);
            expect(result).toContain('row-a');
        });

        it('returns undefined for an undefined entry with no cache', () => {
            componentRef.setInput('data', []);
            const result = component.getEntryStyleClass(undefined, 5);
            expect(result).toBeUndefined();
        });
    });

    describe('onEntryClick double-click delay', () => {
        it('schedules a single-click call when a double-click handler is set', () => {
            vi.useFakeTimers();
            componentRef.setInput('data', [{ dp1: 'A' }]);
            componentRef.setInput('onClick', () => {});
            componentRef.setInput('onDoubleClickMethodID', () => {});
            const callSpy = vi.spyOn(servoyApi, 'callServerSideApi');
            const el = document.createElement('div');
            const event = { target: el } as unknown as MouseEvent;
            component.onEntryClick({ dp1: 'A' }, 0, event);
            expect(component.timeoutID).not.toBeNull();
            vi.advanceTimersByTime(260);
            expect(callSpy).toHaveBeenCalledWith('callMethod', expect.arrayContaining(['onClick']));
            vi.useRealTimers();
        });

        it('cancels the pending single-click on the second click (double-click)', () => {
            vi.useFakeTimers();
            componentRef.setInput('data', [{ dp1: 'A' }]);
            componentRef.setInput('onClick', () => {});
            componentRef.setInput('onDoubleClickMethodID', () => {});
            const el = document.createElement('div');
            const event = { target: el } as unknown as MouseEvent;
            component.onEntryClick({ dp1: 'A' }, 0, event);
            component.onEntryClick({ dp1: 'A' }, 0, event);
            expect(component.timeoutID).toBeNull();
            vi.useRealTimers();
        });

        it('fires immediately when no double-click handler is set', () => {
            componentRef.setInput('data', [{ dp1: 'A' }]);
            componentRef.setInput('onClick', () => {});
            const callSpy = vi.spyOn(servoyApi, 'callServerSideApi');
            const el = document.createElement('div');
            const event = { target: el } as unknown as MouseEvent;
            component.onEntryClick({ dp1: 'A' }, 0, event);
            expect(callSpy).toHaveBeenCalledWith('callMethod', expect.arrayContaining(['onClick']));
        });

        it('does nothing when no onClick handler is set', () => {
            componentRef.setInput('data', [{ dp1: 'A' }]);
            const callSpy = vi.spyOn(servoyApi, 'callServerSideApi');
            const el = document.createElement('div');
            const event = { target: el } as unknown as MouseEvent;
            component.onEntryClick({ dp1: 'A' }, 0, event);
            expect(callSpy).not.toHaveBeenCalled();
        });
    });

    describe('onEntryDoubleClick', () => {
        it('calls the server-side double-click method with the data-target', () => {
            componentRef.setInput('data', [{ dp1: 'A' }]);
            componentRef.setInput('onDoubleClickMethodID', () => {});
            const callSpy = vi.spyOn(servoyApi, 'callServerSideApi');
            const el = document.createElement('div');
            el.setAttribute('data-target', 'dp1');
            const event = { target: el } as unknown as MouseEvent;
            component.onEntryDoubleClick({ dp1: 'A' }, 0, event);
            expect(callSpy).toHaveBeenCalledWith('callMethod', expect.arrayContaining(['onDoubleClickMethodID', 0, 'dp1']));
        });

        it('does nothing when no double-click handler is set', () => {
            componentRef.setInput('data', [{ dp1: 'A' }]);
            const callSpy = vi.spyOn(servoyApi, 'callServerSideApi');
            const event = { target: document.createElement('div') } as unknown as MouseEvent;
            component.onEntryDoubleClick({ dp1: 'A' }, 0, event);
            expect(callSpy).not.toHaveBeenCalled();
        });
    });

    describe('onEntryRightClick', () => {
        it('prevents default and calls the server-side right-click method', () => {
            componentRef.setInput('data', [{ dp1: 'A' }]);
            componentRef.setInput('onRightClickMethodID', () => {});
            const callSpy = vi.spyOn(servoyApi, 'callServerSideApi');
            const el = document.createElement('div');
            el.setAttribute('data-target', 'dp1');
            const event = { target: el, preventDefault: vi.fn(), stopPropagation: vi.fn() } as unknown as MouseEvent;
            component.onEntryRightClick({ dp1: 'A' }, 0, event);
            expect((event.preventDefault as any)).toHaveBeenCalled();
            expect(callSpy).toHaveBeenCalledWith('callMethod', expect.arrayContaining(['onRightClickMethodID']));
        });
    });
});

