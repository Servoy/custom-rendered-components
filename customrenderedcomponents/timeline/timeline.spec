{
	"name": "customrenderedcomponents-timeline",
	"displayName": "timeline",
	"version": 1,
	"definition": "customrenderedcomponents/timeline/timeline.js",
	"serverscript": "customrenderedcomponents/timeline/timeline_server.js",
	"libraries": [{ "name": "timeline.css", "version": "1.0", "url": "customrenderedcomponents/timeline/timeline.css", "mimetype": "text/css" }],
	"model":
	{
		"data": { "type": "entry[]", "tags": {"scope" : "private"}},
		"entryStyleClassFunc": { "type": "string"},
		"entryRendererFunc": { "type": "string"},
		"visible": "visible",
		"foundset": {"type": "foundset", "dataproviders": [
				"subject", 
				"content",
				"tooltip",
				"time",
				"data"] }
	},
	"handlers" : {
		"onClick": {
			"description": "Called when the mouse is clicked on a timeline entry",
			"parameters": [{
				"name": "entry",
				"type": "entry"
			},
			{
				"name": "targetId",
				"type": "string"
			}
			]
		}
	}, 
	"api" : {
		"newEntry": {
			"parameters": [
				{ "name": "time", "type": {"type": "string"} }
			],
            "returns": "entry"
		},
        "clear": {
        }
	},
	"types" : {
		"entry" : {
			"subject": {"type" : "string" },
			"content" : {"type" : "string"},
			"tooltip": {"type" : "string"},
            "time": {"type" : "string"},
            "data": {"type" : "object"}
		}
    }
}