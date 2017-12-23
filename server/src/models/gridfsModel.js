import mongoose from './mongoose'
import { Schema } from 'mongoose'

const GridFS = mongoose.model(
  'gfs',
  new Schema({}, { strict: false }),
  'fs.files',
)

export default GridFS
