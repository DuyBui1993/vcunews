var gulp        = require('gulp');
var gutil       = require('gulp-util');
var bower       = require('bower');
var concat      = require('gulp-concat');
var sass        = require('gulp-sass');
var minifyCss   = require('gulp-minify-css');
var rename      = require('gulp-rename');
var sh          = require('shelljs');
var concat      = require('gulp-concat');
var wrap        = require("gulp-wrap");
var uglify      = require('gulp-uglify');
var inline = require('gulp-angular-inline-template');
var splice = require('gulp-splice');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/**/*.js'],
  template: ['./www/**/*.template.html']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('bundleHtml', function() {
  gulp.src(paths.template)
    .pipe(inline())
    .pipe(splice({key:'##template##',outer:'index.html'}))
    .pipe(gulp.dest('./www'));
})

gulp.task('bundleScript', function() {
    return gulp.src([
                     './www/js/app.js',
                     './www/js/route.js',
                     './www/js/factory.js',
                     './www/component/**/*.controller.js',
                    ])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./www/js/'))
        .pipe(rename('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("./www/js/"));
});


gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['bundleScript']);
  gulp.watch(paths.template, ['bundleHtml']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
