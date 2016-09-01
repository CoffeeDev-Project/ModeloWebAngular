// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano'); 
var bowerDirectory = function(filejs){
    return "bower_components/" + filejs;
};
// Lint Task
//Nuestra tarea lint comprueba cualquier archivo JavaScript en nuestro directorio js/
//y se asegura de que no haya errores en nuestro código.
gulp.task('lint', function() {
    return gulp.src('src/assets/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
//La tarea Sass compilado cualquiera de nuestros archivos Sass en nuestra directorio scss/ en el CSS
//y guarda el archivo CSS compilado en nuestro directorio app/css.
gulp.task('sass', function() {
    return gulp.src([
      'src/assets/scss/*.scss',
      'src/assets/scss/*.css',
      bowerDirectory('materialize/dist/css/materialize.min.css')
    ]).pipe(sass())
      .pipe(cssnano())
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({
      stream: true
    }));
});

// Concatenate & Minify JS
//La tarea scripts concatena todos los archivos JavaScript en nuestro js/
//y ahorra que la salida de nuestro directorio app/js.
//Entonces gulp detiene archivo concatenado, minifica el js, lo renombra y lo guarda en el directorio app/js
//junto con el archivo concatenado.
gulp.task('scripts', function() {
    return gulp.src([
      'src/assets/js/*.js',
      bowerDirectory('jquery/dist/jquery.min.js')
    ]).pipe(concat('all.js'))
      .pipe(gulp.dest('app/js'))
      .pipe(rename('all.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/js'))
      .pipe(browserSync.reload({
      stream: true
    }));
});

// Minify Task
//Minifica el html dejandolo en el directorio app del proyecto
gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({
    stream: true
  }));
});

// Watch Files For Changes
//La tarea watch se utiliza para ejecutar tareas como hacemos cambios en nuestros archivos.
//Como se escribe código y modificar sus archivos, el método gulp.watch () va a escuchar los cambios
//y ejecutar automáticamente las tareas de nuevo, así que no tenemos que saltar continuamente de nuevo a nuestra
//línea de comandos y ejecute el comando gulp cada vez.
gulp.task('watch', ['browserSync','sass','lint','scripts','minify'], function() {
    gulp.watch('src/assets/js/*.js', ['lint', 'scripts']);
    gulp.watch('src/assets/scss/*.css', ['sass']);
    gulp.watch('src/*.html', ['minify']);
});

// browserSync Task
// Permite que el proyecto se actualice en el navegador
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

// Default Task
//Finalmente, tenemos nuestro tarea por defecto que se utiliza como una referencia agrupados a las otras tareas.
//Esta será la tarea que se corrió al entrar de golpe en la línea de comando sin ningún parámetro adicional.
gulp.task('default', ['lint', 'sass', 'scripts', 'minify', 'watch']);
