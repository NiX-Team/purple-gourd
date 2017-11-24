export default {
  async handleLogin(ctx) {
    let formData = ctx.request.body

    if (
      formData.username == 'crazymousethief' &&
      formData.password == 'crazymousethief'
    ) {
      ctx.body = 'login'
      ctx.session = {}
    } else {
      ctx.throw(401, 'Authentication failed', { username: formData.username })
    }
  },
}
