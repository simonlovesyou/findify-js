import * as path from 'path';
import * as webpack from 'webpack';
import * as defaultConfig from '../../config/webpack';

interface WebpackEnvArgs {
  analyze?: boolean;
  generateStatsFile?: boolean;
}

export default (env: WebpackEnvArgs): webpack.Configuration => {
  const config: webpack.Configuration = {
    entry: {
      'findify-sdk': path.resolve(__dirname, 'src/index'),
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      // we target a UMD and name it FindifySDK
      // when including the bundle in the browser
      // it will be accessible at `window.FindifySDK`
      libraryTarget: 'umd',
      library: 'FindifySDK',
      // will name the AMD module of the UMD build,
      // otherwise an anonymous define is used
      umdNamedDefine: true,
    },
    stats: 'minimal',
    bail: true,
    resolve: {
      extensions: ['.ts', '.js'],
    },
    target: ['web', 'es5'],
    optimization: defaultConfig.optimization,
    module: {
      rules: [
        {
          test: /\.(t|j)s$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                rootMode: 'upward',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          FINDIFY_ENV: JSON.stringify('production'),
        },
      }),
    ],
  };

  if (env && env.analyze) {
    config.plugins!.push(defaultConfig.BundleAnalyzer);
  }

  return config;
};
