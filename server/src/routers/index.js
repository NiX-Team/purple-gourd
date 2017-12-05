import Router from 'koa-router'
import login from '~/routers/login'
import user from '~/routers/user'
import upload from '~/routers/upload'
import auth from '~/middlewares/auth'

const router = new Router()

export default router
  .use('/login', login.routes(), login.allowedMethods())
  .use('/user', auth(), user.routes(), user.allowedMethods())
  .use('/upload', auth(), upload.routes(), upload.allowedMethods())
