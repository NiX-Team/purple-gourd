import Router from 'koa-router'
import body from 'koa-body'
import announcementController from '~/controllers/announcement'

const router = new Router()

export default router
  .post('/', body(), announcementController.handleAddAnnouncement)
  .get('/:id', announcementController.handleGetAnnouncement)
