export default {
  async login(ctx) {
    let formData = ctx.request.body

    if (
      formData.username == 'crazymousethief' &&
      formData.password == 'crazymousethief'
    ) {
      ctx.body = 'login'
      ctx.session = {}
      ctx.redirect('/')
    }
  },
}
