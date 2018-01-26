import http from 'http'
import Koa from 'koa'
import error from '~/middlewares/error'
import routers from '~/routers'
import session from '~/middlewares/session'

const app = new Koa()

app
  .use(error())
  .use(session())
  .use(routers.routes())
  .use(routers.allowedMethods())

http.createServer(app.callback()).listen(3001)
