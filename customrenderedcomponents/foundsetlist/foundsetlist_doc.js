/**
 * A Custom List Component that displays a foundset of records with custom rendering, drag & drop sorting, and HTML customization.
 */

/**
 * A client-side function used to render each entry in the list.
 */
var entryRendererFunction;

/**
 * Responsive height for the list component in pixels.
 */
var responsiveHeight;

/**
 * Flag indicating whether the list height adjusts dynamically based on its content.
 */
var responsiveDynamicHeight;

/**
 * CSS style classes applied to the list component.
 */
var styleClass;

/**
 * CSS style class applied to a selected list entry.
 */
var selectionClass;

/**
 * Flag indicating whether the list is enabled for user interaction.
 */
var enabled;

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

/**
 * Flag indicating whether the list component is visible.
 */
var visible;

/**
 * The foundset of records bound to this component.
 */
var foundset;

/**
 * Data provider used to determine the CSS style class for each list entry.
 */
var entryStyleClassDataProvider;

/**
 * Data provider used to determine the tooltip content for each list entry.
 */
var tooltipDataProvider;

/**
 * Optional HTML content to be displayed for the first item in the list.
 */
var firstItemHtml;

/**
 * Optional HTML content to be displayed for the last item in the list.
 */
var lastItemHtml;

/**
 * When true, the list displays records in reverse order.
 */
var reverseOrder;


var handlers = {
    /**
     * Called when the mouse is clicked on a list entry
     *
     * @param {JSRecord} record The record corresponding to the clicked entry.
     * @param {Number} foundSetIndex The index of the clicked entry in the foundset.
     * @param {String} dataTarget The data target identifier set in the entry renderer.
     * @param {JSEvent} event The event object associated with the click.
     */
    onClick: function() {},

    /**
     * Called upon right click on a list entry
     *
     * @param {JSRecord} record The record corresponding to the right-clicked entry.
     * @param {Number} foundSetIndex The index of the entry in the foundset.
     * @param {String} dataTarget The data target identifier set in the entry renderer.
     * @param {JSEvent} event The event object associated with the right-click.
     */
    onRightClickMethodID: function() {},

    /**
     * Called upon double click on a list entry
     *
     * @param {JSRecord} record The record corresponding to the double-clicked entry.
     * @param {Number} foundSetIndex The index of the entry in the foundset.
     * @param {String} dataTarget The data target identifier set in the entry renderer.
     * @param {JSEvent} event The event object associated with the double-click.
     */
    onDoubleClickMethodID: function() {},

    /**
     * Called when the mouse is clicked on the optional firstItemHtml
     *
     * @param {JSEvent} event The event object associated with the click.
     * @param {String} dataTarget The data target identifier defined in the entry renderer.
     */
    onFirstItemClick: function() {},

    /**
     * Called when the mouse is clicked on the optional lastItemHtml
     *
     * @param {JSEvent} event The event object associated with the click.
     * @param {String} dataTarget The data target identifier.
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


var svy_types = {

    /**
     * Configuration options for sortable behavior in the FoundSet List.
     */
    sortableOptions: {

        /**
         * When true, allows multiple records to be dragged simultaneously.
         */
        multiDrag: null,

        /**
         * The key used to enable multiple selection during drag (e.g. CTRL).
         */
        multiDragKey: null,

        /**
         * CSS style class used to define the drag handle.
         */
        handle: null,

        /**
         * Animation duration in milliseconds for drag transitions.
         */
        animation: null,

    }
}
