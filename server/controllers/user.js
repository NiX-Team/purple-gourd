export default {
  async handleLogin(ctx) {
    let formData = ctx.request.body.fields

    if (
      formData.username === 'crazymousethief' &&
      formData.password === 'crazymousethief'
    ) {
      ctx.body = 'Authentication success'
      ctx.session = {}
    } else {
      ctx.throw(401, 'Authentication fail', { username: formData.username })
    }
  },
}
