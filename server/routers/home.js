import Router from 'koa-router'

const router = new Router()

export default router.get('/', async ctx => {
  if (ctx.session) ctx.body = 'purple gourd'
  else ctx.redirect('/login')
})
