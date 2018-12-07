var gulp          = require('gulp');
var wait      = require('gulp-wait');
var babel         = require("gulp-babel");
var sass          = require('gulp-sass');
var browserSync   = require('browser-sync');
var del           = require('del');
var imagemin      = require('gulp-imagemin');
var pngquant      = require('imagemin-pngquant');
var cache         = require('gulp-cache');
var autoprefixer  = require('gulp-autoprefixer');

gulp.task('sass', function() {
  return gulp.src('src/scss/*.scss')
  .pipe(wait(500))
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(autoprefixer(['last 5 versions', '> 1%'], {cascade: true }))
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({stream: true}))
});


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: false
  });
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('clear', function() {
  return cache.clearAll();
});
gulp.task('img', function() { 
  return gulp.src('src/images/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugings: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('dist/images'));
})

gulp.task('watch', ['browser-sync', 'sass'], function() {
  gulp.watch('src/scss/*.scss', ['sass']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/*.js', browserSync.reload);
});


gulp.task('build', ['clean','img','sass'], function() {
  var buildCss = gulp.src('src/css/style.css')
    .pipe(gulp.dest('dist/css'));

  var buildJs = gulp.src('src/js/**/*')
    .pipe(babel())
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});