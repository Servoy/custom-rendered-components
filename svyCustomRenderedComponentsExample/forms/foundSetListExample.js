/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"09717D58-B9D4-45DD-B745-347D1B06261C"}
 */
function onLoad(event) {
	//get the method code from the renderEntry function below and assign it to the list
	var renderFunction = scopes.svySystem.printMethodCode(renderEntry).join("\n");
	elements.foundsetlist.entryRendererFunction = renderFunction;
}

/**
 * To allow to easily write the renderer Function in Servoy, the example attaches the function to the list in the onLoad of this form
 * @private 
 * @param entry
 *
 * @properties={typeid:24,uuid:"0F7BDB02-6E55-429D-8C9E-FC8FBE72A51B"}
 */
function renderEntry(entry) {
	var template = '<div class="product-row">';
	template += '<div class="product" data-target="product-name" svy-tooltip="tooltipFunction(null, entry)">' + entry.dp0 + '</div>';
	template += '<div class="product-unitsinstock" data-target="unitsinstock" svy-tooltip="tooltipFunction(\'unitsinstock\')">' + entry.dp1 + '&nbsp;&nbsp;<i class="fas fa-layer-group fa-lg"></i></div>';
	template += '<div class="product-unitprice" data-target="unitprice" svy-tooltip="tooltipFunction(\'unitprice\')">' + entry.dp2 + '&nbsp;&nbsp;<i class="fas fa-tag fa-lg"></i></div>';
	template += '<div class="product-discontinued">' + (entry.dp3 !== 0 ? '<i class="fas fa-ban fa-lg"></i>' : '') + '</div>';
	template += '</div>';
	return template;
}

/**
 * Called when the mouse is clicked on a list entry.
 *
 * @param {JSRecord<db:/example_data/products>} record
 * @param {Number} foundSetIndex
 * @param {string} dataTarget
 * @param {JSEvent} event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"074BAC57-1C04-4938-AA44-FB6B2D404F0E"}
 */
function onClick(record, foundSetIndex, dataTarget, event) {
	plugins.dialogs.showInfoDialog('Dialog title', 'You clicked on product "' + record.productname + '", click (data) target "' + dataTarget + '"', 'OK');
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"542428E0-472A-4AE8-8E3A-394887B12133"}
 */
function onRecordSelection(event) {
}
