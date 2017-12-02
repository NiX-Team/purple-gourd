import Router from 'koa-router'
import login from './login'
import user from './user'
import auth from '../middlewares/auth'

const router = new Router()

export default router
  .use('/login', login.routes(), login.allowedMethods())
  .use('/user', auth(), user.routes(), user.allowedMethods())
