import path from 'path';
import webpack from 'webpack';

import pkg from '../package.json';

const environments = [
  'development',
  'production',
  'dll',
  'library',
  'cssBuilder',
];

const getEnvironment = env =>
  (env && environments.find(e => !!env[e])) ||
  process.env.NODE_ENV ||
  'development';

const defaultConfig = environment => ({
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
    modules: [path.resolve(process.cwd(), 'src'), 'node_modules'],
    alias: {
      'axios': path.resolve(process.cwd(), 'node_modules/axios'),
      'bluebird': path.resolve(process.cwd(), 'node_modules/bluebird'),
      'lodash': path.resolve(process.cwd(), 'node_modules/lodash'),
    }
  },

  node: {
    fs: 'empty',
  },

  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/',
  },

  module: {
    rules: {
      globalCSS: {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },

      ts: {
        test: /\.tsx?$/,
        include: [
          path.resolve(process.cwd(), 'src'),
          path.resolve(process.cwd(), 'dev')
        ],
        exclude: path.resolve(process.cwd(), 'node_modules')
      },

      font: {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash:base64:5].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },

      image: {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[hash:base64:5].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
    },
  },

  plugins: [
    new webpack.ProvidePlugin({
      Promise: 'bluebird',
    }),
    new webpack.DefinePlugin({
      ...environments.reduce(
        (acc, key) => ({
          ...acc,
          [`__${key.toUpperCase()}__`]: environment === key,
        }),
        {}
      ),
      'process.env': {
        NODE_ENV: JSON.stringify(environment),
        FINDIFY_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
      },
    }),
  ],
});

export default env => {
  const environment = getEnvironment(env);
  const environmentConfig = require(`./${environment}.js`).default; // eslint-disable-line
  return environmentConfig(env, defaultConfig(environment));
};
