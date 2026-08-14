import { Component, inject, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { BaseList } from '../baselist.component';
import { SortableEvent } from 'sortablejs';
import { JSEvent, EventLike } from '@servoy/public';

@Component({
    selector: 'customrenderedcomponents-customlist',
    templateUrl: './customlist.html',
    styleUrls: ['./customlist.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, NgStyle]
})
export class CustomRenderedComponentsCustomList extends BaseList {
    readonly selectedIndex = input<number>(undefined as any);
    readonly entryStyleClassFunction = input<(entry: any) => string>(undefined as any);

	timeoutID: number | null = null;

    constructor() {
        super();
    }

    svyOnInit() {
        super.svyOnInit();
        this.initSortable(this.setData, this.onAdd, this.onRemove, this.sortEnd, 'shared-customlist');
    }

    public onEntryClick(entry: any, index: number, event: MouseEvent) {
        if (this.onClick()) {		
			if (this.onDoubleClickMethodID()) {
				if (this.timeoutID) {
                	window.clearTimeout(this.timeoutID);
                    this.timeoutID = null;
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
        const data: string = dataTarget?.getAttribute('data-target') ?? '';

        const jsEvent: JSEvent = this.servoyService.createJSEvent( event  as EventLike, 'onEntryClick' );

		this.servoyApi().callServerSideApi('callMethod', ['onClick', index, data, jsEvent]);
	}
    
    public onEntryRightClick(entry: any, index: number, event: MouseEvent) {
        if (this.onRightClickMethodID()) {
			event.preventDefault();
			event.stopPropagation();
            const target = event.target as Element;
            const dataTarget = target.closest('[data-target]');
            const data: string = dataTarget?.getAttribute('data-target') ?? '';

            const jsEvent: JSEvent = this.servoyService.createJSEvent( event  as EventLike, 'onEntryRightClick' );

			this.servoyApi().callServerSideApi('callMethod', ['onRightClickMethodID', index, data, jsEvent]);
        }
    }
    
    public onEntryDoubleClick(entry: any, index: number, event: MouseEvent) {
        if (this.onDoubleClickMethodID()) {
            const target = event.target as Element;
            const dataTarget = target.closest('[data-target]');
            const data: string = dataTarget?.getAttribute('data-target') ?? '';

            const jsEvent: JSEvent = this.servoyService.createJSEvent( event  as EventLike, 'onEntryDoubleClick' );

			this.servoyApi().callServerSideApi('callMethod', ['onDoubleClickMethodID', index, data, jsEvent]);
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
            if (this.entryStyleClassFunction()) {
                result = this.entryStyleClassFunction()(entry);
            }
            cache.style = result;
        }
        if (this.selectionClass() && this.selectedIndex() === index) {
            result += ' ' + this.selectionClass();
        }
        return result;
    }

    private setData = (dataTransfer: DataTransfer, dragEl: HTMLElement) => {

        let idx: string;
        let evtOldIndices: any[] = [];
        let dragElSelected: NodeListOf<Element> | null = null;
        if (this.dragSortableOptions() && this.dragSortableOptions().multiDrag) {
            dragElSelected = this.getNativeElement().querySelectorAll('.svyextra-listcomponent-dragselected');
            for (const node of dragElSelected) {
                idx = node.getAttribute('data-idx') ?? '';
                evtOldIndices.push(idx);
            }
        }

        if (!dragElSelected || !dragElSelected.length) {
            idx = dragEl.getAttribute('data-idx') ?? '';
            evtOldIndices = [idx];
        }

        const originalArray = this.data().concat([]);

        const entries = [];
        for (const row of evtOldIndices) {
            const entry = originalArray[row];
            entries.push(entry);
        }

        dataTransfer.setData('entries', JSON.stringify(entries));
    };

    private onAdd = (evt: SortableEvent) => {

        const event = evt as any;
        const entries = JSON.parse(event.originalEvent.dataTransfer.getData('entries'));

        const evtOldIndices = (evt.oldIndicies.length ? evt.oldIndicies : null) || [{ index: evt.oldIndex }];
        const evtNewIndices = (evt.newIndicies.length ? evt.newIndicies : null) || [{ index: evt.newIndex }];
        const oldIndicies: number[] = [];
        const newIndicies: number[] = [];
        const entriesMovedTo: any[] = [];

        const originalArray = this.data().concat([]);

        for (let o = 0; o < evtNewIndices.length; o++) {
            oldIndicies.push(evtOldIndices[o].index!);

            const newIdx = evtNewIndices[o].index!;
            newIndicies.push(newIdx);
            entriesMovedTo.push(originalArray[newIdx]);
        }

        const currentData = this.data().concat([]);
        for (let o = 0; o < newIndicies.length; o++) {
            currentData.splice(newIndicies[o], 0, entries[o]);
        }
        this.servoyApi().apply('data', currentData);

        if (this.onDrop()) {
            this.onDrop()(evt, oldIndicies, newIndicies, entries, entriesMovedTo);
        }
        this.cdRef.detectChanges();
    };

    private onRemove = (evt: SortableEvent) => {

        const evtOldIndices = (evt.oldIndicies.length ? evt.oldIndicies : null) || [{ index: evt.oldIndex }];
        const oldIndicies: number[] = [];

        for (const row of evtOldIndices) {
            oldIndicies.push(row.index!);
        }

        if (evt.pullMode === true) {
            const currentData = this.data().concat([]);
            for (const row of oldIndicies) {
                currentData.splice(row, 1);
            }
            this.servoyApi().apply('data', currentData);
        }
    };

    private sortEnd = (evt: SortableEvent) => {
        const evtOldIndices = (evt.oldIndicies.length ? evt.oldIndicies : null) || [{ index: evt.oldIndex }];
        const evtNewIndices = (evt.newIndicies.length ? evt.newIndicies : null) || [{ index: evt.newIndex }];
        const oldIndicies: number[] = [];
        const newIndicies: number[] = [];
        const oldEntries: any[] = [];
        const newEntries: any[] = [];

        const originalArray = this.data().concat([]);
        const currentData = this.data().concat([]);

        for (let o = 0; o < evtOldIndices.length; o++) {
            const oldItem = originalArray[evtOldIndices[o].index!];
            const newItem = originalArray[evt.newIndex!];

            currentData.splice(originalArray.indexOf(oldItem), 1);
            currentData.splice(originalArray.indexOf(newItem), 0, oldItem);

            oldIndicies.push(evtOldIndices[o].index!);
            newIndicies.push(evtNewIndices[o].index!);
            newEntries.push(newItem);
            oldEntries.push(oldItem);
        }

        this.servoyApi().apply('data', currentData);
        this.onSortEnd()(evt, oldIndicies, newIndicies, oldEntries, newEntries);
    };
}
