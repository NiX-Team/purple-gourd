import mongoose from 'mongoose'
import filter from './filterPlugin'

mongoose.Promise = global.Promise
mongoose.plugin(filter)

const connection = mongoose.createConnection('mongodb://localhost/db')

export default connection
