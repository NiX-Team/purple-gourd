import announcementModel from '~/models/announcementModel'
import { error } from '~/middlewares/error'

async function findById(id) {
  let result
  result = await announcementModel.findById(id)
  if (!result) throw error(404, 'No such announcement')
  return result
}

async function findByUser(username) {
  return await announcementModel.find({ creator: username })
}

async function findByIdAndUpdate(id, doc) {
  await announcementModel.findByIdAndUpdate(id, doc)
  return doc
}

async function add(data) {
  return await data.save()
}

async function remove(id) {
  await announcementModel.findByIdAndRemove(id)
}

function filter(data) {
  ;['_id', 'creator'].forEach(item => {
    delete data[item]
  })
  return data
}

export default {
  async handleAddAnnouncement(ctx) {
    const jsonData = filter(ctx.request.body),
      data = new announcementModel(jsonData)

    data.creator = ctx.session.username

    ctx.body = await add(data)
  },

  async handleRemoveAnnouncement(ctx) {
    const id = ctx.params.id
    await findById(id)
    await remove(id)
    ctx.body = null
  },

  async handleGetAnnouncementById(ctx) {
    ctx.body = await findById(ctx.params.id)
  },

  async handleGetAnnouncementsByUser(ctx) {
    ctx.body = await findByUser(ctx.session.username)
  },

  async handleUpdateAnnouncement(ctx) {
    const jsonData = filter(ctx.request.body),
      id = ctx.params.id
    let result = await findById(id)
    if (result.creator !== ctx.session.username)
      ctx.throw(403, 'Only creator can change this')
    ctx.body = await findByIdAndUpdate(id, Object.assign(result, jsonData))
  },
}
