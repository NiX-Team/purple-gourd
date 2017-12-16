import mongoose from 'mongoose'
import Grid from 'gridfs-stream'

mongoose.Promise = global.Promise

const connection = mongoose.createConnection('mongodb://localhost/db', {
  useMongoClient: true,
})

connection.once('open', () => {
  connection.gfs = Grid(connection.db, mongoose.mongo)
})

export default connection
