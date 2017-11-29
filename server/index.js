import http from 'http'
import Koa from 'koa'
import routers from './routers'
import session from './middlewares/session'
import devServer, { historyApiFallBack } from './middlewares/devServer'

import body from 'koa-body'

const app = new Koa()

app
  .use(devServer())
  .use(session())
  .use(routers.routes())
  .use(routers.allowedMethods())
  .use(historyApiFallBack())

http.createServer(app.callback()).listen(3000)
