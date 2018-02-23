import Router from 'koa-router'
import login from '~/routes/login'
import logout from '~/routes/logout'
import users from '~/routes/users'
import announcements from '~/routes/announcements'
import files from '~/routes/files'
import auth from '~/middlewares/auth'

const router = new Router()

export default router
  .use('/login', login.routes(), login.allowedMethods())
  .use('/logout', logout.routes(), logout.allowedMethods())
  .use('/users', auth(), users.routes(), users.allowedMethods())
  .use('/announcements', auth(), announcements.routes(), announcements.allowedMethods())
  .use('/files', auth(), files.routes(), users.allowedMethods())
