/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E05A6E79-EBAF-4C68-8B91-5AD7A4E8337C",variableType:4}
 */
var cat2 = 2;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F3C30911-2945-4834-95F5-B30213C22D09",variableType:4}
 */
var cat1 = 1;

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"24A6529E-9292-4CF3-A695-CC5DC3D45164"}
 */
function onShow(firstShow, event) {
	filterCat2();
	filterCat1();
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
 * @properties={typeid:24,uuid:"BCF54AD5-7E2A-4E88-9E0E-4A6789BB3626"}
 */
function onDataChangeCat1(oldValue, newValue, event) {
	filterCat1();
	return true;
}

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {boolean}
 *
 * @properties={typeid:24,uuid:"01338294-C803-4B99-9120-37AD2A207CF6"}
 */
function onDataChangeCat2(oldValue, newValue, event) {
	filterCat2();
	return true;
}

/**
 * @properties={typeid:24,uuid:"0336562E-32CB-4B4F-B9E3-6A02CC13C9D3"}
 */
function filterCat1() {
	var fs = elements.list1.foundset.foundset;
	var q = datasources.db.example_data.products.createSelect();
	q.where.add(q.columns.categoryid.eq(cat1));
	fs.loadRecords(q);
}

/**
 * @properties={typeid:24,uuid:"6403AAEB-B3DA-438E-A78D-07657A2FC665"}
 */
function filterCat2() {
	var fs = elements.list2.foundset.foundset;
	var q = datasources.db.example_data.products.createSelect();
	q.where.add(q.columns.categoryid.eq(cat2));
	fs.loadRecords(q);
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"C461FAB1-65D0-4D6E-AB2E-6F3457260290"}
 */
function onLoad(event) {
	//get the method code from the renderEntry function below and assign it to the list
	var renderFunction = scopes.svySystem.printMethodCode(renderEntry).join("\n");
	elements.list1.entryRendererFunction = renderFunction;
	elements.list2.entryRendererFunction = renderFunction;
}

/**
 * To allow to easily write the renderer Function in Servoy, the example attaches the function to the list in the onLoad of this form
 * @private
 * @param entry
 *
 * @properties={typeid:24,uuid:"4997DD36-8C64-4E33-B9C7-8752E31AE73B"}
 */
function renderEntry(entry) {
	var template = '<div class="product-row">';
	template += '<div class="product" data-target="product-name" svy-tooltip="tooltipFunction(null, entry)">' + entry.dp4 + ' ' + entry.dp0 + '</div>';
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
 * @properties={typeid:24,uuid:"F507E907-1B6D-4ACF-8C03-DB869BC4A9AF"}
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
 * @properties={typeid:24,uuid:"7E426AE0-F7C8-467C-881D-EDB73DE69802"}
 */
function onRecordSelection(event) { }

/**
 * @param {JSEvent} event
 * @param {Array<number>} oldIndicies
 * @param {Array<number>} newIndicies
 * @param {Array<record>} recordsMoved
 * @param {Array<record>} recordsMovedTo
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"9CFE2313-1924-4A07-ABB1-2F886444ACB8"}
 */
function onSortEnd(event, oldIndicies, newIndicies, recordsMoved, recordsMovedTo) {
	application.output('ON SORT *************************');

	// TODO Auto-generated method stub
	application.output(oldIndicies)
	application.output(newIndicies)
	for (var i = 0; i < recordsMoved.length; i++) {
		application.output(recordsMoved[i])
	}
	application.output("***      ****")

	for (i = 0; i < recordsMovedTo.length; i++) {
		application.output(recordsMovedTo[i])
	}
}

/**
 * @param {JSEvent} event
 * @param {Array<number>} oldIndicies
 * @param {Array<number>} newIndicies
 * @param {Array<JSRecord<db:/example_data/products>>} recordsMoved
 * @param {Array<JSRecord<db:/example_data/products>>} recordsMovedTo
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"651C797C-3F5F-4A60-87AA-75FC496543AD"}
 */
function onSortEnd2(event, oldIndicies, newIndicies, recordsMoved, recordsMovedTo) {
	application.output('ON SORT *************************');

	// TODO Auto-generated method stub
	application.output(oldIndicies)
	application.output(newIndicies)
	for (var i = 0; i < recordsMoved.length; i++) {
		application.output(recordsMoved[i])
	}
	application.output("***      ****")

	for (i = 0; i < recordsMovedTo.length; i++) {
		application.output(recordsMovedTo[i])
	}

}

/**
 * @param {JSEvent} event
 * @param {Array<number>} oldIndicies
 * @param {Array<number>} newIndicies
 * @param {Array<JSRecord<db:/example_data/products>>} recordsMoved
 * @param {Array<JSRecord<db:/example_data/products>>} recordsMovedTo
 * @param {boolean} cloned
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"C062E940-44C5-46E9-A271-568DB64F2C41"}
 */
function onDrop(event, oldIndicies, newIndicies, recordsMoved, recordsMovedTo, cloned) {
	application.output('ON DROP --------------------');
	application.output(event.getElementName())
//	application.output(eventFrom.getElementName()) // TODO how to get the event for a different element ?
	application.output(oldIndicies)
	application.output(newIndicies);
	for (var i = 0; i < recordsMoved.length; i++) {
		application.output(recordsMoved[i])
	}
	application.output("***      ****");

	for (i = 0; i < recordsMovedTo.length; i++) {
		application.output(recordsMovedTo[i])
	}

	var fs = elements.list2.foundset.foundset;

	for (var idx = 0; idx < recordsMoved.length; idx++) {
		var record = recordsMoved[idx];
		if (cloned) {
			var newRecord = fs.getRecord(fs.newRecord())
			databaseManager.copyMatchingFields(record, newRecord);
			newRecord.categoryid = cat2;
			databaseManager.saveData(newRecord);
		} else {
			record.categoryid = cat2;
			databaseManager.saveData(record);
		}
	}

	if (cloned) {
		filterCat2();
		filterCat1();
	} else {
		filterCat1();
		filterCat2();
	}

	//	filterCat1();
	//	filterCat2();
}

/**
 * @param {JSEvent} event
 * @param {JSEvent} eventFrom
 * @param {Array<number>} oldIndicies
 * @param {Array<number>} newIndicies
 * @param {Array<JSRecord<db:/example_data/products>>} recordsMoved
 * @param {Array<JSRecord<db:/example_data/products>>} recordsMovedTo
 * @param {boolean} cloned
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"FEAC62FA-10BF-401F-AF9B-6D57F63C7144"}
 */
function onDropList1(event, oldIndicies, newIndicies, recordsMoved, recordsMovedTo, cloned) {
	application.output('ON DROP --------------------');
	application.output(event.getElementName())
	application.output(oldIndicies)
	application.output(newIndicies);
	for (var i = 0; i < recordsMoved.length; i++) {
		application.output(recordsMoved[i])
	}
	application.output("***      ****");

	for (i = 0; i < recordsMovedTo.length; i++) {
		application.output(recordsMovedTo[i])
	}

	var fs = elements.list1.foundset.foundset;
	for (var idx = 0; idx < recordsMoved.length; idx++) {
		var record = recordsMoved[idx];
		if (cloned) {
			var newRecord = fs.getRecord(fs.newRecord())
			databaseManager.copyMatchingFields(record, newRecord);
			newRecord.categoryid = cat1;
			databaseManager.saveData(newRecord);
		} else {
			record.categoryid = cat1;
			databaseManager.saveData(record);

		}
	}
	
	if (cloned) {
		filterCat1();
		filterCat2();
	} else {
		filterCat1();
		filterCat2();
	}

}

/**
 * @param {JSEvent} event
 * @param {Array<number>} oldIndicies
 * @param {Array<JSRecord<db:/example_data/products>>} recordsMoved
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"5023D16E-7755-4104-9CBF-ED255401DA24"}
 */
function onRemove(event, oldIndicies, recordsMoved) {
	application.output('ON REMOVE -----------------');
	application.output(event.getElementName())
	application.output(oldIndicies)
	application.output(recordsMoved[0])
}
