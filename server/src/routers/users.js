import Router from 'koa-router'
import body from 'koa-bodyparser'
import usersController from '~/controllers/users'
import announcementsController from '~/controllers/announcements'

const router = new Router()

export default router
  .get('/', usersController.handleGetUserInfo)
  .get('/announcements', announcementsController.handleGetAnnouncementsByUser)
  .get(
    '/followers',
    usersController.query({ followers: 1 }),
    usersController.handleGetUserInfo,
  )
  .get(
    '/following',
    usersController.query({ following: 1 }),
    usersController.handleGetUserInfo,
  )
  .post('/following', body(), usersController.handleAddUserFollowing)
  .delete('/following', body(), usersController.handleRemoveUserFollowing)
