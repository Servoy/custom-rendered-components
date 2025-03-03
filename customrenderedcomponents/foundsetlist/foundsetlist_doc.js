var styleClass;

/**
 * This is a client side function that gets 2 arguments: first is the data-target (this should be set in the entry renderer) and second is the entry of the data
 */
var tooltipFunction;

/**
 * Option whether text is shown as sanitized html or trusted html (as is).
 */
var showAs;

/**
 * When set to true, allows to drag records into another FoundSet List element
 */
var dragEnabled;

/**
 * When set to true, allows to drop records from another FoundSet List element
 */
var dropEnabled;

/**
 * When set to true, allows to reorder records within the FoundSet List element using drag & drop
 */
var sortableEnabled;

/**
 * Customize options for the drag n'drop and sortable
 */
var dragSortableOptions;



var handlers = {
    /**
     * Called when the mouse is clicked on a list entry
     * 
     * @param {JSRecord} record
     * @param {Number} foundSetIndex
     * @param {String} dataTarget
     * @param {JSEvent} event
     */
    onClick: function() {},

    /**
     * Called upon right click on a list entry
     * 
     * @param {JSRecord} record
     * @param {Number} foundSetIndex
     * @param {String} dataTarget
     * @param {JSEvent} event
     */
    onRightClickMethodID: function() {},

    /**
     * Called upon double click on a list entry
     * 
     * @param {JSRecord} record
     * @param {Number} foundSetIndex
     * @param {String} dataTarget
     * @param {JSEvent} event
     */
    onDoubleClickMethodID: function() {},

    /**
     * Called when the mouse is clicked on the optional firstItemHtml
     * 
     * @param {JSEvent} event
     * @param {String} dataTarget
     */
    onFirstItemClick: function() {},

    /**
     * Called when the mouse is clicked on the optional lastItemHtml
     * 
     * @param {JSEvent} event
     * @param {String} dataTarget
     */
    onLastItemClick: function() {},

    /**
     * Called when FoundSet List records are reordered by drag&drop. You are responsible to persist the changes for the affected records. Make sure to persist any change for the affected record and call loadRecords for the affected foundsets. If you don't the FoundSet List may get into an incosistent state
     * 
     * @param {JSEvent} event the JSEvent for this element
     * @param {Array<Number>} oldIndicies the original indexes of the moved records
     * @param {Array<Number>} newIndicies the new record indexes
     * @param {Array<JSRecord>} recordsMoved the records sorted
     * @param {Array<JSRecord>} recordsMovedTo the records whom have been shifted upon sort end
     */
    onSortEnd: function() {},

    /**
     * Called when records dragged from another FoundSet List are dropped into this FoundSet list element. You are responsible to persist the changes for the affected records. Make sure to persist any change for the affected record and call loadRecords for the affected foundsets. If you don't the FoundSet List may go into an incosistent state.
     * 
     * @param {JSEvent} event the JSEvent for this element
     * @param {Array<Number>} oldIndicies the original indexes, when drag started, of the dropped records
     * @param {Array<Number>} newIndicies the new indexes of records upon drop
     * @param {Array<JSRecord>} recordsMoved the records dragged and dropped
     * @param {Array<JSRecord>} recordsMovedTo the records whom have been shifted upon drop
     */
    onDrop: function() {}
};

/**
 * Adds the given style class to all items in the list's children that match the selector.
 * Note that tag selectors are not supported.
 *
 * @param {String} selector The CSS selector used to identify items in the list's children.
 * @param {String} styleClass The style class to add to or remove from the matching items.
 */
function addStyleClassForSelector(selector, styleClass) {
}

/**
 * Removes the given style class from all items in the list's children that match the selector.
 * Note that tag selectors are not supported.
 *
 * @param {String} selector The CSS selector used to identify items in the list's children.
 * @param {String} styleClass The style class to add to or remove from the matching items.
 */
function removeStyleClassForSelector(selector, styleClass) {
}				
