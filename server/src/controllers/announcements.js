import crypto from 'crypto'
import { PassThrough } from 'stream'
import archiver from 'archiver'
import Announcement, { filter } from '~/models/announcementModel'
import User from '~/models/userModel'
import File from '~/models/fileModel'
import { error } from '~/middlewares/error'
import Condition from '~/utils/condition'

const MAX_FILE_NUMBER = 5

const notNull = Condition.notNull(() => {
  throw error(404, 'No such announcement')
})

class Announcements {
  @filter
  async addAnnouncement(ctx) {
    const data = ctx.request.body,
      newDoc = new Announcement(data)
    newDoc.creator = ctx.session.uid
    ctx.body = await newDoc.save()
  }

  async addAnnouncementForm(ctx) {
    const data = ctx.request.body,
      id = ctx.params.id,
      result = notNull(await Announcement.findById(id)),
      formData = result.formField.reduce((cur, { fieldName }) => {
        if (data[fieldName]) cur[fieldName] = data[fieldName]
        return cur
      }, {})

    if (result.forms.find(({ submitter }) => submitter.equals(ctx.session.uid))) {
      await Announcement.findOneAndUpdate(
        { _id: id, 'forms.submitter': ctx.session.uid },
        {
          $set: {
            'forms.$.data': formData,
          },
        },
      )
    } else {
      await Announcement.findByIdAndUpdate(id, {
        $push: {
          forms: { data: formData, submitter: ctx.session.uid },
        },
      })
    }
    ctx.body = formData
  }

  async removeAnnouncement(ctx) {
    await Announcement.findByIdAndRemove(ctx.params.id)
    ctx.body = null
  }

  async getAnnouncementById(ctx) {
    ctx.body = [
      notNull(
        await Announcement.findById(ctx.params.id).populate({
          path: 'files.list.fid',
          select: '-buffer',
        }),
      ),
    ].filter(item => {
      item.forms = item.forms.filter(item => item.submitter.equals(ctx.session.uid))
      item.files = item.files.filter(item => item.submitter.equals(ctx.session.uid))
      return true
    })[0]
  }

  async getAnnouncementsFollowing(ctx) {
    const result = await User.findById(ctx.session.uid),
      nowTime = new Date(Date.now())
    ctx.body = (await Announcement.find({
      creator: { $in: result.following.map(item => item.uid) },
      beginTime: { $lte: nowTime },
      endTime: { $gte: nowTime },
    })).filter(item => {
      item.forms = item.forms.filter(item => item.submitter.equals(ctx.session.uid))
      item.files = item.files.filter(item => item.submitter.equals(ctx.session.uid))
      return true
    })
  }

  async getAnnouncementsUserCreated(ctx) {
    ctx.body = await Announcement.find({ creator: ctx.session.uid })
  }

  @filter
  async updateAnnouncement(ctx) {
    const data = ctx.request.body,
      id = ctx.params.id,
      result = notNull(await Announcement.findById(id))
    if (!result.creator.equals(ctx.session.uid)) ctx.throw(403, 'Only creator can change this')
    const doc = Object.assign(result, data)
    await Announcement.findByIdAndUpdate(id, doc)
    ctx.body = doc
  }

  async uploadFile(ctx) {
    const id = ctx.params.id
    const result = notNull(await Announcement.findById(id))
    if (result.creator.equals(ctx.session.uid))
      ctx.body = ctx.throw(403, `Creator can't upload file, please wait for the next version(team support)`)
    const file = ctx.req.file
    const hash = crypto.createHash('md5')
    hash.update(file.buffer)
    const md5 = hash.digest('hex')

    const newFile = new File(file)
    newFile.hash = md5
    newFile.owner = ctx.session.uid
    await newFile.save()

    let targetList = result.files.find(({ submitter }) => submitter.equals(ctx.session.uid))

    if (!targetList) {
      result.files.push({
        list: [],
        submitter: ctx.session.uid,
      })
      targetList = result.files.slice(-1)[0]
    }
    if (targetList.list.length >= MAX_FILE_NUMBER) await targetList.list[0].remove()
    targetList.list.push({ fid: newFile.id })
    await result.save()

    ctx.body = (await Announcement.findById(id).populate({
      path: 'files.list.fid',
      select: '-buffer',
    })).files.filter(({ submitter }) => submitter.equals(ctx.session.uid))[0]
  }

  async getArchive(ctx) {
    const id = ctx.params.id
    const result = notNull(
      await Announcement.findById(id)
        .populate('files.list.fid')
        .populate('files.submitter'),
    )
    if (!result.creator.equals(ctx.session.uid)) ctx.throw(403, 'You are not the creator')
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })
    result.files.forEach(item => {
      const file = item.list.pop().fid
      archive.append(file.buffer, {
        name: `${item.submitter.username}.${file.originalname.split('.').pop()}`,
      })
    })
    archive.finalize()
    ctx.set('Content-Disposition', 'inline; filename=Archive.zip')
    ctx.set('Content-Type', 'application/zip')
    ctx.body = archive.pipe(PassThrough())
  }
}

export default new Announcements()
