'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const del = require('del');
const ghPages = require('gh-pages');


gulp.task('style', function() {
  gulp.src('src/assets/styles/scss/main.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      require('postcss-fixes'),
      require('autoprefixer'),
      require('cssnano')({
        'safe': true,
        'calc': false
      })
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('public/assets/styles'))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src('src/pug/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('public'))
    .pipe(browserSync.stream());
});

gulp.task('images', function() {
  return gulp.src('src/assets/images/**/**/*.{png,jpg,gif}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
    ]))
    .pipe(gulp.dest('public/assets/images'));
});

gulp.task('js', function () {
  return gulp.src('src/js/**/*.js')
      // .pipe(concat('script.js'))
      // .pipe(uglify())
      // .pipe(rename('script.min.js'))
      .pipe(gulp.dest('public/js'))
      .pipe(browserSync.stream());
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'public',
    notify: false,
    open: true
  });

  gulp.watch('src/assets/styles/**/**/*.scss', ['style']);
  gulp.watch('src/pug/**/**/**/**/*.pug', ['html']);
  gulp.watch('src/assets/img/**/*.*', ['images']);
  gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('copy', function() {
  return gulp.src([
    'src/assets/fonts/*.{woff,woff2}',
    'src/js/**/*.js',
    'src/vendors/**'
  ], {
    base: './src/'
  })
    .pipe(gulp.dest('./public'));
});

gulp.task('clean', function() {
  return del.sync([
    'public/**'
  ]);
});

gulp.task('upload', () => {
	return ghPages.publish('public')
});

gulp.task('default', [
  'clean',
  'copy',
  'html',
  'style',
  'js',
  'images',
  'serve'
]);

gulp.task('publish', [
  'clean',
  'copy',
  'html',
  'style',
  'js',
  'images',
  'upload'
]);