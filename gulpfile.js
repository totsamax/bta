var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpDeployFtp = require('gulp-deploy-ftp');
var concatCSS = require('gulp-concat-css');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var ftp = require('gulp-ftp');


var options = {
    user: "totsamax",
    password: 'shelter111',
    host: 'deus.timeweb.ru',
    uploadPath: "/bishkektaxi.tmweb.ru/public_html/taxiAdmin"
};

gulp.task('default', function () {
    gulp.src('css/*.css')
        .pipe(concatCSS("bundle.css"))
        .pipe(minifyCSS())
        .pipe(rename('bundle.min.css'))
        .pipe(gulp.dest('app/css'));
});
gulp.task('ftp', function () {
    gulp.src('**/*')
        .pipe(ftp({
            host: 'deus.timeweb.ru',
            user: 'totsamax',
            pass: 'shelter111',
            remotePath: "/bishkektaxi.tmweb.ru/public_html/taxiAdmin"
        }))
        // you need to have some kind of stream after gulp-ftp to make sure it's flushed 
        // this can be a gulp plugin, gulp.dest, or any kind of stream 
        // here we use a passthrough stream 
        .pipe(gutil.noop());
});
gulp.task('watch', function () {
    gulp.watch('./*', ['ftp']);
    gulp.watch('js/*', ['ftp']);
    gulp.watch('css/*', ['ftp']);

});