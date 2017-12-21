import mongoose from 'mongoose'
import Grid from 'gridfs-stream'
import filter from './filterPlugin'

mongoose.Promise = global.Promise
mongoose.plugin(filter)

const connection = mongoose.createConnection('mongodb://localhost/db', {
  useMongoClient: true,
})

connection.once('open', () => {
  connection.gfs = Grid(connection.db, mongoose.mongo)
})

export default connection
