const $ = global.$;
const path = global.taskPath;

const gulp = require('gulp');
const del = require('del');

gulp.task('clean:style', () => {
    return del(path.build.style);
});
gulp.task('build:style', () => {
    return gulp.src(path.src.style)
        .pipe($.plumber({ errorHandler: global.errorHandler }))
        .pipe($.sass_glob())
        .pipe($.sass()).on('error', function (err) {
            $.sass.logError.bind(this)(err);
        })
        .pipe($.autoprefixer("last 2 version", "> 1%", "ie 11"))
        .pipe($.cssmin())
        .pipe($.insert.append(path.src.lineending))
        .pipe($.ext_replace('.min.css'))
        .pipe(gulp.dest(path.build.style))
});

gulp.task('dev:style', () => {
    return gulp.src(path.src.style)
        .pipe($.plumber({ errorHandler: global.errorHandler }))
        .pipe($.sass_glob())
        // .pipe($.sourcemaps.init())
        .pipe($.sass()).on('error', function (err) {
            this.emit('end');
        })
        // .pipe($.sourcemaps.write())
        .pipe($.autoprefixer("last 2 version", "> 1%", "ie 11"))
        .pipe($.insert.append(path.src.lineending))
        .pipe($.ext_replace('.min.css'))
        .pipe(gulp.dest(path.build.style))
});

gulp.task('watch:style', () => {
    return gulp.watch(path.watch.style, gulp.series('dev:style', 'server:reload'));
});
