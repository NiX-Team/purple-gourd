import mongoose from './mongoose'
import { Schema } from 'mongoose'

const userSchema = new Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String },
})

export default mongoose.model('user', userSchema)
