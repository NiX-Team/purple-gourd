import mongoose from './mongoose'
import { Schema } from 'mongoose'

const announcementSchema = new Schema(
  {
    title: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    beginTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    uploadType: { type: String, required: true },
    description: { type: String },
    formField: [new Schema({ fieldName: { type: String } }, { _id: false })],
    forms: [
      new Schema(
        {
          data: { type: Schema.Types.Mixed },
          submitter: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
          },
        },
        { timestamps: true, _id: false },
      ),
    ],
    files: [
      new Schema(
        {
          list: [
            new Schema(
              {
                fid: {
                  type: Schema.Types.ObjectId,
                  ref: 'fs.files',
                  required: true,
                },
                uploadTime: { type: Date, required: true },
              },
              { _id: false },
            ),
          ],
          submitter: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
          },
        },
        { timestamps: true, _id: false },
      ),
    ],
  },
  { timestamps: true },
)

export default mongoose.model('announcement', announcementSchema)
