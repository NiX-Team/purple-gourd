import Router from 'koa-router'
import body from 'koa-body'
import multer from 'koa-multer'
import announcementsController from '~/controllers/announcements'

const router = new Router(),
  upload = new multer({
    storage: new multer.memoryStorage(),
    limits: {
      fileSize: 16 * 1024 * 1024,
    },
  })

export default router
  .get('/', announcementsController.getAnnouncementsFollowing)
  .post('/', body(), announcementsController.addAnnouncement)
  .put('/:id', body(), announcementsController.updateAnnouncement)
  .get('/:id', announcementsController.getAnnouncementById)
  .get('/:id/archive', announcementsController.getArchive)
  .post('/:id', body(), announcementsController.addAnnouncementForm)
  .delete('/:id', announcementsController.removeAnnouncement)
  .post('/:id/upload', upload.single('file'), announcementsController.uploadFile)
