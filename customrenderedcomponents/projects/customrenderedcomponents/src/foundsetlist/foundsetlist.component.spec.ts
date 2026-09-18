import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ServoyApiTesting, ServoyPublicService, ServoyPublicServiceTestingImpl, ServoyPublicTestingModule, IFoundset, runOnPushChangeDetection } from '@servoy/public';
import { CustomRenderedComponentsFoundsetList } from './foundsetlist.component';

function createMockFoundset(rows: any[], options: Partial<IFoundset> = {}): IFoundset {
    return {
        foundsetId: 1,
        serverSize: rows.length,
        viewPort: {
            startIndex: 0,
            size: rows.length,
            rows
        },
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
        getRecordRefByRowID: vi.fn(),
        columnDataChangedByRowId: vi.fn(),
        removeChangeListener: vi.fn(),
        addChangeListener: vi.fn().mockImplementation(() => () => {}),
        ...options
    } as any;
}

describe('CustomRenderedComponentsFoundsetList', () => {
    let component: CustomRenderedComponentsFoundsetList;
    let componentRef: ComponentRef<CustomRenderedComponentsFoundsetList>;
    let fixture: ComponentFixture<CustomRenderedComponentsFoundsetList>;
    let servoyApi: ServoyApiTesting;

    beforeEach(async () => {
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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render items from foundset viewport rows', async () => {
        const rows = [
            { dp1: 'Row 1', _svyRowId: '1' },
            { dp1: 'Row 2', _svyRowId: '2' },
            { dp1: 'Row 3', _svyRowId: '3' }
        ];
        const foundset = createMockFoundset(rows);
        componentRef.setInput('foundset', foundset);
        await runOnPushChangeDetection(fixture);

        const items = fixture.nativeElement.querySelectorAll('.list-item');
        expect(items.length).toBe(3);
    });

    it('should set markupId on container', async () => {
        componentRef.setInput('data', []);
        await runOnPushChangeDetection(fixture);

        const container = fixture.nativeElement.querySelector('.svy-extra-listcomponent');
        expect(container.id).toBe('testid');
    });

    it('should apply styleClass to the container', async () => {
        componentRef.setInput('data', []);
        componentRef.setInput('styleClass', 'foundset-class');
        await runOnPushChangeDetection(fixture);

        const container = fixture.nativeElement.querySelector('.svy-extra-listcomponent');
        expect(container.classList.contains('foundset-class')).toBe(true);
    });

    it('should render firstItemHtml when provided', async () => {
        componentRef.setInput('data', []);
        componentRef.setInput('firstItemHtml', '<span class="first">First</span>');
        await runOnPushChangeDetection(fixture);

        const firstItem = fixture.nativeElement.querySelector('.first-list-item');
        expect(firstItem).toBeTruthy();
        expect(firstItem.innerHTML).toContain('First');
    });

    it('should render lastItemHtml when provided', async () => {
        componentRef.setInput('data', []);
        componentRef.setInput('lastItemHtml', '<span class="last">Last</span>');
        await runOnPushChangeDetection(fixture);

        const lastItem = fixture.nativeElement.querySelector('.last-list-item');
        expect(lastItem).toBeTruthy();
        expect(lastItem.innerHTML).toContain('Last');
    });

    it('should not render firstItemHtml when not provided', async () => {
        componentRef.setInput('data', []);
        await runOnPushChangeDetection(fixture);

        const firstItem = fixture.nativeElement.querySelector('.first-list-item');
        expect(firstItem).toBeFalsy();
    });

    it('should apply selection class to selected row', async () => {
        const rows = [
            { dp1: 'A', _svyRowId: '1' },
            { dp1: 'B', _svyRowId: '2' }
        ];
        const foundset = createMockFoundset(rows, { selectedRowIndexes: [1] });
        componentRef.setInput('foundset', foundset);
        componentRef.setInput('selectionClass', 'active');
        await runOnPushChangeDetection(fixture);

        const items = fixture.nativeElement.querySelectorAll('.list-item');
        expect(items[1].classList.contains('active')).toBe(true);
        expect(items[0].classList.contains('active')).toBe(false);
    });

    it('should apply entryStyleClassDataProvider per row', async () => {
        const rows = [
            { dp1: 'A', _svyRowId: '1' },
            { dp1: 'B', _svyRowId: '2' }
        ];
        const foundset = createMockFoundset(rows);
        componentRef.setInput('foundset', foundset);
        componentRef.setInput('entryStyleClassDataProvider', ['cls-a', 'cls-b']);
        await runOnPushChangeDetection(fixture);

        const items = fixture.nativeElement.querySelectorAll('.list-item');
        expect(items[0].classList.contains('cls-a')).toBe(true);
        expect(items[1].classList.contains('cls-b')).toBe(true);
    });

    it('should return tooltip from tooltipDataProvider', () => {
        componentRef.setInput('tooltipDataProvider', ['Tip A', 'Tip B']);
        expect(component.getTooltip(0)).toBe('Tip A');
        expect(component.getTooltip(1)).toBe('Tip B');
    });

    it('should return null tooltip for invalid index', () => {
        componentRef.setInput('tooltipDataProvider', ['Tip A']);
        expect(component.getTooltip(5)).toBeNull();
    });

    it('should request selection update on entry click', async () => {
        const rows = [
            { dp1: 'A', _svyRowId: '1' },
            { dp1: 'B', _svyRowId: '2' }
        ];
        const foundset = createMockFoundset(rows);
        componentRef.setInput('foundset', foundset);
        componentRef.setInput('onClick', () => {});
        await runOnPushChangeDetection(fixture);

        const items = fixture.nativeElement.querySelectorAll('.list-item');
        items[1].click();

        expect(foundset.requestSelectionUpdate).toHaveBeenCalledWith([1]);
    });

    it('should support multi-select with ctrl key', async () => {
        const rows = [
            { dp1: 'A', _svyRowId: '1' },
            { dp1: 'B', _svyRowId: '2' },
            { dp1: 'C', _svyRowId: '3' }
        ];
        const foundset = createMockFoundset(rows, { multiSelect: true, selectedRowIndexes: [0] });
        componentRef.setInput('foundset', foundset);
        componentRef.setInput('onClick', () => {});
        await runOnPushChangeDetection(fixture);

        const items = fixture.nativeElement.querySelectorAll('.list-item');
        items[2].dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));

        expect(foundset.requestSelectionUpdate).toHaveBeenCalledWith([0, 2]);
    });

    it('should call onFirstItemClick when first item is clicked', async () => {
        const firstClickSpy = vi.fn();
        componentRef.setInput('data', []);
        componentRef.setInput('firstItemHtml', '<span>First</span>');
        componentRef.setInput('onFirstItemClick', firstClickSpy);
        await runOnPushChangeDetection(fixture);

        const firstItem = fixture.nativeElement.querySelector('.first-list-item');
        firstItem.click();

        expect(firstClickSpy).toHaveBeenCalled();
    });

    it('should call onLastItemClick when last item is clicked', async () => {
        const lastClickSpy = vi.fn();
        componentRef.setInput('data', []);
        componentRef.setInput('lastItemHtml', '<span>Last</span>');
        componentRef.setInput('onLastItemClick', lastClickSpy);
        await runOnPushChangeDetection(fixture);

        const lastItem = fixture.nativeElement.querySelector('.last-list-item');
        lastItem.click();

        expect(lastClickSpy).toHaveBeenCalled();
    });

    it('should render from foundset rows and not from the data input', async () => {
        const rows = [
            { dp1: 'Row 1', _svyRowId: '1' },
            { dp1: 'Row 2', _svyRowId: '2' }
        ];
        const foundset = createMockFoundset(rows);
        componentRef.setInput('foundset', foundset);
        await runOnPushChangeDetection(fixture);
        expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(2);
    });

    it('should render nothing when only the data input is set', async () => {
        componentRef.setInput('data', [
            { dp1: 'A', _svyRowId: '1' },
            { dp1: 'B', _svyRowId: '2' },
            { dp1: 'C', _svyRowId: '3' }
        ]);
        await runOnPushChangeDetection(fixture);
        expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(0);
    });

    it('should refresh entries when the foundset viewport changes via the change listener', async () => {
        let listener: any;
        const foundset = createMockFoundset(
            [{ dp1: 'A', _svyRowId: '1' }],
            { addChangeListener: vi.fn().mockImplementation((cb: any) => { listener = cb; return () => {}; }) }
        );
        componentRef.setInput('foundset', foundset);
        component.svyOnChanges({
            foundset: { currentValue: foundset, previousValue: undefined, firstChange: true, isFirstChange: () => true }
        });
        await runOnPushChangeDetection(fixture);
        expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(1);

        foundset.viewPort.rows = [
            { dp1: 'A', _svyRowId: '1' },
            { dp1: 'B', _svyRowId: '2' },
            { dp1: 'C', _svyRowId: '3' }
        ];
        foundset.viewPort.size = 3;
        listener({ viewportRowsCompletelyChanged: true });
        await runOnPushChangeDetection(fixture);
        expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(3);
    });

    it('should render rows tracked by _svyRowId without throwing', async () => {
        const rows = [
            { dp1: 'A', _svyRowId: 'a' },
            { dp1: 'B', _svyRowId: 'b' }
        ];
        const foundset = createMockFoundset(rows);
        componentRef.setInput('foundset', foundset);
        await runOnPushChangeDetection(fixture);
        expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(2);

        foundset.viewPort.rows = [
            { dp1: 'A', _svyRowId: 'a' },
            { dp1: 'B2', _svyRowId: 'b' },
            { dp1: 'C', _svyRowId: 'c' }
        ];
        foundset.viewPort.size = 3;
        expect(() => (foundset.addChangeListener as any).mock.calls[0][0]({ viewportRowsUpdated: true })).not.toThrow();
        await runOnPushChangeDetection(fixture);
        expect(fixture.nativeElement.querySelectorAll('.list-item').length).toBe(3);
    });

    it('should set data-idx attribute on each entry', async () => {
        const rows = [
            { dp1: 'A', _svyRowId: '1' },
            { dp1: 'B', _svyRowId: '2' }
        ];
        const foundset = createMockFoundset(rows);
        componentRef.setInput('foundset', foundset);
        await runOnPushChangeDetection(fixture);

        const items = fixture.nativeElement.querySelectorAll('.list-item');
        expect(items[0].getAttribute('data-idx')).toBe('0');
        expect(items[1].getAttribute('data-idx')).toBe('1');
    });

    it('should handle layout style in responsive mode', async () => {
        vi.spyOn(servoyApi, 'isInAbsoluteLayout').mockReturnValue(false);
        componentRef.setInput('data', []);
        componentRef.setInput('responsiveHeight', 500);
        await runOnPushChangeDetection(fixture);

        const container = fixture.nativeElement.querySelector('.svy-extra-listcomponent');
        expect(container.style.position).toBe('relative');
        expect(container.style.height).toBe('500px');
    });

    it('should register foundset change listener', async () => {
        const rows = [{ dp1: 'A', _svyRowId: '1' }];
        const foundset = createMockFoundset(rows);
        componentRef.setInput('foundset', foundset);

        component.svyOnChanges({
            foundset: { currentValue: foundset, previousValue: undefined, firstChange: true, isFirstChange: () => true }
        });

        expect(foundset.addChangeListener).toHaveBeenCalled();
    });

    it('should remove foundset change listener on destroy', async () => {
        const rows = [{ dp1: 'A', _svyRowId: '1' }];
        const foundset = createMockFoundset(rows);
        componentRef.setInput('foundset', foundset);
        await runOnPushChangeDetection(fixture);

        component.ngOnDestroy();

        expect(foundset.removeChangeListener).toHaveBeenCalled();
    });
});
