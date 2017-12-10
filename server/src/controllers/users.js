import usersModel from '~/models/usersModel'

export default {
  async handleLogin(ctx) {
    let formData = ctx.request.body,
      user

    if (
      formData &&
      (user = await usersModel.findOne({ username: formData.username })) &&
      formData.username === user.username &&
      formData.password === user.password
    ) {
      ctx.body = { message: 'Authentication success' }
      ctx.session = { username: formData.username }
    } else ctx.throw(401, 'Bad credentials')
  },

  async handleGetUserInfo(ctx) {
    ctx.body = await usersModel.findOne(
      { username: ctx.session.username },
      ctx.query,
    )
  },
}
