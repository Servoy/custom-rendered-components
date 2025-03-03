var data;

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
 * When set to true, allows to drag entries into another Custom List element
 */
var dragEnabled;

/**
 * When set to true, allows to drop entries from another Custom List element
 */
var dropEnabled;

/**
 * When set to true, allows to reorder entries within the Custom List element using drag & drop
 */
var sortableEnabled;

/**
 * Customize options for the drag n'drop and sortable
 */
var dragSortableOptions;

var selectedIndex;



var handlers = {
    /**
     * Called when the mouse is clicked on a list entry
     * 
     * @param {Object} entry
     * @param {Number} index
     * @param {String} dataTarget
     * @param {JSEvent} event
     */
    onClick: function() {},

    /**
     * Called upon right click on a list entry
     * 
     * @param {Object} entry
     * @param {Number} index
     * @param {String} dataTarget
     * @param {JSEvent} event
     */
    onRightClickMethodID: function() {},

    /**
     * Called upon double click on a list entry
     * 
     * @param {Object} entry
     * @param {Number} index
     * @param {String} dataTarget
     * @param {JSEvent} event
     */
    onDoubleClickMethodID: function() {},

    /**
     * Called when Custom List entries are reordered by drag&drop.
     * 
     * @param {JSEvent} event the JSEvent for this element
     * @param {Array<Number>} oldIndicies the original indexes of the moved entries
     * @param {Array<Number>} newIndicies the new entries indexes
     * @param {Array<Object>} entriesMoved the entries sorted
     * @param {Array<Object>} entriesMovedTo the entries whom have been shifted upon sort end
     */
    onSortEnd: function() {},

    /**
     * Called when entries dragged from another Custom List are dropped into this Custom list element.
     * 
     * @param {JSEvent} event the JSEvent for this element
     * @param {Array<Number>} oldIndicies the original indexes, when drag started, of the dropped entries
     * @param {Array<Number>} newIndicies the new indexes of entries upon drop
     * @param {Array<Object>} entriesMoved the entries dragged and dropped
     * @param {Array<Object>} entriesMovedTo the entries whom have been shifted upon drop
     */
    onDrop: function() {}
};

/**
 * Creates a new entry in the Custom List and adds it to the `data` model.
 * If the `data` model is uninitialized, it initializes it as an empty array before adding the entry.
 * @return {Object} The newly created entry added to the `data` model.
 */
function newEntry() {
}

/**
 * Clears all entries from the Custom List by setting the `data` model to an empty array.
 * This effectively removes all items in the list.
 */
function clear() {
}

/**
 * Retrieves the total number of entries in the Custom List.
 * @return {Number} The number of entries in the `data` model. Returns 0 if the `data` model is not initialized.
 */
function getEntriesCount() {
}

/**
 * Retrieves a specific entry from the Custom List based on the given index.
 * @param {Number} index The 0-based index of the entry to retrieve.
 * @return {Object} The entry at the specified index, or null if the index is out of range or the `data` model is not initialized.
 */
function getEntry(index) {
}

/**
 * Removes a specific entry from the Custom List based on the given index.
 * @param {number} index The 0-based index of the entry to remove.
 * @return {boolean} Returns true if the entry was successfully removed, or false if the index is out of range or the `data` model is not initialized.
 */
function removeEntry(index) {
}

/**
 * Replaces the existing entries in the Custom List with the specified array of entries.
 * @param {Array<Object>} entries An array of objects representing the new set of entries for the `data` model.
 */
function setEntries(entries) {
}

/**
 * Adds the given style class to all items in the list's children that match the selector.
 * Note that tag selectors are not supported.
 *
 * @param {String} selector The CSS selector used to identify items in the list's children. Note: tag selectors are not supported.
 * @param {String} styleClass The style class to add to the matching items.
 */
function addStyleClassForSelector(selector, styleClass) {
}

/**
 * Removes the given style class from all items in the list's children that match the selector.
 * Note that tag selectors are not supported.
 *
 * @param {String} selector The CSS selector used to identify items in the list's children. Note: tag selectors are not supported.
 * @param {String} styleClass The style class to remove from the matching items.
 */
function removeStyleClassForSelector(selector, styleClass) {
}