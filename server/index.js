import http from 'http'
import Koa from 'koa'
import bodyparser from 'koa-bodyparser'
import routers from './routers'
import session from './middleware/session'

import webpack from 'webpack'
import koaWebpack from 'koa-webpack'
import { clientConfig } from '../webpack.config.babel'

const app = new Koa()

app
  .use(
    koaWebpack({
      compiler: webpack(clientConfig),
      dev: {
        stats: {
          colors: true,
        },
      },
    }),
  )
  .use(session())
  .use(bodyparser())
  .use(routers.routes())
  .use(async (ctx, next) => {
    await next()
    if (!ctx.session) ctx.redirect('/login')
  })
  .use(routers.allowedMethods())

http.createServer(app.callback()).listen(3000)
