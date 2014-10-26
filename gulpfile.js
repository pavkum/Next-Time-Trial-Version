var gulp = require('gulp');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');

gulp.task('jquery' , function(){

  gulp.src('bower_components/jQuery/dist/jquery.min.js')
      .pipe(gulp.dest('www/js/'));

});

gulp.task('fastclick' , function(){

  gulp.src('bower_components/fastclick/lib/fastclick.js')
      .pipe(gulp.dest('www/js/'));

});

gulp.task('action' , function(){

  gulp.src('bower_components/ActionJs/action.js')
      .pipe(uglify())
      .pipe(gulp.dest('www/js/'));

});

gulp.task('web-src' , function(){
    gulp.src(['web-src/base.js' , 'web-src/utilities.js' , 'web-src/header.js' , 'web-src/techocall.js' ,
    'web-src/utils/storage-action.js' , 'web-src/utils/view-action.js' , 'web-src/registered-contacts/registered-contacts-action.js' ,
    'web-src/showRemainders.js' , 'web-src/showContacts.js' , 'web-src/settings.js'])
        .pipe(uglify())
        .pipe(gulp.dest('www/js'))
});

gulp.task('injectjs' , function(){


    gulp.src('www/index.html')
        .pipe(inject(gulp.src('www/js/*.js', {read : false})))
        .pipe(gulp.dest('www'));

});

gulp.task('default' , ['jquery' , 'fastclick' , 'action' , 'injectjs']);
