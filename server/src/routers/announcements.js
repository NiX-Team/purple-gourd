import Router from 'koa-router'
import body from 'koa-body'
import announcementsController from '~/controllers/announcements'

const router = new Router()

export default router
  .get('/', announcementsController.handleGetAnnouncements)
  .post('/', body(), announcementsController.handleAddAnnouncement)
  .put('/:id', body(), announcementsController.handleUpdateAnnouncement)
  .get('/:id', announcementsController.handleGetAnnouncementById)
  .delete('/:id', announcementsController.handleRemoveAnnouncement)
