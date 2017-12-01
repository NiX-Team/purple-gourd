import mongoose from 'mongoose'

mongoose.Promise = global.Promise

export default mongoose.createConnection('mongodb://localhost/db', {
  useMongoClient: true,
})
