"use strict";

const  gulp = require("gulp");
const   sass = require("gulp-sass");
const   plumber = require("gulp-plumber");
const   sourcemap = require("gulp-sourcemaps");
const   postcss = require("gulp-postcss");
const   rename = require("gulp-rename");
const   csso = require("gulp-csso");
const   autoprefixer = require("autoprefixer");
const   server = require("browser-sync").create();
const   posthtml = require("gulp-posthtml");
const   include = require("posthtml-include");
const   del = require("del");
const  concat = require('gulp-concat');
const  uglify = require('gulp-uglify-es').default;

gulp.task("css", function () {
    return gulp.src("app/scss/style.scss")
      .pipe(plumber())
      .pipe(sourcemap.init())
      .pipe(sass())
      .pipe(postcss([
        autoprefixer()
      ]))
      .pipe(csso())
      .pipe(rename("style.min.css"))
      .pipe(sourcemap.write("."))
      .pipe(gulp.dest("dest/css"))
      .pipe(server.stream());
  });

gulp.task("html", function () {
    return gulp.src("app/*.html")
        .pipe(posthtml([
            include()
        ]))
        .pipe(gulp.dest("dest"));
});

gulp.task("scripts", function() {
	return gulp.src([
		'app/js/scripts.js',
		])
	.pipe(concat('scripts.min.js')) 
	.pipe(uglify()) 
	.pipe(gulp.dest('dest/js')) 
	.pipe(server.stream()); 
});

gulp.task("refresh", function (done) {
    server.reload();
    done();
});

gulp.task("server", function () {
    server.init({
        server: "dest/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });
    gulp.watch("app/scss/**/*.{scss,sass}", gulp.series("css"));
    gulp.watch("app/*.html", gulp.series("html", "refresh"));
    gulp.watch(['app/libs/swiper/*.js',"app/*.js"],gulp.series("scripts"));
});

gulp.task("copy", function () {
    return gulp.src([
        "app/fonts/**/*.{woff,woff2}",
        "app/js/**",
        "app/img/**",
        "app/*.ico"
    ], {
        base: "app"
    })
        .pipe(gulp.dest("dest"));
});
gulp.task("clean", function () {
    return del("dest");
});

gulp.task("build", gulp.series(
    "clean",
    "copy",
    "css",
    "html",
    "scripts"
));

gulp.task("start", gulp.series("build", "server"));