/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7A58D1B3-F883-4D70-85F1-97D545090CB3",variableType:4}
 */
var cat1 = 1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"D7DE7D75-6D4B-4A4A-AE90-432E781E224D",variableType:4}
 */
var cat2 = 2;

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F35A7E6C-0D3D-4A62-8453-A98207A8D6D1"}
 */
function onLoad(event) {
	//get the method code from the renderEntry function below and assign it to the list
	var renderFunction = scopes.svySystem.printMethodCode(renderEntry).join("\n");
	elements.list1.entryRendererFunction = renderFunction;
	//get the method code from the rowStyleClass function below and assign it to the list
	var styleClassFunction = scopes.svySystem.printMethodCode(rowStyleClass).join("\n");
	elements.list1.entryStyleClassFunction = styleClassFunction;
	//set entries from query
	setListEntries();
	
	elements.list2.entryRendererFunction = renderFunction;
	elements.list2.entryStyleClassFunction = styleClassFunction;
	//set entries from query
	setListEntrie2s();
}

/**
 * Creates the entries shown in the list from a dataset
 * @private 
 * @properties={typeid:24,uuid:"C542BB2D-35DA-4E7E-B31B-056CE6B1AFA0"}
 */
function setListEntries() {
	var q = datasources.db.example_data.products.createSelect();
	q.where.add(q.columns.categoryid.eq(cat1))
	q.result.add(q.columns.productname);
	q.result.add(q.columns.unitsinstock);
	q.result.add(q.columns.unitprice);
	q.result.add(q.columns.discontinued);
	q.result.add(q.columns.productid);
	var ds = databaseManager.getDataSetByQuery(q, -1);
	
	var entries = [];
	for (var i = 1; i <= ds.getMaxRowIndex(); i++) {
		var row = ds.getRowAsArray(i);
		var entry = {
			productname: row[0],
			unitsinstock: row[1],
			unitprice: utils.numberFormat(row[2], '#,##0.00'),
			discontinued: row[3],
			productid: row[4]

		}
		entries.push(entry);
	}
	
	elements.list1.setEntries(entries);
}

/**
 * Creates the entries shown in the list from a dataset
 * @private 
 * @properties={typeid:24,uuid:"5887680C-EF07-4B1F-8F5C-1693D0CAB7DA"}
 */
function setListEntrie2s() {
	var q = datasources.db.example_data.products.createSelect();
	q.where.add(q.columns.categoryid.eq(cat2))
	q.result.add(q.columns.productname);
	q.result.add(q.columns.unitsinstock);
	q.result.add(q.columns.unitprice);
	q.result.add(q.columns.discontinued);
	q.result.add(q.columns.productid)
	var ds = databaseManager.getDataSetByQuery(q, -1);
	
	var entries = [];
	for (var i = 1; i <= ds.getMaxRowIndex(); i++) {
		var row = ds.getRowAsArray(i);
		var entry = {
			productname: row[0],
			unitsinstock: row[1],
			unitprice: utils.numberFormat(row[2], '#,##0.00'),
			discontinued: row[3],
			productid: row[4]
		}
		entries.push(entry);
	}
	
	elements.list2.setEntries(entries);
}

/**
 * To allow to easily write the renderer Function in Servoy, the example attaches the function to the list in the onLoad of this form
 * 
 * @private 
 * @param entry
 *
 * @properties={typeid:24,uuid:"DCC17FE1-8816-494D-A1A0-3ABCB57476DB"}
 */
function renderEntry(entry) {
	var template = '<div class="product-row">';
	template += '<div class="product" data-target="product-name" svy-tooltip="tooltipFunction(null, entry)">' + entry.productname + '</div>';
	template += '<div class="product-unitsinstock" data-target="unitsinstock" svy-tooltip="tooltipFunction(\'unitsinstock\')">' + entry.unitsinstock + '&nbsp;&nbsp;<i class="fas fa-layer-group fa-lg"></i></div>';
	template += '<div class="product-unitprice" data-target="unitprice" svy-tooltip="tooltipFunction(\'unitprice\')">' + entry.unitprice + '&nbsp;&nbsp;<i class="fas fa-tag fa-lg"></i></div>';
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
 * @properties={typeid:24,uuid:"F66E19F9-6485-4ABE-A476-8B9F36FED75E"}
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
 * @properties={typeid:24,uuid:"EBD7B036-9BD8-499A-9750-66EF8187B90D"}
 */
function onClick(record, foundSetIndex, dataTarget, event) {
	plugins.dialogs.showInfoDialog('Dialog title', 'You clicked on product "' + record.productname + '", click (data) target "' + dataTarget + '"', 'OK');
}

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"962E8E72-E819-48C1-B56B-95D8831D9B43"}
 */
function onDataChange(oldValue, newValue, event) {
	setListEntries()
	return true;
}

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"F50B23AE-84D7-4586-9C60-49E0AAEABB21"}
 */
function onDataChange2(oldValue, newValue, event) {
	setListEntrie2s()
	return true;
}

/**
 * @param {JSEvent} event
 * @param {Array<number>} oldIndicies
 * @param {Array<number>} newIndicies
 * @param {Array<object>} entriesMoved
 * @param {Array<object>} entriesMovedTo
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"241F0138-FC9F-45BD-8EFB-A1118E7AC39F"}
 */
function onDrop(event, oldIndicies, newIndicies, entriesMoved, entriesMovedTo) {
	application.output('ON DROP 1 --------------------');
	application.output(event.getElementName())
	application.output(oldIndicies)
	application.output(newIndicies);
	for (var i = 0; i < entriesMoved.length; i++) {
		application.output(entriesMoved[i])
	}
	application.output("***      ****");

	var fs = datasources.db.example_data.products.getFoundSet();

	for (i = 0; i < entriesMoved.length; i++) {
		application.output(entriesMoved[i])
		
		var query = datasources.db.example_data.products.createSelect();
		query.where.add(query.columns.productid.eq(entriesMoved[i].productid));
		
		fs.loadRecords(query);
		if (fs.getSize()) {
			fs.categoryid = cat1;
			databaseManager.saveData(fs);
		}
	}
}

/**
 * @param {JSEvent} event
 * @param {Array<number>} oldIndicies
 * @param {Array<number>} newIndicies
 * @param {Array<object>} oldEntries
 * @param {Array<object>} newEntries
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"26EEBA45-94AE-4D84-B758-608A3090C122"}
 */
function onSortEnd(event, oldIndicies, newIndicies, oldEntries, newEntries) {
	application.output('ON SORT 1 --------------------');
	application.output(event.getElementName())
	application.output(oldIndicies)
	application.output(newIndicies);
	for (var i = 0; i < oldEntries.length; i++) {
		application.output(oldEntries[i])
	}
	application.output("***      ****");

	for (i = 0; i < newEntries.length; i++) {
		application.output(newEntries[i])
	}
}

/**
 * @param {JSEvent} event
 * @param {Array<number>} oldIndicies
 * @param {Array<number>} newIndicies
 * @param {Array<object>} entriesMoved
 * @param {Array<object>} entriesMovedTo
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"83EF2FA7-C9E8-4C27-B349-ADB5B0CFEDCE"}
 */
function onDrop2(event, oldIndicies, newIndicies, entriesMoved, entriesMovedTo) {
	application.output('ON DROP 2 --------------------');
	application.output(event.getElementName())
	application.output(oldIndicies)
	application.output(newIndicies);
	for (var i = 0; i < entriesMovedTo.length; i++) {
		application.output(entriesMovedTo[i])
	}
	application.output("***      ****");

	var fs = datasources.db.example_data.products.getFoundSet();

	for (i = 0; i < entriesMoved.length; i++) {
		application.output(entriesMoved[i])
		
		var query = datasources.db.example_data.products.createSelect();
		query.where.add(query.columns.productid.eq(entriesMoved[i].productid));
		
		fs.loadRecords(query);
		if (fs.getSize()) {
			fs.categoryid = cat2;
			databaseManager.saveData(fs);
		}
	}
	
	
}

/**
 * @param {JSEvent} event
 * @param {Array<number>} oldIndicies
 * @param {Array<number>} newIndicies
 * @param {Array<object>} oldEntries
 * @param {Array<object>} newEntries
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"A8147619-6EAA-4D6B-902A-E0A33E01C011"}
 */
function onSortEnd2(event, oldIndicies, newIndicies, oldEntries, newEntries) {
	application.output('ON SORT 2 --------------------');
	application.output(event.getElementName())
	application.output(oldIndicies)
	application.output(newIndicies);
	for (var i = 0; i < oldEntries.length; i++) {
		application.output(oldEntries[i])
	}
	application.output("***      ****");

	for (i = 0; i < newEntries.length; i++) {
		application.output(newEntries[i])
	}
}

/**
 * Called when the mouse is clicked on a list entry.
 *
 * @param {JSRecord} record
 * @param {Number} foundSetIndex
 * @param {String} dataTarget
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4BF50AD8-CEB0-45EC-9B76-507AA11CA580"}
 */
function onClick1(record, foundSetIndex, dataTarget, event) {
	plugins.webnotificationsToastr.info('Click '  + record.productname)
}

/**
 * Called upon double click on a list entry.
 *
 * @param {JSRecord} record
 * @param {Number} foundSetIndex
 * @param {String} dataTarget
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"3F96A455-A9C3-472B-8999-875E09A78C6D"}
 */
function onDoubleClick(record, foundSetIndex, dataTarget, event) {
	plugins.webnotificationsToastr.error('Double Click ' + record.productname)
}

/**
 * Called upon right click on a list entry.
 *
 * @param {JSRecord} record
 * @param {Number} foundSetIndex
 * @param {String} dataTarget
 * @param {JSEvent} event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"AC9C0616-A1EF-4458-A131-7380F1E61459"}
 */
function onRightClick(record, foundSetIndex, dataTarget, event) {
	plugins.webnotificationsToastr.warning('Right Click '+ record.productname)
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"346467B0-5C4E-4E5E-97E0-70D9397CBA2D"}
 */
function onAction(event, dataTarget) {
	plugins.webnotificationsToastr.info('click')

}

/**
 * DoubleClick event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"DB2A4CA1-3FE6-402F-8961-235B5D96529F"}
 */
function onDoubleClick1(event, dataTarget) {
	plugins.webnotificationsToastr.error('DOUBLE click')

}
