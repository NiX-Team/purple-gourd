import Router from 'koa-router'
import login from './login'

const router = new Router()

export default router.use('/login', login.routes(), login.allowedMethods())
