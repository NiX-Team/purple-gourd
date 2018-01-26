import mongoose from './mongoose'
import { Schema } from 'mongoose'
import { Buffer } from 'buffer'

const fileSchema = new Schema(
  {
    hash: { type: String },
    originalname: { type: String },
    mimetype: { type: String },
    buffer: { type: Buffer },
    size: { type: Number },
  },
  { timestamps: true },
)

const File = mongoose.model('file', fileSchema)

export default File
