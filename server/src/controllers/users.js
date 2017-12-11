import usersModel from '~/models/userModel'
import { error } from '~/middlewares/error'

async function findOneAndCheck(username, uid) {
  const result = await usersModel.findOne({ username })
  if (!result) throw error(404, 'No such user')
  return {
    uid: result._id,
    isFollow: result.followers.find(item => item.uid.equals(uid))
      ? true
      : false,
  }
}

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
      ctx.session = { uid: user._id, username: user.username }
    } else ctx.throw(401, 'Bad credentials')
  },

  async handleGetUserInfo(ctx) {
    ctx.body = await usersModel.findOne(
      { username: ctx.session.username },
      ctx.query,
    )
  },

  async handleAddUserFollowing(ctx) {
    const jsonData = ctx.request.body,
      { uid, isFollow } = await findOneAndCheck(
        jsonData.username,
        ctx.session.uid,
      )
    if (isFollow) throw error(204) // TODO: Not sure whether to return 204
    await usersModel.findByIdAndUpdate(ctx.session.uid, {
      $push: { following: { uid } },
    })
    await usersModel.findByIdAndUpdate(uid, {
      $push: { followers: { uid: ctx.session.uid } },
    })
    ctx.body = { username: jsonData.username }
  },

  async handleRemoveUserFollowing(ctx) {
    const jsonData = ctx.request.body,
      { uid, isFollow } = await findOneAndCheck(
        jsonData.username,
        ctx.session.uid,
      )
    if (isFollow) {
      console.log('wow')
      await usersModel.findByIdAndUpdate(ctx.session.uid, {
        $pull: { following: { uid } },
      })
      await usersModel.findByIdAndUpdate(uid, {
        $pull: { followers: { uid: ctx.session.uid } },
      })
    }
    ctx.body = null
  },

  query(obj) {
    return async (ctx, next) => {
      ctx.query = obj
      await next()
    }
  },
}
