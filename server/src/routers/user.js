import Router from 'koa-router'
import userController from '~/controllers/user'
import announcementController from '~/controllers/announcement'

const router = new Router()

export default router
  .get('/', userController.handleGetUserInfo)
  .get('/announcement', announcementController.handleGetAnnouncementsByUser)
