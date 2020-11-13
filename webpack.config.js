import webpack from 'webpack';
import path from 'path';
import glob from 'glob';

const { resolve, basename, sep } = path;

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const getEntry = () => {
  const files = {};
  glob
    .sync('src/**/*.js', {
      ignore: [
        'src/components/**/*',
        'src/assets/js/_*/**/*',
        'src/assets/js/**/_*',
        'src/assets/js/_*/_*',
        'src/static/**/*',
      ],
    })
    .forEach(function(item) {
      const match = basename(item).match(/(.+)\.js$/);
      const fileName = item.split('src/')[1];

      if (match) {
        files[fileName.match(/(.+)\.js$/)[1]] = [resolve(__dirname, item)];
      }
    });
  return files;
};

const config = {
  mode,
  entry: getEntry,
  devtool: mode === 'development' ? 'inline-source-map' : false,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // node_modules 내의 모듈들은 Babel 처리하지 않음.
        // 단, IE 11에서 swiper를 사용하려면 swiper와 dom7도 Babel 처리가 필요하므로
        // exclude 되지 않도록 처리.
        // Windows는 디렉토리 구분자가 `\`이므로 정규식 사용 시 `path.sep`을 사용하여
        // 플랫폼 별로 적합한 구분자 사용하도록 해주어야 함.
        // include: filePath => new RegExp(`src\\${sep}assets\\${sep}).*`).test(filePath),
        exclude: filePath => new RegExp(`node_modules\\${sep}(?!(dom7|swiper)\\${sep}).*`).test(filePath),
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
            },
          },
          'eslint-loader',
        ],
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

export default config;
