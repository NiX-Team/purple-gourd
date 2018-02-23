import Router from 'koa-router'
import filesController from '~/controllers/files'

const router = new Router()

export default router.get('/:id', filesController.getFile)
