var gulp = require('gulp');
var dartSass = require('gulp-dart-sass'); //Sassコンパイル
var plumber = require('gulp-plumber'); //エラー時の強制終了を防止
var notify = require('gulp-notify'); //エラー発生時にデスクトップ通知する
var browserSync = require( 'browser-sync' ); //ブラウザ反映
var postcss = require('gulp-postcss'); //autoprefixerとセット
var autoprefixer = require('autoprefixer'); //ベンダープレフィックス付与
const sourcemaps = require('gulp-sourcemaps'); // ソースマップ出力
var ejs = require("gulp-ejs");
var rename = require("gulp-rename"); //.ejsの拡張子を変更

const cached = require('gulp-cached'); // sassファイルキャッシュ
const sassParent = require('gulp-sass-parent');  // 親子関係を解決
const debug = require('gulp-debug'); // ログ表示

// scssのコンパイル

const paths = {
  scss: {
    src: 'src/assets/scss/**/*.scss', // コンパイル対象
    parent: 'src/assets/scss', // 親ディレクトリ
    dest: 'public/css' // 出力先
  }
}

/**
 * scssタスクで実行する関数
 */
function scss() {
  return gulp.src(paths.scss.src)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
      .pipe(cached('scss')) // ファイルをキャッシュ
      .pipe(sassParent({dir: paths.scss.parent})) // ファイルキャッシュ時でも親子関係を解決する
    .pipe(sourcemaps.init())
    .pipe(dartSass({
      outputStyle: 'expanded'
    }))
    .pipe(postcss([
        autoprefixer({cascade: true})
    ]))
    //  .pipe(autoprefixer({        ////TypeError: dest.on is not a functionと出てしまう
    //  cascade: true            
    //}))
    .pipe(sourcemaps.write('/maps'))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(debug({title: 'scss dest:'}));
}
/**
 * scssファイルをキャッシュする関数
 */
function scssCache(){
  return gulp.src(paths.scss.src)
    .pipe(cached('scss')) // ファイルをキャッシュさせる
    .pipe(debug({title: 'scss cached:'}));
}
/**
 * watchタスクで実行する関数
 */
function watch() {
  return gulp.watch(paths.scss.src, gulp.series(scss))
}
// 保存時のリロード
function browsersync(done) {
    browserSync.init({
        files: ['public/**/*.*', 'views/**/*.*'], // BrowserSyncにまかせるファイル群
        proxy: 'http://localhost:3000',  // express の動作するポートにプロキシ
        port: 4000,  // BrowserSync は 4000 番ポートで起動
        open: true
    });
    done();
};
function bsReload(done) {
    browserSync.reload();
    done();
};
function ejs (done){
    gulp
    .src(["views/**/*.ejs", "!" + "views/**/_*.ejs"])
    .pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )//エラーチェック
    .pipe(ejs())
    .pipe(rename({extname: ".html"})) //拡張子をhtmlに
    .pipe(gulp.dest("./")); //出力先
    done();
}
// 監視
function watchFiles(done) {
    gulp.watch( './src/scss/**/*.scss', gulp.series(scss,bsReload) ); //sassが更新されたらgulp sassを実行
    gulp.watch( './src/js/*.js', gulp.series(bsReload) ); //jsが更新されたらbs-relaodを実行
    gulp.watch('./views/**/*.ejs',gulp.series(ejs,bsReload) ) ; //ejsが更新されたらgulp-ejsを実行
}
// default
//gulp.task('default', gulp.series(gulp.parallel('browser-sync', 'watch')));

exports.default = gulp.series(scssCache, gulp.parallel(watch,watchFiles,browsersync)); // defaultタスク
