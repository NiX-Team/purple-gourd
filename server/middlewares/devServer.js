import path from 'path'
import webpack from 'webpack'
import koaWebpack from 'koa-webpack'
import { clientConfig } from '../../webpack.config.babel'

const middleware = koaWebpack({
  compiler: webpack(clientConfig),
  dev: {
    stats: {
      colors: true,
    },
  },
})

const historyApiFallBack = () => {
  return async (ctx, next) => {
    await next()
    ctx.response.type = 'html'
    ctx.body = middleware.dev.fileSystem.readFileSync(
      path.join(clientConfig.output.path, 'index.html'),
    )
  }
}

export { historyApiFallBack }
export default () => {
  return middleware
}
