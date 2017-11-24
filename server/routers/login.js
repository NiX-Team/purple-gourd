import Router from 'koa-router'
import userController from '../controllers/user'

const router = new Router()

export default router.post('/', userController.handleLogin)
