var entryStyleClassFunc;

var entryStyleClassFunction;

var entryRendererFunc;

var entryRendererFunction;

var visible;

var foundset;

var responsiveHeight;

var responsiveDynamicHeight;

var styleClass;

var selectionClass;

/**
 * Option whether text is shown as sanitized html or trusted html (as is).
 */
var showAs;

var enabled;


var handlers = {
    /**
     * Called when the mouse is clicked on a list entry
     *
     * @param {Object} entry
     * @param {Number} index
     * @param {String} dataTarget
     * @param {JSEvent} event
     */
    onClick: function() {}
};

/**
 * Creates a new entry in the `data` model of the List Component. 
 * If the `data` model is not initialized, it will initialize it as an empty array before adding the entry.
 * This function can only be used when the `foundset` is set to `-none-`.
 *
 * @return {Object} The newly created entry added to the `data` model.
 */
function newEntry() {
}

/**
 * Clears all entries from the `data` model of the List Component by setting it to an empty array.
 * This function can only be used when the `foundset` is set to `-none-`.
 */
function clear() {
}

/**
 * Retrieves an entry from the `data` model of the List Component based on the provided index.
 * This function can only be used when the `foundset` is set to `-none-`.
 *
 * @param {Number} index The 0-based index of the entry to retrieve.
 * @return {Object|null} The entry at the specified index, or null if the index is out of range or the `data` model is not initialized.
 */
function getEntry(index) {
}

/**
 * Removes an entry from the `data` model of the List Component based on the provided index.
 * This function can only be used when the `foundset` is set to `-none-`.
 *
 * @param {Number} index The 0-based index of the entry to remove.
 * @return {Boolean} Returns true if the entry was successfully removed, or false if the index is out of range or the `data` model is not initialized.
 */
function removeEntry(index) {
}

/**
 * Replaces the existing entries in the `data` model of the List Component with the specified array of entries.
 * This function can only be used when the `foundset` is set to `-none-`.
 *
 * @param {Array<Object>} entries An array of objects representing the new set of entries for the `data` model.
 */
function setEntries(entries) {
}

/**
 * Retrieves the total number of entries in the `data` model of the List Component.
 * This function can only be used when the `foundset` is set to `-none-`.
 *
 * @return {Number} The number of entries in the `data` model. Returns 0 if the `data` model is not initialized.
 */
function getEntriesCount() {
}

/**
 * Adds a CSS style class to elements that match a specific selector within the List Component. 
 * This is delayed until the form containing the component is fully loaded.
 *
 * @param {String} selector The CSS selector for the target elements.
 * @param {String} styleClass The CSS class to add to the elements matching the selector.
 */
function addStyleClassForSelector(selector, styleClass) {
}

/**
 * Removes a CSS style class from elements that match a specific selector within the List Component. 
 * This is delayed until the form containing the component is fully loaded.
 *
 * @param {String} selector The CSS selector for the target elements.
 * @param {String} styleClass The CSS class to remove from the elements matching the selector.
 */
function removeStyleClassForSelector(selector, styleClass) {
}