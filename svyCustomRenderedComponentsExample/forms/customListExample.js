/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A3A3FD00-2C3B-4AF3-AC9E-029430577A19"}
 */
function onLoad(event) {
	//get the method code from the renderEntry function below and assign it to the list
	var renderFunction = scopes.svySystem.printMethodCode(renderEntry).join("\n");
	elements.customlist.entryRendererFunction = renderFunction;
	//get the method code from the rowStyleClass function below and assign it to the list
	var styleClassFunction = scopes.svySystem.printMethodCode(rowStyleClass).join("\n");
	elements.customlist.entryStyleClassFunction = styleClassFunction;
	//set entries from query
	setListEntries();
}

/**
 * Creates the entries shown in the list from a dataset
 * @private 
 * @properties={typeid:24,uuid:"604AFCE0-E80A-4C30-B16F-F2AE476E2E31"}
 */
function setListEntries() {
	var q = datasources.db.example_data.products.createSelect();
	q.result.add(q.columns.productname);
	q.result.add(q.columns.unitsinstock);
	q.result.add(q.columns.unitprice);
	q.result.add(q.columns.discontinued);
	var ds = databaseManager.getDataSetByQuery(q, -1);
	
	var entries = [];
	for (var i = 1; i <= ds.getMaxRowIndex(); i++) {
		var row = ds.getRowAsArray(i);
		var entry = {
			productname: row[0],
			unitsinstock: row[1],
			unitprice: utils.numberFormat(row[2], '#,##0.00'),
			discontinued: row[3]
		}
		entries.push(entry);
	}
	
	elements.customlist.setEntries(entries);
}

/**
 * To allow to easily write the renderer Function in Servoy, the example attaches the function to the list in the onLoad of this form
 * 
 * @private 
 * @param entry
 *
 * @properties={typeid:24,uuid:"E99C2C5F-7748-4FF8-9221-AEDE19773B52"}
 */
function renderEntry(entry) {
	var template = '<div class="product-row">';
	template += '<div class="product" data-target="product-name">' + entry.productname + '</div>';
	template += '<div class="product-unitsinstock" data-target="unitsinstock">' + entry.unitsinstock + '&nbsp;&nbsp;<i class="fas fa-layer-group fa-lg"></i></div>';
	template += '<div class="product-unitprice" data-target="unitprice">' + entry.unitprice + '&nbsp;&nbsp;<i class="fas fa-tag fa-lg"></i></div>';
	template += '<div class="product-discontinued">' + (entry.discontinued !== 0 ? '<i class="fas fa-ban fa-lg"></i>' : '') + '</div>';
	template += '</div>';
	return template;
}

/**
 * To allow to easily write the (row) style class Function in Servoy, the example attaches the function to the list in the onLoad of this form
 * 
 * @param entry
 * 
 * @private 
 *
 * @properties={typeid:24,uuid:"7D45B3EB-2C21-4EB6-9DC3-E565C67929A7"}
 */
function rowStyleClass(entry)
{
	var classes = [];
	if (entry.discontinued !== 0) {
		classes.push('discontinued');
	}
	if (entry.unitsinstock < 10) {
		classes.push(('stock-critical'));
	} else if (entry.unitsinstock < 20) {
		classes.push(('stock-low'));		
	} else {
		classes.push(('stock-ok'));				
	}
	return classes.join(' ');
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
 * @properties={typeid:24,uuid:"D8EFAD3B-B94D-4FF2-A01C-A232BD7CF8E8"}
 */
function onClick(record, foundSetIndex, dataTarget, event) {
	plugins.dialogs.showInfoDialog('Dialog title', 'You clicked on product "' + record.productname + '", click (data) target "' + dataTarget + '"', 'OK');
}