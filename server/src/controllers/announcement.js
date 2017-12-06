import announcementModel from '~/models/announcementModel'

export default {
  async handleAddAnnouncement(ctx) {
    const formData = ctx.req.body,
      data = new announcementModel(formData)

    data.creator = ctx.session.username

    try {
      await data.save()
    } catch (e) {
      ctx.throw(507, 'Storage fail')
    }

    ctx.body = 'Post success'
  },
}
