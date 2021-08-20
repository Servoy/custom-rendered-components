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
		"entryRendererFunction": 				{ "type": "clientfunction" },
		"responsiveHeight": 					{ "type": "int", "default": 500 },
		"responsiveDynamicHeight": 				{ "type": "boolean", "default": false },
		"styleClass": 							{ "type": "styleclass", "tags": { "scope" :"design" } },
		"selectionClass": 						{ "type": "styleclass" },
		"enabled": 								{ "type": "enabled", "blockingOn": false, "default": true, "for": ["onClick", "onFirstItemClick", "onLastItemClick"] },
		"tooltipFunction":						{ "type": "clientfunction" },
		"showAs": 								{ "type": "string", "values": ["html", "trusted_html"], "default" : "html", "tags": { "scope" :"design","doc" :"Option whether text is shown as sanitized html or trusted html (as is)." }},
		"dragEnabled" : 						{ "type" : "boolean", "default" : false, "tags": { "scope" :"design", "doc": "When set to true, allows to drag records into another FoundSet List element"}},
		"dropEnabled" : 						{ "type" : "boolean", "default" : false, "tags": { "scope" :"design", "doc": "When set to true, allows to drop records from another FoundSet List element"}},
		"sortableEnabled" : 					{ "type" : "boolean", "default" : false, "tags": { "scope" :"design", "doc": "When set to true, allows to reorder records within the FoundSet List element using drag & drop"}},
		"dragSortableOptions":					{ "type": "sortableOptions", "tags": { "scope" :"design", "doc": "Customize options for the drag n'drop and sortable"}},	
		"visible": 								{ "type": "visible" },
		"foundset": 							{ "type": "foundset", "dynamicDataproviders": true, "default" : {"foundsetSelector": ""} , "pushToServer": "allow", "initialPreferredViewPortSize": 130, "sendSelectionViewportInitially": true },
		"entryStyleClassDataProvider":			{ "type": "dataprovider", "forFoundset": "foundset" }, 
		"tooltipDataProvider":					{ "type": "dataprovider", "forFoundset": "foundset" },
		"firstItemHtml":						{ "type": "tagstring" },
		"lastItemHtml":							{ "type": "tagstring" }
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
			"doc": "Called when FoundSet List records are reordered by drag&drop. You are responsible to persist the changes for the affected records. Make sure to persist any change for the affected record and call loadRecords for the affected foundsets. If you don't the FoundSet List may get into an incosistent state",
			"parameters": [
				{ "name": "event", "type": "JSEvent", "doc": "the JSEvent for this element" },
				{ "name": "oldIndicies", "type": "int[]", "doc": "the original indexes of the moved records"  },
				{ "name": "newIndicies", "type": "int[]", "doc": "the new record indexes"  },
				{ "name": "recordsMoved", "type": "record[]", "doc": "the records sorted"  },
				{ "name": "recordsMovedTo", "type": "record[]", "doc": "the records whom have been shifted upon sort end"  }
			]
		},
		"onDrop": {
			"doc": "Called when records dragged from another FoundSet List are dropped into this FoundSet list element. You are responsible to persist the changes for the affected records. Make sure to persist any change for the affected record and call loadRecords for the affected foundsets. If you don't the FoundSet List may go into an incosistent state.",
			"parameters": [
				{ "name": "event", "type": "JSEvent", "doc": "the JSEvent for this element" },
				{ "name": "oldIndicies", "type": "int[]", "doc": "the original indexes, when drag started, of the dropped records"  },
				{ "name": "newIndicies", "type": "int[]", "doc": "the new indexes of records upon drop"  },
				{ "name": "recordsMoved", "type": "record[]", "doc": "the records dragged and dropped"  },
				{ "name": "recordsMovedTo", "type": "record[]", "doc": "the records whom have been shifted upon drop"  }				
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