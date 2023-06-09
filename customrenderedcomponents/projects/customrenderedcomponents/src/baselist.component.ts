import { ChangeDetectorRef, Directive, Input, Renderer2, SecurityContext, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ServoyBaseComponent } from '@servoy/public';
import { SortableOptions } from './sortableoptions';
import Sortable, { Options, SortableEvent } from 'sortablejs';

@Directive()
export class BaseList extends ServoyBaseComponent<HTMLDivElement> {
    @Input() data: Array<any>;
    @Input() entryRendererFunction: (entry: any, index: number) => string;
    @Input() responsiveHeight: number;
    @Input() responsiveDynamicHeight: boolean;
    @Input() styleClass: string;
    @Input() selectionClass: string;
    @Input() enabled: boolean;
    @Input() tooltipFunction: () => void;
    @Input() showAs: string;
    @Input() dragEnabled: boolean;
    @Input() dropEnabled: boolean;
    @Input() sortableEnabled: boolean;
    @Input() dragSortableOptions: SortableOptions;

    @Input() onClick: (entry: any, index: number, dataTarget: string, event: Event) => void;
    @Input() onSortEnd: (event: Event, oldIndicies: Array<number>, newIndicies: Array<number>, entriesMoved: Array<any>, entriesMovedTo: Array<any>) => void;
    @Input() onDrop: (event: Event, oldIndicies: Array<number>, newIndicies: Array<number>, entriesMoved: Array<any>, entriesMovedTo: Array<any>) => Promise<any>;

    protected cache: Array<{ html?: SafeHtml; style?: string }> = [];

    private sortableObj: Sortable;
    private layoutStyle: { position?: string; maxHeight?: string; height?: string } = {};

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private sanitizer: DomSanitizer) {
        super(renderer, cdRef);
    }

    // api
    /**
     * Adds the given style class to all items in the list's children that match the selector.
     * Note that tag selectors are not supported.
     *
     * @param String selector
     * @param String styleClass
     */
    public addStyleClassForSelector(selector: string, styleClass: string) {
        const list = this.getNativeElement().querySelectorAll(selector);
        list.forEach(element => element.classList.add(styleClass));
    }

    /**
     * Removes the given style class from all items in the list's children that match the selector.
     * Note that tag selectors are not supported.
     *
     * @param String selector
     * @param String styleClass
     */
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

    public getLayoutStyle() {
        if (!this.servoyApi.isInAbsoluteLayout()) {
            this.layoutStyle.position = 'relative';
            if (this.responsiveDynamicHeight) {
                if (this.responsiveHeight > 0) {
                    this.layoutStyle.maxHeight = this.responsiveHeight + 'px';
                }
            } else {
                if (this.responsiveHeight === 0) {
                    //                 $element.css("height", "100%");
                    this.layoutStyle.height = 100 + '%';
                } else {
                    this.layoutStyle.height = this.responsiveHeight + 'px';
                }
            }
        }
        return this.layoutStyle;
    }

    public getEntryRenderer(entry: any, index: number) {
        if (this.entryRendererFunction) {
            let cache = this.cache[index];
            if (!cache) {
                this.cache[index] = cache = {};
            }
            let html = cache.html;
            if (html === undefined) {
                html = this.sanitizer.bypassSecurityTrustHtml(this.entryRendererFunction(entry, index));
                cache.html = html;
            }
            return html;
        }
        return this.sanitizer.bypassSecurityTrustHtml(this.defaultRenderer(entry, index));
    }
    
    public defaultRenderer(entry: any, index: number) {
		var template = '<div>';
		for (var prop in entry) {
			if (prop.indexOf('dp') === 0) {
				template += '<div data-target="' + prop + '" innerHTML="entry.' + prop + '">'+entry[prop]+'</div>';
			}
		}
		template += '</div>';
		return template;
	}

    public getSanitizedData(entry: any) {
        // return it as is
        if (this.isTrustedHTML()) {
            // avoid cycling the object if trusted
            return entry;
        }

        let data = {};
        if ((typeof entry) === 'string') {
            // if is a string sanitize the string
            if (this.isTrustedHTML()) {
                data = this.sanitizer.bypassSecurityTrustHtml(entry);
            } else {
                data = this.sanitizer.sanitize(SecurityContext.HTML, entry);
            }
        } else if ((typeof entry) === 'object' || entry instanceof Array) {
            // sanitize items of entry
            // eslint-disable-next-line guard-for-in
            for (const dp in entry) {
                let entryValue = entry[dp];
                if (entryValue === null || entryValue === undefined) {
                    data[dp] = entryValue;
                } else if (entryValue instanceof Array) {
                    // handle arrays
                    // eslint-disable-next-line guard-for-in
                    for (const i in entryValue) {
                        entryValue[i] = this.getSanitizedData(entryValue[i]);
                    }
                    data[dp] = entryValue;
                } else if ((typeof entryValue) === 'object') {
                    // nested object
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
            // if is a number or boolean
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

        /* Enable Sorting */
        if (this.dragEnabled || this.dropEnabled || this.sortableEnabled) {
            const sortOptions = this.dragSortableOptions || {} as SortableOptions;
            const opts: Options = {};

            /** Drag Options */
            opts.sort = this.sortableEnabled;

            opts.group = {
                name: '',
                pull: this.dragEnabled, // can drag into other lists
                put: this.dropEnabled, // can drop from other lists
            };

            // copy data upon drag
            if (this.dragEnabled) {
                opts.setData = setData;
            }

            // group name
            if (this.dragEnabled || this.dropEnabled) {
                opts.group.name = sortOptions.group || groupName;;
            }

            // if drag type is copy
            if (this.dragEnabled && sortOptions.dragType === 'COPY') {
                opts.group.pull = 'clone';
            }

            /** Common options */
            if (sortOptions.handle) opts.handle = sortOptions.handle;
            if (sortOptions.animation) opts.animation = sortOptions.animation;
            if (sortOptions.selectedClass) opts.selectedClass = sortOptions.selectedClass;

            /** Enable Multi Drag */
            if (sortOptions.multiDrag) {
                opts.multiDrag = true;
                opts.selectedClass = 'svyextra-listcomponent-dragselected';
                if (sortOptions.multiDragKey) opts.multiDragKey = sortOptions.multiDragKey;
            }

            /** Events */
            if (this.onDrop) {
                opts.onAdd = onAdd;
                opts.onRemove = onRemove;
            }

            if (this.onSortEnd) {
                opts.onEnd = onSortEnd;
            }

            if (this.sortableObj) {
                this.sortableObj.destroy();
            }
            this.sortableObj = Sortable.create(this.getNativeElement(), opts);
        }
    }

    private isTrustedHTML() {
        if (this.servoyApi.trustAsHtml() || this.showAs === 'trusted_html') {
            return true;
        }
        return false;
    }
}
