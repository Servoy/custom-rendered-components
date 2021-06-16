{
	"name": "customrenderedcomponents-foundsetlist",
	"displayName": "FoundSet List",
	"categoryName": "Visualization",
	"version": 1,
	"icon" :"customrenderedcomponents/arc-icon-16.png",
	"definition": "customrenderedcomponents/foundsetlist/foundsetlist.js",
	"libraries": [
		{ "name": "listcomponent.css", "version": "1.0", "url": "customrenderedcomponents/css/listcomponent.css", "mimetype": "text/css" },
		{ "name": "Sortable.js", "version": "1.13.0", "url": "customrenderedcomponents/sortable/Sortable.js", "mimetype": "text/javascript" }
	],
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
		"showAs": 								{ "type": "string", "values": ["html", "trusted_html"], "default" : "html", "tags": { "scope" :"design","doc" :"Option whether text is shown as sanitized html or trusted html (as is)." }},
		"dragEnabled" : 						{ "type" : "boolean", "default" : false, "tags": { "scope" :"design"}},
		"dropEnabled" : 						{ "type" : "boolean", "default" : false, "tags": { "scope" :"design"}},
		"sortableEnabled" : 					{ "type" : "boolean", "default" : false, "tags": { "scope" :"design"}},
		"dragSortableOptions":					{ "type": "sortableOptions", "tags": { "scope" :"design"}}	
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
		},
		"onSortEnd": {
			"parameters": [
				{ "name": "event", "type": "JSEvent" },
				{ "name": "oldIndicies", "type": "int[]" },
				{ "name": "newIndicies", "type": "int[]" },
				{ "name": "recordsMoved", "type": "record[]" },
				{ "name": "recordsMovedTo", "type": "record[]" }
			]
		},
		"onDrop": {
			"parameters": [
				{ "name": "event", "type": "JSEvent" },
				{ "name": "oldIndicies", "type": "int[]" },
				{ "name": "newIndicies", "type": "int[]" },
				{ "name": "recordsMoved", "type": "record[]" },
				{ "name": "recordsMovedTo", "type": "record[]" },				
				{ "name": "cloned", "type": "boolean" }
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
		"sortableOptions" : {
			"dragType" : { "type" : "string", "default" : "MOVE", "values": [{"MOVE": "MOVE"}, {"COPY": "COPY"}], "tags": { "scope" :"private"}},
			"multiDrag" : { "type" : "boolean", "default" : false, "tags": { "scope" :"design"}},
			"multiDragKey" : { "type" : "string", "default" : "CTRL", "tags": { "scope" :"design"}},
			"group" : {"type" : "string", "tags": { "scope" :"private"}},
			"handle" : 	{"type": "styleclass", "tags": { "scope" :"design"}},
			"animation" :  {"type": "int", "tags": { "scope" :"design"}},
			"selectedClass" :	{"type": "styleclass", "tags": { "scope" :"private"}}
		}
    }
}