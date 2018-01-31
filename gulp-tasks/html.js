const $ = global.$;
const path = global.taskPath;

const gulp = require('gulp');
const del = require('del');
const filePath = require('path');
const fs = require('fs');

gulp.task('clean:html', () => {
    return del(path.build.html + '*.html');
});

gulp.task('build:html', () => {
    return gulp.src(path.src.html)
        .pipe($.plumber({ errorHandler: global.errorHandler }))
        .pipe($.pug({
            basedir: '.'
        }))
        .pipe($.prettydiff({
            lang: "html",
            mode: "beautify",
            inchar: " ",
            insize: 4,
            force_indent: true,
            wrap: 0,
            crlf: false,
            textpreserve: true,
            spaceclose: true,
            newline: true
        }))
        .pipe($.insert.append(path.src.lineending))
        // TODO: сделать нормальный репортер
        // .pipe($.htmllint({}, htmllintReporter))
        .pipe($.htmllint())
        .pipe(gulp.dest(path.build.html))
});

gulp.task('dev:html', gulp.series(
    'build:html'
));

gulp.task('watch:html', () => {
    return gulp.watch(path.watch.html, gulp.series('dev:html', 'server:reload'));
});
