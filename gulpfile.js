var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var exec = require('child_process').exec;
var uuiPkg = require('./package.json');
var originVersion = '2.1'

var uuiDist = 'dist/uui/' + uuiPkg.version;
var originDist = 'dist/uui/' + originVersion;

var distModules = ['iuap-design', '', 'datetimepicker', 'grid', 'tree']

var pathOfJS = [
  'iuap-design/dist/js/u-ui.js',
  'datetimepicker/dist/js/u-date.js',
  'kero/dist/js/u-model.js'
]

var pathOfCSS = [
  'iuap-design/dist/css/u.css',
  'datetimepicker/dist/css/date.css'
]

var pathOfCopyCSS = [
  'iuap-design/dist/css/u-extend.css',
  'iuap-design/dist/css/u-extend.min.css',
  'grid/dist/css/grid.css',
  'grid/dist/css/grid.min.css',
  'tree/dist/css/tree.css',
  'tree/dist/css/tree.min.css'
]

var pathGrid = [
  'kero/dist/js/grid.kero.js',
  'grid/dist/js/u-grid.js'
]
var pathTree = [
  'kero/dist/js/tree.kero.js',
  'tree/dist/js/u-tree.js'
]

var pathUI = [
  'iuap-design/dist/js/u-ui.js',
  'datetimepicker/dist/js/u-date.js'
]


var pathOfCopyJS = [
  // 'iuap-design/dist/js/u-ui.js',
  // 'iuap-design/dist/js/u-ui.min.js',
  'iuap-design/dist/js/u-polyfill.js',
  'iuap-design/dist/js/u-polyfill.min.js',
  // 'grid/dist/js/u-grid.js',
  // 'grid/dist/js/u-grid.min.js',
  // 'tree/dist/js/u-tree.js',
  // 'tree/dist/js/u-tree.min.js',
  'kero/dist/js/u-model.js',
  'kero/dist/js/u-model.min.js',
  'datetimepicker/dist/js/u-date.js',
  'datetimepicker/dist/js/u-date.min.js'
]

/**
 * 公共错误处理函数
 * 使用示例：
 *  .pipe(uglify())
 .on('error', errHandle)
 .pipe(rename('u.min.js'))
 * @param  {[type]} err [description]
 * @return {[type]}     [description]
 */
function errHandle(err) {
    util.log(err.fileName + '文件编译出错，出错行数为' + err.lineNumber + '，具体错误信息为：' + err.message);
    this.end();
};


gulp.task('js', function(){
  gulp.src( pathOfJS )
    .pipe(concat('u.js'))
    .pipe(gulp.dest( uuiDist + '/js'))
    .pipe(uglify())
    .pipe(rename('u.min.js'))
    .pipe(gulp.dest(uuiDist + '/js'))
})

gulp.task('gridjs', function() {
  gulp.src( pathGrid )
    .pipe(concat('u-grid.js'))
    .pipe(gulp.dest( uuiDist + '/js'))
    .pipe(uglify())
    .pipe(rename('u-grid.min.js'))
    .pipe(gulp.dest(uuiDist + '/js'))
})

gulp.task('treejs', function() {
  gulp.src( pathTree )
    .pipe(concat('u-tree.js'))
    .pipe(gulp.dest( uuiDist + '/js'))
    .pipe(uglify())
    .pipe(rename('u-tree.min.js'))
    .pipe(gulp.dest(uuiDist + '/js'))
})

gulp.task('uiconcat', function() {
  gulp.src( pathUI)
    .pipe(concat('u-ui.js'))
    .pipe(gulp.dest( uuiDist + '/js'))
    .pipe(uglify())
    .pipe(rename('u-ui.min.js'))
    .pipe(gulp.dest(uuiDist + '/js'))

})



gulp.task('css', function(){
  gulp.src( pathOfCSS )
    .pipe(concat('u.css'))
    .pipe(gulp.dest(uuiDist + '/css'))
    .pipe(minifycss())
    .pipe(rename('u.min.css'))
    .pipe(gulp.dest(uuiDist + '/css'))
})

gulp.task('copycss', function(){
  gulp.src( pathOfCopyCSS )
    .pipe(gulp.dest(uuiDist + '/css'))
})

gulp.task('copyjs', function(){
  gulp.src(pathOfCopyJS)
    .pipe(gulp.dest(uuiDist + '/js'))
})

gulp.task('copyfont', function(){
  gulp.src('iuap-design/dist/fonts/font-awesome/*/*')
    .pipe(gulp.dest(uuiDist + '/fonts/font-awesome'))
})

gulp.task('copyimage', function(){
  gulp.src('iuap-design/dist/images/**')
    .pipe(gulp.dest(uuiDist + '/images/'))
})

function getDistDir(moduleDir){
  var publishPkg = require('./' + moduleDir + '/package.json');
  var publishDist = 'dist/' + moduleDir + '/' + publishPkg.version;
  return publishDist;
}


function publishModule(moduleName){
  gulp.src(moduleName + '/dist/**').pipe(gulp.dest(getDistDir(moduleName)));
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

gulp.task('default', ['css', 'js', 'uiconcat', 'gridjs', 'treejs', 'copycss', 'copyjs','copyfont', 'copyimage', 'publishModules'],function(){
  gulp.run('origin');
})


/* 兼容之前 begin*/
var originGlobs = {
  bizjs :[
    './compatible/biz/knockout-3.2.0.debug.js',
    uuiDist + '/js/u-model.js',
    './compatible/biz/compManager.js',
    './compatible/biz/compatible.js',
    './compatible/biz/input.js',
    './compatible/biz/datetime.js',
    './compatible/biz/combobox.js',
    './compatible/biz/checkbox.js',
    './compatible/biz/grid.js',
  ],
  js:[
    uuiDist + '/js/u-polyfill.js',
    uuiDist + '/js/u-ui.js',
    './compatible/src/dialog_.js',
    uuiDist + '/js/u-grid.js',
    './compatible/u/validate.js',
    './compatible/u/autocomplete.js',
    './compatible/u/backtop.js',
    './compatible/u/combobox.js',
    './compatible/u/dialog.js',
    './compatible/u/moment.js',
    './compatible/u/datetimepicker.js',
    './compatible/u/formater.js',
    './compatible/u/JsExtensions.js',
    './compatible/u/loading.js',
    './compatible/u/message.js',
  ]
};

gulp.task('originlocales', function() {
   gulp.src('./compatible/locales/en/*')
    .pipe(gulp.dest(originDist + '/origin/locales/en'));
  gulp.src('./compatible/locales/en_US/*')
    .pipe(gulp.dest(originDist + '/origin/locales/en_US'));
    gulp.src('./compatible/locales/en-US/*')
    .pipe(gulp.dest(originDist + '/origin/locales/en-US'));
    gulp.src('./compatible/locales/zh/*')
    .pipe(gulp.dest(originDist + '/origin/locales/zh'));
    gulp.src('./compatible/locales/zh-CN/*')
    .pipe(gulp.dest(originDist + '/origin/locales/zh-CN'));
    gulp.src('./compatible/locales/zh_CN/*')
    .pipe(gulp.dest(originDist + '/origin/locales/zh_CN'));
});

gulp.task('originexternal', function() {
  return gulp.src('./compatible/external/*')  /*liuyk需要复制过去*/
    .pipe(gulp.dest(originDist + '/origin/external'))
});


gulp.task('originassets', ['originlocales', 'originexternal'], function(){
  return gulp.src('./compatible/assets/**')
    //.pipe(gulp.dest('dist/originassets'))
        .pipe(gulp.dest(originDist + '/origin'))
});

///////////////////////////////////////

/* JS直接使用新的JS加上兼容js*/
gulp.task('originbizcorejs',function(){
  return gulp.src('./compatible/biz/biz.core.js')
    .pipe(concat('u.biz.core.js'))
    .pipe(gulp.dest(originDist + '/origin/js'))
    .pipe(uglify())
    .on('error', errHandle)
    .pipe(concat('u.biz.core.min.js'))
    .pipe(gulp.dest(originDist + '/origin/js'));
});

gulp.task('originbizjs',function(){
  return gulp.src(originGlobs.bizjs)
    .pipe(concat('u.biz.js'))
    .pipe(gulp.dest(originDist + '/origin/js'))
    .pipe(uglify())
    .on('error', errHandle)
    .pipe(rename('u.biz.min.js'))
    .pipe(gulp.dest(originDist + '/origin/js'));
});

gulp.task('originujs',function(){
  return gulp.src(originGlobs.js)
    .pipe(concat('u.js'))
    .pipe(gulp.dest(originDist + '/origin/js'))
    .pipe(uglify()).on('error', errHandle)
        .pipe(rename('u.min.js'))
        .pipe(gulp.dest(originDist + '/origin/js'));
});

gulp.task('originjs', ['originbizcorejs','originbizjs','originujs'],function() {

});
///////////////////////////////////////


/* CSS直接使用新的css*/
gulp.task('originless:ui', function() {
    return gulp.src('./compatible/less/import.less')
        .pipe(less())
        .pipe(rename('oldu.css'))
        .pipe(gulp.dest(originDist + '/origin/css'));
});

gulp.task('originless',['originless:ui'], function() {
  return gulp.src([uuiDist + '/css/u.css',uuiDist + '/origin/css/oldu.css','./compatible/css/u.css',uuiDist + '/css/grid.css'])
    .pipe(concat('u.css'))
    .pipe(gulp.dest(originDist + '/origin/css'))
  .pipe(minifycss())
  .pipe(concat('u.min.css'))
  .pipe(gulp.dest(originDist + '/origin/css'));

});
///////////////////////////////////////

gulp.task('origin', ['originassets', 'originjs', 'originless']);
