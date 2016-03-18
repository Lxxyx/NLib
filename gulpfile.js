var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task('babel', function () {
  return gulp.src("./src/**/*")
    .pipe(babel())
    .pipe(gulp.dest("./dist"));
});

gulp.task('babel:watch', function () {
  gulp.watch('src/**/*', ['babel'])
})

gulp.task("default", ['babel', 'babel:watch']);