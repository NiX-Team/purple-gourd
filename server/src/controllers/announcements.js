import stream from 'stream'
import crypto from 'crypto'
import mongoose from '~/models/mongoose'
import Announcement, { filter } from '~/models/announcementModel'
import User from '~/models/userModel'
import { error } from '~/middlewares/error'
import Condition from '~/utils/condition'

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

    if (
      result.forms.find(({ submitter }) => submitter.equals(ctx.session.uid))
    ) {
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
    ctx.body = [notNull(await Announcement.findById(ctx.params.id))].filter(
      item =>
        (item.forms = item.forms.filter(item =>
          item.submitter.equals(ctx.session.uid),
        )),
    )[0]
  }

  async getAnnouncementsFollowing(ctx) {
    const result = await User.findById(ctx.session.uid),
      nowTime = new Date(Date.now())
    ctx.body = (await Announcement.find({
      creator: { $in: result.following.map(item => item.uid) },
      beginTime: { $lte: nowTime },
      endTime: { $gte: nowTime },
    })).filter(
      item =>
        (item.forms = item.forms.filter(item =>
          item.submitter.equals(ctx.session.uid),
        )),
    )
  }

  async getAnnouncementsByUser(ctx) {
    ctx.body = await Announcement.find({ creator: ctx.session.uid })
  }

  @filter
  async updateAnnouncement(ctx) {
    const data = ctx.request.body,
      id = ctx.params.id,
      result = notNull(await Announcement.findById(id))
    if (!result.creator.equals(ctx.session.uid))
      ctx.throw(403, 'Only creator can change this')
    const doc = Object.assign(result, data)
    await Announcement.findByIdAndUpdate(id, doc)
    ctx.body = doc
  }

  async uploadFile(ctx) {
    const id = ctx.params.id
    const result = notNull(await Announcement.findById(id))
    const hash = crypto.createHash('md5')
    const file = ctx.req.file
    hash.update(file.buffer)
    const md5 = hash.digest('hex')
    let writestream = null

    const foundFile = await new Promise((resolve, reject) => {
      mongoose.gfs.findOne({ md5 }, (e, f) => (e ? reject(e) : resolve(f)))
    })

    let fileId
    if (foundFile) {
      fileId = foundFile._id
    } else {
      writestream = mongoose.gfs.createWriteStream({
        filename: `${file.originalname}`,
      })
      fileId = writestream.id
      const bufferStream = new stream.PassThrough()
      bufferStream.end(file.buffer)
      bufferStream.pipe(writestream)
    }

    const targetList = result.files.find(({ submitter }) =>
      submitter.equals(ctx.session.uid),
    )

    if (targetList) {
      if (!targetList.list.find(({ fid }) => fid.equals(fileId))) {
        await Announcement.findOneAndUpdate(
          {
            _id: id,
            'files.submitter': ctx.session.uid,
          },
          {
            $push: {
              'files.$.list': { fid: fileId, uploadTime: new Date(Date.now()) },
            },
          },
        )
      }
    } else {
      await Announcement.findByIdAndUpdate(id, {
        $push: {
          files: {
            list: { fid: fileId, uploadTime: new Date(Date.now()) },
            submitter: ctx.session.uid,
          },
        },
      })
    }

    // TODO: Can be optimized
    await new Promise((resolve, reject) => {
      if (writestream) {
        writestream.on('finish', file => resolve(file))
        writestream.on('error', e => reject(e))
      } else resolve()
    })
    ctx.body = (await Announcement.findById(id).populate(
      'files.list.fid',
    )).files.filter(({ submitter }) => submitter.equals(ctx.session.uid))[0]
  }
}

export default new Announcements()
