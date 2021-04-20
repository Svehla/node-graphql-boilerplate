import { CheckerPlugin } from 'awesome-typescript-loader'
import { IgnorePlugin } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

export default {
  entry: {
    serverless_admin_index: {
      import: './src/serverless_admin_index.ts',
      filename: '[name]/index.js',
    },
    serverless_iterator_index: {
      import: './src/serverless_iterator_index.ts',
      filename: '[name]/index.js',
    },
  },
  output: {
    // coz of lambda fn API
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
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
