// node.js Packages / Dependencies
const gulp          = require('gulp');
const sass          = require('gulp-sass');
const uglify        = require('gulp-uglify');
const rename        = require('gulp-rename');
const concat        = require('gulp-concat');
const cleanCSS      = require('gulp-clean-css');
const imageMin      = require('gulp-imagemin');
const pngQuint      = require('imagemin-pngquant'); 
const browserSync   = require('browser-sync').create();
const autoprefixer  = require('gulp-autoprefixer');
const jpgRecompress = require('imagemin-jpeg-recompress'); 
const clean         = require('gulp-clean');


// Paths
var paths = {
    root: { 
        www:        './'
    },
    src: {
        root:       'assets',
        html:       './**/*.html',
        css:        'assets/css/*.css',
        js:         'assets/js/*.js',
        vendors:    'assets/vendors/**/*.*',
        imgs:       'assets/imgs/**/*.+(png|jpg|gif|svg)',
        scss:       'assets/scss/**/*.scss'
    },
    dist: {
        root:       'dist',
        css:        'dist/css',
        js:         'dist/js',
        imgs:       'dist/imgs',
        vendors:    'dist/vendors'
    }
}

// Compile SCSS
gulp.task('sass', function() {
    return gulp.src(paths.src.scss)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) 
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.src.root + '/css'))
    .pipe(browserSync.stream());
});

// Minify + Combine CSS
gulp.task('css', function() {
    return gulp.src(paths.src.css)
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('meyawo.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.css))
});

// Minify + Combine JS
gulp.task('js', function() {
    return gulp.src(paths.src.js)
    .pipe(uglify())
    .pipe(concat('meyawo.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
});

// Compress (JPEG, PNG, GIF, SVG, JPG)
gulp.task('img', function(){
    return gulp.src(paths.src.imgs)
    .pipe(imageMin([
        imageMin.gifsicle(),
        imageMin.jpegtran(),
        imageMin.optipng(),
        imageMin.svgo(),
        pngQuint(),
        jpgRecompress()
    ]))
    .pipe(gulp.dest(paths.dist.imgs));
});

// copy vendors to dist
gulp.task('vendors', function(){
    return gulp.src(paths.src.vendors)
    .pipe(gulp.dest(paths.dist.vendors))
});

// clean dist
gulp.task('clean', function () {
    return gulp.src(paths.dist.root)
        .pipe(clean());
});

// Prepare all assets for production
gulp.task('build', gulp.series('sass', 'css', 'js', 'vendors', 'img'));


// Watch (SASS, CSS, JS, and HTML) reload browser on change
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: paths.root.www
        } 
    })
    gulp.watch(paths.src.scss, gulp.series('sass'));
    gulp.watch(paths.src.js).on('change', browserSync.reload);
    gulp.watch(paths.src.html).on('change', browserSync.reload);
});