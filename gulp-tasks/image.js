const $ = global.$;
const path = global.taskPath;

const gulp = require('gulp');
const del = require('del');
const pngquant = require('imagemin-pngquant');

gulp.task('clean:image', () => {
    return del(path.build.image);
});

gulp.task('build:image', () => {
    return gulp.src(path.src.image)
        .pipe($.plumber({ errorHandler: global.errorHandler }))
        .pipe($.newer(path.build.image))
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.image))
});

gulp.task('dev:image', gulp.series(
    'build:image'
));

gulp.task('watch:image', () => {
    return gulp.watch(path.watch.image, gulp.series('dev:image', 'server:reload'));
});
