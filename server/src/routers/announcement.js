import Router from 'koa-router'
import multer from 'koa-multer'
import announcementController from '~/controllers/announcement'

const router = new Router()

export default router.post(
  '/',
  new multer().none(),
  announcementController.handleAddAnnouncement,
)
