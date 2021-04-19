{
	"name": "customrenderedcomponents-customlist",
	"displayName": "Custom List",
	"categoryName": "Visualization",
	"version": 1,
	"icon" :"customrenderedcomponents/arc-icon-16.png",
	"definition": "customrenderedcomponents/customlist/customlist.js",
	"serverscript": "customrenderedcomponents/customlist/customlist_server.js",
	"libraries": [
		{ "name": "listcomponent.css", "version": "1.0", "url": "customrenderedcomponents/css/listcomponent.css", "mimetype": "text/css" },
		{ "name": "Sortable.js", "version": "1.13.0", "url": "customrenderedcomponents/sortable/Sortable.js", "mimetype": "text/javascript" }
	],
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
		"enabled": 							{ "type": "enabled", "blockingOn": false, "default": true, "for": ["onClick"] },
		"tooltipFunction":					{ "type": "tagstring" },
		"showAs": 							{ "type": "string", "values": ["html", "trusted_html"], "default" : "html", "tags": { "scope" :"design","doc" :"Option whether text is shown as sanitized html or trusted html (as is)." }},
		"sortableOptions":					{ "type": "sortableOptions" }	
	},
	"handlers" : {
		"onClick": {
			"doc": "Called when the mouse is clicked on a list entry",
			"parameters": [
				{ "name": "entry", "type": "object" },
				{ "name": "index", "type": "int" },
				{ "name": "dataTarget", "type": "string" },
				{ "name": "event", "type": "JSEvent" }
			]
		},
		"onSortEnd": {
			"parameters": [
				{ "name": "event", "type": "JSEvent" },
				{ "name": "oldIndicies", "type": "int[]" },
				{ "name": "newIndicies", "type": "int[]" },
				{ "name": "oldEntries", "type": "object[]" },
				{ "name": "newEntries", "type": "object[]" }
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
	},
	"types": {
		"sortableOptions" : {
			"sort" :			"boolean",
			"handle" : 			"styleclass",
			"animation" : 		"int",
			"multiDrag" :		"boolean",
			"selectedClass" :	"styleclass"
		}
	}
}