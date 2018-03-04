import User from '~/models/userModel'

class Users {
  async login(ctx) {
    let formData = ctx.request.body,
      user

    if (
      formData &&
      (user = await User.findOne({ username: formData.username })) &&
      formData.username === user.username &&
      formData.password === user.password
    ) {
      ctx.body = { message: 'Authentication success' }
      ctx.session = { uid: user._id, username: user.username }
    } else ctx.throw(401, 'Bad credentials')
  }

  async logout(ctx, next) {
    ctx.session = null
    await next()
    ctx.body = { message: 'Logout success' }
  }

  async getUserInfo(ctx) {
    ctx.body = await User.findOne({ username: ctx.session.username }).select('-password')
  }

  async addUserFollowing(ctx) {
    const data = ctx.request.body
    await User.findByIdAndUpdate(ctx.session.uid, {
      $addToSet: {
        following: {
          uid: (await User.findOneAndUpdate(
            { username: data.username },
            {
              $addToSet: { followers: { uid: ctx.session.uid } },
            },
          ))._id,
        },
      },
    })
    ctx.body = { username: data.username }
  }

  async removeUserFollowing(ctx, next, wow) {
    const data = ctx.request.body
    await User.findByIdAndUpdate(ctx.session.uid, {
      $pull: {
        following: {
          uid: (await User.findOneAndUpdate(
            { username: data.username },
            { $pull: { followers: { uid: ctx.session.uid } } },
          ))._id,
        },
      },
    })
    ctx.body = null
  }
}

export default new Users()
