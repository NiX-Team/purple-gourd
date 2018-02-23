import mongoose from '~/config/mongoose'
import { Schema } from 'mongoose'

const followersSchema = new Schema({ uid: { type: Schema.Types.ObjectId, ref: 'user' } }, { _id: false })

const followingSchema = new Schema({ uid: { type: Schema.Types.ObjectId, ref: 'user' } }, { _id: false })

const userSchema = new Schema(
  {
    username: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    followers: [followersSchema],
    following: [followingSchema],
  },
  { timestamps: true },
)

const User = mongoose.model('user' /* Will automatically add 's' or 'es', intersting */, userSchema)

export default User
