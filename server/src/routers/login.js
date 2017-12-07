import Router from 'koa-router'
import body from 'koa-body'
import userController from '~/controllers/user'

const router = new Router()

export default router.post('/', body(), userController.handleLogin)
