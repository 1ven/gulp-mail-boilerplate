var gulp = require('gulp');
var connect = require('gulp-connect');
var del = require('del');
var plumber = require('gulp-plumber');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
var inlineCss = require('gulp-inline-css');
var runSequence = require('run-sequence');

var DEST = './build';
var TEMP = './temp';

gulp.task('clean_build', function() {
    return del(DEST);
});

gulp.task('clean_temp', function() {
    return del(TEMP);
});

gulp.task('connect', function() {
    connect.server({
        root: 'build',
        port: '1337',
        livereload: true
    });
});

gulp.task('stylus', function () {
    return gulp.src('./src/common.styl')
        .pipe(plumber())
        .pipe(stylus())
        .pipe(gulp.dest(TEMP+'/css'))
        .pipe(connect.reload());
});

gulp.task('jade', function () {
    return gulp.src('./src/jade/*.jade')
        .pipe(jade())
        .pipe(gulp.dest(TEMP));
});

gulp.task('html', ['jade'], function () {
    return gulp.src('./temp/*.html')
        .pipe(inlineCss())
        .pipe(gulp.dest(DEST))
        .pipe(connect.reload());
});

gulp.task('img', function () {
    return gulp.src('./src/img/*.*')
        .pipe(gulp.dest(DEST+'/img'));
});

gulp.task('watch', function () {
    gulp.watch('./src/common.styl', ['stylus']);
    gulp.watch(['./src/jade/*.jade', './src/jade/**/*.jade'], ['html']);
    gulp.watch(['./src/img/*.*'], ['img']);
});

gulp.task('default', function (callback) {
    runSequence(
        'clean_build',
        ['jade', 'stylus'],
        'html',
        'clean_temp',
        ['watch', 'img', 'connect'],
        callback
    );
});
