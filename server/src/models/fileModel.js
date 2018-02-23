import mongoose from '~/config/mongoose'
import { Schema } from 'mongoose'
import { Buffer } from 'buffer'

const fileSchema = new Schema(
  {
    hash: { type: String, required: true },
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    buffer: { type: Buffer },
    size: { type: Number, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      writable: false,
    },
  },
  { timestamps: true },
)

const File = mongoose.model('file', fileSchema)

export default File
