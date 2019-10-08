{
	"name": "customrenderedcomponents-listcomponent",
	"displayName": "List Component",
	"version": 1,
	"definition": "customrenderedcomponents/listcomponent/listcomponent.js",
	"serverscript": "customrenderedcomponents/listcomponent/listcomponent_server.js",
	"libraries": [{ "name": "listcomponent.css", "version": "1.0", "url": "customrenderedcomponents/listcomponent/listcomponent.css", "mimetype": "text/css" }],
	"model":
	{
		"data": { "type": "object[]", "tags": {"scope" : "private"}},
		"entryStyleClassFunc": { "type": "string"},
		"entryRendererFunc": { "type": "string"},
		"visible": "visible",
		"foundset": {"type": "foundset", "dynamicDataproviders": true, "default" : {"foundsetSelector":""} , "pushToServer": "allow", "initialPreferredViewPortSize": 130, "sendSelectionViewportInitially": true },
		"responsiveHeight": {"type": "int", "default": 500},
		"styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" }}
	},
	"handlers" : {
		"onClick": {
			"description": "Called when the mouse is clicked on a list entry",
			"parameters": [{
				"name": "entry",
				"type": "object"
			},
			{
				"name": "index",
				"type": "int"
			},
			{
				"name": "dataTarget",
				"type": "string"
			},
			{
				"name": "event",
				"type": "JSEvent"
			}
			]
		}
	}, 
	"api" : {
		"newEntry": {
			"parameters": [
			],
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
		"getEntriesCount": {
			"parameters": [
			],
            "returns": "int"
		}
	},
	"types" : {

    }
}