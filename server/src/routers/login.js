import Router from 'koa-router'
import body from 'koa-body'
import usersController from '~/controllers/users'

const router = new Router()

export default router.post('/', body(), usersController.handleLogin)
