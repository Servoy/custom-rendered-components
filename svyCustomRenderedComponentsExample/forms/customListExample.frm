customProperties:"formComponent:false,\
useCssPosition:true",
encapsulation:44,
items:[
{
height:480,
partType:5,
typeid:19,
uuid:"212E6D96-0566-4074-A57F-FC0A6C60E9B0"
},
{
cssPosition:"120,20,20,20,-1,-1",
json:{
cssPosition:{
bottom:"20",
height:"-1",
left:"20",
right:"20",
top:"120",
width:"-1"
},
tooltipFunction:"function getTooltip(dataTarget, entry) {\r\
    if (entry && entry.discontinued != 0) return 'Product discontinued'\r\
    else if (dataTarget == 'unitsinstock') return 'Units in stock'\r\
    else if (dataTarget == 'unitprice') return 'Price'\r\
    else return null;\r\
}"
},
name:"customlist",
typeName:"customrenderedcomponents-customlist",
typeid:47,
uuid:"EB43548C-598B-4714-8D75-19C4B710DD5D"
},
{
cssPosition:"20,20,-1,20,-1,80",
text:"<html><p>This example renders its list-items from the data provided (here created from a dataset)<\/p>\r\
\r\
<p>The function that generates the html to be shown resides in the client and is assigned in the form's onLoad method. It could also be entered directly in the component's entryRendererFunction property.<\/p><\/html>",
typeid:7,
uuid:"EF955C39-DD73-4A4D-AA29-466CE9C0546E"
}
],
name:"customListExample",
navigatorID:"-1",
onLoadMethodID:"A3A3FD00-2C3B-4AF3-AC9E-029430577A19",
showInMenu:true,
typeid:3,
uuid:"31B8CEEF-25B5-44EE-92C5-8C214DCE1CB2"