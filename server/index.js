import http from 'http'
import Koa from 'koa'
import routers from '~/routers'
import session from '~/middlewares/session'
import '~/models/mongoose'
import devServer, { historyApiFallBack } from '~/middlewares/devServer'

const app = new Koa()

app
  .use(devServer())
  .use(session())
  .use(routers.routes())
  .use(routers.allowedMethods())
  .use(historyApiFallBack())

http.createServer(app.callback()).listen(3000)
