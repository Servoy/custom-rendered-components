import { Component, Input, ChangeDetectionStrategy, Renderer2, ChangeDetectorRef, SimpleChanges, ViewEncapsulation, HostListener} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FoundsetChangeListener, IFoundset, ServoyPublicService, TooltipService } from '@servoy/public';
import { SortableEvent } from 'sortablejs';
import { BaseList } from '../baselist.component';

@Component({
    selector: 'customrenderedcomponents-foundsetlist',
    templateUrl: './foundsetlist.html',
    styleUrls: ['./foundsetlist.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CustomRenderedComponentsFoundsetList extends BaseList {


    @Input() foundset: IFoundset;
    @Input() entryStyleClassDataProvider: any;
    @Input() tooltipDataProvider: any;
    @Input() firstItemHtml: string;
    @Input() lastItemHtml: string;
    
    @Input() reverseOrder: boolean;

    @Input() onFirstItemClick: (event: Event, dataTarget: string) => void;
    @Input() onLastItemClick: (event: Event, dataTarget: string) => void;
    
    timeoutID: number;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, sanitizer: DomSanitizer, 
    	tooltipService: TooltipService, servoyService: ServoyPublicService) {
        super(renderer, cdRef, sanitizer,tooltipService,servoyService);
    }

    svyOnChanges(changes: SimpleChanges) {
        super.svyOnChanges(changes);
        if (changes.foundset) {
            if (this.servoyApi.isInDesigner()) return;
            
            if (changes.foundset.currentValue !== changes.foundset.previousValue) {
                // load data
                this.loadDataFromFoundset();
            }
            
            // addFoundsetListener
            this.foundset && this.foundset.addChangeListener(this.foundsetListener);
        }
        if (changes.reverseOrder) {
            if (changes.reverseOrder.currentValue) {
                this.renderer.addClass(this.elementRef.nativeElement, 'svy-extra-listcomponent-reverse');
            } else {
                this.renderer.removeClass(this.elementRef.nativeElement, 'svy-extra-listcomponent-reverse');
            }
        }
    }


    ngOnDestroy() {
        super.ngOnDestroy();
        if (this.foundset) this.foundset.removeChangeListener(this.foundsetListener);
    }
    
    loadingExtraRecords: boolean = false;

    onElementScroll($event) {
        // scroll
        const scrollParent = this.getNativeElement();
        const scrollTop = this.reverseOrder ? scrollParent.scrollTop * -1 : scrollParent.scrollTop;
        const scrollHeight = scrollParent.scrollHeight;
        const offsetHeight = scrollParent.offsetHeight;
        const scrollDiff = scrollHeight - scrollTop;
        const offsetDiff = scrollDiff - offsetHeight;

        if (!this.loadingExtraRecords && offsetDiff < 25 && this.hasMoreRows()) {
            this.loadingExtraRecords = true;
            this.foundset.loadExtraRecordsAsync(70, false).finally(() => this.loadingExtraRecords = false);
        }
    }
    
    private hasMoreRows(): boolean {
        if (this.foundset) {
            var viewPortLastIndex = this.foundset.viewPort.startIndex + this.foundset.viewPort.size;
            return this.foundset.hasMoreRows || viewPortLastIndex < this.foundset.serverSize;
        }
        return false;
    }

    public onEntryClick(index: number, event: MouseEvent) {
		
		let newSelection = [index];

        if (this.foundset && this.foundset.multiSelect === true && event.ctrlKey) {
            newSelection = this.foundset.selectedRowIndexes ? this.foundset.selectedRowIndexes.slice() : [];
            const idxInSelected = newSelection.indexOf(index);
            if (idxInSelected === -1) {
                newSelection.push(index);
            } else if (newSelection.length > 1) {
                newSelection.splice(idxInSelected, 1);
            }
        } else if (this.foundset && this.foundset.multiSelect === true && event.shiftKey) {
            let start = -1;
            if (this.foundset.selectedRowIndexes) {
                for (const j of this.foundset.selectedRowIndexes) {
                    if (start === -1 || start > j) {
                        start = j;
                    }
                }
            }
            let stop = index;
            if (start > index) {
                stop = start;
                start = index;
            }
            newSelection = [];
            for (let n = start; n <= stop; n++) {
                newSelection.push(n);
            }
        }

        if (this.foundset) {
            this.foundset.requestSelectionUpdate(newSelection);
        }
		
		// trigger click only if is not a double click
        if (this.onClick) {
			if (this.onDoubleClickMethodID) {
				if (this.timeoutID) {
                	window.clearTimeout(this.timeoutID);
                    this.timeoutID = null;
                    // double click, do nothing will be done in sub classes
                } else {
    	            this.timeoutID = window.setTimeout(() => {
                    	this.timeoutID = null;
                    	this.onEntryClickHandler(index, event);
                    }, 250);
                }
            } else {
            	this.onEntryClickHandler(index, event);
            }
        }
    }
    
    public onEntryClickHandler(index: number, event: MouseEvent) {
        if (this.onClick) {
            const target = event.target as Element;
            const dataTarget = target.closest('[data-target]');
            let data: string;
            if (dataTarget) {
                data = dataTarget.getAttribute('data-target');
            }
            const record = this.foundset.viewPort.rows[index];
            this.onClick(record, index + 1, data, event);
        }
    }
    
    public onEntryRightClick(index: number, event: MouseEvent) {
        if (this.onRightClickMethodID) {
			event.preventDefault();
			event.stopPropagation();
            const target = event.target as Element;
            const dataTarget = target.closest('[data-target]');
            let data: string;
            if (dataTarget) {
                data = dataTarget.getAttribute('data-target');
            }
            const record = this.foundset.viewPort.rows[index];
            this.onRightClickMethodID(record, index + 1, data, event);
        }
    }
    
    public onEntryDoubleClick(index: number, event: Event) {
        if (this.onDoubleClickMethodID) {
            const target = event.target as Element;
            const dataTarget = target.closest('[data-target]');
            let data: string;
            if (dataTarget) {
                data = dataTarget.getAttribute('data-target');
            }
            const record = this.foundset.viewPort.rows[index];
            this.onDoubleClickMethodID(record, index + 1, data, event);
        }
    }

    public onFirstItemClicked(event: MouseEvent) {
        if (this.onFirstItemClick) {
            const target = event.target as Element;
            const dataTarget = target.closest('[data-target]');
            let data: string;
            if (dataTarget) {
                data = dataTarget.getAttribute('data-target');
            }
            this.onFirstItemClick(event, data);
        }
    }

    public onLastItemClicked(event: MouseEvent) {
        if (this.onLastItemClick) {
            const target = event.target as Element;
            const dataTarget = target.closest('[data-target]');
            let data: string;
            if (dataTarget) {
                data = dataTarget.getAttribute('data-target');
            }
            this.onLastItemClick(event, data);
        }
    }

    public getTooltip(index: number) {
        if (index >= 0 && this.tooltipDataProvider && this.tooltipDataProvider[index] !== undefined) {
            return this.tooltipDataProvider[index];
        }
        return null;
    }

    public getEntryStyleClass(fsIndex: number, entry: any) {
        let cache = this.cache[fsIndex];
        if (!cache) {
            this.cache[fsIndex] = cache = {};
        }
        let result = cache.style;
        if (result === undefined) {
            result = '';
            if (this.entryStyleClassDataProvider) {
                result += this.entryStyleClassDataProvider[fsIndex];
            }
            cache.style = result;
        }
        if (this.selectionClass && this.foundset.selectedRowIndexes) {
            if (this.foundset.selectedRowIndexes.indexOf(fsIndex) !== -1) {
                result += ' ' + this.selectionClass;
            }
        }
        return result;
    }

    private foundsetListener: FoundsetChangeListener = (changes) => {
        // check to see what actually changed and update what is needed in browser
        if (changes.viewportRowsCompletelyChanged || changes.viewportRowsUpdated || changes.fullValueChanged || changes.serverFoundsetSizeChanged) {
            this.loadDataFromFoundset();
            this.cdRef.detectChanges();
        }
    };

    private loadDataFromFoundset() {
        if (this.foundset) {
            const data = [];
            for (const row of this.foundset.viewPort.rows) {
                const sanitizedRow = this.getSanitizedData(row);
                data.push(sanitizedRow);
            }
            this.data = data;

            // init the Sortable object
            this.initSortable(this.setData, this.onAdd, null, this.onSort, 'shared-foundsetlist');
            this.cache =  [];
        }
    }

    /**
     * @private
     * Store draggable data when dragEnabled=true
     *  */
    private setData = (dataTransfer: DataTransfer, dragEl: HTMLElement) => {

        let idx: number;
        let evtOldIndices = [];
        let dragElSelected: NodeListOf<Element> = null;
        if (this.dragSortableOptions && this.dragSortableOptions.multiDrag) {
            // when multiDrag enabled, find all selected elements. Are the one having the selected class equal to svyextra-listcomponent-dragselected
            dragElSelected = this.getNativeElement().querySelectorAll('.svyextra-listcomponent-dragselected');
            for (const element of dragElSelected) {
                idx = parseInt(element.getAttribute('data-idx'), 10);
                evtOldIndices.push(idx);
            }
        }

        // get the idx of the selected element
        if (!dragElSelected || !dragElSelected.length) {
            idx = parseInt(dragEl.getAttribute('data-idx'), 10);
            evtOldIndices = [idx];
        }

        // get the record reference based on svyRowId
        const records = [];
        for (const index of evtOldIndices) {
            const rowID = this.foundset.viewPort.rows[index]._svyRowId;
            const record = this.foundset.getRecordRefByRowID(rowID);
            records.push(record);
        }

        dataTransfer.setData('records', JSON.stringify(records)); // `dataTransfer` object of HTML5 DragEvent
    };

    /**
     * @private
     * When item is dropped into list (MOVED or COPIED)
     *  */
    private onAdd = (evt: SortableEvent) => {

        // get the dragged data from the DataTransfer object (see setData)
        const event = evt as any;
        const records = JSON.parse(event.originalEvent.dataTransfer.getData('records'));

        const evtOldIndices = (evt.oldIndicies.length ? evt.oldIndicies : null) || [{ index: evt.oldIndex }];
        const evtNewIndices = (evt.newIndicies.length ? evt.newIndicies : null) || [{ index: evt.newIndex }];
        const oldIndicies = [];
        const newIndicies = [];
        const recordsMovedTo = [];

        for (let o = 0; o < evtNewIndices.length; o++) {
            // track old foundset indexes (1-based)
            oldIndicies.push(evtOldIndices[o].index + 1);

            // track new foundset indexes (1-based)
            const newIdx = evtNewIndices[o].index;
            newIndicies.push(newIdx + 1);
            recordsMovedTo.push(this.foundset.viewPort.rows[newIdx]);
        }

        let cloned = false;

        if (evt.pullMode === 'clone') {
            cloned = true;
        } else if (evt.pullMode === true) {
            cloned = false;
        }

        // if handler is available
        if (this.onDrop) {
            this.onDrop(evt, oldIndicies, newIndicies, records, recordsMovedTo).then(() => {
                this.loadDataFromFoundset();
            });
        }
    };

    private onSort = (evt: SortableEvent) => {

        if (evt.pullMode === 'clone') {
            // TODO shall call an apply ?

        } else if (evt.pullMode === true) {
            // drag & drop
        } else { // change sort index

            const evtOldIndices = (evt.oldIndicies.length ? evt.oldIndicies : null) || [{ index: evt.oldIndex }];
            const evtNewIndices = (evt.newIndicies.length ? evt.newIndicies : null) || [{ index: evt.newIndex }];
            const oldIndicies = [];
            const newIndicies = [];
            const recordsMoved = [];
            const recordsMovedTo = [];

            for (let o = 0; o < evtOldIndices.length; o++) {
                oldIndicies.push(evtOldIndices[o].index + 1);
                recordsMoved.push(this.foundset.viewPort.rows[evtOldIndices[o].index]);
                newIndicies.push(evtNewIndices[o].index + 1);
                recordsMovedTo.push(this.foundset.viewPort.rows[evtNewIndices[o].index]);
            }

            if (this.onSortEnd) {
                this.onSortEnd(evt, oldIndicies, newIndicies, recordsMoved, recordsMovedTo);
            }
        }
    };

}



