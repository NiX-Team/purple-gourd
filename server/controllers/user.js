import userModel from '../models/userModel'

export default {
  async handleLogin(ctx) {
    let formData = ctx.request.body.fields,
      user

    if (
      formData &&
      (user =
        (await userModel.findOne({ username: formData.username })) || {}) &&
      formData.username === user.username &&
      formData.password === user.password
    ) {
      ctx.body = 'Authentication success'
      ctx.session = {}
    } else {
      ctx.throw(401, 'Authentication fail')
    }
  },
}
