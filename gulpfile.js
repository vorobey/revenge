var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var connect = require("gulp-connect");
var sass = require('gulp-sass');
var rename = require('gulp-rename');

gulp.task('js:vendor', function () {
    return gulp.src('assets/vendor/**/*.js')
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/js'));
});
gulp.task("js:compile", function () {
    return gulp.src("assets/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat("app.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/js"));
});
gulp.task("js:watch", function () {
    return gulp.watch(["assets/js/**/*.js"], ['js:compile']);
});
gulp.task('connect', function() {
    connect.server({
        root: './',
        port: 3067
    });
});
gulp.task('styles:compile', function () {
    gulp.src(['./assets/sass/style.sass'])
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [

            ],
            errLogToConsole: false
        }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('dist/css'));

});

gulp.task('files', function () {
    gulp.src(['./assets/images/**/*'])
        .pipe(gulp.dest('dist/images/'));
    return gulp.src(['./assets/files/**/*'])
        .pipe(gulp.dest('dist/files'));

});
gulp.task('files:watch', function () {
    gulp.watch(['./assets/images/**/*', './assets/files/**/*'], ['files']);
});
gulp.task('styles:watch', function() {
    gulp.watch(['./assets/sass/**/*.sass', './assets/sass/**/*.scss'], ['styles:compile']);
});

gulp.task('dev', ['js:compile', 'js:watch', 'js:vendor', 'styles:compile', 'styles:watch', 'files', 'files:watch',
    'connect']);

gulp.task('deploy', ['js:compile', 'js:vendor', 'styles:compile', 'files']);