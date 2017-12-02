import Router from 'koa-router'
import login from '~/routers/login'
import user from '~/routers/user'
import auth from '~/middlewares/auth'

const router = new Router()

export default router
  .use('/login', login.routes(), login.allowedMethods())
  .use('/user', auth(), user.routes(), user.allowedMethods())
