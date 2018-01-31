const gulp = require('gulp');
const browserSync = require('browser-sync').create();

gulp.task('server:init', () => {
    return browserSync.init({
    port: 3000,
        server: {
            baseDir: './'
        },
        reloadDelay: 75
    });
});

gulp.task('server:reload', function(done) {
    browserSync.reload();
    done();
});

