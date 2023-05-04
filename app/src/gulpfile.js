const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const pump = require('pump');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');

const pathJs = './widgets/assets/js';
const path = './widgets/assets';

gulp.task('room', function(cb) {
    pump([
        gulp.src([
            pathJs+'/socket.js',
            pathJs+'/video.js',
            pathJs+'/media.js',
            pathJs+'/wrtc.js',
            pathJs+'/filesp2p.js',
            pathJs+'/index.js',
        ]),
        gulpif(false, sourcemaps.init()),
        concat('room.js', { newLine: ';' }),
        uglify(),
        rename({ suffix: '.min' }),
        gulpif(false, sourcemaps.write()),
        gulp.dest(path + '/build/')
    ], cb);
});

gulp.task('index', function(cb) {
    pump([
        gulp.src([
            pathJs+'/socket.js',
            pathJs+'/login.js'
        ]),
        gulpif(false, sourcemaps.init()),
        concat('index.js', { newLine: ';' }),
        uglify(),
        rename({ suffix: '.min' }),
        gulpif(false, sourcemaps.write()),
        gulp.dest(path + '/build/')
    ], cb);
});

gulp.task('default', gulp.series(['room', 'index']));
//gulp.task('index', gulp.series('index'));