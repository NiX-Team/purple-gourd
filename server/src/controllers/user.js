import userModel from '~/models/userModel'

export default {
  async handleLogin(ctx) {
    let formData = ctx.request.body,
      user

    if (
      formData &&
      (user =
        (await userModel.findOne({ username: formData.username })) || {}) &&
      formData.username === user.username &&
      formData.password === user.password
    ) {
      ctx.body = { message: 'Authentication success' }
      ctx.session = { username: formData.username }
    } else ctx.throw(401, 'Bad credentials')
  },

  async handleGetUserInfo(ctx, next) {
    ctx.body = JSON.stringify({ username: ctx.session.username })
  },
}
