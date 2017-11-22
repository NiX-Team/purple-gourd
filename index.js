import app from './server/index'
import http from 'http'

http.createServer(app.callback()).listen(3000)
