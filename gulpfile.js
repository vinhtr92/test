var gulp         = require('gulp');
var sequence     = require('gulp-sequence');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var sassGlob     = require('gulp-sass-glob');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var notify       = require('gulp-notify');
var htmlmin      = require('gulp-htmlmin');
var cssnano      = require('gulp-cssnano');
var uglify       = require('gulp-uglify');
var filter       = require('gulp-filter');
var zip          = require('gulp-zip');
var through2     = require('through2');
var del          = require('del');
var cp           = require('child_process');
var gutil        = require('gulp-util');
var fs           = require('fs');

/**
 * Handle errors and alert the user.
 */
function handleErrors() {
  var args = Array.prototype.slice.call(arguments);

  notify.onError({
    title: 'Task Failed! See console.',
    message: "\n\n<%= error.message %>",
    sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).apply(this, args);

  gutil.beep(); // Beep 'sosumi' again

  // Prevent the 'watch' task from stopping
  this.emit('end');
}

/**
 * Compile SASS, minify and run stylesheet through autoprefixer.
 */
gulp.task('scss', function() {
  return gulp.src(['source/_scss/*.scss', '!source/_scss/dev.scss'])
    .pipe(sourcemaps.init())
    .pipe(sassGlob({ ignorePaths: ['**/*~split.scss'] }))
    .pipe(sass().on('error', handleErrors))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('scss:templates', function() {
  return gulp.src(['source/*/assets/css/*.scss'], {base: 'source'})
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on('error', handleErrors))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('scss:dev', function() {
  return gulp.src('source/_scss/dev.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', handleErrors))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

/**
 * Build pattern lab source code.
 */
gulp.task('patternlab:build', function() {
  if (fs.existsSync('patternlab.phar')) {
    return cp.spawn('php' , ['patternlab.phar', 'build'], {stdio: 'inherit'});
  }

  var patternlab = process.platform === 'win32' ? 'patternlab.bat' : 'patternlab';
  return cp.spawn(patternlab , ['build'], {stdio: 'inherit'});
});

/**
 * Start browsersync and watch change files.
 */
gulp.task('watch', function () {
  browserSync.init({
    server: {
      baseDir: './public',
      directory: false
    },
    snippetOptions: {
      // Ignore all HTML files within the templates folder
      blacklist: ['/index.html', '/', '/?*']
    }
  });

  gulp.watch([
    'source/**/*.md',
    'source/**/*.json',
    'source/**/*.yml',
    'source/**/*.yaml',
    'source/**/*.twig',
    'source/assets/**/*',
    'source/*/assets/**/*',
  ]).on('change', gulp.series('patternlab:build', browserSync.reload));

  gulp.watch('source/_scss/dev.scss', gulp.parallel('scss:dev'));
  gulp.watch('source/*/assets/css/*.scss', gulp.parallel('scss:templates'));

  gulp.watch(['source/_patterns/**/*.scss'], gulp.parallel('scss'));
  gulp.watch(['source/_scss/**/*.scss', '!source/_scss/dev.scss'], gulp.parallel('scss'));
});

gulp.task('build', gulp.series('patternlab:build', 'scss', 'scss:templates'));
gulp.task('default', gulp.series('build', 'watch'));
