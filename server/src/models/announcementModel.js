import mongoose from './mongoose'
import { Schema } from 'mongoose'

const formSchema = new Schema(
  {
    data: { type: Schema.Types.Mixed },
    submitter: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true, _id: false },
)

const fileListSchema = new Schema({
  fid: {
    type: Schema.Types.ObjectId,
    ref: 'gfs',
    required: true,
  },
  uploadTime: { type: Date, required: true },
})

const fileSchema = new Schema(
  {
    list: [fileListSchema],
    submitter: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true, _id: false },
)

const formFieldSchema = new Schema(
  { fieldName: { type: String } },
  { _id: false },
)

const announcementSchema = new Schema(
  {
    title: { type: String, required: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      writable: false,
    },
    beginTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    uploadType: { type: String, required: true },
    description: { type: String },
    formField: [formFieldSchema],
    forms: { type: [formSchema], writable: false },
    files: { type: [fileSchema], writable: false },
  },
  { timestamps: true },
)

const Announcement = mongoose.model('announcement', announcementSchema)

export default Announcement
export const filter = Announcement.getFilterDecorator()
