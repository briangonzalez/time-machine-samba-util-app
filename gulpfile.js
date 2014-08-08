// Requires.
// ------------
var gulp = require('gulp');
var exec = require('child_process').exec;


// Sass.
// ------------
gulp.task('build', function() {
  exec("rm -rf ./build && nwbuild . -v 0.10.1");
});
