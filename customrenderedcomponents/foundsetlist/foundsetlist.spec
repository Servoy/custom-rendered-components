{
	"name": "customrenderedcomponents-foundsetlist",
	"displayName": "FoundSet List",
	"categoryName": "Visualization",
	"version": 1,
	"icon" :"customrenderedcomponents/arc-icon-16.png",
	"definition": "customrenderedcomponents/foundsetlist/foundsetlist.js",
	"libraries": [{ "name": "listcomponent.css", "version": "1.0", "url": "customrenderedcomponents/css/listcomponent.css", "mimetype": "text/css" }],
	"model":
	{
		"data": 								{ "type": "object[]", "tags": {"scope" : "private"} },
		"entryRendererFunction": 				{ "type": "tagstring" },
		"visible": 								{ "type": "visible" },
		"foundset": 							{ "type": "foundset", "dynamicDataproviders": true, "default" : {"foundsetSelector": ""} , "pushToServer": "allow", "initialPreferredViewPortSize": 130, "sendSelectionViewportInitially": true },
		"entryStyleClassDataProvider":			{ "type": "dataprovider", "forFoundset": "foundset" }, 
		"responsiveHeight": 					{ "type": "int", "default": 500 },
		"responsiveDynamicHeight": 				{ "type": "boolean", "default": false },
		"styleClass": 							{ "type": "styleclass", "tags": { "scope" :"design" } },
		"selectionClass": 						{ "type": "styleclass" },
		"enabled": 								{ "type": "enabled", "blockingOn": false, "default": true, "for": ["onClick", "onFirstItemClick", "onLastItemClick"] },
		"firstItemHtml":						{ "type": "tagstring" },
		"lastItemHtml":							{ "type": "tagstring" },
		"tooltipDataProvider":					{ "type": "dataprovider", "forFoundset": "foundset" },
		"tooltipFunction":						{ "type": "tagstring" },
		"showAs": 								{ "type": "string", "values": ["html", "trusted_html"], "default" : "html", "tags": { "scope" :"design","doc" :"Option whether text is shown as sanitized html or trusted html (as is)." }}	
	},
	"handlers" : {
		"onClick": {
			"doc": "Called when the mouse is clicked on a list entry",
			"parameters": [
				{ "name": "record", "type": "record" },
				{ "name": "foundSetIndex", "type": "int" },
				{ "name": "dataTarget", "type": "string" },
				{ "name": "event", "type": "JSEvent" }
			]
		},
		"onFirstItemClick": {
			"doc": "Called when the mouse is clicked on the optional firstItemHtml",
			"parameters": [
				{ "name": "event", "type": "JSEvent" },
				{ "name": "dataTarget", "type": "string" }
			]
		},
		"onLastItemClick": {
			"doc": "Called when the mouse is clicked on the optional lastItemHtml",
			"parameters": [
				{ "name": "event", "type": "JSEvent" },
				{ "name": "dataTarget", "type": "string" }
			]
		}
	}, 
	"api" : {
		"addStyleClassForSelector": {
        	"delayUntilFormLoads": true,
        	"parameters": [
        		{"name": "selector", "type": "string"},
        		{"name": "styleClass", "type": "string"}
			]
        },
		"removeStyleClassForSelector": {
        	"delayUntilFormLoads": true,
        	"parameters": [
        		{"name": "selector", "type": "string"},
        		{"name": "styleClass", "type": "string"}
			]
        }
	},
	"types" : {

    }
}