import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import flatten from 'gulp-flatten';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import spritesmith from 'gulp.spritesmith-multi';
import autoprefixer from 'autoprefixer';
import postcssClean from 'postcss-clean';
import del from 'del';
import log from 'fancy-log';
import bs from 'browser-sync';

console.log('webpack mode:', webpackConfig.mode);


const plugins = gulpLoadPlugins();
const browserSync = bs.create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

const paths = {
  dest: {
    root: 'dist/',
    font: 'dist/assets/fonts/',
    media: 'dist/assets/media/',
    sprites: 'dist/assets/images/sprites/',
    spriteStyles: 'dist/components/sprites/',
    static: 'dist/static/',
  },
  src: {
    root: 'src/',
    styles: {
      watch: ['src/**/*.less'],
      build: ['src/**/*.less', '!src/components/**/*', '!**/_*/*', '!**/_*.*'],
    },
    scripts: ['src/**/*.js', '!src/components/**/*', '!src/static/**/*'],
    markup: ['src/**/*.html', '!src/components/**/*', '!src/static/**/*', '!**/_*/**/*', '!**/_*'],
    image: ['src/**/*.{png,jpg,jpeg,gif}', '!src/components/**/*', '!src/static/**/*', '!**/_*/**/*', '!**/_*'],
    media: ['src/assets/media/**/*.{mp4,ogg,webm}', '!src/components/**/*', '!src/static/**/*', '!**/_*/**/*', '!**/_*'],
    font: ['src/**/*.{eot,ttf,woff,woff2}'],
    json: ['src/**/*.json'],
    static: ['src/static/**/*'],
    sprites: {
      image: ['src/components/sprites/**/*.png'],
      template: 'src/components/sprites/template.hbs',
      path: '../../assets/images/sprites/',
      styles: 'src/components/sprites/',
    },
  },
  server: {
    baseDir: 'dist/',
  },
};

const clean = {
  demo: () => del([paths.dest.root]),
  sprites: () => del([paths.dest.sprites]),
};

/*
 * You can also declare named functions and export them as tasks
 */

const markup = () => {
  return gulp
    .src(paths.src.markup)
    .pipe(plugins.plumberNotifier())
    .pipe(plugins.newer(paths.dest.root))
    .pipe(
      plugins.fileInclude({
        prefix: '@@',
        basepath: '@file',
        indent: true,
      }),
    )
    .pipe(
      plugins.htmlhint({htmlhintrc: '.htmlhintrc'}),
    )
    .pipe(plugins.if(!'*/components/**/*', plugins.htmlhint.reporter()))
    .pipe(gulp.dest(paths.dest.root))
    .pipe(browserSync.stream());
};

const styles = () => {
  return gulp
    .src(paths.src.styles.build)
    .pipe(plugins.plumberNotifier())
    .pipe(plugins.newer(paths.dest.root))
    .pipe(plugins.if(!isProduction, plugins.sourcemaps.init()))
    .pipe(plugins.less())
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.formatter())
    .pipe(plugins.csslint.formatter('fail'))
    .pipe(plugins.postcss([autoprefixer()]))
    .pipe(
      plugins.if(
        isProduction,
        plugins.postcss([
          postcssClean({
            compatibility: 'ie7',
            aggressiveMerging: false,
            restructuring: false,
            format: 'keep-breaks',
          }),
        ]),
      ),
    )
    .pipe(plugins.if(!isProduction, plugins.sourcemaps.write()))
    .pipe(gulp.dest(paths.dest.root))
    .pipe(browserSync.stream());
};

const scripts = () => {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        log.error('Webpack', err);
        reject(err);
      }

      log(stats.toString({ colors: true }));
      resolve();
    });
  });
};

const image = () => {
  return gulp
    .src(paths.src.image)
    .pipe(plugins.plumberNotifier())
    .pipe(plugins.newer(paths.dest.root))
    .pipe(
      plugins.if(
        isProduction,
        plugins.imagemin({
          interlaced: true,
          progressive: true,
        }),
      ),
    )
    .pipe(gulp.dest(paths.dest.root));
};

const media = () => {
  return gulp
    .src(paths.src.media)
    .pipe(plugins.plumberNotifier())
    .pipe(plugins.newer(paths.dest.media))
    .pipe(gulp.dest(paths.dest.media));
};

const sprites = () => {
  return gulp
    .src(paths.src.sprites.image)
    .pipe(plugins.plumberNotifier())
    .pipe(plugins.newer(paths.dest.sprites))
    .pipe(
      spritesmith({
        spritesmith: function(options, sprite) {
          options.cssName = 'sprite-' + sprite + '.less';
          options.cssSpritesheetName = 'sprite-' + sprite;
          options.cssSpriteName = 'sprite-' + sprite;
          options.cssTemplate = paths.src.sprites.template;
          options.padding = 4;
          options.imgPath = paths.src.sprites.path + options.imgName;
          options.cssHandlebarsHelpers = {
            sort: arr => {
              arr.sort((a, b) => {
                if (a.name < b.name) {
                  return -1;
                }
                if (a.name > b.name) {
                  return 1;
                }
                return 0;
              });
            },
            returnpx: function(num) {
              return num / 2 + 'px';
            },
            getFolder: function() {
              return sprite;
            },
          };
        },
      }),
    )
    .pipe(plugins.if('*.less', gulp.dest(paths.src.sprites.styles)))
    .pipe(plugins.if('*.less', plugins.replace(' {', '() {')))
    .pipe(
      plugins.if('*.less', plugins.rename(path => {
        path.basename += '-variable';
      })),
    )
    .pipe(plugins.if('*.png', gulp.dest(paths.dest.sprites), gulp.dest(paths.src.sprites.styles)));
};

const copy = {
  font: () => {
    return gulp
      .src(paths.src.font)
      .pipe(plugins.plumberNotifier())
      .pipe(plugins.newer(paths.dest.font))
      .pipe(flatten())
      .pipe(gulp.dest(paths.dest.font));
  },
  json: () => {
    return gulp
      .src(paths.src.json)
      .pipe(plugins.newer(paths.dest.root))
      .pipe(gulp.dest(paths.dest.root));
  },
  staticFiles: () => {
    return gulp
      .src(paths.src.static)
      .pipe(plugins.newer(paths.dest.static))
      .pipe(gulp.dest(paths.dest.static));
  },
};

const server = () => {
  const webpackBundler = webpack(webpackConfig);

  browserSync.init({
    server: {
      baseDir: paths.server.baseDir,
      directory: true,
    },
    middleware: [
      webpackDevMiddleware(webpackBundler, {
        publicPath: webpackConfig.output.publicPath,
        serverSideRender: true,
      }),
      webpackHotMiddleware(webpackBundler),
    ],
    cors: true,
    files: [paths.dest.root + '**/*.html'],
    startPath: '/',
    ghostMode: false,
    notify: false,
    reloadDelay: 1000,
    skipUncaughtErrors: true,
  });
};

const watch = () => {
  const { font, json } = copy;
  gulp.watch(paths.src.markup, markup);
  gulp.watch(paths.src.scripts, scripts);
  gulp.watch(paths.src.image, image);
  gulp.watch(paths.src.media, media);
  gulp.watch(paths.src.sprites.image, sprites);
  gulp.watch(paths.src.styles.watch, styles);
  gulp.watch(paths.src.font, font);
  gulp.watch(paths.src.json, json);
};

const copyTaskList = [copy.font, copy.json, copy.staticFiles];
const buildTaskList = [markup, gulp.series(sprites, styles), image, media];
if (isProduction) {
  buildTaskList.push(scripts);
}
const buildTask = gulp.parallel(buildTaskList);
const copyTask = gulp.parallel(copyTaskList);
const cleanTask = gulp.parallel([clean.demo, clean.sprites]);
const watchTask = gulp.parallel([server, watch]);
let build;

if (isProduction) {
  build = gulp.series(cleanTask, buildTask, copyTask);
} else {
  build = gulp.series(cleanTask, buildTask, copyTask, watchTask);
}

/*
 * You could even use `export as` to rename exported tasks
 */
export { build as default, cleanTask as clean };
