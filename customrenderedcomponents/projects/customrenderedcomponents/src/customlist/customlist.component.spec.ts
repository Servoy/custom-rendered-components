import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ServoyApiTesting, ServoyPublicService, ServoyPublicServiceTestingImpl, ServoyPublicTestingModule, runOnPushChangeDetection } from '@servoy/public';
import { CustomRenderedComponentsCustomList } from './customlist.component';

describe('CustomRenderedComponentsCustomList', () => {
    let component: CustomRenderedComponentsCustomList;
    let componentRef: ComponentRef<CustomRenderedComponentsCustomList>;
    let fixture: ComponentFixture<CustomRenderedComponentsCustomList>;
    let servoyApi: ServoyApiTesting;

    beforeEach(async () => {
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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render list items from data input', async () => {
        const testData = [
            { dp1: 'Item 1', dp2: 'Desc 1' },
            { dp1: 'Item 2', dp2: 'Desc 2' }
        ];
        componentRef.setInput('data', testData);
        await runOnPushChangeDetection(fixture);

        const items = fixture.nativeElement.querySelectorAll('.list-item');
        expect(items.length).toBe(2);
    });

    it('should apply styleClass to the container', async () => {
        componentRef.setInput('data', []);
        componentRef.setInput('styleClass', 'my-custom-class');
        await runOnPushChangeDetection(fixture);

        const container = fixture.nativeElement.querySelector('.svy-extra-listcomponent');
        expect(container.classList.contains('my-custom-class')).toBe(true);
    });

    it('should apply selection class to selected index', async () => {
        const testData = [{ dp1: 'A' }, { dp1: 'B' }, { dp1: 'C' }];
        componentRef.setInput('data', testData);
        componentRef.setInput('selectionClass', 'selected');
        componentRef.setInput('selectedIndex', 1);
        await runOnPushChangeDetection(fixture);

        const items = fixture.nativeElement.querySelectorAll('.list-item');
        expect(items[1].classList.contains('selected')).toBe(true);
        expect(items[0].classList.contains('selected')).toBe(false);
    });

    it('should set markupId on container', async () => {
        componentRef.setInput('data', []);
        await runOnPushChangeDetection(fixture);

        const container = fixture.nativeElement.querySelector('.svy-extra-listcomponent');
        expect(container.id).toBe('testid');
    });

    it('should use entryRendererFunction when provided', async () => {
        const renderer = (entry: any, _index: number) => `<span class="custom">${entry.name}</span>`;
        componentRef.setInput('data', [{ name: 'Hello' }]);
        componentRef.setInput('entryRendererFunction', renderer);
        await runOnPushChangeDetection(fixture);

        const item = fixture.nativeElement.querySelector('.list-item');
        expect(item.querySelector('.custom')).toBeTruthy();
        expect(item.querySelector('.custom').textContent).toBe('Hello');
    });

    it('should invoke onClick handler on entry click', async () => {
        const clickSpy = vi.fn();
        const testData = [{ dp1: 'Clickable' }];
        componentRef.setInput('data', testData);
        componentRef.setInput('onClick', clickSpy);
        await runOnPushChangeDetection(fixture);

        const callSpy = vi.spyOn(servoyApi, 'callServerSideApi');
        const item = fixture.nativeElement.querySelector('.list-item');
        item.click();
        await runOnPushChangeDetection(fixture);

        expect(callSpy).toHaveBeenCalledWith('callMethod', expect.arrayContaining(['onClick']));
    });

    it('should invoke onRightClickMethodID on context menu', async () => {
        const rightClickSpy = vi.fn();
        const testData = [{ dp1: 'Right' }];
        componentRef.setInput('data', testData);
        componentRef.setInput('onRightClickMethodID', rightClickSpy);
        await runOnPushChangeDetection(fixture);

        const callSpy = vi.spyOn(servoyApi, 'callServerSideApi');
        const item = fixture.nativeElement.querySelector('.list-item');
        item.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
        await runOnPushChangeDetection(fixture);

        expect(callSpy).toHaveBeenCalledWith('callMethod', expect.arrayContaining(['onRightClickMethodID']));
    });

    it('should use entryStyleClassFunction for entry styling', async () => {
        const styleFn = (entry: any) => entry.cls;
        const testData = [{ dp1: 'A', cls: 'highlight' }];
        componentRef.setInput('data', testData);
        componentRef.setInput('entryStyleClassFunction', styleFn);
        await runOnPushChangeDetection(fixture);

        const item = fixture.nativeElement.querySelector('.list-item');
        expect(item.classList.contains('highlight')).toBe(true);
    });

    it('should use default renderer when no entryRendererFunction', async () => {
        const testData = [{ dp1: 'Value1', dp2: 'Value2' }];
        componentRef.setInput('data', testData);
        await runOnPushChangeDetection(fixture);

        const item = fixture.nativeElement.querySelector('.list-item');
        expect(item.innerHTML).toContain('Value1');
        expect(item.innerHTML).toContain('Value2');
    });

    it('should set data-idx attribute on each entry', async () => {
        const testData = [{ dp1: 'A' }, { dp1: 'B' }];
        componentRef.setInput('data', testData);
        await runOnPushChangeDetection(fixture);

        const items = fixture.nativeElement.querySelectorAll('.list-item');
        expect(items[0].getAttribute('data-idx')).toBe('0');
        expect(items[1].getAttribute('data-idx')).toBe('1');
    });

    it('should clear cache when data changes', async () => {
        const testData = [{ dp1: 'Old' }];
        componentRef.setInput('data', testData);
        await runOnPushChangeDetection(fixture);

        componentRef.setInput('data', [{ dp1: 'New' }]);
        component.svyOnChanges({ data: { currentValue: [{ dp1: 'New' }], previousValue: testData, firstChange: false, isFirstChange: () => false } });
        await runOnPushChangeDetection(fixture);

        const item = fixture.nativeElement.querySelector('.list-item');
        expect(item.innerHTML).toContain('New');
    });

    it('should handle layout style in responsive mode', async () => {
        vi.spyOn(servoyApi, 'isInAbsoluteLayout').mockReturnValue(false);
        componentRef.setInput('data', []);
        componentRef.setInput('responsiveHeight', 300);
        await runOnPushChangeDetection(fixture);

        const container = fixture.nativeElement.querySelector('.svy-extra-listcomponent');
        expect(container.style.position).toBe('relative');
        expect(container.style.height).toBe('300px');
    });
});
