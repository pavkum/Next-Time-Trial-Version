var gulp = require('gulp');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var Q = require('q');

// clean tasks

gulp.task('clean' , ['clean-html' , 'clean-js' , 'clean-template'] , function(){
    var deferred = Q.defer();

    setTimeout(function(){
        deferred.resolve();
    },1000);

    return deferred.promise;
});

gulp.task('clean-html' , function(){
    return gulp.src('www/index.html' , {read : false})
      .pipe(clean());
});

gulp.task('clean-js' , function(){
    return gulp.src('www/js' , {read : false})
      .pipe(clean());
});

gulp.task('clean-template' , function(){
    return gulp.src('www/template' , {read : false})
      .pipe(clean());
});


// move tasks
gulp.task('move' , ['html' , 'bower' , 'font' , 'sass' , 'javascript' , 'image' , 'templates' ]);



// bower tasks
gulp.task('bower' , ['require' , 'jquery' , 'fastclick' , 'underscore' , 'backbone' , 'text' ]);

gulp.task('require' , function(){

  return gulp.src('bower_components/requirejs/require.js')
      .pipe(gulp.dest('www/js/lib'));

});

gulp.task('jquery' , function(){

  return gulp.src('bower_components/jquery/dist/jquery.js')
      .pipe(gulp.dest('www/js/lib'));

});

gulp.task('fastclick' , function(){

  return gulp.src('bower_components/fastclick/lib/fastclick.js')
      .pipe(gulp.dest('www/js/lib'));

});

gulp.task('underscore' , function(){

  return gulp.src('bower_components/underscore/underscore.js')
      .pipe(gulp.dest('www/js/lib'));

});


gulp.task('backbone' , function(){

  return gulp.src('bower_components/backbone/backbone.js')
      .pipe(gulp.dest('www/js/lib'));

});


gulp.task('text' , function(){

  return gulp.src('bower_components/requirejs-text/text.js')
      .pipe(gulp.dest('www/js/lib'));

});



// font task

gulp.task('font' , function(){
  return gulp.src('web-src/font/*.ttf')
    .pipe(gulp.dest('www/font'));
});

// sass task

gulp.task('sass' , function(){
    return gulp.src('web-src/sass/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('www/css/'));
});

// javascript move

gulp.task('javascript' , function(){
  return gulp.src(['web-src/js/nexttalk.js' , 'web-src/js/**/*.js' , 'web-src/js/**/*.html'])
        //.pipe(concat('nexttalk.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('www/js'));
});

// image move

gulp.task('image' , function(){
    return gulp.src('web-src/img/*.png')
        .pipe(gulp.dest('www/img'));
});

//templates move

gulp.task('templates' , function(){
    return gulp.src('web-src/templates/*.html')
        .pipe(gulp.dest('www/templates'));
});

// html move

gulp.task('html' , ['templates'] , function(){
    return gulp.src('web-src/index.html')
        .pipe(gulp.dest('www/'));
});

// inject

gulp.task('inject' , function(){

    return gulp.src('www/index.html')
        .pipe(inject(gulp.src([ 'www/css/*.css'], {read : false}) , {relative:true}))
        .pipe(gulp.dest('www'));

});

gulp.task('build' , [ 'move', 'inject']);

gulp.task('default' , ['clean' , 'build']);
