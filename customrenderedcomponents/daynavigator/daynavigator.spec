{
	"name": "customrenderedcomponents-daynavigator",
	"displayName": "Day navigator",
	"version": 1,
	"definition": "customrenderedcomponents/daynavigator/daynavigator.js",
    "libraries": [{"name":"moment", "version":"2.19.1", "url": "customrenderedcomponents/daynavigator/moment-with-locales.min.js", "mimetype":"text/javascript"},
                  {"name":"moment-jdateformatparser", "version":"0.1.1", "url":"customrenderedcomponents/daynavigator/moment-jdateformatparser.js", "mimetype":"text/javascript"},
                  { "name": "daynavigator.css", "version": "1.0", "url": "customrenderedcomponents/daynavigator/daynavigator.css", "mimetype": "text/css" }, 
    			  {"name":"bootstrap-datepaginator.css", "version":"1", "url":"customrenderedcomponents/daynavigator/lib/bootstrap-datepaginator.css", "mimetype":"text/css"}, 
    			  {"name":"bootstrap-datepaginator.js", "version":"1", "url":"customrenderedcomponents/daynavigator/lib/bootstrap-datepaginator.js", "mimetype":"text/javascript"}],
	"model":
	{
		"selectedDate": "date",
		"visible": "visible"
	},
	"handlers" :
	{
		"onChange": {
			"description": "Called when the day is changed",
			"parameters": [{
				"name": "date",
				"type": "date"
			}]
		}
	}
}