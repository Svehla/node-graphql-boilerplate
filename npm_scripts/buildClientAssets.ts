/* eslint-disable */
import webpack from 'webpack';
// @ts-expect-error
import webpackConfig from '../webpack.config';

webpack(webpackConfig , (err, stats) => { // Stats Object
  if (err || stats?.hasErrors()) {
    console.log('Error(s) occurred during creating assets by webpack');
    console.log(stats?.toJson().errors);
    console.log(err);
  } else {
    console.log('Webpack build finished succesfully');
  }
});
