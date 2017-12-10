import mongoose from './mongoose'
import { Schema } from 'mongoose'
import announcements from '../controllers/announcements'

const userSchema = new Schema(
  {
    username: { type: String },
    password: { type: String },
    email: { type: String },
    followers: [new Schema({ username: { type: String } }, { _id: false })],
    following: [new Schema({ username: { type: String } }, { _id: false })],
  },
  { timestamps: true },
)

export default mongoose.model('user', userSchema)
