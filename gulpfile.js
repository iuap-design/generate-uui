var gulp = require('gulp');
var $ = require('gulp-load-plugins');

var pathOfJS = [
  'iuap-design/dist/js/u-ui.js',
  'datatable/dist/js/u-model.js',
  'datetimepicker/dist/js/u-date.js'
]

var pathOfCSS = [
  'iuap-design/dist/css/u.css',
  'datetimepicker/dist/css/date.css'
]

var pathOfCopyCSS = [
  'iuap-design/dist/css/u-extends.css',
  'iuap-design/dist/css/font-awesome.css'
]

gulp.task('js', function(){
  gulp.src( pathOfJS )
    .pipe($.concat())
    .pipe(rename('u.js'))
    .pipe(gulp.dest('dist/js'))
})

gulp.task('css', function(){
  gulp.src( pathOfCSS )
    .pipe($.concat())
    .pipe(rename('u.css'))
    .pipe(gulp.dest('dist/css'))
})

gulp.task('copycss', function(){
  gulp.src( pathOfCopyCSS )
    .pipe(gulp.dest('dist/css'))
})

gulp.task('copyfont', function(){
  gulp.src('iuap-design/dist/fonts/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('default', ['css', 'js', 'copycss', 'copyfont'])
