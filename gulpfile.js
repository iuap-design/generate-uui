var gulp = require('gulp');
var $ = require('gulp-load-plugins');

gulp.task('concat', function(){
  return gulp.src()
    .pipe($.concat())
    .pipe(rename('u.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['concat'])
