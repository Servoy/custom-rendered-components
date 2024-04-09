{
	"name": "customrenderedcomponents-customlist",
	"displayName": "Custom List",
	"categoryName": "Visualization",
	"version": 1,
	"icon" :"customrenderedcomponents/arc-icon-16.png",
	"definition": "customrenderedcomponents/customlist/customlist.js",
	"doc": "customrenderedcomponents/customlist/customlist_doc.js",
	"serverscript": "customrenderedcomponents/customlist/customlist_server.js",
	"libraries": [
		{ "name": "listcomponent.css", "version": "1.0", "url": "customrenderedcomponents/css/listcomponent.css", "mimetype": "text/css" },
		{ "name": "Sortable.js", "version": "1.13.0", "url": "customrenderedcomponents/sortable/Sortable.js", "mimetype": "text/javascript" }
	],
	"model":
	{
		"data": 							{ "type": "object[]", "tags": {"scope" : "private"}, "pushToServer": "allow" },
		"entryRendererFunction": 			{ "type": "clientfunction" },
		"responsiveHeight": 				{ "type": "int", "default": 500 },
		"responsiveDynamicHeight": 			{ "type": "boolean", "default": false },
		"styleClass": 						{ "type": "styleclass", "tags": { "scope" :"design" } },
		"selectionClass": 					{ "type": "styleclass" },
		"enabled": 							{ "type": "enabled", "blockingOn": false, "default": true, "for": ["onClick"] },
		"tooltipFunction":					{ "type": "clientfunction", "tags": {"doc": "This is a client side function that gets 2 arguments: first is the data-target (this should be set in the entry renderer) and second is the entry of the data"}},
		"showAs": 							{ "type": "string", "values": ["html", "trusted_html"], "default" : "html", "tags": { "scope" :"design","doc" :"Option whether text is shown as sanitized html or trusted html (as is)." }},
		"dragEnabled" : 					{ "type" : "boolean", "default" : false, "tags": { "scope" :"design", "doc": "When set to true, allows to drag entries into another Custom List element"}},
		"dropEnabled" : 					{ "type" : "boolean", "default" : false, "tags": { "scope" :"design", "doc": "When set to true, allows to drop entries from another Custom List element"}},
		"sortableEnabled" : 				{ "type" : "boolean", "default" : false, "tags": { "scope" :"design", "doc": "When set to true, allows to reorder entries within the Custom List element using drag & drop"}},
		"dragSortableOptions":				{ "type": "sortableOptions", "tags": { "scope" :"design", "doc": "Customize options for the drag n'drop and sortable"}},	
		"visible": 							{ "type": "visible" },
		"selectedIndex": 					{ "type": "int", "default": 0, "tags": {"scope" : "private"}, "pushToServer": "allow" },
		"entryStyleClassFunction": 			{ "type": "clientfunction" }
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
		"onRightClickMethodID": {
			"doc": "Called upon right click on a list entry",
			"parameters": [
				{ "name": "entry", "type": "object" },
				{ "name": "index", "type": "int" },
				{ "name": "dataTarget", "type": "string" },
				{ "name": "event", "type": "JSEvent" }
			]
		},
		"onDoubleClickMethodID": {
			"doc": "Called upon double click on a list entry",
			"parameters": [
				{ "name": "entry", "type": "object" },
				{ "name": "index", "type": "int" },
				{ "name": "dataTarget", "type": "string" },
				{ "name": "event", "type": "JSEvent" }
			]
		},
		"onSortEnd": {
			"doc": "Called when Custom List entries are reordered by drag&drop.",
			"parameters": [
				{ "name": "event", "type": "JSEvent", "doc": "the JSEvent for this element" },
				{ "name": "oldIndicies", "type": "int[]", "doc": "the original indexes of the moved entries"  },
				{ "name": "newIndicies", "type": "int[]", "doc": "the new entries indexes"  },
				{ "name": "entriesMoved", "type": "object[]", "doc": "the entries sorted"  },
				{ "name": "entriesMovedTo", "type": "object[]", "doc": "the entries whom have been shifted upon sort end"  }
			]
		},
		"onDrop": {
			"doc": "Called when entries dragged from another Custom List are dropped into this Custom list element.",
			"parameters": [
				{ "name": "event", "type": "JSEvent", "doc": "the JSEvent for this element" },
				{ "name": "oldIndicies", "type": "int[]", "doc": "the original indexes, when drag started, of the dropped entries"  },
				{ "name": "newIndicies", "type": "int[]", "doc": "the new indexes of entries upon drop"  },
				{ "name": "entriesMoved", "type": "object[]", "doc": "the entries dragged and dropped"  },
				{ "name": "entriesMovedTo", "type": "object[]", "doc": "the entries whom have been shifted upon drop"  }				
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