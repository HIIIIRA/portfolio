const gulp = require("gulp");
const notify = require("gulp-notify"); // エラー通知
const plumber = require("gulp-plumber"); // エラー時のタスク停止防止
const debug = require("gulp-debug"); // ログ表示
const dartSass = require("gulp-dart-sass");
const autoprefixer = require("gulp-autoprefixer"); // ベンダープレフィックス付与
const sourcemaps = require("gulp-sourcemaps"); // ソースマップ出力

const cached = require("gulp-cached"); // ファイルキャッシュ

const sassParent = require("gulp-sass-parent"); // 親子関係を解決

const paths = {
  scss: {
    src: "assets/scss/**/*.scss", // コンパイル対象
    parent: "assets/scss", // 親ディレクトリ
    dest: "assets/css", // 出力先
  },
};

/**
 * scssタスクで実行する関数
 */
function scss() {
  return gulp
    .src(paths.scss.src)
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(cached("scss")) // ファイルをキャッシュ
    .pipe(sassParent({ dir: paths.scss.parent })) // ファイルキャッシュ時でも親子関係を解決する
    .pipe(sourcemaps.init())
    .pipe(
      dartSass({
        outputStyle: "expanded",
      })
    )
    .pipe(
      autoprefixer({
        cascade: true,
      })
    )
    .pipe(sourcemaps.write("/maps"))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(debug({ title: "scss dest:" }));
}
/**
 * キャッシュ
 */
function scssCache() {
  return gulp
    .src(paths.scss.src)
    .pipe(cached("scss"))
    .pipe(debug({ title: "scss cached:" }));
}
/**
 * watchタスクで実行する関数
 */
function watch() {
  return gulp.watch(paths.scss.src, gulp.series(scss));
}

exports.scss = scss; // scssタスク
exports.watch = gulp.series(scssCache, watch); // watchタスク
exports.default = gulp.series(scss); // defaultタスク
