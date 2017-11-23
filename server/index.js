import http from 'http'
import Koa from 'koa'
import bodyparser from 'koa-bodyparser'
import routers from './routers'
import session from './middlewares/session'
import devServer from './middlewares/devServer'

const app = new Koa()

app
  .use(devServer())
  .use(session())
  .use(bodyparser())
  .use(routers.routes())
  .use(routers.allowedMethods())

http.createServer(app.callback()).listen(3000)
