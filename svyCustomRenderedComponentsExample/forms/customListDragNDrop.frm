customProperties:"formComponent:false,\
useCssPosition:true",
encapsulation:44,
items:[
{
cssPosition:"8,-1,-1,33,445,36",
json:{
cssPosition:{
bottom:"-1",
height:"36",
left:"33",
right:"-1",
top:"8",
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
uuid:"206912CA-B09F-4B51-93CF-1CE73143A3CC"
},
{
height:480,
partType:5,
typeid:19,
uuid:"4109C724-7695-425E-BD8B-2E81806907AF"
},
{
cssPosition:"120,28,20,calc(50% + 32px),-1,-1",
json:{
cssPosition:{
bottom:"20",
height:"-1",
left:"calc(50% + 32px)",
right:"28",
top:"120",
width:"-1"
},
dragEnabled:true,
dragSortableOptions:{
svyUUID:"2BC92812-1FF7-4ACA-8465-CFBE90893CDD"
},
dropEnabled:true,
onDrop:"83EF2FA7-C9E8-4C27-B349-ADB5B0CFEDCE",
onSortEnd:"A8147619-6EAA-4D6B-902A-E0A33E01C011",
sortableEnabled:true,
tooltipFunction:"function getTooltip(dataTarget, entry) {\r\
    if (entry && entry.discontinued != 0) return 'Product discontinued'\r\
    else if (dataTarget == 'unitsinstock') return 'Units in stock'\r\
    else if (dataTarget == 'unitprice') return 'Price'\r\
    else return null;\r\
}"
},
name:"list2",
typeName:"customrenderedcomponents-customlist",
typeid:47,
uuid:"72244584-70A1-4DD8-9FF7-0342DF1E0EB9"
},
{
cssPosition:"65,-1,-1,20,270,30",
json:{
cssPosition:{
bottom:"-1",
height:"30",
left:"20",
right:"-1",
top:"65",
width:"270"
},
dataProviderID:"cat1",
onDataChangeMethodID:"962E8E72-E819-48C1-B56B-95D8831D9B43",
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
uuid:"9EC12563-CB21-42ED-A6EA-7477EE0BC021"
},
{
cssPosition:"120,calc( 50% + 30px),20,20,-1,-1",
json:{
cssPosition:{
bottom:"20",
height:"-1",
left:"20",
right:"calc( 50% + 30px)",
top:"120",
width:"-1"
},
dragEnabled:true,
dragSortableOptions:{
multiDrag:true,
svyUUID:"198BBD57-404B-44A5-AB49-E9665CFAC621"
},
dropEnabled:true,
onDrop:"241F0138-FC9F-45BD-8EFB-A1118E7AC39F",
onSortEnd:"26EEBA45-94AE-4D84-B758-608A3090C122",
sortableEnabled:true,
tooltipFunction:"function getTooltip(dataTarget, entry) {\r\
    if (entry && entry.discontinued != 0) return 'Product discontinued'\r\
    else if (dataTarget == 'unitsinstock') return 'Units in stock'\r\
    else if (dataTarget == 'unitprice') return 'Price'\r\
    else return null;\r\
}"
},
name:"list1",
typeName:"customrenderedcomponents-customlist",
typeid:47,
uuid:"A93846DA-8BEE-45C2-942B-8DC77D0345A3"
},
{
cssPosition:"66,-1,-1,calc(50% + 32px),260,30",
json:{
cssPosition:{
bottom:"-1",
height:"30",
left:"calc(50% + 32px)",
right:"-1",
top:"66",
width:"260"
},
dataProviderID:"cat2",
onDataChangeMethodID:"F50B23AE-84D7-4586-9C60-49E0AAEABB21",
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
uuid:"FA415D2C-CB3B-497B-8547-4EF59D192378"
}
],
name:"customListDragNDrop",
navigatorID:"-1",
onLoadMethodID:"F35A7E6C-0D3D-4A62-8453-A98207A8D6D1",
showInMenu:true,
typeid:3,
uuid:"06ED4443-FF12-424E-AED9-77C0F07D3AAF"