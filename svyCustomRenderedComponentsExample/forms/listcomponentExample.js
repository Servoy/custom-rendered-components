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
	var renderFunction = "(" + scopes.svySystem.printMethodCode(renderEntry).join("") + ")";
	
	elements.listcomponent.entryRendererFunc = renderFunction;
}

/**
 * TODO generated, please specify type and doc for the params
 * @protected
 * @param entry
 *
 * @properties={typeid:24,uuid:"0F7BDB02-6E55-429D-8C9E-FC8FBE72A51B"}
 */
function renderEntry(entry) {
	// TODO build a nicer template
	var template = '<div>';
	template += '<i class="pull-right fa fa-tag" data-target="icon"></i>';
	for (var prop in entry) {
		if (prop.indexOf("dp") === 0) {
			template += '<div class="feed-subject" data-target="' + prop + '">' + entry[prop] + '</div>';
		}
	}
	template += '</div>';
	template + '<hr/>'
	return template;
		
	return template;
}
/**
 * Called when the mouse is clicked on a list entry.
 *
 * @param {object} entry
 * @param {Number} index
 * @param {string} dataTarget
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"21510734-141C-4E3B-ACEF-511EF9F3B4A7"}
 */
function onClick(entry, index, dataTarget, event) {
	plugins.dialogs

}
