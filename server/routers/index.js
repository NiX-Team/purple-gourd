import Router from 'koa-router'
import login from './login'
import home from './home'

const router = new Router()

export default router
  .use('/', home.routes(), login.allowedMethods())
  .use('/login', login.routes(), login.allowedMethods())
