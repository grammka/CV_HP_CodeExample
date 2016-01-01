var gulp                = require('gulp'),
	install             = require('gulp-install'),
	plugins             = require('gulp-load-plugins')(),
	templateCache       = require('gulp-angular-templatecache'),
	mainBowerFiles      = require('main-bower-files'),
	del                 = require('del'),
	nib                 = require('nib'),
	historyApiFallback  = require('connect-history-api-fallback');



// DIRECTORIES PATHS -----------------------------------------------------------------

var production, nonotify, rootDir, tmpDir, anguTmpDir;

process.env['__IS_PROD__'] = production = plugins.util.env.prod || plugins.util.env.production;
process.env['__PROJECT_PATH__'] = "build";
nonotify    = plugins.util.env.nonotify;
rootDir     = process.env['__PROJECT_PATH__'] + "/";
tmpDir      = ".tmp/";
anguTmpDir  = ".angu-templates";


function notifyFile(path) {
	var _path = path;

	return function(file) {
		return _path + " generated: " + file.relative;
	}
}


var paths = {
	"jade": {
		"watch": "assets/jade/**/*.jade",
		"source": {
			dev: ["./assets/jade/**/*.jade", "!./assets/jade/**/_*.jade"],
			prod: ["./assets/jade/**/*.jade", "!./assets/jade/**/_*.jade", "!./assets/jade/index.jade"]
		},
		"dest": ""
	},
	"jadeAnguTemplates": {
		"watch": "assets/jade/_angu-templates/*.jade",
		"source": "./assets/jade/_angu-templates/*.jade",
		"dest": anguTmpDir
	},
	"anguTemplates": {
		"source": anguTmpDir + "/*.html",
		"dest": "data/js"
	},
	"stylus": {
		"watch": "assets/styl/**/*.styl",
		"source": ["./assets/styl/**/*.styl", "!./assets/styl/**/_*.styl"],
		"dest": "data/css"
	},
	"js": {
		"watch": "assets/js/app/**/*.js",
		"source": "./assets/js/app/**/*.js",
		"dest": "data/js",
		"name": "app.js"
	},
	"extension": {
		"watch": "assets/js/extension/**/*.js",
		"source": "./assets/js/extension/**/*.js",
		"dest": "data/js",
		"name": "ext.js"
	},
	"vendor": {
		"source": "./assets/js/vendor/**/*.js"
	},
	"components": {
		"watch": "assets/js/components",
		"source": "./assets/js/components",
		"dest": {
			"js": "data/js",
			"css": "data/css",
			"fonts": "data/fonts",
			"images": "data/css/images"
		},
		"name": {
			"js": "vendor.js",
			"css": "vendor.css"
		}
	},
	"json": {
		"watch": "assets/json/**/*",
		"source": "./assets/json/**/*",
		"dest": "data/json"
	},
	"images": {
		"watch": "assets/img/**/*",
		"source": "./assets/img/**/*",
		"dest": "data/img",
		"options": {
			"progressive": true,
			"interlaced": true,
			"svgoPlugins": [{
				"removeViewBox": false
			}]
		}
	},
	"fonts": {
		"watch": "assets/fonts/**/*",
		"source": "./assets/fonts/**/*",
		"dest": "data/fonts"
	},
	"sounds": {
		"watch": "assets/sounds/**/*",
		"source": "./assets/sounds/**/*",
		"dest": "data/sounds"
	}
};




// JADE -----------------------------------------------------

gulp.task('jade', function() {
	return gulp.src(production ? paths.jade.source.prod : paths.jade.source.dev)
		.pipe(plugins.plumber({errorHandler: nonotify ? plugins.util.noop() : plugins.notify.onError("Error: <%= error.message %>")}))
		.pipe(plugins.jade({pretty: true, doctype: "html"}))
		.pipe(plugins.cached('jade-cache'))
		.pipe(gulp.dest(rootDir + paths.jade.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("JADE  ")));
});

gulp.task('jade-angu-templates', function() {
	return gulp.src(paths.jadeAnguTemplates.source)
		.pipe(plugins.plumber({errorHandler: nonotify ? plugins.util.noop() : plugins.notify.onError("Error: <%= error.message %>")}))
		.pipe(plugins.jade({pretty: true}))
		.pipe(plugins.cached('jade-cache'))
		.pipe(gulp.dest(paths.jadeAnguTemplates.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("JADE ANGU TEMPLATES  ")));
});

gulp.task('angu-templates', ['jade-angu-templates'], function () {
	return gulp.src(paths.anguTemplates.source)
		.pipe(plugins.plumber({errorHandler: nonotify ? plugins.util.noop() : plugins.notify.onError("Error: <%= error.message %>")}))
		.pipe(templateCache({
			module: 'HPApp'
		}))
		.pipe(gulp.dest((production ? tmpDir : rootDir) + paths.anguTemplates.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("ANGU TEMPLATES  ")));
});


// STYLUS -----------------------------------------------------

gulp.task('stylus', function() {
	return gulp.src(paths.stylus.source)
		.pipe(plugins.plumber({errorHandler: nonotify ? plugins.util.noop() : plugins.notify.onError("Error: <%= error.message %>")}))
		.pipe(plugins.stylus({
			use: nib(),
			"compress": production ? true : false
		}))
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.init({loadMaps: true}))
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.write())
		.pipe(gulp.dest((production ? tmpDir : rootDir) + paths.stylus.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("STYLUS ")));
});


// JAVASCRIPT -----------------------------------------------

function compileJS(paths) {
	return gulp.src(paths.source)
		.pipe(plugins.plumber({errorHandler: nonotify ? plugins.util.noop() : plugins.notify.onError("Error: <%= error.message %>")}))
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.init())
		.pipe(plugins.concat(paths.name))
		.pipe(production ? plugins.uglify({mangle: false}) : plugins.util.noop())
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.write({
			"addComment": true,
			"includeContent": true,
			"sourceRoot": "/sources/js"
		}))
		//.pipe(plugins.preprocess())
		.pipe(gulp.dest((production ? tmpDir : rootDir) + paths.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("JS    ")));
}

gulp.task('js', function() {
	compileJS(paths.js);
});

gulp.task('extension', function() {
	compileJS(paths.extension);
});


// VENDOR ----------------------------------------------------

gulp.task('vendor', function() {
	var js, coffee, css, fonts, images;

	js      = plugins.filter(['**/*.js'], {restore: true});
	coffee  = plugins.filter(['**/*.coffee'], {restore: true});
	css     = plugins.filter(['**/*.css'], {restore: true});
	fonts   = plugins.filter(['**/*.svg', '**/*.eot', '**/*.ttf', '**/*.woff'], {restore: true});
	images  = plugins.filter(['**/*.gif', '**/*.png', '**/*.jpeg', '**/*.jpg'], {restore: true});

	return gulp.src(
		mainBowerFiles({
			paths: {
				"bowerDirectory": paths.components.source,
				"bowerrc": __dirname + "/.bowerrc",
				"bowerJson": __dirname + "/bower.json"
			}
		})
			.concat(paths.vendor.source)
	)
		.pipe(coffee)
		.pipe(plugins.concat('all.coffee'))
		.pipe(plugins.coffee({bare: true}))
		.pipe(coffee.restore)

		.pipe(js)
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.init())
		.pipe(plugins.concat(paths.components.name.js, {newLine: '\n;\n'}))
		.pipe(production ? plugins.uglify({mangle: false}) : plugins.util.noop())
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.write({
			"addComment": true,
			"includeContent": true,
			"sourceRoot": "/sources/js"
		}))
		.pipe(gulp.dest((production ? tmpDir : rootDir) + paths.components.dest.js))
		.pipe(js.restore)

		.pipe(css)
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.init())
		.pipe(plugins.concat(paths.components.name.css))
		.pipe(plugins.minifyCss())
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.write({
			"addComment": true,
			"includeContent": true,
			"sourceRoot": "/sources/css"
		}))
		.pipe(gulp.dest((production ? tmpDir : rootDir) + paths.components.dest.css))
		.pipe(css.restore)

		.pipe(fonts)
		.pipe(gulp.dest(rootDir + paths.components.dest.fonts))
		.pipe(fonts.restore)

		.pipe(images)
		.pipe(gulp.dest(rootDir + paths.components.dest.images))
		.pipe(images.restore)

		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("VENDOR")));
});


// IMAGES ---------------------------------------------------

gulp.task('images', function() {
	return gulp.src(paths.images.source)
		.pipe(plugins.plumber({errorHandler: nonotify ? plugins.util.noop() : plugins.notify.onError("Error: <%= error.message %>")}))
		.pipe(production ? plugins.util.noop() : plugins.changed(rootDir + paths.images.dest))
		.pipe(plugins.imagemin(paths.images.options))
		.pipe(gulp.dest(rootDir + paths.images.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("IMAGES")));
});


// FONTS ----------------------------------------------------

gulp.task('fonts', function() {
	return gulp.src(paths.fonts.source)
		.pipe(production ? plugins.util.noop() : plugins.changed(rootDir + paths.fonts.dest))
		.pipe(gulp.dest(rootDir + paths.fonts.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("FONTS ")));
});


// SOUNDS ----------------------------------------------------

gulp.task('sounds', function() {
	return gulp.src(paths.sounds.source)
		.pipe(production ? plugins.util.noop() : plugins.changed(rootDir + paths.sounds.dest))
		.pipe(gulp.dest(rootDir + paths.sounds.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("SOUNDS ")));
});

// JSON ----------------------------------------------------

gulp.task('json', function() {
	return gulp.src(paths.json.source)
		.pipe(production ? plugins.util.noop() : plugins.changed(rootDir + paths.json.dest))
		.pipe(gulp.dest(rootDir + paths.json.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("JSON ")));
});


// SERVER ---------------------------------------------------

var EXPRESS_PORT = 5001;
var EXPRESS_ROOT = __dirname + "/" + rootDir;
var EXPRESS_BASE = 'hackpack';

gulp.task('server', function () {
	plugins.connect.server({
		root: EXPRESS_ROOT,
		port: EXPRESS_PORT,
		//base: EXPRESS_BASE,
		livereload: false,
		middleware: function() {
			return [historyApiFallback({})];
		}
	});
});


// COMPONENTS -----------------------------------------------

gulp.task('bower-install', function() {
	return gulp.src([__dirname + "/bower.json"]).pipe(install());
});

gulp.task('npm-install', function() {
	return gulp.src([__dirname + "/package.json"]).pipe(install());
});


// CLEAN ---------------------------------------------------

gulp.task('clean', function() {
	del(rootDir + "**/*", {force: true}, function(err) {
		if (err) plugins.util.log(err);
	});
});


// REVISION REPLACE ----------------------------------------

gulp.task('revision', function () {
	if (production) {
		var userefAssets = plugins.useref.assets({searchPath: tmpDir});

		return gulp.src("./assets/jade/index.jade")
			.pipe(plugins.jade({pretty: true}))
			.pipe(plugins.replace(/\{\%COMPILE_DATE\%\}/, new Date))
			.pipe(userefAssets)
			.pipe(plugins.rev())
			.pipe(userefAssets.restore())
			.pipe(plugins.useref())
			.pipe(plugins.revReplace())
			.pipe(gulp.dest(rootDir));
	}
});





// INIT TASKS -----------------------------------------------

gulp.task('update-components', ['bower-install', 'npm-install']);

gulp.task('build-assets', ['jade', 'angu-templates', 'js', 'extension', 'json', 'stylus', 'images', 'fonts', 'sounds'], function() {
	gulp.start('revision');
});

gulp.task('build-vendor', ['vendor'], function () {
	gulp.start('build-assets');
});

gulp.task('build', ['clean', 'update-components'], function() {
	gulp.start('build-vendor');
});

gulp.task('buildwatch', ['build'], function() {
	gulp.start('watch');
});

gulp.task('watch', ['server'], function() {
	gulp.watch(paths.jade.watch, ['jade']);
	gulp.watch(paths.jadeAnguTemplates.watch, ['angu-templates']);
	gulp.watch(paths.stylus.watch, ['stylus']);
	gulp.watch(paths.json.watch, ['json']);
	gulp.watch(paths.images.watch, ['images']);
	gulp.watch(paths.fonts.watch, ['fonts']);
	gulp.watch(paths.sounds.watch, ['sounds']);
	gulp.watch(paths.js.watch, ['js']);
	gulp.watch(paths.extension.watch, ['extension']);
	gulp.watch(paths.components.watch, ['vendor']);
	gulp.watch(__dirname + '/bower.json', ['bower-install'], function() {
		gulp.start('vendor');
	});
});
