import Router from 'koa-router'
import multer from 'koa-multer'
import userController from '~/controllers/user'

const router = new Router()

export default router.post('/', new multer().none(), userController.handleLogin)
