import announcementModel from '~/models/announcementModel'

export default {
  async handleAddAnnouncement(ctx) {
    const formData = ctx.request.body,
      data = new announcementModel(formData)

    data.creator = ctx.session.username

    try {
      await data.save()
    } catch (e) {
      ctx.throw(507, 'Storage fail')
    }

    ctx.body = 'Post success'
  },

  async handleGetAnnouncement(ctx) {
    let result = await announcementModel.findOne({ _id: ctx.params.id })
    ctx.body = JSON.stringify(result)
  },
}
