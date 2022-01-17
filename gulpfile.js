'use strict';

var browserify = require('browserify');

var gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var browsersync = require('browser-sync').create();


gulp.task('icons', function() {
    return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('./dist/webfonts/'));
});

gulp.task('modules-css', function() {
    return gulp.src('node_modules/animate.css/animate.min.css')
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('modules-js', function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/waypoints/lib/jquery.waypoints.min.js'
    ]).pipe(gulp.dest('./dist/js/'));
});

// compile scss to css
gulp.task('sass', function () {
    return gulp.src('./sass/styles.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({basename: 'styles.min'}))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('browsersyncServe',function browsersyncServe(cb){
    browsersync.init({
        server: {
        baseDir: '.'
        }    
    });
    cb();
});

gulp.task('browsersyncReload', function browsersyncReload(cb){
browsersync.reload();
cb();
});


gulp.task('watch',
    gulp.series('browsersyncServe', () => watch(['./sass/**/*.scss', './js/**/*.js', '!./js/scripts.min.js'], gulp.series('sass', 'minify-js', 'browsersyncReload')))
);

// minify js
gulp.task('minify-js', function () {

    return gulp.src('./js/scripts.js')
        .pipe(uglify())
        .pipe(rename({basename: 'scripts.min'}))
        .pipe(gulp.dest('./js'));
});


// default task
gulp.task('default', gulp.series('modules-js','modules-css', 'icons', 'sass', 'minify-js'));