import { CheckerPlugin } from 'awesome-typescript-loader'
import { IgnorePlugin } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

export default {
  entry: {
    index: './src/serverless_index.ts',
  },
  output: {
    // coz of lambda fn
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist-minified'),
    publicPath: '/',
    filename: '[name].js',
  },
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  optimization: {
    // TODO: add minification
    // minimize: false,
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CheckerPlugin(),

    // @ts-expect-error
    new webpack.IgnorePlugin(/^pg-native$/),

    new IgnorePlugin({
      resourceRegExp: /^pg-native$/,
    }),
  ],
}
