/**
 * Created by Administrator on 2016/4/20.
 */
var app;
var viewModel = {
    winData: new u.DataTable({
        meta: {
            key: {type: 'string'},
            value: {type: 'string'}

        }
    }),
    noWinData: new u.DataTable({
        meta: {
            key: {type: 'string'},
            value: {type: 'string'}

        }
    })
};

app = u.createApp({
    el: 'body',
    model: viewModel
});


//打印数组
var isArray =  function(object){
    return  object && typeof object==='object' &&
        typeof object.length==='number' &&
        typeof object.splice==='function' &&
            //判断length属性是否是可枚举的 对于数组 将得到false
        !(object.propertyIsEnumerable('length'));
};
var printArray = function(array){
    if(!isArray(array))
        return;
    if(array.length != 0){
        for(var i = 0; i < array.length; i++){
            console.log(array[i]);
        };
    }
}


//dataTable设置值
//API setSimpleData

viewModel.noWinData.setSimpleData([
    {"key": "isFF", "value": u.isFF},
    {"key": "isOpera", "value": u.isOpera},
    {"key": "isChrome", "value": u.isChrome},
    {"key": "isSafari", "value": u.isSafari},
    {"key": "isWebkit", "value": u.isWebkit},

    {"key": "isIOS", "value": u.isIOS},
    {"key": "isIphone", "value": u.isIphone},
    {"key": "isIPAD", "value": u.isIPAD},

    {"key": "isUnix", "value": u.isUnix},
    {"key": "isLinux", "value": u.isLinux},
    {"key": "isAndroid", "value": u.isAndroid},
    {"key": "isMac", "value": u.isMac},
    {"key": "hasTouch", "value": u.hasTouch}
]);
viewModel.winData.setSimpleData([
    {"key": "isWin", "value": u.isWin},
    {"key": "isIE", "value": u.isIE},
    {"key": "isIE8_BEFORE", "value": u.isIE8_BEFORE},
    {"key": "isIE8", "value": u.isIE8},
    {"key": "isIE8_CORE", "value": u.isIE8_CORE},
    {"key": "isIE9", "value": u.isIE9},
    {"key": "isIE9_CORE", "value": u.isIE9_CORE},
    {"key": "isIE10", "value": u.isIE10},
    {"key": "isIE11", "value": u.isIE11}
])
