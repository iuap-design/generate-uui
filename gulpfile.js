var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

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
  'iuap-design/dist/css/u-extend.css',
  'iuap-design/dist/css/font-awesome.css'
]

gulp.task('js', function(){
  gulp.src( pathOfJS )
    .pipe(concat('u.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename('u.min.js'))
    .pipe(gulp.dest('dist/js'))
})

gulp.task('css', function(){
  gulp.src( pathOfCSS )
    .pipe(concat('u.css'))
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
