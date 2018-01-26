import Router from 'koa-router'
import announcementsController from '~/controllers/announcements'

const router = new Router()

export default router.get('/:id', announcementsController.getFile)
