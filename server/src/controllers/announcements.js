import stream from 'stream'
import crypto from 'crypto'
import mongoose from '~/models/mongoose'
import announcementModel from '~/models/announcementModel'
import userModel from '~/models/userModel'
import { error } from '~/middlewares/error'

async function findById(id, opt = {}) {
  let result
  result = await announcementModel.findById(id, opt)
  if (!result) throw error(404, 'No such announcement')
  return result
}

async function findByUser(uid) {
  return await announcementModel.find({ creator: uid })
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
  ;['_id', 'creator', 'forms', 'createdAt', 'updatedAt'].forEach(item => {
    delete data[item]
  })
  return data
}

export default {
  async handleAddAnnouncement(ctx) {
    const jsonData = filter(ctx.request.body),
      data = new announcementModel(jsonData)

    data.creator = ctx.session.uid

    ctx.body = await add(data)
  },

  async handleAddAnnouncementForm(ctx) {
    const jsonData = ctx.request.body,
      id = ctx.params.id,
      result = await findById(id)
    let formData = {}
    result.formField.forEach(({ fieldName }) => {
      if (jsonData[fieldName]) formData[fieldName] = jsonData[fieldName]
    })
    if (
      result.forms.find(({ submitter }) => submitter.equals(ctx.session.uid))
    ) {
      await announcementModel.findOneAndUpdate(
        { _id: id, 'forms.submitter': ctx.session.uid },
        {
          $set: {
            'forms.$.data': formData,
          },
        },
      )
    } else {
      await announcementModel.findByIdAndUpdate(id, {
        $push: {
          forms: { data: formData, submitter: ctx.session.uid },
        },
      })
    }
    ctx.body = formData
  },

  async handleRemoveAnnouncement(ctx) {
    const id = ctx.params.id
    await findById(id)
    await remove(id)
    ctx.body = null
  },

  async handleGetAnnouncementById(ctx) {
    ctx.body = [await findById(ctx.params.id)].filter(
      item =>
        (item.forms = item.forms.filter(item =>
          item.submitter.equals(ctx.session.uid),
        )),
    )[0]
  },

  async handleGetAnnouncementsFollowing(ctx) {
    const result = await userModel.findById(ctx.session.uid),
      nowTime = new Date(Date.now())
    ctx.body = (await announcementModel.find({
      creator: { $in: result.following.map(item => item.uid) },
      beginTime: { $lte: nowTime },
      endTime: { $gte: nowTime },
    })).filter(
      item =>
        (item.forms = item.forms.filter(item =>
          item.submitter.equals(ctx.session.uid),
        )),
    )
  },

  async handleGetAnnouncementsByUser(ctx) {
    ctx.body = await findByUser(ctx.session.uid)
  },

  async handleUpdateAnnouncement(ctx) {
    const jsonData = filter(ctx.request.body),
      id = ctx.params.id
    let result = await findById(id)
    if (!result.creator.equals(ctx.session.uid))
      ctx.throw(403, 'Only creator can change this')
    ctx.body = await findByIdAndUpdate(id, Object.assign(result, jsonData))
  },

  async handleUploadFile(ctx) {
    const id = ctx.params.id
    const result = await findById(id)
    const hash = crypto.createHash('md5')
    const file = ctx.req.file
    hash.update(file.buffer)
    const md5 = hash.digest('hex')

    const foundFile = await new Promise((resolve, reject) => {
      mongoose.gfs.findOne({ md5 }, (e, f) => (e ? reject(e) : resolve(f)))
    })

    let fileId
    if (foundFile) {
      fileId = foundFile._id
    } else {
      const writestream = mongoose.gfs.createWriteStream({
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
        await announcementModel.findOneAndUpdate(
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
      await announcementModel.findByIdAndUpdate(id, {
        $push: {
          files: {
            list: { fid: fileId, uploadTime: new Date(Date.now()) },
            submitter: ctx.session.uid,
          },
        },
      })
    }

    ctx.body = (await findById(id)).files.filter(({ submitter }) =>
      submitter.equals(ctx.session.uid),
    )[0]
  },
}
