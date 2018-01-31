import path from 'path'

const CLIENT_PATH = path.resolve(process.cwd(), 'client')
const SERVER_PATH = path.resolve(process.cwd(), 'server')
const OUTPUT_PATH = path.resolve(process.cwd(), 'dist')
const { NODE_ENV } = process.env

export { CLIENT_PATH, SERVER_PATH, OUTPUT_PATH, NODE_ENV }
