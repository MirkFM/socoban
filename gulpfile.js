// assets (build directory)
//  |- css
//  |- img
//  |- js
//  |- sass
// dist (sources directory)
//  |- pug
//  |- img
//  |- js
//  |- sass
//	|- pug
// *.html (build)
// gulpfile.js
// package.json

var gulp				= require('gulp'),
	pipe				= require('multipipe'),
	watch				= require('gulp-watch'),
	plumber				= require('gulp-plumber'),
	gulpif				= require('gulp-if'),
	filter				= require('gulp-filter'),
	del					= require('del'),
	runSequence			= require('gulp-run-sequence'),
	newer				= require('gulp-newer'),
	ext_replace			= require('gulp-ext-replace'),
	pug					= require('gulp-pug'),
	gulpPrettyDiff		= require("gulp-prettydiff"),
	sassGlobbing		= require('gulp-sass-glob'),
	sass				= require('gulp-sass'),
	compassImagehelper	= require('gulp-compass-imagehelper'),
	sourcemaps			= require('gulp-sourcemaps'),
	prefixer			= require('gulp-autoprefixer'),
	cssmin				= require('gulp-minify-css'),
	imagemin			= require('gulp-imagemin'),
	pngquant			= require('imagemin-pngquant'),
	browserSync			= require('browser-sync'),
	data				= require('gulp-data'),
	filePath			= require('path'),
	fs					= require('fs');

var path = {
		build: {
			style: 'assets/css/',
			compassHelper: 'dist/sass/helpers',
			image: 'assets/img/',
			js: 'assets/js/',
			plugin: 'assets/plugins/',
			font: 'assets/fonts/',
			html: ''
		},
		src: {
			style: 'dist/sass/**/*.scss',
			image: ['dist/img/**/*.*', '!dist/img/images/**/*.*'],
			js: 'dist/js/**/*.js',
			plugin: 'dist/plugins/**/*.*',
			font: 'dist/fonts/**/*.*',
			html: ['dist/pug/*.pug', '!dist/pug/_*.pug']
		},
		watch: {
			html: 'dist/pug/**/*.pug'
		}
};

function watchPath(type) {
	return path.watch[type] || path.src[type];
}

function wrapPipe(taskFn) {
	return function(done) {
		var onSuccess = function() {
			done();
		};
		var onError = function(err) {
			console.log(err);
			console.warn(err);
			done(err);
		};
		var outStream = taskFn(onSuccess, onError);
		if(outStream && typeof outStream.on === 'function') {
			outStream.on('end', onSuccess);
		}
	};
}

// html tasks
gulp.task('clean:html', function() {
	return del(path.build.html + '*.html');
});
gulp.task('build:html', wrapPipe(function(success, error) {
	return gulp.src(path.src.html)
		.pipe(data(function() {
			var pathFile = './dist/data/_all.json';

			if (fs.existsSync(pathFile)) {
				console.log(pathFile);
				return JSON.parse(fs.readFileSync(pathFile));
			}
		}))
		.pipe(data(function(file) {
			var pathFile = './dist/data/' + filePath.basename(file.path, '.pug') + '.json';

			if (fs.existsSync(pathFile)) {
				console.log(pathFile);
				return JSON.parse(fs.readFileSync(pathFile));
			}
		}))
		.pipe(pug({basedir: '../'}).on('error', error))
		.pipe(gulpPrettyDiff({
				lang: "html",
				inchar: "	",
				insize: 1,
				force_indent: true,
				wrap: 0,
				textpreserve: true,
				spaceclose: true,
				mode: "beautify"
		}).on('error', error))
		.pipe(gulp.dest(path.build.html));
}));
gulp.task('watch:html', wrapPipe(function(success, error) {
	return gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(data(function() {
			var pathFile = './dist/data/_all.json';

			if (fs.existsSync(pathFile)) {
				return JSON.parse(fs.readFileSync(pathFile));
			}
		}))
		.pipe(data(function(file) {
			var pathFile = './dist/data/' + filePath.basename(file.path, '.pug') + '.json';

			if (fs.existsSync(pathFile)) {
				return JSON.parse(fs.readFileSync(pathFile));
			}
		}))
		.pipe(pug({basedir: '../'}).on('error', error))
		.pipe(gulpPrettyDiff({
				lang: "html",
				inchar: "	",
				insize: 1,
				force_indent: true,
				wrap: 0,
				textpreserve: true,
				spaceclose: true,
				mode: "beautify"
		}).on('error', error))
		.pipe(gulp.dest(path.build.html));
}));

gulp.task('imagehelper', function () {
	return gulp.src(path.src.image)
		.pipe(compassImagehelper({
			targetFile: '_imagehelper.scss',
			template: '../node_modules/gulp-compass-imagehelper/custom.mustache',
			images_path: 'img/',
			css_path: 'css/'
		}))
		.pipe(gulp.dest(path.build.compassHelper));
});

// style tasks
gulp.task('clean:style', function() {
	return del(path.build.style);
});
gulp.task('build:style', wrapPipe(function(success, error) {
	return gulp.src(path.src.style)
		.pipe(sassGlobbing().on('error', error))
		.pipe(sass().on('error', error))
		.pipe(prefixer("last 2 version", "> 1%", "ie 9").on('error', error))
		.pipe(ext_replace('.min.css').on('error', error))
		.pipe(gulp.dest(path.build.style));
}));
gulp.task('watch:style', wrapPipe(function(success, error) {
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(sassGlobbing().on('error', error))
		.pipe(sourcemaps.init())
			.pipe(sass().on('error', error))
		.pipe(sourcemaps.write())
		.pipe(prefixer("last 2 version", "> 1%", "ie 9").on('error', error))
		.pipe(ext_replace('.min.css').on('error', error))
		.pipe(gulp.dest(path.build.style));
}));


// js tasks
gulp.task('clean:js', function() {
	return del(path.build.js);
});
gulp.task('build:js', wrapPipe(function(success, error) {
	return gulp.src(path.src.js)
		.pipe(ext_replace('.min.js').on('error', error))
		.pipe(gulp.dest(path.build.js));
}));
gulp.task('watch:js', wrapPipe(function(success, error) {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(ext_replace('.min.js').on('error', error))
		.pipe(gulp.dest(path.build.js));
}));


// image tasks
gulp.task('clean:image', function() {
	return del(path.build.image);
});
gulp.task('build:image', wrapPipe(function(success, error) {
	return gulp.src(path.src.image)
		.pipe(newer(path.build.image))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}).on('error', error))
		.pipe(gulp.dest(path.build.image));
}));
gulp.task('watch:image', ['build:image']);


// font tasks
gulp.task('clean:font', function() {
	return del(path.build.font);
});
gulp.task('build:font', wrapPipe(function(success, error) {
	return gulp.src(path.src.font)
		.pipe(newer(path.build.font))
		.pipe(gulp.dest(path.build.font));
}));
gulp.task('watch:font', ['build:font']);


// plugin tasks
gulp.task('clean:plugin', function() {
	return del(path.build.plugin);
});
gulp.task('build:plugin', wrapPipe(function(success, error) {
	return gulp.src(path.src.plugin)
		.pipe(newer(path.build.plugin))
		.pipe(gulp.dest(path.build.plugin));
}));
gulp.task('watch:plugin', ['build:plugin']);


// server
gulp.task('server', function() {
	browserSync.init({
		port: 3000,
		server: {
			baseDir: './'
		},
		reloadDelay: 75
	});
});

gulp.task('watch', function(){
	watch(watchPath('style'), function() {
		runSequence('watch:style', browserSync.reload);
	});

	watch(watchPath('html'), function() {
		runSequence('watch:html', browserSync.reload);
	});

	watch(watchPath('js'), function() {
		runSequence('watch:js', browserSync.reload);
	});

	watch(watchPath('plugin'), function() {
		runSequence('watch:plugin', browserSync.reload);
	});

	watch(watchPath('font'), function() {
		runSequence('watch:font', browserSync.reload);
	});

	watch(watchPath('image'), function() {
		runSequence('watch:image', 'imagehelper', browserSync.reload);
	});
});

gulp.task('clean', [
	'clean:html',
	'clean:style',
	'clean:js'
]);

gulp.task('clean:all', [
	'clean',
	'clean:image',
	'clean:font',
	'clean:plugin'
]);

gulp.task('build', [
	'build:html',
	'build:style',
	'build:js'
]);

gulp.task('copy', [
	'build:image',
	'build:font',
	'build:plugin'
]);

gulp.task('build:all', ['clean:all'], function() {
	runSequence(
		'copy',
		'imagehelper',
		'build'
	);
});

gulp.task('default', ['clean'], function() {
	runSequence(
		'copy',
		'imagehelper',
		'build',
		'server',
		'watch'
	);
});