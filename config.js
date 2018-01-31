const buildPath = {
    html: './',
    image: './assets/img/',
    script: './assets/js/',
    style: './assets/css/'
};

const srcPath = {
    lineending: '\n',
    html: ['dist/pug/*.pug', '!dist/pug/_*.pug'],
    image: ['./dist/img/**/*.*', '!dist/img/images/**/*.*'],
    script: './dist/js/*.js',
    style: ['./dist/sass/*.scss']
};

let watchPath = {
    html: ['dist/pug/**/*.pug'],
    style: ['./dist/sass/**/*.scss']
};

// src path is default watch path
watchPath = Object.assign({}, srcPath, watchPath);

module.exports = {
    path: {
        build: buildPath,
        src: srcPath,
        watch: watchPath
    }
};
