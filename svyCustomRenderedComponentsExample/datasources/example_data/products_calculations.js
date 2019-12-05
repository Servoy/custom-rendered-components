/**
 * @properties={type:12,typeid:36,uuid:"A052101F-4DF3-4638-8C79-290690B848E9"}
 */
function formatted_price()
{
	return utils.numberFormat(unitprice, '#,##0.00');
}

/**
 * @properties={type:12,typeid:36,uuid:"33245E78-1EC6-4FA6-9D4D-90DAEBEC9564"}
 */
function row_style_class()
{
	var classes = [];
	if (discontinued !== 0) {
		classes.push('discontinued');
	}
	if (unitsinstock < 10) {
		classes.push(('stock-critical'));
	} else if (unitsinstock < 20) {
		classes.push(('stock-low'));		
	} else {
		classes.push(('stock-ok'));				
	}
	return classes.join(' ');
}
