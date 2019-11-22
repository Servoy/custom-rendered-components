{
	"name": "customrenderedcomponents-foundsetlist",
	"displayName": "FoundSet List",
	"version": 1,
	"definition": "customrenderedcomponents/foundsetlist/foundsetlist.js",
	"libraries": [{ "name": "listcomponent.css", "version": "1.0", "url": "customrenderedcomponents/listcomponent/listcomponent.css", "mimetype": "text/css" }],
	"model":
	{
		"data": 								{ "type": "object[]", "tags": {"scope" : "private"} },
		"entryStyleClassFunction": 				{ "type": "tagstring" },
		"entryRendererFunction": 				{ "type": "tagstring" },
		"visible": 								{ "type": "visible" },
		"foundset": 							{ "type": "foundset", "dynamicDataproviders": true, "default" : {"foundsetSelector": ""} , "pushToServer": "allow", "initialPreferredViewPortSize": 130, "sendSelectionViewportInitially": true },
		"entryStyleClassDataProvider":			{ "type": "dataprovider", "forFoundset": "foundset" }, 
		"responsiveHeight": 					{ "type": "int", "default": 500 },
		"responsiveDynamicHeight": 				{ "type": "boolean", "default": false },
		"styleClass": 							{ "type": "styleclass", "tags": { "scope" :"design" } },
		"selectionClass": 						{ "type": "styleclass" },
		"enabled": 								{ "type": "enabled", "blockingOn": false, "default": true, "for": ["onClick"] }
	},
	"handlers" : {
		"onClick": {
			"description": "Called when the mouse is clicked on a list entry",
			"parameters": [
				{ "name": "record", "type": "record" },
				{ "name": "foundSetIndex", "type": "int" },
				{ "name": "dataTarget", "type": "string" },
				{ "name": "event", "type": "JSEvent" }
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