var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var exec = require('child_process').exec;
var zip = require('gulp-zip');
var flatmap = require('gulp-flatmap');
var del = require('del');
var fs = require('fs');
var uuiPkg = require('./package.json');
var process = require('child_process');
var originVersion = '2.0.1';

var version = require('./version.js');

var uuiDist = 'dist/uui/' + uuiPkg.version;
var originDist = 'dist/uui/' + originVersion;

var distModules = ['neoui', '', 'neoui-datetimepicker', 'neoui-grid', 'tree']


var pathcopyjs = [
    'node_modules/kero-adapter/dist/js/u.js',
    'node_modules/kero-adapter/dist/js/u.min.js',
    'neoui-grid/dist/js/u-grid.js',
    'neoui-grid/dist/js/u-grid.min.js',
    'neoui-tree/dist/js/u-tree.js',
    'neoui-tree/dist/js/u-tree.min.js'
]

var pathOfCopyCSS = [
    'node_modules/kero-adapter/dist/fonts/font-awesome/css/font-awesome.css',
    'node_modules/kero-adapter/dist/fonts/font-awesome/css/font-awesome.min.css',
    'neoui-grid/dist/css/grid.css',
    'neoui-grid/dist/css/grid.min.css',
    'neoui-tree/dist/css/tree.css',
    'neoui-tree/dist/css/tree.min.css'
]

var notIncludeCss = '!'+ uuiDist + '/css/font-awesome' + '*' + '.css';

gulp.task('name', function(){
    gulp.src('node_modules/kero-adapter/dist/css/neoui.css')
        .pipe(rename('u.css'))
        .pipe(gulp.dest(uuiDist + '/css'));

    gulp.src('node_modules/kero-adapter/dist/css/neoui.min.css')
        .pipe(rename('u.min.css'))
        .pipe(gulp.dest(uuiDist + '/css'));

})

gulp.task('copyjs', function(){
    gulp.src(pathcopyjs)
        .pipe(gulp.dest(uuiDist + '/js/'))
})

gulp.task('copycss', function(){
    gulp.src(pathOfCopyCSS)
        .pipe(gulp.dest(uuiDist + '/css/'))
})

gulp.task('copyfont', function(){
    gulp.src(['node_modules/kero-adapter/dist/fonts/*.*','node_modules/kero-adapter/dist/fonts/font-awesome/fonts/**'])
        .pipe(gulp.dest(uuiDist + '/fonts/'));
})

gulp.task('copyimg', function(){
    gulp.src(['node_modules/kero-adapter/dist/images/**'])
        .pipe(gulp.dest(uuiDist + '/images/'));
})

gulp.task('commit', ['name', 'copycss', 'copyjs','copyfont','copyimg'], function(){
    version.init([
        uuiDist + '/js/u.js',
        uuiDist + '/js/u.min.js',
        uuiDist + '/js/u-tree.js',
        uuiDist + '/js/u-tree.min.js',
        uuiDist + '/js/u-grid.js',
        uuiDist + '/js/u-grid.min.js',
        uuiDist + '/css/u.css',
        uuiDist + '/css/u.min.css',
        uuiDist + '/css/grid.css',
        uuiDist + '/css/grid.min.css',
        uuiDist + '/css/tree.css',
        uuiDist + '/css/tree.min.css'
    ]);
})


gulp.task('dist', ['commit'], function(){
    gulp.run('down');
    gulp.run('new');
});



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









// maven 配置信息

var publishConfig = {
    command: "mvn",
    repositoryId: "iUAP-Stagings",
    repositoryURL: "http://172.16.51.12:8081/nexus/content/repositories/iUAP-Stagings",
    artifactId: "iuap-design",
    groupId: "com.yonyou.iuap",
    version: "3.1.0"
};



/**
 * 打包为war
 * @param  {[type]} "package" [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
gulp.task("package", function(){
  gulp.src('./dist/uui/latest/**')
      .pipe(zip('iuap-design.war'))
      .pipe(gulp.dest('./'));

  console.info('package ok!');
});

/**
 * install 到本地
 * @param  {[type]} "install" [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
gulp.task("install", ["package"], function(){

  var targetPath = fs.realpathSync('.');

  // 安装命令
  var installCommandStr = publishConfig.command +
      " install:install-file -Dfile=" + targetPath +
      "/iuap-design.war   -DgroupId="+ publishConfig.groupId +
      " -DartifactId=" + publishConfig.artifactId +
      "  -Dversion="+ publishConfig.version +" -Dpackaging=war";

    var installWarProcess = process.exec(installCommandStr, function(err,stdout,stderr){
        if(err) {
            console.log('install war error:'+stderr);
        }
    });

    installWarProcess.stdout.on('data',function(data){
        console.info(data);
    });
    installWarProcess.on('exit',function(data){
    console.info('install war success');
  })

});

/**
 * 发布到maven仓库中
 * @param  {[type]} "deploy"    [description]
 * @param  {[type]} ["package"] [description]
 * @param  {[type]} function(   [description]
 * @return {[type]}             [description]
 */
gulp.task("maven", ["install"], function(){
  var targetPath = fs.realpathSync('.');

  var publishCommandStr =  publishConfig.command + " deploy:deploy-file  -Dfile="+ targetPath+"/iuap-design.war   -DgroupId="+ publishConfig.groupId +" -DartifactId="+ publishConfig.artifactId +"  -Dversion="+ publishConfig.version +" -Dpackaging=war  -DrepositoryId="+ publishConfig.repositoryId +" -Durl=" +publishConfig.repositoryURL;

  console.info(publishCommandStr);

  var publishWarProcess =   process.exec(publishCommandStr, function(err,stdout,stderr){
    if(err) {
      console.log('publish war error:'+stderr);
    }
  });

  publishWarProcess.stdout.on('data',function(data){
    console.info(data);
  });
  publishWarProcess.on('exit',function(data){
    console.info('publish  war success');
  });

})


