import Router from 'koa-router'
import body from 'koa-bodyparser'
import usersController from '~/controllers/users'
import announcementsController from '~/controllers/announcements'

const router = new Router()

export default router
  .get('/', usersController.getUserInfo)
  .get('/announcements', announcementsController.getAnnouncementsUserCreated)
  .post('/following', body(), usersController.addUserFollowing)
  .delete('/following', body(), usersController.removeUserFollowing)
