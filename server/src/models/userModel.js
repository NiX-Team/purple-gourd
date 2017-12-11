import mongoose from './mongoose'
import { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    username: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    followers: [
      new Schema(
        { uid: { type: Schema.Types.ObjectId, ref: 'user' } },
        { _id: false },
      ),
    ],
    following: [
      new Schema(
        { uid: { type: Schema.Types.ObjectId, ref: 'user' } },
        { _id: false },
      ),
    ],
  },
  { timestamps: true },
)

export default mongoose.model(
  'user' /* Will automatically add 's' or 'es', intersting */,
  userSchema,
)
