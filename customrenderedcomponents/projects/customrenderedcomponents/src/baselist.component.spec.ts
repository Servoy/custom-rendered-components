import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ServoyApiTesting, ServoyPublicService, ServoyPublicServiceTestingImpl, ServoyPublicTestingModule, TooltipService, runOnPushChangeDetection } from '@servoy/public';
import { CustomRenderedComponentsCustomList } from './customlist/customlist.component';

// Exercises the shared BaseList logic through the concrete CustomList subclass so the
// covered base-class lines only count once.
describe('BaseList (via CustomList)', () => {
    let component: CustomRenderedComponentsCustomList;
    let componentRef: ComponentRef<CustomRenderedComponentsCustomList>;
    let fixture: ComponentFixture<CustomRenderedComponentsCustomList>;
    let servoyApi: ServoyApiTesting;
    let tooltipService: TooltipService;

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
        tooltipService = TestBed.inject(TooltipService);
    });

    describe('getLayoutStyle', () => {
        it('returns empty object in absolute layout', () => {
            vi.spyOn(servoyApi, 'isInAbsoluteLayout').mockReturnValue(true);
            expect(component.getLayoutStyle()).toEqual({});
        });

        it('sets relative position and fixed height in responsive mode', () => {
            vi.spyOn(servoyApi, 'isInAbsoluteLayout').mockReturnValue(false);
            componentRef.setInput('responsiveHeight', 400);
            const style = component.getLayoutStyle();
            expect(style.position).toBe('relative');
            expect(style.height).toBe('400px');
        });

        it('sets height 100% when responsiveHeight is 0', () => {
            vi.spyOn(servoyApi, 'isInAbsoluteLayout').mockReturnValue(false);
            componentRef.setInput('responsiveHeight', 0);
            const style = component.getLayoutStyle();
            expect(style.height).toBe('100%');
        });

        it('sets maxHeight when responsiveDynamicHeight is true', () => {
            vi.spyOn(servoyApi, 'isInAbsoluteLayout').mockReturnValue(false);
            componentRef.setInput('responsiveDynamicHeight', true);
            componentRef.setInput('responsiveHeight', 250);
            const style = component.getLayoutStyle();
            expect(style.maxHeight).toBe('250px');
        });

        it('leaves maxHeight unset when dynamic height is true but height <= 0', () => {
            vi.spyOn(servoyApi, 'isInAbsoluteLayout').mockReturnValue(false);
            componentRef.setInput('responsiveDynamicHeight', true);
            componentRef.setInput('responsiveHeight', 0);
            const style = component.getLayoutStyle();
            expect(style.maxHeight).toBeUndefined();
        });
    });

    describe('defaultRenderer', () => {
        it('renders a div per dp-prefixed property', () => {
            const html = component.defaultRenderer({ dp1: 'A', dp2: 'B', other: 'C' }, 0);
            expect(html).toContain('data-target="dp1"');
            expect(html).toContain('data-target="dp2"');
            expect(html).not.toContain('data-target="other"');
            expect(html).toContain('A');
            expect(html).toContain('B');
        });

        it('renders an empty wrapper for an entry without dp props', () => {
            const html = component.defaultRenderer({ foo: 'bar' }, 0);
            expect(html).toBe('<div></div>');
        });
    });

    describe('getEntryRenderer', () => {
        it('uses the entryRendererFunction when provided and caches the result', () => {
            const renderer = vi.fn((entry: any) => `<b>${entry.dp1}</b>`);
            componentRef.setInput('entryRendererFunction', renderer);
            const first = component.getEntryRenderer({ dp1: 'X' }, 0);
            const second = component.getEntryRenderer({ dp1: 'X' }, 0);
            expect(first).toBe(second);
            expect(renderer).toHaveBeenCalledTimes(1);
        });

        it('falls back to the default renderer when no function is set', () => {
            const sanitizer = TestBed.inject(DomSanitizer);
            const result: any = component.getEntryRenderer({ dp1: 'Hi' }, 0);
            const htmlString = sanitizer.sanitize(SecurityContext.HTML, result as any);
            expect(htmlString).toContain('Hi');
        });

        it('does not cache when the entry is undefined', () => {
            const renderer = vi.fn(() => '<b>x</b>');
            componentRef.setInput('entryRendererFunction', renderer);
            const result = component.getEntryRenderer(undefined, 0);
            expect(result).toBeUndefined();
            expect(renderer).not.toHaveBeenCalled();
        });
    });

    describe('getSanitizedData', () => {
        it('returns the raw entry when trusted HTML is on', () => {
            vi.spyOn(servoyApi, 'trustAsHtml').mockReturnValue(true);
            const entry = { dp1: '<b>bold</b>' };
            expect(component.getSanitizedData(entry)).toBe(entry);
        });

        it('sanitizes string properties when not trusted', () => {
            vi.spyOn(servoyApi, 'trustAsHtml').mockReturnValue(false);
            const result = component.getSanitizedData({ dp1: 'plain', dp2: '<script>x</script>safe' });
            expect(result.dp1).toBe('plain');
            expect(result.dp2).not.toContain('<script>');
        });

        it('passes through null and undefined property values', () => {
            vi.spyOn(servoyApi, 'trustAsHtml').mockReturnValue(false);
            const result = component.getSanitizedData({ dp1: null, dp2: undefined });
            expect(result.dp1).toBeNull();
            expect(result.dp2).toBeUndefined();
        });

        it('recurses into arrays of entries', () => {
            vi.spyOn(servoyApi, 'trustAsHtml').mockReturnValue(false);
            const result = component.getSanitizedData({ list: [{ dp1: 'a' }, { dp1: 'b' }] });
            expect(result.list.length).toBe(2);
            expect(result.list[0].dp1).toBe('a');
        });

        it('recurses into nested objects but keeps Date values intact', () => {
            vi.spyOn(servoyApi, 'trustAsHtml').mockReturnValue(false);
            const date = new Date(2020, 0, 1);
            const result = component.getSanitizedData({ nested: { dp1: 'x' }, when: date });
            expect(result.nested.dp1).toBe('x');
            expect(result.when).toBe(date);
        });

        it('keeps non-string primitive values as-is', () => {
            vi.spyOn(servoyApi, 'trustAsHtml').mockReturnValue(false);
            const result = component.getSanitizedData({ dp1: 42, dp2: true });
            expect(result.dp1).toBe(42);
            expect(result.dp2).toBe(true);
        });

        it('returns primitives that are not objects directly', () => {
            vi.spyOn(servoyApi, 'trustAsHtml').mockReturnValue(false);
            expect(component.getSanitizedData(123 as any)).toBe(123);
        });
    });

    describe('getSanitizedHtml', () => {
        it('sanitizes html when not trusted', () => {
            vi.spyOn(servoyApi, 'trustAsHtml').mockReturnValue(false);
            const result = component.getSanitizedHtml('<img src=x onerror=alert(1)>safe');
            expect(String(result)).not.toContain('onerror');
        });

        it('bypasses sanitization when showAs is trusted_html', () => {
            vi.spyOn(servoyApi, 'trustAsHtml').mockReturnValue(false);
            componentRef.setInput('showAs', 'trusted_html');
            const result: any = component.getSanitizedHtml('<b>ok</b>');
            const sanitizer = TestBed.inject(DomSanitizer);
            expect(sanitizer.sanitize(SecurityContext.HTML, result)).toContain('ok');
        });
    });

    describe('svyOnChanges cache clearing', () => {
        it('clears the cache when data changes', () => {
            (component as any).cache = [{ html: 'x' }];
            component.svyOnChanges({ data: { currentValue: [], previousValue: [], firstChange: false, isFirstChange: () => false } });
            expect((component as any).cache.length).toBe(0);
        });

        it('clears the cache when entryRendererFunction changes', () => {
            (component as any).cache = [{ html: 'x' }];
            component.svyOnChanges({ entryRendererFunction: { currentValue: () => '', previousValue: undefined, firstChange: true, isFirstChange: () => true } });
            expect((component as any).cache.length).toBe(0);
        });

        it('leaves the cache intact for unrelated changes', () => {
            (component as any).cache = [{ html: 'x' }];
            component.svyOnChanges({ styleClass: { currentValue: 'a', previousValue: 'b', firstChange: false, isFirstChange: () => false } });
            expect((component as any).cache.length).toBe(1);
        });
    });

    describe('style class selectors', () => {
        it('adds a style class to elements matched by a selector', async () => {
            componentRef.setInput('data', [{ dp1: 'A' }, { dp1: 'B' }]);
            await runOnPushChangeDetection(fixture);
            component.addStyleClassForSelector('.list-item', 'marked');
            const items = fixture.nativeElement.querySelectorAll('.list-item');
            expect(items[0].classList.contains('marked')).toBe(true);
            expect(items[1].classList.contains('marked')).toBe(true);
        });

        it('removes a style class from elements matched by a selector', async () => {
            componentRef.setInput('data', [{ dp1: 'A' }]);
            await runOnPushChangeDetection(fixture);
            component.addStyleClassForSelector('.list-item', 'marked');
            component.removeStyleClassForSelector('.list-item', 'marked');
            const item = fixture.nativeElement.querySelector('.list-item');
            expect(item.classList.contains('marked')).toBe(false);
        });
    });

    describe('showtooltip', () => {
        it('does nothing when no tooltipFunction is set', () => {
            const spy = vi.spyOn(tooltipService, 'showTooltip');
            const event = { target: document.createElement('div') } as unknown as MouseEvent;
            component.showtooltip(event, {});
            expect(spy).not.toHaveBeenCalled();
        });

        it('shows the tooltip for a data-target element', () => {
            componentRef.setInput('tooltipFunction', () => 'Tooltip text');
            const showSpy = vi.spyOn(tooltipService, 'showTooltip');
            const el = document.createElement('div');
            el.setAttribute('data-target', 'dp1');
            const inner = document.createElement('span');
            el.appendChild(inner);
            const event = { target: inner } as unknown as MouseEvent;
            component.showtooltip(event, { dp1: 'v' });
            expect(component.dataTarget).toBe('dp1');
            expect(showSpy).toHaveBeenCalled();
        });

        it('does not re-show the tooltip for the same data-target', () => {
            componentRef.setInput('tooltipFunction', () => 'Tooltip text');
            const el = document.createElement('div');
            el.setAttribute('data-target', 'dp1');
            component.dataTarget = 'dp1';
            const event = { target: el } as unknown as MouseEvent;
            const showSpy = vi.spyOn(tooltipService, 'showTooltip');
            component.showtooltip(event, { dp1: 'v' });
            expect(showSpy).not.toHaveBeenCalled();
        });

        it('hides the tooltip when there is no data-target element', () => {
            componentRef.setInput('tooltipFunction', () => 'Tooltip text');
            component.dataTarget = 'dp1';
            const hideSpy = vi.spyOn(tooltipService, 'hideTooltip');
            const event = { target: document.createElement('div') } as unknown as MouseEvent;
            component.showtooltip(event, {});
            expect(component.dataTarget).toBeNull();
            expect(hideSpy).toHaveBeenCalled();
        });

        it('does not show the tooltip when the function returns empty', () => {
            componentRef.setInput('tooltipFunction', () => '');
            const showSpy = vi.spyOn(tooltipService, 'showTooltip');
            const el = document.createElement('div');
            el.setAttribute('data-target', 'dp2');
            const event = { target: el } as unknown as MouseEvent;
            component.showtooltip(event, {});
            expect(showSpy).not.toHaveBeenCalled();
        });
    });
});
