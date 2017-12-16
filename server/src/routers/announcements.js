import Router from 'koa-router'
import body from 'koa-body'
import multer from 'koa-multer'
import announcementsController from '~/controllers/announcements'

const router = new Router(),
  upload = new multer({
    storage: new multer.memoryStorage(),
  })

export default router
  .get('/', announcementsController.handleGetAnnouncementsFollowing)
  .post('/', body(), announcementsController.handleAddAnnouncement)
  .put('/:id', body(), announcementsController.handleUpdateAnnouncement)
  .get('/:id', announcementsController.handleGetAnnouncementById)
  .post('/:id', body(), announcementsController.handleAddAnnouncementForm)
  .delete('/:id', announcementsController.handleRemoveAnnouncement)
  .post(
    '/:id/upload',
    upload.single('file'),
    announcementsController.handleUploadFile,
  )
