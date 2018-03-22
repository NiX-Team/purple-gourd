import mongoose from 'mongoose'
import filter from '~/lib/filterPlugin'

mongoose.Promise = global.Promise
mongoose.plugin(filter)

const connection = mongoose.createConnection(
  process.env.NODE_ENV === 'production' ? 'mongodb://mongo/db' : 'mongodb://localhost/db',
  {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 1000,
  },
)

export default connection
