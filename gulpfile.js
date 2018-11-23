var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('styles', function() {
    gulp.src('sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./css'));
});

gulp.task('scripts', function() {
	//gulp.src(['js/main.js', 'js/restaurant_info.js'])
	gulp.src('js/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./js'));
});

gulp.task('scripts-dist', function() {
	gulp.src(['js/main.js', 'js/restaurant_info.js'])
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./js'));
});
