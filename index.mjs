import Koa from 'koa'

const app = new Koa()

app.use(async ctx => {
  ctx.body = 'purple gourd'
})

app.listen(3000)
