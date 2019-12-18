customProperties:"formComponent:false,\
useCssPosition:true",
dataSource:"db:/example_data/products",
encapsulation:60,
items:[
{
height:480,
partType:5,
typeid:19,
uuid:"1312430C-A252-4844-9A47-69E36E4E9696"
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
entryStyleClassDataProvider:"row_style_class",
foundset:{
dataproviders:{
dp0:"productname",
dp1:"unitsinstock",
dp2:"formatted_price",
dp3:"discontinued"
},
foundsetSelector:""
},
onClick:"074BAC57-1C04-4938-AA44-FB6B2D404F0E",
tooltipFunction:"function getTooltip(dataTarget, entry) {\r\
    if (entry && entry.dp3 != 0) return 'Product discontinued'\r\
    else if (dataTarget == 'unitsinstock') return 'Units in stock'\r\
    else if (dataTarget == 'unitprice') return 'Price'\r\
    else return null;\r\
}"
},
name:"foundsetlist",
typeName:"customrenderedcomponents-foundsetlist",
typeid:47,
uuid:"3E2688DC-731C-413C-B35D-87E610CFF7AF"
},
{
cssPosition:"20,20,-1,20,-1,80",
text:"<html><p>This example renders one list-item per record of the form's foundset using the dataproviders assigned to the list component .<\/p>\r\
\r\
<p>The function that generates the html to be shown resides in the client and is assigned in the form's onLoad method. It could also be entered directly in the component's entryRendererFunction property.<\/p><\/html>",
typeid:7,
uuid:"651E17F4-B96F-4D87-B3B8-5AB638083A7E"
}
],
name:"foundSetListExample",
navigatorID:"-1",
onLoadMethodID:"09717D58-B9D4-45DD-B745-347D1B06261C",
onRecordSelectionMethodID:"542428E0-472A-4AE8-8E3A-394887B12133",
showInMenu:true,
typeid:3,
uuid:"E1D8CB76-5B0C-45D9-B80C-D65F911FD459"