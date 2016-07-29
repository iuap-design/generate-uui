var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var exec = require('child_process').exec;
var zip = require('gulp-zip');
var flatmap = require('gulp-flatmap');
var del = require('del');
var uuiPkg = require('./package.json');
var originVersion = '2.0.1';

var version = require('./version.js');

var uuiDist = 'dist/uui/' + uuiPkg.version;
var originDist = 'dist/uui/' + originVersion;

var distModules = ['neoui', '', 'neoui-datetimepicker', 'neoui-grid', 'tree']

var pathOfJS = [
    'neoui/dist/js/u-ui.js',
    'neoui-datetimepicker/dist/js/u-date.js',
    'kero/dist/js/model.js'
]

var pathOfCSS = [
    'neoui/dist/css/u.css',
    'neoui-datetimepicker/dist/css/u-date.css'
]

var pathOfCopyCSS = [
    'neoui/dist/css/u-extend.css',
    'neoui/dist/css/u-extend.min.css',
    'neoui/dist/fonts/font-awesome/css/font-awesome.css',
    'neoui/dist/fonts/font-awesome/css/font-awesome.min.css',
    'neoui-grid/dist/css/grid.css',
    'neoui-grid/dist/css/grid.min.css',
    'neoui-tree/dist/css/tree.css',
    'neoui-tree/dist/css/tree.min.css'
]

var pathGrid = [
    'neoui-grid/dist/js/u-grid.js',
    'kero/dist/js/grid.kero.js'
]
var pathTree = [
    'neoui-tree/dist/js/u-tree.js',
    'kero/dist/js/tree.kero.js'
    
]

var pathUI = [
    'neoui/dist/js/u-ui.js',
    'neoui-datetimepicker/dist/js/u-date.js'
]


var pathOfCopyJS = [
    'neoui/dist/js/u-polyfill.js',
    'neoui/dist/js/u-polyfill.min.js',
    'kero/dist/js/u-model.js',
    'kero/dist/js/u-model.min.js',
    'neoui-datetimepicker/dist/js/u-date.js',
    'neoui-datetimepicker/dist/js/u-date.min.js'
]

var notIncludeCss = '!'+ uuiDist + '/css/font-awesome' + '*' + '.css';

/**
 * 公共错误处理函数
 * 使用示例：
 *  .pipe(uglify().on('error', errHandle))
    .pipe(rename('u.min.js'))
 * @param  {[type]} err [description]
 * @return {[type]}     [description]
 */
var errHandle = function ( err ) {
    // 报错文件名
    var fileName = err.fileName;
    // 报错类型
    var name = err.name;
    // 报错信息
    var message = err.message;
    // 出错代码位置
    var loc = err.loc;

    var logInfo = '报错文件：' + fileName + '报错类型：' + name + '出错代码位置：' + loc.line + ',' + loc.column;

    util.log( logInfo );

    this.end();
}


gulp.task('baseJs', function(){
    return gulp.src( pathOfJS )
        .pipe(concat('u.js'))
        .pipe(gulp.dest( uuiDist + '/js'))
        .pipe(uglify())
        .pipe(rename('u.min.js'))
        .pipe(gulp.dest(uuiDist + '/js'))
});

gulp.task('js', ['baseJs'] , function(){
    version.init([
        uuiDist + '/js/u.min.js',
    ]);
});

gulp.task('gridjs-init', function() {
    return gulp.src( pathGrid )
        .pipe(concat('u-grid.js'))
        .pipe(gulp.dest( uuiDist + '/js'))
        .pipe(uglify())
        .pipe(rename('u-grid.min.js'))
        .pipe(gulp.dest(uuiDist + '/js'))
});

gulp.task('gridjs', ['gridjs-init'] , function(){
    version.init([
        uuiDist + '/js/u-grid.min.js',
    ]);
});

gulp.task('treejs-init', function() {
    return gulp.src( pathTree )
        .pipe(concat('u-tree.js'))
        .pipe(gulp.dest( uuiDist + '/js'))
        .pipe(uglify())
        .pipe(rename('u-tree.min.js'))
        .pipe(gulp.dest(uuiDist + '/js'))
});

gulp.task('treejs', ['treejs-init'] , function(){
    version.init([
        uuiDist + '/js/u-tree.min.js',
    ]);
});

gulp.task('uiconcat-init', function() {
    return gulp.src( pathUI)
        .pipe(concat('u-ui.js'))
        .pipe(gulp.dest( uuiDist + '/js'))
        .pipe(uglify())
        .pipe(rename('u-ui.min.js'))
        .pipe(gulp.dest(uuiDist + '/js'))

});

gulp.task('uiconcat', ['uiconcat-init'] , function(){
    version.init([
        uuiDist + '/js/u-ui.min.js',
    ]);
});

gulp.task('css-init', function(){
    return gulp.src( pathOfCSS )
        .pipe(concat('u.css'))
        .pipe(gulp.dest(uuiDist + '/css'))
        .pipe(minifycss())
        .pipe(rename('u.min.css'))
        .pipe(gulp.dest(uuiDist + '/css'))
});

gulp.task('css', ['css-init'] , function(){
    version.init([
        uuiDist + '/css/u.css',
        uuiDist + '/css/u.min.css',
    ]);
});

gulp.task('copycss', function(){
    return gulp.src( pathOfCopyCSS )
        .pipe(gulp.dest(uuiDist + '/css'))
})

gulp.task('copyjs', function(){
    return gulp.src(pathOfCopyJS)
        .pipe(gulp.dest(uuiDist + '/js'))
})

gulp.task('copyfont', function(){
    gulp.src(['neoui/dist/fonts/*.*','neoui/dist/fonts/font-awesome/fonts/**'])
        .pipe(gulp.dest(uuiDist + '/fonts/'));
})

gulp.task('copyimg', function(){
    gulp.src(['neoui/dist/images/**'])
        .pipe(gulp.dest(uuiDist + '/images/'));
})

function getDistDir(moduleDir){
    var publishPkg = require('./' + moduleDir + '/package.json');
    var publishDist = 'dist/' + moduleDir + '/' + publishPkg.version;
    return publishDist;
}


function publishModule(moduleName){
    gulp.src(moduleName + '/dist/**')
        .pipe(gulp.dest(getDistDir(moduleName)));
}

gulp.task('publishModules', function(){
    for(var pm of distModules){
        publishModule(pm);
    }
})

// 在 gulp 中执行 shell 命令
gulp.task('shell', function() {
    exec('sh fetch.sh', function(err) {
        if (err) return err;
    // if (typeof cb == 'function') cb();
    });
});

gulp.task('dist', ['css', 'js', 'uiconcat', 'gridjs', 'treejs', 'copycss', 'copyjs','copyfont','copyimg'],function(){
    gulp.run('origin');
    gulp.run('down');
    gulp.run('new');
});


/* 兼容之前 begin*/
var originGlobs = {
    bizjs :[
        './compatible/biz/knockout-3.2.0.debug.js',
        uuiDist + '/js/u-model.js',
        './compatible/biz/compManager.js',
        './compatible/biz/compatible.js',
        './compatible/biz/input.js',
        './compatible/biz/datetime.js',
        //'./compatible/biz/combobox.js',
        './compatible/biz/checkbox.js',
        './kero/dist/js/grid.kero.js',
    ],
    js:[
        uuiDist + '/js/u-polyfill.js',
        uuiDist + '/js/u-ui.js',
        './compatible/src/dialog_.js',
        './neoui-grid/dist/js/u-grid.js',
        './compatible/u/validate.js',
        './compatible/u/autocomplete.js',
        './compatible/u/backtop.js',
        //'./compatible/u/combobox.js',
        './compatible/u/dialog.js',
        './compatible/u/moment.js',
        './compatible/u/neoui-datetimepicker.js',
        './compatible/u/formater.js',
        './compatible/u/JsExtensions.js',
        './compatible/u/loading.js',
        './compatible/u/message.js',
    ]
};

gulp.task('originlocales', function() {
    gulp.src('./compatible/locales/en/*')
        .pipe(gulp.dest(originDist + '/locales/en'));
    gulp.src('./compatible/locales/en_US/*')
        .pipe(gulp.dest(originDist + '/locales/en_US'));
    gulp.src('./compatible/locales/en-US/*')
        .pipe(gulp.dest(originDist + '/locales/en-US'));
    gulp.src('./compatible/locales/zh/*')
        .pipe(gulp.dest(originDist + '/locales/zh'));
    gulp.src('./compatible/locales/zh-CN/*')
        .pipe(gulp.dest(originDist + '/locales/zh-CN'));
    gulp.src('./compatible/locales/zh_CN/*')
        .pipe(gulp.dest(originDist + '/locales/zh_CN'));
});

gulp.task('originexternal', function() {
    return gulp.src('./compatible/external/*')  /*liuyk需要复制过去*/
        .pipe(gulp.dest(originDist + '/external'))
});


gulp.task('originassets', ['originlocales', 'originexternal'], function(){
    return gulp.src('./compatible/assets/**')
        .pipe(gulp.dest(originDist + ''))
});

///////////////////////////////////////

/* JS直接使用新的JS加上兼容js*/
gulp.task('originbizcorejs',function(){
    return gulp.src('./compatible/biz/biz.core.js')
            .pipe(concat('u.biz.core.js'))
            .pipe(gulp.dest(originDist + '/js'))
            .pipe(uglify())
            .on('error', errHandle)
            .pipe(concat('u.biz.core.min.js'))
            .pipe(gulp.dest(originDist + '/js'));
});

gulp.task('originbizjs',function(){
    return gulp.src(originGlobs.bizjs)
            .pipe(concat('u.biz.js'))
            .pipe(gulp.dest(originDist + '/js'))
            .pipe(uglify())
            .on('error', errHandle)
            .pipe(rename('u.biz.min.js'))
            .pipe(gulp.dest(originDist + '/js'));
});

gulp.task('originujs',function(){
    return gulp.src(originGlobs.js)
            .pipe(concat('u.js'))
            .pipe(gulp.dest(originDist + '/js'))
            .pipe(uglify()).on('error', errHandle)
            .pipe(rename('u.min.js'))
            .pipe(gulp.dest(originDist + '/js'));
});

gulp.task('originjs', ['originbizcorejs','originbizjs','originujs'],function() {

});
///////////////////////////////////////


/* CSS直接使用新的css*/
gulp.task('originless:ui', function() {
    return gulp.src('./compatible/less/import.less')
        .pipe(less())
        .pipe(rename('oldu.css'))
        .pipe(gulp.dest(originDist + '/css'));
});

gulp.task('originless',['originless:ui'], function() {
    return gulp.src([uuiDist + '/css/u.css',originDist + '/css/oldu.css','./compatible/css/u.css',uuiDist + '/css/grid.css'])
            .pipe(concat('u.css'))
            .pipe(gulp.dest(originDist + '/css'))
            .pipe(minifycss())
            .pipe(concat('u.min.css'))
            .pipe(gulp.dest(originDist + '/css'));

});
///////////////////////////////////////

gulp.task('origincopy', function() {
    gulp.src([uuiDist] + '/css/font-awesome' + '*' + '.css')
        .pipe(gulp.dest(originDist + '/fonts/font-awesome/css'));
    gulp.src([uuiDist + '/images/**'])
        .pipe(gulp.dest(originDist + '/images'));

})

gulp.task('origin', ['originassets', 'originjs', 'originless', 'origincopy']);

/**
 * 下载新版体验
 * @return {[type]}   [description]
 */
gulp.task('newpack', function() {
    return gulp.src([uuiDist + '/**/*', 'dist/download/temp/*.*'])
        .pipe(gulp.dest('dist/download/' + 'iuap-design-' + uuiPkg.version))
        .pipe(zip('iuap-design-' + uuiPkg.version + '.zip'))
        .pipe(gulp.dest('dist/download'));
});

gulp.task('down', ['newpack'], function() {
    del('dist/download/' + 'iuap-design-' + uuiPkg.version);
});

/**
 * 最新版本存放路径
 * @param  {[type]} ) {}          [description]
 * @return {[type]}   [description]
 */
gulp.task('new', function() {
    return gulp.src(uuiDist + '/**')
        .pipe(gulp.dest('dist/uui/latest'));
})







