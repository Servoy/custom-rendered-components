customProperties:"formComponent:false,\
useCssPosition:true",
dataSource:"db:/example_data/products",
encapsulation:108,
items:[
{
cssPosition:"139,-1,-1,50%,201,30",
json:{
cssPosition:{
bottom:"-1",
height:"30",
left:"50%",
right:"-1",
top:"139",
width:"201"
},
dataProviderID:"cat2",
onDataChangeMethodID:"01338294-C803-4B99-9120-37AD2A207CF6",
size:{
height:30,
width:140
},
valuelistID:"5CA6FDA6-F6C3-4D4B-823D-1826D571AEDB"
},
name:"combobox_5",
size:"140,30",
typeName:"bootstrapcomponents-combobox",
typeid:47,
uuid:"085B119E-D7B8-4E5F-A137-4C24D1C7A2A3"
},
{
cssPosition:"139,-1,-1,36,201,30",
json:{
cssPosition:{
bottom:"-1",
height:"30",
left:"36",
right:"-1",
top:"139",
width:"201"
},
dataProviderID:"cat1",
onDataChangeMethodID:"BCF54AD5-7E2A-4E88-9E0E-4A6789BB3626",
size:{
height:30,
width:140
},
valuelistID:"5CA6FDA6-F6C3-4D4B-823D-1826D571AEDB"
},
name:"combobox_4",
size:"140,30",
typeName:"bootstrapcomponents-combobox",
typeid:47,
uuid:"08C0E861-A0B9-4064-8E94-A70F495EFD88"
},
{
cssPosition:"207,calc(50% + 30px),37,32,279,236",
json:{
cssPosition:{
bottom:"37",
height:"236",
left:"32",
right:"calc(50% + 30px)",
top:"207",
width:"279"
},
dragEnabled:true,
dragSortableOptions:{
multiDrag:true,
multiDragKey:null,
selectedClass:"selected",
svyUUID:"ADA74EEF-33A6-4C7B-99C2-8F72326B3C26"
},
dropEnabled:true,
entryStyleClassDataProvider:"row_style_class",
foundset:{
dataproviders:{
dp0:"productname",
dp1:"unitsinstock",
dp2:"formatted_price",
dp3:"discontinued",
dp4:"productid"
},
foundsetSelector:"db:/example_data/products",
loadAllRecords:true
},
onClick:"BBDD74FB-2379-4B80-9C6A-90B1E2932593",
onDoubleClickMethodID:"1E91495A-253B-4666-80AF-6E726474933E",
onDrop:"FEAC62FA-10BF-401F-AF9B-6D57F63C7144",
onRemove:"5023D16E-7755-4104-9CBF-ED255401DA24",
onRightClickMethodID:"C1F629D9-F775-4780-9E7E-C7D5CF47CA4F",
onSortEnd:"9CFE2313-1924-4A07-ABB1-2F886444ACB8",
sortableEnabled:true,
sortableOptions:{
dragToOtherList:true,
dragType:"COPY",
dropFromOtherList:true,
moveFromOtherList:true,
moveToOtherList:"MOVE",
multiDrag:true,
selectedClass:"selected",
sort:false,
svyUUID:"BBA8C0C2-1BA9-4414-B2AF-188837249D65"
},
visible:true
},
name:"list1",
typeName:"customrenderedcomponents-foundsetlist",
typeid:47,
uuid:"3CC767A1-690C-45B8-AB60-26D23BD731A4"
},
{
cssPosition:"207,31,37,calc(50% + 38px),274,236",
json:{
cssPosition:{
bottom:"37",
height:"236",
left:"calc(50% + 38px)",
right:"31",
top:"207",
width:"274"
},
dragEnabled:true,
dragSortableOptions:{
selectedClass:"selected",
svyUUID:"9CA1E256-E4B8-4DC9-9DD9-065F4E08E4DF"
},
dropEnabled:true,
entryStyleClassDataProvider:"row_style_class",
formIndex:0,
foundset:{
dataproviders:{
dp0:"productname",
dp1:"unitsinstock",
dp2:"formatted_price",
dp3:"discontinued",
dp4:"productid"
},
foundsetSelector:"db:/example_data/products",
loadAllRecords:true
},
onClick:"BBDD74FB-2379-4B80-9C6A-90B1E2932593",
onDoubleClickMethodID:"1E91495A-253B-4666-80AF-6E726474933E",
onDrop:"C062E940-44C5-46E9-A271-568DB64F2C41",
onRightClickMethodID:"C1F629D9-F775-4780-9E7E-C7D5CF47CA4F",
onSortEnd:"651C797C-3F5F-4A60-87AA-75FC496543AD",
sortableOptions:{
dragToOtherList:true,
dropFromOtherList:true,
moveFromOtherList:true,
moveToOtherList:"MOVE",
multiDrag:true,
sort:false,
svyUUID:"2B0EF767-6403-4522-884C-79AB8E75B4FC"
},
visible:true
},
name:"list2",
typeName:"customrenderedcomponents-foundsetlist",
typeid:47,
uuid:"82E24012-A79C-4274-B66A-94BF1668B17D"
},
{
height:480,
partType:5,
typeid:19,
uuid:"987F7D6B-6F26-4180-B44F-CF38447F423D"
},
{
cssPosition:"14,-1,-1,31,445,36",
json:{
cssPosition:{
bottom:"-1",
height:"36",
left:"31",
right:"-1",
top:"14",
width:"445"
},
size:{
height:30,
width:80
},
text:"Products"
},
name:"label_3",
size:"80,30",
typeName:"bootstrapcomponents-label",
typeid:47,
uuid:"F117EA15-C068-455D-969F-C8F0B13E5BDC"
}
],
name:"foundsetDragNDrop",
navigatorID:"-1",
onLoadMethodID:"C461FAB1-65D0-4D6E-AB2E-6F3457260290",
onShowMethodID:"24A6529E-9292-4CF3-A695-CC5DC3D45164",
showInMenu:true,
typeid:3,
uuid:"A65A8EC5-D99A-4026-8DB7-118133E249F2"