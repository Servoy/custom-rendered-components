var AdmZip = require('adm-zip');

// creating archives
var zip = new AdmZip();

zip.addLocalFolder("./META-INF/", "/META-INF/");
zip.addLocalFolder("./dist/servoy/customrenderedcomponents/", "/dist/servoy/customrenderedcomponents/");
zip.addLocalFolder("./css/", "/css/");
zip.addLocalFolder("./customlist/", "/customlist/");
zip.addLocalFolder("./foundsetlist/", "/foundsetlist/");
zip.addLocalFolder("./listcomponent/", "/listcomponent/");
zip.addLocalFolder("./sortable/", "/sortable/");

zip.writeZip("customrenderedcomponents.zip");