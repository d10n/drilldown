'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var path = require('path');

gulp.task('test', function() {
    return gulp.src('./src/**/*-spec.js', {read: false})
        .pipe(mocha({
            require: [path.resolve('./mocha-helper.js')]
        }));
});

gulp.task('coverage', function() {
    return gulp.src(['./src/**/*.js', '!./src/**/*-spec.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', function() {
            gulp.src(['./src/**/*-spec.js'])
                .pipe(mocha({
                    require: [path.resolve('./mocha-helper.js')]
                }))
                .pipe(istanbul.writeReports())
        });
});

gulp.task('browserify', function() {
    var input = './src/drilldown.js';
    return browserify({
        entries: [path.resolve(input)],
        standalone: 'dd'
    })
        .bundle()
        .pipe(source(input))
        .pipe(rename('drilldown.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'))
        .pipe(rename('drilldown.min.js'))
        .pipe(uglify({compress: {dead_code: true}}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['browserify']);
