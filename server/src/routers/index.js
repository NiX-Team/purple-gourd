import Router from 'koa-router'
import login from '~/routers/login'
import logout from '~/routers/logout'
import users from '~/routers/users'
import announcements from '~/routers/announcements'
import files from '~/routers/files'
import auth from '~/middlewares/auth'

const router = new Router()

export default router
  .use('/login', login.routes(), login.allowedMethods())
  .use('/logout', logout.routes(), logout.allowedMethods())
  .use('/users', auth(), users.routes(), users.allowedMethods())
  .use('/announcements', auth(), announcements.routes(), announcements.allowedMethods())
  .use('/files', auth(), files.routes(), users.allowedMethods())
