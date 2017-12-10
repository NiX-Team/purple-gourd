import Router from 'koa-router'
import usersController from '~/controllers/users'
import announcementsController from '~/controllers/announcements'

const router = new Router()

export default router
  .get('/', usersController.handleGetUserInfo)
  .get('/announcements', announcementsController.handleGetAnnouncementsByUser)
  .get('/followers')
