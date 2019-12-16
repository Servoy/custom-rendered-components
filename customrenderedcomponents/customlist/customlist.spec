{
	"name": "customrenderedcomponents-customlist",
	"displayName": "Custom List",
	"version": 1,
	"definition": "customrenderedcomponents/customlist/customlist.js",
	"serverscript": "customrenderedcomponents/customlist/customlist_server.js",
	"libraries": [{ "name": "listcomponent.css", "version": "1.0", "url": "customrenderedcomponents/css/listcomponent.css", "mimetype": "text/css" }],
	"model":
	{
		"data": 							{ "type": "object[]", "tags": {"scope" : "private"}, "pushToServer": "allow" },
		"selectedIndex": 					{ "type": "int", "default": 0, "tags": {"scope" : "private"}, "pushToServer": "allow" },
		"entryStyleClassFunction": 			{ "type": "tagstring" },
		"entryRendererFunction": 			{ "type": "tagstring" },
		"visible": 							{ "type": "visible" },
		"responsiveHeight": 				{ "type": "int", "default": 500 },
		"responsiveDynamicHeight": 			{ "type": "boolean", "default": false },
		"styleClass": 						{ "type": "styleclass", "tags": { "scope" :"design" } },
		"selectionClass": 					{ "type": "styleclass" },
		"enabled": 							{ "type": "enabled", "blockingOn": false, "default": true, "for": ["onClick"] }
	},
	"handlers" : {
		"onClick": {
			"description": "Called when the mouse is clicked on a list entry",
			"parameters": [
				{ "name": "entry", "type": "object" },
				{ "name": "index", "type": "int" },
				{ "name": "dataTarget", "type": "string" },
				{ "name": "event", "type": "JSEvent" }
			]
		}
	}, 
	"api" : {
		"newEntry": {
			"parameters": [ ],
            "returns": "object"
		},
        "clear": {
        },		
        "getEntry": {
			"parameters": [
			 	{"name": "index", "type": "int"}
			],
            "returns": "object"
		},
		"removeEntry": {
			"parameters": [
				{"name": "index", "type": "int"}
			],
            "returns": "boolean"
		},
		"setEntries": {
			"parameters": [
				{"name": "entries", "type": "object[]"}
			]
		},		
		"getEntriesCount": {
			"parameters": [
			],
            "returns": "int"
		},
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
	}
}