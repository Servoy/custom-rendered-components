import { ChangeDetectorRef, Directive, inject, input, SecurityContext, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ServoyBaseComponent, ServoyPublicService, TooltipService } from '@servoy/public';
import { SortableOptions } from './sortableoptions';
import Sortable, { Options, SortableEvent } from 'sortablejs';

@Directive({ standalone: true })
export class BaseList extends ServoyBaseComponent<HTMLDivElement> {
    readonly data = input<Array<any>>(undefined as any);
    readonly entryRendererFunction = input<(entry: any, index: number) => string>(undefined as any);
    readonly responsiveHeight = input<number>(undefined as any);
    readonly responsiveDynamicHeight = input<boolean>(undefined as any);
    readonly styleClass = input<string>(undefined as any);
    readonly selectionClass = input<string>(undefined as any);
    readonly enabled = input<boolean>(undefined as any);
    readonly tooltipFunction = input<(dataTarget: string, entry: any) => string>(undefined as any);
    readonly showAs = input<string>(undefined as any);
    readonly dragEnabled = input<boolean>(undefined as any);
    readonly dropEnabled = input<boolean>(undefined as any);
    readonly sortableEnabled = input<boolean>(undefined as any);
    readonly dragSortableOptions = input<SortableOptions>(undefined as any);

    readonly onClick = input<(entry: any, index: number, dataTarget: string, event: Event) => void>(undefined as any);
    readonly onRightClickMethodID = input<(entry: any, index: number, dataTarget: string, event: Event) => void>(undefined as any);
    readonly onDoubleClickMethodID = input<(entry: any, index: number, dataTarget: string, event: Event) => void>(undefined as any);
    readonly onSortEnd = input<(event: Event, oldIndicies: Array<number>, newIndicies: Array<number>, entriesMoved: Array<any>, entriesMovedTo: Array<any>) => void>(undefined as any);
    readonly onDrop = input<(event: Event, oldIndicies: Array<number>, newIndicies: Array<number>, entriesMoved: Array<any>, entriesMovedTo: Array<any>) => Promise<any>>(undefined as any);

    protected cache: Array<{ html?: SafeHtml; style?: string }> = [];

    private sortableObj!: Sortable;
    private layoutStyle: { position?: string; maxHeight?: string; height?: string } = {};
    
    private initialDelay = 750;
    private dismissDelay = 5000;
    
    public dataTarget: string | null = null;

    private sanitizer = inject(DomSanitizer);
    private tooltipService = inject(TooltipService);
    protected servoyService = inject(ServoyPublicService);

    constructor() {
        super();
		this.initialDelay = this.servoyService.getUIProperty("tooltipInitialDelay");
        if (this.initialDelay === null || isNaN(this.initialDelay)) this.initialDelay = 750;
        this.dismissDelay = this.servoyService.getUIProperty("tooltipDismissDelay");
        if (this.dismissDelay === null || isNaN(this.dismissDelay)) this.dismissDelay = 5000;
    }

    public addStyleClassForSelector(selector: string, styleClass: string) {
        const list = this.getNativeElement().querySelectorAll(selector);
        list.forEach(element => element.classList.add(styleClass));
    }

    public removeStyleClassForSelector(selector: string, styleClass: string) {
        const list = this.getNativeElement().querySelectorAll(selector);
        list.forEach(element => element.classList.remove(styleClass));
    }

    public svyOnChanges(changes: SimpleChanges) {
        super.svyOnChanges(changes);
        if (changes.data || changes.entryRendererFunction) {
            this.cache = [];
        }
    }
    
    public showtooltip(event: MouseEvent, entry: any) {
		if (!this.tooltipFunction()) return;
        const element = (event.target as Element).closest('[data-target]');
        if (element) {
			const target = element.getAttribute('data-target');
			if (target == this.dataTarget) return;
            this.dataTarget = target;
            this.tooltipService.hideTooltip();
            const message = this.tooltipFunction()(this.dataTarget!, entry);
            if (message) this.tooltipService.showTooltip(event, message, this.initialDelay, this.dismissDelay);
        } else {
            this.dataTarget = null;
            this.tooltipService.hideTooltip();
        }
    }

    public getLayoutStyle() {
        if (!this.servoyApi().isInAbsoluteLayout()) {
            this.layoutStyle.position = 'relative';
            if (this.responsiveDynamicHeight()) {
                if (this.responsiveHeight() > 0) {
                    this.layoutStyle.maxHeight = this.responsiveHeight() + 'px';
                }
            } else {
                if (this.responsiveHeight() === 0) {
                    this.layoutStyle.height = 100 + '%';
                } else {
                    this.layoutStyle.height = this.responsiveHeight() + 'px';
                }
            }
        }
        return this.layoutStyle;
    }

    public getEntryRenderer(entry: any, index: number) {
        if (this.entryRendererFunction()) {
            let cache = this.cache[index];
            if (!cache) {
                this.cache[index] = cache = {};
            }
            let html = cache.html;
            if (html === undefined && entry !== undefined) {
                html = this.sanitizer.bypassSecurityTrustHtml(this.entryRendererFunction()(entry, index));
                cache.html = html;
            }
            return html;
        }
        return this.sanitizer.bypassSecurityTrustHtml(this.defaultRenderer(entry, index));
    }
    
    public defaultRenderer(entry: any, index: number) {
		let template = '<div>';
		for (const prop in entry) {
			if (prop.indexOf('dp') === 0) {
				template += '<div data-target="' + prop + '" innerHTML="entry.' + prop + '">'+entry[prop]+'</div>';
			}
		}
		template += '</div>';
		return template;
	}

    public getSanitizedData(entry: any) {
        if (this.isTrustedHTML()) {
            return entry;
        }

        let data: any = {};
        if ((typeof entry) === 'string') {
            if (this.isTrustedHTML()) {
                data = this.sanitizer.bypassSecurityTrustHtml(entry);
            } else {
                data = this.sanitizer.sanitize(SecurityContext.HTML, entry);
            }
        } else if ((typeof entry) === 'object' || entry instanceof Array) {
            for (const dp in entry) {
                let entryValue = entry[dp];
                if (entryValue === null || entryValue === undefined) {
                    data[dp] = entryValue;
                } else if (entryValue instanceof Array) {
                    for (const i in entryValue) {
                        entryValue[i] = this.getSanitizedData(entryValue[i]);
                    }
                    data[dp] = entryValue;
                } else if ((typeof entryValue) === 'object' && !(entryValue instanceof Date)) {
                    entryValue = this.getSanitizedData(entryValue);
                    data[dp] = entryValue;
                } else if ((typeof entryValue) === 'string' && !this.isTrustedHTML()) {
                    data[dp] = this.sanitizer.sanitize(SecurityContext.HTML, entryValue);
                } else if ((typeof entryValue) === 'string') {
                    data[dp] = this.sanitizer.bypassSecurityTrustHtml(entryValue);
                } else {
                    data[dp] = entryValue;
                }
            }
        } else {
            data = entry;
        }
        return data;
    }

    public getSanitizedHtml(html: string) {
        if (!this.isTrustedHTML()) {
            return this.sanitizer.sanitize(SecurityContext.HTML, html);
        } else {
            return this.sanitizer.bypassSecurityTrustHtml(html);
        }
    }

    protected initSortable(setData: (dataTransfer: DataTransfer, draggedElement: HTMLElement) => void,
        onAdd: (event: SortableEvent) => void,
        onRemove: (event: SortableEvent) => void,
        onSortEnd: (event: SortableEvent) => void, groupName: string) {

        if (this.dragEnabled() || this.dropEnabled() || this.sortableEnabled()) {
            const sortOptions = this.dragSortableOptions() || {} as SortableOptions;
            const opts: Options = {};

            opts.sort = this.sortableEnabled();

            opts.group = {
                name: '',
                pull: this.dragEnabled(),
                put: this.dropEnabled(),
            };

            if (this.dragEnabled()) {
                opts.setData = setData;
            }

            if (this.dragEnabled() || this.dropEnabled()) {
                opts.group.name = sortOptions.group || groupName;
            }

            if (this.dragEnabled() && sortOptions.dragType === 'COPY') {
                opts.group.pull = 'clone';
            }

            if (sortOptions.handle) opts.handle = sortOptions.handle;
            if (sortOptions.animation) opts.animation = sortOptions.animation;
            if (sortOptions.selectedClass) opts.selectedClass = sortOptions.selectedClass;

            if (sortOptions.multiDrag) {
                opts.multiDrag = true;
                opts.selectedClass = 'svyextra-listcomponent-dragselected';
                if (sortOptions.multiDragKey) opts.multiDragKey = sortOptions.multiDragKey;
            }

            if (this.onDrop()) {
                opts.onAdd = onAdd;
                opts.onRemove = onRemove;
            }

            if (this.onSortEnd()) {
                opts.onEnd = onSortEnd;
            }

            if (this.sortableObj) {
                this.sortableObj.destroy();
            }
            this.sortableObj = Sortable.create(this.getNativeElement(), opts);
        }
    }

    private isTrustedHTML() {
        if (this.servoyApi().trustAsHtml() || this.showAs() === 'trusted_html') {
            return true;
        }
        return false;
    }
}
