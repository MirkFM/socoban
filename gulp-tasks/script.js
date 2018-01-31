const $ = global.$;
const path = global.taskPath;

const gulp = require('gulp');
const del = require('del');

gulp.task('clean:script', () => {
    return del(path.build.script);
});
gulp.task('build:script', () => {
    return gulp.src(path.src.script)
        .pipe($.plumber({ errorHandler: global.errorHandler }))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.uglify())
        .pipe($.insert.append(path.src.lineending))
        .pipe($.ext_replace('.min.js'))
        .pipe(gulp.dest(path.build.script))
});

gulp.task('dev:script', gulp.series(
    'build:script'
));

gulp.task('watch:script', () => {
    return gulp.watch(path.watch.script, gulp.series('dev:script', 'server:reload'));
});
