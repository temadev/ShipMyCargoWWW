var gulp = require('gulp')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , jade = require('gulp-jade')
  , less = require('gulp-less')
  , livereload = require('gulp-livereload')
  , tinylr = require('tiny-lr')
  , marked = require('marked')
  , path = require('path')
  , changed = require('gulp-changed')
  , prettify = require('gulp-html-prettify')
  , server = tinylr();

// LiveReload port. Change it only if there's a conflict
var lvr_port = 35729;

// SOURCES CONFIG 
var source = {
  scripts: {
    app: ['public/js/modules/*.js', 'public/js/app.init.js']
  }
};

// BUILD TARGET CONFIG 
var build = {
  scripts: {
    app: {
      main: 'app.js',
      dir: 'public/js/'
    }
  }
};

// Error handler
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}


//---------------
// TASKS
//---------------


// JS APP
gulp.task('scripts-app', function () {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(source.scripts.app)
    //.pipe(uglify())  /* UNCOMMENT TO MINIFY * /
    .pipe(concat(build.scripts.app.main))
    .pipe(gulp.dest(build.scripts.app.dir))
    .pipe(livereload(server));
});


//---------------
// WATCH
//---------------

// Rerun the task when a file changes
gulp.task('watch', function () {
  try {
    server.listen(
      lvr_port,
      function (err) {

        if (err) {
          return console.log(err);
        }

        gulp.watch(source.scripts.app, ['scripts-app']);

      });
  }
  catch (e) {
    console.log(e);
  }

});

//---------------
// DEFAULT TASK
//---------------

gulp.task('default', [
  'scripts-app',
  'watch'
]);
