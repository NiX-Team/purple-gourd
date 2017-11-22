import Koa from 'koa'

const app = new Koa()

app.use(async ctx => {
  ctx.body = 'purple gourd'
})

export default app
