import Koa from 'koa'
import bodyparser from 'koa-bodyparser'
import routers from './routers'
import session from './middleware/session'

const app = new Koa()

app
  .use(session())
  .use(bodyparser())
  .use(routers.routes())
  .use(async (ctx, next) => {
    await next()
    if (!ctx.session) ctx.redirect('/login')
  })
  .use(routers.allowedMethods())

export default app
