var obj1 = {
    id : 'id',
    name : 'name'
}
var obj2 = {
    code : 'code',
    name : 'newName'
}
console.log("obj1.id="+obj1.id,"  obj1.name="+obj1.name);
console.log("obj2.code="+obj2.code,"  obj2.name="+obj2.name);
u.extend(obj1, obj2); //obj1为{id: "id", name: "newName", code: "code"}
console.log("u.extend(obj1, obj2)\n","obj1.id="+obj1.id,"  obj1.name="+obj1.name,"  obj1.code="+obj1.code);

u.setCookie('name', 'xushy1');
var name = u.getCookie('name');
console.log("getcookie: name=" + name);

var onClick = function(){
    console.log("click");
}
var onClick1 = function(){
    console.log("click1");
}
var mouseover = function(){
    console.log("mouseover");
}
var unbinddianwo = function(){
    u.off(document.getElementById("dianwo"),'click',onClick);
}
var chufa = function(){
    u.trigger(document.getElementById("dianwo"),'mouseover');
}
var removeclass = function(){
    u.removeClass(document.getElementById('dianwo'), 'u-button-lg');
    var hasclass = u.hasClass(document.getElementById('dianwo'), 'u-button-lg');
    console.log("hasclass:u-button-lg ? " + hasclass);
}
var addclass = function(){
    u.addClass(document.getElementById('dianwo'), 'u-button-lg');
    var hasclass = u.hasClass(document.getElementById('dianwo'), 'u-button-lg');
    console.log("hasclass:u-button-lg ? " + hasclass);
}
var toggleclass = function(){
    u.toggleClass(document.getElementById('dianwo'), 'u-button-lg');
    var hasclass = u.hasClass(document.getElementById('dianwo'), 'u-button-lg');
    console.log("hasclass:u-button-lg ? " + hasclass);
}
var css = function(){
    u.css(document.getElementById('css'), { background:'#F00'});
    var cssvalue = u.css(document.getElementById('css'), 'background');
    //{ background:#F00; color:#FFF}
    console.log("cssvalue:background=" + cssvalue);
}
var wrap = function(){
    u.wrap(document.getElementById('css'), "<div id='test'></div>");
}
u.on(document.getElementById("dianwo"),'click',onClick);
u.on(document.getElementById("dianwo"),'mouseover',mouseover);
u.on(document.getElementById("dianwo"),'click',onClick1);

//点击按钮取消绑定click事件的函数
u.on(document.getElementById("quxiao"),'click',unbinddianwo);

//点击按钮触发事件
u.on(document.getElementById("chufa"),'click',chufa);

//点击按钮给button addclass
u.on(document.getElementById("addclass"),'click',addclass);

//点击按钮给button removeclass
u.on(document.getElementById("removeclass"),'click',removeclass);

//点击按钮给button toggleclass
u.on(document.getElementById("toggleclass"),'click',toggleclass);

//点击按钮给button css
u.on(document.getElementById("css"),'click',css);

//点击按钮给button css
u.on(document.getElementById("wrap"),'click',wrap);

var style = u.getStyle(document.getElementById('style'), 'background');
console.log("style:background=" + style);

var zindex = u.getZIndex();;
console.log("zindex:" + zindex);

var createdom = u.makeDOM('<div id="createdom"></div>');
console.log("createdom:" + createdom);

//u.stopEvent(window.event);

var date1 = "20160620";
var date2 = "2016/06/20";
var date3 = "2016-06-20";
var date4 = new Date();
console.log(date1 + "  isdate?  " + u.isDate(date1));
console.log(date2 + "  isdate?  " + u.isDate(date2));
console.log(date3 + "  isdate?  " + u.isDate(date3));
console.log(date4 + "  isdate?  " + u.isDate(date4));

var number1 = "188";
var number2 = "188.25";
var number3 = "-188.25";
var number4 = "-188";
console.log(number1 + "  isNumber?  " + u.isNumber(number1));
console.log(number2 + "  isNumber?  " + u.isNumber(number2));
console.log(number3 + "  isNumber?  " + u.isNumber(number3));
console.log(number4 + "  isNumber?  " + u.isNumber(number4));