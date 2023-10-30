const 
    gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    browserSync = require('browser-sync').create(),
    rigger = require('gulp-rigger'),
    del = require('del'),
    log = require('fancy-log'),
    cssnano = require('gulp-cssnano'),
    cache = require('gulp-cache'),
    replace = require('gulp-replace'),
    svgSprite = require('gulp-svg-sprite'),
    minify = require('gulp-minify'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename');

var assetsDir = 'src/';
var outputDir = 'dist/';

gulp.task('html', function() {
    return gulp.src(assetsDir + '*.html')
        .pipe(rigger())
        .pipe(gulp.dest(outputDir))
        .on('end', function() { log.warn('Html task complete'); });
});

gulp.task('fonts', function() {
    return gulp.src(assetsDir + 'fonts/*.{eot,ttf,woff,woff2,svg}')
        .pipe(gulp.dest(outputDir + 'fonts'))
        .pipe(browserSync.stream())
        .on('end', function() { log.warn('Fonts task complete'); });
});

gulp.task('sprites', function() {
    return gulp.src(assetsDir + 'sprite/*.svg')
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: '../sprite.svg',
                    render: {
                        scss: {
                            dest: assetsDir + 'scss/source/global/sprite.scss'
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest(outputDir + 'images'))
        .on('end', function() { log.warn('Sprites task complete');
        del(outputDir + 'images/symbol/'); 
    });
});

gulp.task('styles', function() {
    return gulp.src(assetsDir + 'scss/*.scss')
        .pipe(sass())
        .on('error', function(err) {
            console.log(err.message + ' on line ' + err.lineNumber + ' in file : ' + err.fileName);
        })
        .pipe(autoprefixer({ overrideBrowserslist: ['> 5%', 'IE 10'] }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(browserSync.stream())
        .on('end', function() { log.warn('Styles task complete'); });
});

gulp.task('scripts', function() {
    return gulp.src([
            assetsDir + 'js/*.js'
        ])
        .pipe(rigger())
        .pipe(minify({noSource: true}))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(browserSync.stream())
        .on('end', function() { log.warn('Scripts task complete'); });
});

gulp.task('modules', function() {
    sources = [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery.scrollbar/jquery.scrollbar.min.js'
    ];
    return gulp
        .src(sources)
        .pipe(gulp.dest(outputDir + 'modules/'))
        .on('end', function() { log.warn('modules task complete'); });
});

gulp.task('images', function() {
    return gulp.src(assetsDir + 'images/**/*.{gif,ico,jpg,jpeg,png,svg}')
        .pipe(gulp.dest(outputDir + 'images'))
        .pipe(browserSync.stream())
        .on('end', function() { log.warn('Images task complete'); });
});

gulp.task('clear', function() {
    return del([
        outputDir + '*',
        outputDir + 'fonts/**/*',
        outputDir + 'css/**/*',
        outputDir + 'js/**/*',
        outputDir + 'images/**/*'
    ]);
});

gulp.task('build', gulp.series('clear','html', 'fonts', 'sprites', 'styles', 'scripts', 'modules', 'images'));

gulp.task('watch', watch);

function watch(done) {
    gulp.watch(assetsDir + '**/*.html', gulp.series('html'));
    gulp.watch(assetsDir + 'fonts/**/*', gulp.series('fonts'));
    gulp.watch(assetsDir + 'scss/**/*.scss', gulp.series('styles'));
    gulp.watch(assetsDir + 'js/**/*.js', gulp.series('scripts'));
    gulp.watch(assetsDir + 'sprite/*.svg', gulp.series('sprites'));
    gulp.watch(assetsDir + 'images/**/*', gulp.series('images'));
    // watch to reload browsers
    gulp.watch([outputDir + 'css/*.css',
                outputDir + 'fonts/**/*',
                outputDir + '*.html',
                outputDir + 'js/**/*.js',
                outputDir + 'images/**/*'])
        .on('change', browserSync.reload);
    return done;
}

gulp.task('browser:reload', function(done) {
    browserSync.watch(outputDir + '*').on('change', browserSync.stream());
    browserSync.watch(outputDir + 'css/**/*').on('change', browserSync.stream());
    browserSync.watch(outputDir + 'js/**/*').on('change', browserSync.stream());
    browserSync.watch(outputDir + 'fonts/**/*').on('change', browserSync.stream());
    browserSync.watch(outputDir + 'images/**/*').on('change', browserSync.stream());
    return done;
});

gulp.task('syns', function(done) {
    browserSync.init({
        open: false,
        server: {
            baseDir: 'dist'
        },
        notify: false,
        port: 3010
    });
    watch();
    done();
});

gulp.task('clearCache', function() {
    return cache.clearAll();
})

gulp.task('clearSprite', function() {
    return del(outputDir + 'images/sprite.svg');
})

gulp.task('default', gulp.series('clearSprite', 'build', 'syns'));