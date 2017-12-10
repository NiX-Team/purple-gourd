import mongoose from './mongoose'
import { Schema } from 'mongoose'

const announcementsSchema = new Schema(
  {
    title: { type: String },
    creator: { type: String },
    beginTime: { type: Date },
    endTime: { type: Date },
    uploadType: { type: String },
    description: { type: String },
    formField: [new Schema({ fieldName: { type: String } }, { _id: false })],
  },
  { timestamps: true },
)

export default mongoose.model('announcement', announcementsSchema)
