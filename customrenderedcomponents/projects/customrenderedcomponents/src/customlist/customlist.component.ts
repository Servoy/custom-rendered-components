import { Component, Input, ChangeDetectionStrategy, Renderer2, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseList } from '../baselist.component';
import { SortableEvent } from 'sortablejs';
import { ServoyPublicService, TooltipService } from '@servoy/public';

@Component({
    selector: 'customrenderedcomponents-customlist',
    templateUrl: './customlist.html',
	styleUrls: ['./customlist.css'],
	encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomRenderedComponentsCustomList extends BaseList {
    @Input() selectedIndex: number;
    @Input() entryStyleClassFunction: (entry: any) => string;

	timeoutID: number;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, sanitizer: DomSanitizer, 
    	tooltipService: TooltipService, servoyService: ServoyPublicService) {
        super(renderer, cdRef, sanitizer,tooltipService,servoyService);
    }

    svyOnInit() {
        super.svyOnInit();
        this.initSortable(this.setData, this.onAdd, this.onRemove, this.sortEnd, 'shared-customlist');
    }

    public onEntryClick(entry: any, index: number, event: MouseEvent) {
        this.selectedIndex = index;
        if (this.onClick) {		
			if (this.onDoubleClickMethodID) {
				if (this.timeoutID) {
                	window.clearTimeout(this.timeoutID);
                    this.timeoutID = null;
                    // double click, do nothing will be done in sub classes
                } else {
    	            this.timeoutID = window.setTimeout(() => {
                    	this.timeoutID = null;
                    	this.onEntryClickHandler(entry, index, event);
                    }, 250);
                }
            } else {
            	this.onEntryClickHandler(entry, index, event);
            }
        }
    }
    
    private onEntryClickHandler(entry: any, index: number, event: MouseEvent) {
		const target = event.target as Element;
        const dataTarget = target.closest('[data-target]');
        let data: string;
        if (dataTarget) {
        	data = dataTarget.getAttribute('data-target');
        }
		this.servoyApi.callServerSideApi('callMethod', ['onClick', index, data, event]);
	}
    
    public onEntryRightClick(entry: any, index: number, event: MouseEvent) {
        if (this.onRightClickMethodID) {
			event.preventDefault();
			event.stopPropagation();
            const target = event.target as Element;
            const dataTarget = target.closest('[data-target]');
            let data: string;
            if (dataTarget) {
                data = dataTarget.getAttribute('data-target');
            }
			this.servoyApi.callServerSideApi('callMethod', ['onRightClickMethodID', index, data, event]);
        }
    }
    
    public onEntryDoubleClick(entry: any, index: number, event: Event) {
        if (this.onDoubleClickMethodID) {
            const target = event.target as Element;
            const dataTarget = target.closest('[data-target]');
            let data: string;
            if (dataTarget) {
                data = dataTarget.getAttribute('data-target');
            }
			this.servoyApi.callServerSideApi('callMethod', ['onDoubleClickMethodID', index, data, event]);
        }
    }

    public getEntryStyleClass(entry: any, index: number) {
        let cache = this.cache[index];
        if (!cache) {
            this.cache[index] = cache = {};
        }
        let result = cache.style;
        if (result === undefined && entry !== undefined) {
            result = '';
            if (this.entryStyleClassFunction) {
                result = this.entryStyleClassFunction(entry);
            }
            cache.style = result;
        }
        if (this.selectionClass && this.selectedIndex === index) {
            result += ' ' + this.selectionClass;
        }
        return result;
    }

    /**
     * @private
     * Store draggable data when dragEnabled=true
     *  */
    private setData = (dataTransfer: DataTransfer, dragEl: HTMLElement) => {

        let idx: string;
        let evtOldIndices = [];
        let dragElSelected: NodeListOf<Element> = null;
        if (this.dragSortableOptions && this.dragSortableOptions.multiDrag) {
            // when multiDrag enabled, find all selected elements. Are the one having the selected class equal to svyextra-listcomponent-dragselected
            dragElSelected = this.getNativeElement().querySelectorAll('.svyextra-listcomponent-dragselected');
            for (const node of dragElSelected) {
                idx = node.getAttribute('data-idx');
                evtOldIndices.push(idx);
            }
        }

        // get the idx of the selected element
        if (!dragElSelected || !dragElSelected.length) {
            idx = dragEl.getAttribute('data-idx');
            evtOldIndices = [idx];
        }

        const originalArray = this.data.concat([]);

        // get the record reference based on svyRowId
        const entries = [];
        for (const row of evtOldIndices) {
            const entry = originalArray[row];
            entries.push(entry);
        }

        dataTransfer.setData('entries', JSON.stringify(entries)); // `dataTransfer` object of HTML5 DragEvent
    };

    /**
     * @private
     * When item is dropped into list (MOVED or COPIED)
     *  */
    private onAdd = (evt: SortableEvent) => {

        // get the dragged data from the DataTransfer object (see setData)
        const event = evt as any;
        const entries = JSON.parse(event.originalEvent.dataTransfer.getData('entries'));

        const evtOldIndices = (evt.oldIndicies.length ? evt.oldIndicies : null) || [{ index: evt.oldIndex }];
        const evtNewIndices = (evt.newIndicies.length ? evt.newIndicies : null) || [{ index: evt.newIndex }];
        const oldIndicies = [];
        const newIndicies = [];
        const entriesMovedTo = [];

        const originalArray = this.data.concat([]);

        for (let o = 0; o < evtNewIndices.length; o++) {
            // track old entries indexes (0-based)
            oldIndicies.push(evtOldIndices[o].index);

            // track new entries indexes (0-based)
            const newIdx = evtNewIndices[o].index;
            newIndicies.push(newIdx);
            entriesMovedTo.push(originalArray[newIdx]);
        }

        // add the entry into data
        for (let o = 0; o < newIndicies.length; o++) {
            this.data.splice(newIndicies[o], 0, entries[o]);
        }
        this.servoyApi.apply('data', this.data);

        let cloned = false;

        if (evt.pullMode === 'clone') {
            cloned = true;
        } else if (evt.pullMode === true) {
            cloned = false;
        }

        // if handler is available
        if (this.onDrop) {
            this.onDrop(evt, oldIndicies, newIndicies, entries, entriesMovedTo);
        }
        this.cdRef.detectChanges();
    };

    /**
     * @private
     * When item is dropped into list (MOVED or COPIED)
     *  */
    private onRemove = (evt: SortableEvent) => {

        const evtOldIndices = (evt.oldIndicies.length ? evt.oldIndicies : null) || [{ index: evt.oldIndex }];
        const oldIndicies = [];

        for (const row of evtOldIndices) {
            // track old entries indexes (0-based)
            oldIndicies.push(row.index);
        }

        let cloned = false;

        if (evt.pullMode === 'clone') {
            cloned = true;
        } else if (evt.pullMode === true) {
            cloned = false;

            // remove the entry from the list since has been moved to a different list
            for (const row of oldIndicies) {
                this.data.splice(row, 1);
            }
            this.servoyApi.apply('data', this.data);
        }
    };

    private sortEnd = (evt: SortableEvent) => {
        const evtOldIndices = (evt.oldIndicies.length ? evt.oldIndicies : null) || [{ index: evt.oldIndex }];
        const evtNewIndices = (evt.newIndicies.length ? evt.newIndicies : null) || [{ index: evt.newIndex }];
        const oldIndicies = [];
        const newIndicies = [];
        const oldEntries = [];
        const newEntries = [];

        const originalArray = this.data.concat([]);

        for (let o = 0; o < evtOldIndices.length; o++) {
            const oldItem = originalArray[evtOldIndices[o].index];
            const newItem = originalArray[evt.newIndex];

            //reorder the data
            this.data.splice(originalArray.indexOf(oldItem), 1);
            this.data.splice(originalArray.indexOf(newItem), 0, oldItem);

            oldIndicies.push(evtOldIndices[o].index);
            newIndicies.push(evtNewIndices[o].index);
            newEntries.push(newItem);
            oldEntries.push(oldItem);
        }

        this.servoyApi.apply('data', this.data);
        this.onSortEnd(evt, oldIndicies, newIndicies, oldEntries, newEntries);
    };
}
