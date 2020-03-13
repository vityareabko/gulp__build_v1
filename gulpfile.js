//Подключаем модули галпа
const gulp = require('gulp'), 
   concat = require('gulp-concat'), // concata files
   autoprefixer = require('gulp-autoprefixer'), //prefixer css
   cleanCSS = require('gulp-clean-css'), //minify css
   clean = require('gulp-clean'), //clean files and folders
   uglify = require('gulp-uglify'), // minify js
   browserSync = require('browser-sync').create(), //monitoring code
   sourcemaps = require('gulp-sourcemaps'),
   sass = require('gulp-sass'), // sass
   imagemin = require('gulp-imagemin');


//Порядок подключения css файлов
const cssFiles = [
   './src/css/bootstrap-grid.min.css',
   './src/css/main.css'
]

//Порядок подключения scss файлов
const ScssFiles = [
   './src/scss/color.scss',
   './src/scss/main.scss'
]

//Порядок подключения js файлов
const jsFiles = [
   './src/js/jquery-3.4.1.min.js',
   './src/js/main.js'
]


//Таск на стили CSS
gulp.task('stylesCSS', () => {
   return gulp.src(cssFiles)
      //Объединение файлов в один
      .pipe(concat('style.css'))
      //Добавить префиксы
      .pipe(autoprefixer({
         cascade: false
      }))
      //Минификация CSS
      .pipe(cleanCSS({
         level: 2
      }))
      //Выходная папка для стилей
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.stream());
});

gulp.task('styleSCSS', () => {
   return gulp.src(ScssFiles)
      .pipe(sourcemaps.init())
      .pipe(sass())
      //Объединение файлов в один
      .pipe(concat('main.css'))
      //Добавить префиксы
      .pipe(autoprefixer({
         cascade: false
      }))
      //Минификация CSS
      .pipe(cleanCSS({
         level: 2
      }))
      .pipe(sourcemaps.write('./'))
      //Выходная папка для стилей
      .pipe(gulp.dest('./src/css'))
      .pipe(browserSync.stream());
});

//Таск на скрипты JS
gulp.task('scripts', () => {
   return gulp.src(jsFiles)
      //Объединение файлов в один
      .pipe(concat('script.js'))
      //Минификация JS
      .pipe(uglify({
         toplevel: true
      }))
      //Выходная папка для скриптов
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.stream());
});

//Удалить всё в указанной папке
gulp.task('cleans', () => {
   return gulp.src('./dist/*', {read: false})
      .pipe(clean());
});

//оптимизация (сжатия) изображении
gulp.task('img-compresed', () => {
   return gulp.src('./src/img/**')
      .pipe(imagemin({
         progressive: true
      }))

   .pipe(gulp.dest('./dist/img/'))
});

//слежка за файлами
gulp.task('watch',() => {
   browserSync.init({
      server: {
          baseDir: "./"
      }
   });
   gulp.watch('./src/img/**', gulp.series('img-compresed'))
   //Следить за SCSS файлами
   gulp.watch('./src/scss/**/*.scss', gulp.series('styleSCSS'))
   //Следит за СSS файлами
   gulp.watch('./src/css/**/*.css', gulp.series('stylesCSS'))
   //Следить за JS файлами
   gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
   //При изменении HTML запустить синхронизацию
   gulp.watch("./*.html").on('change', browserSync.reload);
});


//Таск запускает таск build и watch последовательно
gulp.task('default', gulp.series( gulp.series( 'cleans', 'styleSCSS', gulp.parallel('stylesCSS', 'scripts', 'img-compresed') ), 'watch' ) );