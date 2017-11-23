import webpack from 'webpack'
import koaWebpack from 'koa-webpack'
import { clientConfig } from '../../webpack.config.babel'

export default () => {
  return koaWebpack({
    compiler: webpack(clientConfig),
    dev: {
      stats: {
        colors: true,
      },
    },
  })
}
