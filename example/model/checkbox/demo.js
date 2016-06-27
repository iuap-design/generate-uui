/*创建3个对象用来存储模块与资源文件关系，修改时只需要修改对象*/
var obj = {
    core: ['src/core/core/core.js',
            'src/core/base/base.js',
            'src/core/base/compMgr.js',
            'src/core/core/jsExtensions.js',
            'src/core/utils/i18n.js'],
    ajax: ['src/core/ajax/ajax.js'],
    event: ['src/core/core/event.js'],
    renderUtil: ['src/core/utils/dataRender.js'],
    dateUtil: ['src/core/utils/dateUtils.js'],
    formater: ['src/core/utils/formater.js'],
    hotKeys: ['src/core/utils/hotKeys.js'],
    masker: ['src/core/utils/masker.js'],
    rsautils: ['src/core/utils/rsautils.js'],
    model: ['src/model/core/core.js',
            'src/model/core/app.js',
            'src/model/dataTable/dataTable.js'],
    polyfill: ['hasPolyfill'],
    ui: ['src/ui/base/BaseComponent.js',
         'src/ui/end.js'],
    textfield: ['src/ui/textfield/textfield.js'],
    clockpicker: ['src/ui/clockpicker/clockpicker.js'],
    time: ['src/ui/time/time.js'],
    datetimepicker: ['src/ui/datetimepicker/datetimepicker.js'],
    year: ['src/ui/year/year.js'],
    month: ['src/ui/month/month.js'],
    yearmonth: ['src/ui/yearmonth/yearmonth.js'],
    checkbox: ['src/ui/checkbox/checkbox.js'],
    combobox: ['src/ui/combobox/combo.js',
                'src/ui/combobox/combobox.js'],
    radio: ['src/ui/radio/radio.js'],
    autocomplete: ['src/ui/autocomplete/autocomplete.js'],
    switch: ['src/ui/switch/switch.js'],
    button: ['src/ui/button/button.js'],
    dialog: [ 
            'src/ui/dialog/messageDialog.js',
            'src/ui/dialog/confirmDialog.js',
            'src/ui/dialog/threeBtnDialog.js',
            'src/ui/dialog/dialog.js'],
    message: ['src/ui/message/message.js'],
    loading: ['src/ui/loading/loading.js'],
    menu: ['src/ui/menu/menu.js'],
    pagination: ['src/ui/pagination/pagination.js'],
    progress: ['src/ui/progress/progress.js'],
    datatable: ['src/ui/datatable/data-table.js'],
    // grid: ['src/ui/grid/gridComp.js'],
    // tree: ['src/ui/tree/treeComp.js'],
    grid: ['hasGrid'],
    tree: ['hasTree'],
    backtop: ['src/ui/backtop/backtop.js'],
    tooltip: ['src/ui/tooltip/tooltip.js'],
    multilang: ['src/ui/multilang/multilang.js'],
    palette: [],
    refer: ['src/ui/refer/refer.js'],
    ripple: ['src/ui/ripple/ripple.js'],
    shadow: [],
    tabs: ['src/ui/tabs/tabs.js'],
    card: [],
    navlayout: ['src/ui/navlayout/navlayout.js'],
    gridlayout: [],
    mdlayout: ['src/ui/mdlayout/mdlayout.js'],
    validate: ['src/ui/validate/validate.js'],
    palette: [],
    // resets: [],
    'gridBase':'src/ui/grid/gridComp.js',
    'ColumnMenu':'src/ui/grid/ColumnMenu.js',
    'Drag':'src/ui/grid/Drag.js',
    'Edit':'src/ui/grid/Edit.js',
    'EditForm':'src/ui/grid/EditForm.js',
    'Fixed':'src/ui/grid/Fixed.js',
    'FormShow':'src/ui/grid/FormShow.js',
    'HeaderLevel':'src/ui/grid/HeaderLevel.js',
    'OverWidthHidden':'src/ui/grid/OverWidthHidden.js',
    'Sort':'src/ui/grid/Sort.js',
    'SumRow':'src/ui/grid/SumRow.js',
    'Swap':'src/ui/grid/Swap.js',
    'Tree':'src/ui/grid/Tree.js',
}

var treeObj = {
    all:[],
    coreModel:['core','ajax','event'],
    utilModel:['renderUtil','dateUtil','formater','hotKeys','masker','rsautils'],
    modelModel:['model'],
    uiModel:['ui','textfield','clockpicker','time','datetimepicker','year','month',
            'yearmonth','checkbox','combobox','radio','switch','button','dialog','message',
            'loading','menu','pagination','progress','grid','tree','backtop','tooltip',
            'multilang','palette','refer','ripple','shadow','autocomplete'],
    layoutModel:['datatable','tabs','card','navlayout','gridlayout','mdlayout'/*,'resets'*/],
    otherModel:['polyfill','validate'],
    gridMode:['gridBase','ColumnMenu','Drag','Edit','EditForm','Fixed','FormShow','HeaderLevel',
    'OverWidthHidden','Sort','SumRow','Swap','Tree']
}

/*
var str = ''
for(var f in treeObj){
    str += f + ':"", ss'

    for(var i = 0 ; i < treeObj[f].length; i++){
        str += treeObj[f][i] + ':"", ss'        
    }
}
console.log(str)
*/

var captionObj = {
    all:"全选/全部反选",     
    coreModel:"核心模块",     
    core:"核心代码",     
    ajax:"请求处理",     
    event:"事件处理",     
    utilModel:"工具模块",     
    renderUtil:"渲染工具",     
    dateUtil:"日期工具",     
    formater:"格式化工具",     
    hotKeys:"热键工具",     
    masker:"显示格式化工具",     
    rsautils:"数据加密",     
    modelModel:"模型模块",     
    model:"模型",     
    otherModel:"其他模块",     
    polyfill:"IE8兼容",     
    validate:"校验处理",     
    uiModel:"ui控件模块",     
    ui:"ui基础",     
    textfield:"输入框控件",     
    clockpicker:"时分钟表控件",     
    time:"时分输入控件",     
    datetimepicker:"日期控件",     
    year:"年控件",     
    month:"月控件",     
    yearmonth:"年月控件",     
    checkbox:"复选框控件",     
    combobox:"下拉控件",     
    radio:"单选控件",     
    switch:"开关控件",      
    button:"按钮控件",     
    dialog:"弹框控件",     
    message:"消息提示控件",     
    loading:"loading控件",     
    menu:"菜单控件",     
    pagination:"分页控件",     
    progress:"进度条控件",      
    grid:"表格控件",     
    tree:"树控件",     
    backtop:"置顶控件",     
    tooltip:"工具栏控件",     
    multilang:"多语控件",     
    palette:"调色板",     
    refer:"参照控件",     
    ripple:"点击特效",     
    shadow:"阴影",     
    autocomplete:"自定义控件",     
    layoutModel:"布局模块",     
    datatable:"表格布局",     
    tabs:"页签布局",     
    card:"卡片布局",     
    navlayout:"导航布局",     
    gridlayout:"栅格布局",     
    mdlayout:"主从布局",     
    // resets:"",     
    gridMode:"表格控件定制",
    gridBase:"基础表格",
    ColumnMenu:"表头操作",
    Drag:"拖拽",
    Edit:"编辑功能",
    EditForm:"表单方式编辑",
    Fixed:"固定列",
    FormShow:"表单方式展示",
    HeaderLevel:"多级表头",
    OverWidthHidden:"宽度不足隐藏数据列",
    Sort:"排序",
    SumRow:"合计",
    Swap:"交换列",
    Tree:"树表"
}

var cssObj = {
    ui:['@import "variables.scss"','@import "mixins.scss"'],
    autocomplete: ['@import "autocomplete/autocomplete.scss"'],
    button: ['@import "button/button.scss"'],
    card: ['@import "card/card.scss"'],
    checkbox: ['@import "checkbox/checkbox.scss"'],
    img: ['@import "img/img.scss"'],
    clockpicker: ['@import "clockpicker/clockpicker.scss"','@import "combobox/combo.scss"'],
    month:['@import "combobox/combo.scss"','@import "datetimepicker/datetimepicker.scss"','@import "textfield/textfield.scss"'],
    combobox: ['@import "combobox/combo.scss"'],
    datatable: ['@import "datatable/data-table.scss"'],
    datetimepicker: ['@import "datetimepicker/datetimepicker.scss"'],
    dialog: [ '@import "dialog/dialog.scss"'],
    // grid: ['@import "grid/gridComp.scss"'],
    gridlayout: ['@import "gridlayout/gridlayout.scss"'],
    loading: ['@import "loading/loading.scss"'],
    mdlayout: ['@import "mdlayout/mdlayout.scss"'],
    menu: ['@import "menu/menu.scss"'],
    message: ['@import "message/message.scss"'],
    navlayout: ['@import "navlayout/navlayout.scss"'],
    pagination: ['@import "pagination/pagination.scss"'],
    palette: ['@import "palette/palette.scss"'],
    progress: ['@import "progress/progress.scss"'],
    radio: ['@import "radio/radio.scss"'],
    ripple: ['@import "ripple/ripple.scss"'],
    shadow: ['@import "shadow/shadow.scss"'],
    tabs: ['@import "tabs/tabs.scss"'],
    textfield: ['@import "textfield/textfield.scss"'],
    time: ['@import "time/time.scss"','@import "combobox/combo.scss"','@import "textfield/textfield.scss"','@import "button/button.scss"'],
    year:['@import "textfield/textfield.scss"','@import "combobox/combo.scss"','@import "button/button.scss"','@import "datetimepicker/datetimepicker.scss"'],
    yearmonth:['@import "textfield/textfield.scss"','@import "combobox/combo.scss"','@import "button/button.scss"','@import "datetimepicker/datetimepicker.scss"'],
    tooltip: ['@import "tooltip/tooltip.scss"'],
    // tree: ['@import "tree/tree.scss"'],
    switch: ['@import "switch/switch.scss"'],
    palette: ['@import "palette.scss"'],
    // resets: ['@import "resets/resets.scss"'],
}

var modeluiObj = {
    model: ['src/model/comp-adp/mixins/enableMixin.js',
            'src/model/comp-adp/mixins/requiredMixin.js',
            'src/model/comp-adp/mixins/validateMixin.js',
            'src/model/comp-adp/mixins/valueMixin.js',
            'src/model/comp-adp/baseAdapter.js'],
    checkbox: ['src/model/comp-adp/checkbox.js'],
    combobox: ['src/model/comp-adp/combobox.js'],
    textfield: ['src/model/comp-adp/float.js',
                'src/model/comp-adp/currency.js',
                'src/model/comp-adp/integer.js',
                'src/model/comp-adp/percent.js',
                'src/model/comp-adp/string.js',
                'src/model/comp-adp/textarea.js',
                'src/model/comp-adp/textfield.js',],
    datetimepicker: ['src/model/comp-adp/datetime.js'],
    month: ['src/model/comp-adp/month.js'],
    // grid: ['src/model/comp-adp/grid.js'],
    multilang: ['src/model/comp-adp/multilang.js'],
    pagination: ['src/model/comp-adp/pagination.js'],
    progress: ['src/model/comp-adp/progress.js'],
    radio: ['src/model/comp-adp/radio.js'],
    switch: ['src/model/comp-adp/switch.js'],
    time: ['src/model/comp-adp/time.js'],
    // tree: ['src/model/comp-adp/tree.js'],
    year: ['src/model/comp-adp/year.js'],
    yearmonth: ['src/model/comp-adp/yearmonth.js'],
}

var dependObj = {
    event:['core'],
    renderUtil:['core','dateUtil','formater'],
    dateUtil:['core'],
    formater:['core'],
    hotKeys:['core'],
    masker:['core'],
    model:['core'],
    ui:['core','renderUtil','dateUtil','formater','hotKeys','masker'],
    textfield:['ui','validate'],
    datetimepicker:['ui','ripple','button','clockpicker'],
    clockpicker:['ui','time'],
    time:['ui'],
    year:['ui','ripple'],
    month:['ui','ripple'],
    yearmonth:['ui','ripple'],
    checkbox:['ui','ripple'],
    img:['ui','ripple'],
    combobox:['ui','textfield','ripple'],
    radio:['ui','ripple'],
    autocomplete:['ui'],
    switch:['ui','ripple'],
    button:['ui','ripple'],
    dialog:['ui','button'],
    message:['ui','button'],
    loading:['ui'],
    menu:['ui','ripple'],
    pagination:['ui','message'],
    progress:['ui'],
    datatable:['ui'],
    backtop:['ui'],
    tooltip:['ui'],
    multilang:['ui'],
    tabs:['ui','ripple'],
    navlayout:['ui','ripple'],
    mdlayout:['ui'],
    ripple:['core'],
    validate:['ui','tooltip']
}

var modeDependObj = {
    grid:['textfield','combobox','checkbox','radio','datetimepicker']
}


var colorBaseObj = {
    red:[
"255,235,238",
"255,205,210",
"239,154,154",
"229,115,115",
"239,83,80",
"244,67,54",
"229,57,53",
"211,47,47",
"198,40,40",
"183,28,28",
"255,138,128",
"255,82,82",
"255,23,68",
"213,0,0"],



    pink:[
"252,228,236",
"248,187,208",
"244,143,177",
"240,98,146",
"236,64,122",
"233,30,99",
"216,27,96",
"194,24,91",
"173,20,87",
"136,14,79",
"255,128,171",
"255,64,129",
"245,0,87",
"197,17,98"],



    purple:[
"243,229,245",
"225,190,231",
"206,147,216",
"186,104,200",
"171,71,188",
"156,39,176",
"142,36,170",
"123,31,162",
"106,27,154",
"74,20,140",
"234,128,252",
"224,64,251",
"213,0,249",
"170,0,255"],



    deep_purple:[
"237,231,246",
"209,196,233",
"179,157,219",
"149,117,205",
"126,87,194",
"103,58,183",
"94,53,177",
"81,45,168",
"69,39,160",
"49,27,146",
"179,136,255",
"124,77,255",
"101,31,255",
"98,0,234"],



    indigo:[
"232,234,246",
"197,202,233",
"159,168,218",
"121,134,203",
"92,107,192",
"63,81,181",
"57,73,171",
"48,63,159",
"40,53,147",
"26,35,126",
"140,158,255",
"83,109,254",
"61,90,254",
"48,79,254"],



    blue:[
"227,242,253",
"187,222,251",
"144,202,249",
"100,181,246",
"66,165,245",
"33,150,243",
"30,136,229",
"25,118,210",
"21,101,192",
"13,71,161",
"130,177,255",
"68,138,255",
"41,121,255",
"41,98,255"],



    light_blue:[
"225,245,254",
"179,229,252",
"129,212,250",
"79,195,247",
"41,182,246",
"3,169,244",
"3,155,229",
"2,136,209",
"2,119,189",
"1,87,155",
"128,216,255",
"64,196,255",
"0,176,255",
"0,145,234"],



    cyan:[
"224,247,250",
"178,235,242",
"128,222,234",
"77,208,225",
"38,198,218",
"0,188,212",
"0,172,193",
"0,151,167",
"0,131,143",
"0,96,100",
"132,255,255",
"24,255,255",
"0,229,255",
"0,184,212"],



    teal:[
"224,242,241",
"178,223,219",
"128,203,196",
"77,182,172",
"38,166,154",
"0,150,136",
"0,137,123",
"0,121,107",
"0,105,92",
"0,77,64",
"167,255,235",
"100,255,218",
"29,233,182",
"0,191,165"],



    green:[
"232,245,233",
"200,230,201",
"165,214,167",
"129,199,132",
"102,187,106",
"76,175,80",
"67,160,71",
"56,142,60",
"46,125,50",
"27,94,32",
"185,246,202",
"105,240,174",
"0,230,118",
"0,200,83"],



    light_green:[
"241,248,233",
"220,237,200",
"197,225,165",
"174,213,129",
"156,204,101",
"139,195,74",
"124,179,66",
"104,159,56",
"85,139,47",
"51,105,30",
"204,255,144",
"178,255,89",
"118,255,3",
"100,221,23"],



    lime:[
"249,251,231",
"240,244,195",
"230,238,156",
"220,231,117",
"212,225,87",
"205,220,57",
"192,202,51",
"175,180,43",
"158,157,36",
"130,119,23",
"244,255,129",
"238,255,65",
"198,255,0",
"174,234,0"],



    yellow:[
"255,253,231",
"255,249,196",
"255,245,157",
"255,241,118",
"255,238,88",
"255,235,59",
"253,216,53",
"251,192,45",
"249,168,37",
"245,127,23",
"255,255,141",
"255,255,0",
"255,234,0",
"255,214,0"],



    amber:[
"255,248,225",
"255,236,179",
"255,224,130",
"255,213,79",
"255,202,40",
"255,193,7",
"255,179,0",
"255,160,0",
"255,143,0",
"255,111,0",
"255,229,127",
"255,215,64",
"255,196,0",
"255,171,0"],



    orange:[
"255,243,224",
"255,224,178",
"255,204,128",
"255,183,77",
"255,167,38",
"255,152,0",
"251,140,0",
"245,124,0",
"239,108,0",
"230,81,0",
"255,209,128",
"255,171,64",
"255,145,0",
"255,109,0"],



    deep_orange:[
"251,233,231",
"255,204,188",
"255,171,145",
"255,138,101",
"255,112,67",
"255,87,34",
"244,81,30",
"230,74,25",
"216,67,21",
"191,54,12",
"255,158,128",
"255,110,64",
"255,61,0",
"221,44,0"],

}
var colorObj = {}
for(var f in colorBaseObj){
    var arr = new Array();
    arr.push(colorBaseObj[f][5])
    arr.push(colorBaseObj[f][7])
    arr.push(colorBaseObj[f][11])
    colorObj[f] = arr
}

var defaultColor = ['63,81,181','48,63,159','255,64,129']

var gridObj = {
    
}

/*确保obj中属性为最大集合 begin*/

/*校验属性是否存在*/
function checkObj1(checkObj,baseObj,checkObjName){
    for(var attr in checkObj){
        if(!baseObj[attr]){
            alert(checkObjName + " err:" + attr);
            console.log(checkObjName + " err:" + attr);
        }
    }
}

checkObj1(modeluiObj,obj,'modeluiObj');
checkObj1(cssObj,obj,'cssObj');

/*校验属性以及属性值是否存在*/
function checkObj2(checkObj,baseObj,checkObjName){
    for(var attr in checkObj){
        if(!baseObj[attr]){
            alert(checkObjName + " err:" + attr);
            console.log(checkObjName + " err:" + attr);
        }
        for(var i = 0; i < checkObj[attr].length; i++){
            if(!baseObj[checkObj[attr][i]]){
                alert(checkObjName + "err:" + attr + checkObj[attr][i]);
                console.log(checkObjName + " err:" + attr + checkObj[attr][i]);
            }
        }
    }
}

checkObj2(dependObj,obj,'dependObj');
checkObj2(modeDependObj,obj,'modeDependObj');

/*校验属性值是否存在*/
function checkObj3(checkObj,baseObj,checkObjName){
    for(var attr in checkObj){
        for(var i = 0; i < checkObj[attr].length; i++){
            if(!baseObj[checkObj[attr][i]]){
                alert(checkObjName + "err:" + attr + checkObj[attr][i]);
                console.log(checkObjName + " err:" + attr + checkObj[attr][i]);
            }
        }
    }
}
checkObj3(treeObj,obj,'treeObj');

/*确保obj中属性为最大集合 end*/


var app, viewModel,
    metaObj = {},
    treemetaObj = {},
    wholeStr = '<div>',
    headStr = '<div class="head-div"><span>本功能可自定义选中下载特定模块，设置主题颜色，并可以导入之前选择进行更新操作</span></div>',
    contentStr = '<div>',
    colorStr = '<div class="color-whole-div"><div class="color-head-div">设置主题颜色，左侧选中主色，右侧选择辅色。通过点击色块进行选中，也可在输入框中输入rgb格式的颜色编码。</div>';
    colorStr += '<div class="color-input-div">'
    for(var i = 0;i < 3;i++){
        colorStr += '<div class="u-text color-input"  u-meta=\'{"id":"color1","type":"u-text","data":"colorData","field":"color' + i + '"}\'><input class="u-input"/></div>';
    }
    colorStr += '</div>';
    colorStr += '<div class="color-content-div">';
    var colorLeftStr = '<div class="color-left-div">';
    var colorRightStr = '<div class="color-right-div">';
    for(var color in colorObj){
        colorLeftStr += '<div class="color-div" style="background:rgb(' + colorObj[color][0] + ')" color0="' + colorObj[color][0] + '" color1="' + colorObj[color][1] + '"></div>';
        colorRightStr += '<div class="color-div" style="background:rgb(' + colorObj[color][2] + ')" color2="' + colorObj[color][2] + '"></div>';
    }
    colorLeftStr += '</div>';
    colorRightStr += '</div>';

    colorStr += colorLeftStr;
    colorStr += colorRightStr;

    colorStr += '</div>';
    colorStr += '</div>';


    var evalStr = '<div class="eval-whole-div"><div class="eval-head-div">下载文件setting.txt中保存了上次配置的信息，将信息复制至文本域中并点击执行可恢复上次配置。</div>';
    evalStr += '<button id="eavl-button" class="u-button raised u-eval-button" >执行</button>';
    evalStr += '<textarea style="width: 100%;height: 70px;"u-meta=\'{"id":"str","type":"textarea","data":"evalData","field":"str"}\'></textarea>';
    evalStr += '</div>';
// 遍历obj创建datatable的field字段，同时生成html列表
for(var model in treeObj){
    treemetaObj[model] = {};
    contentStr += '<div class="tree-whole-div">';
    if(model != 'all')
        contentStr += '<div class="tree-icon"><span class="fa fa-minus-square-o"></span> ' + model + ':' + captionObj[model] + '</div>'
    contentStr += '<div class="tree-div"><label  class="u-checkbox tree-parent" u-meta=\'{"id":"'+model+'","type":"u-checkbox","data":"treeData","field":"'+model+'","checkedValue":true,"unCheckedValue":false}\'><input type="checkbox" class="u-checkbox-input"><span class="u-checkbox-label">'+ model + ':' + captionObj[model]+'</span></label>';
    for(var i = 0; i < treeObj[model].length; i++){
        var field = treeObj[model][i];
        var firstClass = '';
        metaObj[field] = {};
        if(i == 0){
            firstClass = 'tree-first-leaf';
        }
        contentStr += '<label  class="u-checkbox tree-leaf ' + firstClass + '" u-meta=\'{"id":"'+field+'","type":"u-checkbox","data":"modelData","field":"'+field+'","checkedValue":true,"unCheckedValue":false}\'><input type="checkbox" class="u-checkbox-input"><span class="u-checkbox-label">'+ field + ':' +captionObj[field]+'</span></label>';
    }
    contentStr += '</div>';
    contentStr += '</div>';
}
    contentStr += '</div>';

    

    wholeStr += headStr + contentStr + colorStr + evalStr;
    wholeStr += '</div>';




document.body.appendChild(u.makeDOM(wholeStr));

u.on(document.getElementById('eavl-button'),'click',function(){
    value = viewModel.evalData.getCurrentRow().getValue('str');
    eval(value)
});

u.on(document,'click',function(e){
    /* 模块展开收起 */
    var targetEle = u.closest(e.target,'fa');
    if(targetEle){
        var treeDiv = u.closest(targetEle,'tree-whole-div').querySelector('.tree-div');
        if(u.hasClass(targetEle,'fa-minus-square-o')){ //收起
            u.removeClass(targetEle,'fa-minus-square-o');
            u.addClass(targetEle,'fa-plus-square-o');
            treeDiv.style.display = 'none';

        }else{ //展开
            u.removeClass(targetEle,'fa-plus-square-o');
            u.addClass(targetEle,'fa-minus-square-o');
            treeDiv.style.display = 'block';
        }
    }
    /* 色块点击 */
    var targetEle = u.closest(e.target,'color-div');
    if(targetEle){
        var colorRow = viewModel.colorData.getCurrentRow();
        var color0 = targetEle.getAttribute('color0');
        var color1 = targetEle.getAttribute('color1');
        var color2 = targetEle.getAttribute('color2');
        if(color0){
            colorRow.setValue('color0',color0);
        }
        if(color1){
            colorRow.setValue('color1',color1);
        }
        if(color2){
            colorRow.setValue('color2',color2);
        }
    }
})



/* 处理全部 */

viewModel = {
    treeData: new u.DataTable({
        meta:treemetaObj
    }),
    modelData: new u.DataTable({
        meta:metaObj
    }),
    colorData:new u.DataTable({
        meta:{
            color0:{},
            color1:{},
            color2:{},
        }
    }),
    evalData:new u.DataTable({
        meta:{
            str:{},
        }
    }),
}

app = u.createApp({
    el: 'body', 
    model: viewModel,
});

var r = viewModel.modelData.createEmptyRow();
viewModel.modelData.setRowSelect(0);


var treeRow = viewModel.treeData.createEmptyRow();
viewModel.treeData.setRowSelect(0);

var colorRow = viewModel.colorData.createEmptyRow();
viewModel.colorData.setRowSelect(0);

var evalRow = viewModel.evalData.createEmptyRow();
viewModel.evalData.setRowSelect(0);
/*按钮处理begin*/
function clickFun(){
    var r = viewModel.modelData.rows()[0];
    var modelFlag = false;
    var jsStr = '';
    var cssStr = '';
    var jsArr = new Array();
    var cssArr = new Array();
    if(r.getValue('model')){
        modelFlag = true;
    }
    for(var field in obj){
        if (r.getValue(field)) {
            jsArr.push(obj[field]);
            if(modelFlag && modeluiObj[field])
                jsArr.push(modeluiObj[field]);
            if(cssObj[field])
                cssArr.push(cssObj[field])
        }
    }
    cssArr = cssArr.toString().split(',');

    cssArr = getNoRepeat(cssArr);
    // console.log(jsArr);
    // console.log(cssArr);

    var colorRow = viewModel.colorData.getCurrentRow();
    color0 = colorRow.getValue('color0');
    
    color1 = colorRow.getValue('color1');
    color2 = colorRow.getValue('color2');
    color0 = color0 ?color0 :defaultColor[0];
    color1 = color1 ?color1 :defaultColor[1];
    color2 = color2 ?color2 :defaultColor[2];


    colorArr = [color0,color1,color2];
    
    settingStr = '';
    
    settingStr += getModelData('viewModel.colorData.getCurrentRow()');
    settingStr += getModelData('viewModel.modelData.getCurrentRow()');
    settingStr += getModelData('viewModel.treeData.getCurrentRow()');
    dataJson = {
        jsArr:jsArr,
        cssArr:cssArr,
        colorArr:colorArr,
        settingStr:settingStr
    }
    u.showLoading();
    u.ajax({
        type:'post',
        dataType:'json',
        data:dataJson,
        url:'http://127.0.0.1:8321/customized',
        success:function(patch){
            u.hideLoading();
            console.log('url:' + 'http://127.0.0.1:8321/down?patch='+ patch);
            // document.getElementById('iframe1').src = 'http://20.1.73.29:8321/down?patch='+ patch;
            document.getElementById('ss').href = 'http://127.0.0.1:8321/down?patch='+ patch;
            document.getElementById('ss').click();
        },
        error:function(patch){
            u.hideLoading();
            // alert('构建失败');
        }
    })
    
}   


function getModelData(rowStr){
    var row = eval(rowStr);
    var dataObj = row.getSimpleData(),
        str = rowStr + '.setSimpleData({';
    for(var f in dataObj){
        if(dataObj[f]){
            if(dataObj[f] === true)
                str += f + ':' + dataObj[f] + ','
            else
                str += f + ':\'' + dataObj[f] + '\','
        }   
    }
    str += '});';
    return str;
}

function clickFunTest(){
    for(var i = 0; i < 20; i++)
        clickFun();
}

u.on(document.getElementById('button'),'click',clickFun);
/*按钮处理end*/

/*处理依赖关系begin*/ 
var dependCountObj = {}
viewModel.modelData.on('valueChange',function(options){
    var field = options.field,
        newValue = options.newValue,
        row = viewModel.modelData.getCurrentRow();
    dependFun(dependObj,field,newValue)
    if(field == 'model'){
        // 当前修改mdoel，如果之前选择modeDependObj的值之后处理相关的依赖
        for(var modelField in modeDependObj){
            var modelFieldValue = row.getValue(modelField);
            if(modelFieldValue){
                dependFun(modeDependObj,modelField,newValue);
            }    
        }
    }
    var modelFlag = row.getValue('model');
    if(modelFlag && field != 'model'){
        dependFun(modeDependObj,field,newValue);
    }

    if(field == 'grid'){
        if(newValue){
            row.setValue('gridBase',true);
            gridEnabled(true);
        }else{
            gridEnabled(false);
            var treeRow = viewModel.treeData.getCurrentRow();
            treeRow.setValue('gridMode',true);
            treeRow.setValue('gridMode',false);
            row.setValue('gridBase',false);
        }
    }
});

/* 处理依赖关系方法 */
function dependFun(dependObj,field,value){
    row = viewModel.modelData.getCurrentRow();
    if(dependObj[field] && dependObj[field].length > 0){
        for(var i = 0; i < dependObj[field].length; i++){
            var f = dependObj[field][i];
            if(!dependCountObj[f])
                dependCountObj[f] = 0;
            if(value){
                row.setValue(f,true);
                dependCountObj[f] += 1;
            }else{
                dependCountObj[f] -= 1;
            }
            if(dependCountObj[f] > 0){
                //设置不可修改
                app.getComp(f).setEnable(false);
                // console.log(dependCountObj[f] + f);
            }else{
                //设置可修改
                app.getComp(f).setEnable(true);
                // console.log(dependCountObj[f] + f + 'err');
            }
        }
    }
}
/* 处理依赖关系end */

/* 处理tree选中 */
viewModel.treeData.on('valueChange',function(options){
    var field = options.field,
        newValue = options.newValue,
        treeRow = viewModel.treeData.getCurrentRow();
        modelRow = viewModel.modelData.getCurrentRow(),
        arr = treeObj[field],
        dependFlag = true;
    /* 处理全选以及全部取消 */
    if(field == 'all'){
        if(newValue){
            for(var f in treeObj){
                treeRow.setValue(f,true);
            }
        }else{
            dependCountObj = {}
            for(var f in obj){
                modelRow.setValue(f,false);
            }
            for(var f in treeObj){
                if(f != 'all')
                    treeRow.setValue(f,false);
            }
            dependCountObj = {}
            
        }
    }
    if(newValue){
        for(i = 0; i < arr.length; i++){
            modelRow.setValue(arr[i],true);
        }
    }else{
        while(dependFlag){
            dependFlag = false;
            for(i = 0; i < arr.length; i++){
                var depandField = arr[i];
                if(dependCountObj[depandField] > 0 || !modelRow.getValue(depandField)){

                }else{
                    modelRow.setValue(depandField,false);
                    dependFlag = true;
                }
            }
        }
        
    }
    if(field == 'gridMode'){
        modelRow.setValue('gridBase',true);
    }
});

/*去掉数组中重复的内容 begin*/
function getNoRepeat(arr){
    var newArr = new Array();
    for(var i = 0; i<arr.length; i++){
        if(newArr.indexOf(arr[i]) > 0){

        }else{
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
/*去掉数组中重复的内容 end*/

/**/
function gridEnabled(enable){
    var gridArr = treeObj.gridMode;
    for(var i = 1; i < gridArr.length; i++){
        app.getComp(gridArr[i]).setEnable(enable);
    }
    app.getComp('gridMode').setEnable(enable);
}   
gridEnabled(false);
app.getComp('gridBase').setEnable(false);