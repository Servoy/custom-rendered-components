import { BaseCustomObject } from '@servoy/public';

export class SortableOptions extends BaseCustomObject {
    dragType: string;
    multiDrag: boolean;
    multiDragKey: null | undefined;
    group: string;
    handle: string;
    animation: number;
    selectedClass: string;

    getWatchedProperties() {
        return [];
    }
}
