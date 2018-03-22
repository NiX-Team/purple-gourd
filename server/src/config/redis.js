import Redis from 'ioredis'

export default new Redis(process.env.NODE_ENV === 'production' ? { host: 'redis' } : {})
