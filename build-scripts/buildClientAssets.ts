import webpack from 'webpack'
import webpackConfig from '../webpack.config'

webpack(webpackConfig, (err, stats) => {
  if (err || stats?.hasErrors()) {
    console.error('Error(s) occurred during creating assets by webpack')
    console.error(stats?.toJson().errors)
    console.error(err)
  } else {
    console.info('Webpack build finished successfully')
  }
})
