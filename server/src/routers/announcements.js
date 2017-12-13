import Router from 'koa-router'
import body from 'koa-body'
import announcementsController from '~/controllers/announcements'

const router = new Router()

export default router
  .get('/', announcementsController.handleGetAnnouncementsFollowing)
  .post('/', body(), announcementsController.handleAddAnnouncement)
  .put('/:id', body(), announcementsController.handleUpdateAnnouncement)
  .get('/:id', announcementsController.handleGetAnnouncementById)
  .post('/:id', body(), announcementsController.handleAddAnnouncementForm)
  .delete('/:id', announcementsController.handleRemoveAnnouncement)
