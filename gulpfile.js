var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var CacheBuster = require('gulp-cachebust');

var config = require('./config.json');

var cachebust = new CacheBuster();

gulp.task('connect', function () {
    connect.server({
        port: 3000,
        fallback: './index.html'
    });
});


gulp.task('build-libraries-script', function () {
    return gulp.src([
        './node_modules/particles.js/particles.js',
    ])
        .pipe(babel())
        .pipe(concat('Libs.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('Libs.min.js'))
        .pipe(gulp.dest('dist'))
        .pipe(cachebust.resources())
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('build-libraries-style', function () {
    return gulp.src([
    ])
        .pipe(concat('Libs.css'))
        .pipe(gulp.dest('dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist'))
        .pipe(cachebust.resources())
        .pipe(gulp.dest('dist'))
});


gulp.task('build-scripts', function () {
    return gulp.src([
        './scripts/**/*.js'
    ])
        // .pipe(babel({ presets: ['env'] }))
        .pipe(concat('Scripts.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('Scripts.min.js'))
        .pipe(gulp.dest('dist'))
        .pipe(cachebust.resources())
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('build-styles', function () {
    return gulp.src('styles/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist'))
        .pipe(cachebust.resources())
        .pipe(gulp.dest('dist'))
});

gulp.task('build-html', [
    'build-styles',
    'build-scripts',
    'build-libraries-script'
], function () {
    return gulp.src('index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('./dist'));
});


let sequence = [
    'build-scripts',
    'build-libraries-script',
    'build-libraries-style',
    'build-styles',
    'build-html'
];
if (config.debug) {
    sequence.push('connect');
}

gulp.task('default', function () {
    runSequence(sequence);
});