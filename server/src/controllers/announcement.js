import announcementModel from '~/models/announcementModel'

async function findById(id) {
  let result
  try {
    result = await announcementModel.findById(id)
    if (!result) throw new Error()
  } catch (e) {
    e.statusCode = 404
    e.message = 'No such announcement'
    throw e
  }
  return result
}

async function findByIdAndUpdate(id, doc) {
  try {
    await announcementModel.findByIdAndUpdate(id, doc)
  } catch (e) {
    e.statusCode = 507
    e.message = 'Storage fail'
    throw e
  }
  return doc
}

async function add(data) {
  try {
    return await data.save()
  } catch (e) {
    e.statusCode = 507
    e.message = 'Storage fail'
    throw e
  }
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

  async handleGetAnnouncement(ctx) {
    ctx.body = await findById(ctx.params.id)
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
