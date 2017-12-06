import mongoose from './mongoose'
import { Schema } from 'mongoose'

const announcementSchema = new Schema({
  title: { type: String },
  creator: { type: String },
  beginTime: { type: Date },
  endTime: { type: Date },
  createTime: { type: Date, default: Date.now() },
  lastModifyTime: { type: Date, default: Date.now() },
  uploadType: { type: String },
  formField: [{ fieldName: { type: String } }],
})

export default mongoose.model('announcement', announcementSchema)
