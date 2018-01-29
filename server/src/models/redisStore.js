import Store, { ONE_DAY } from './memoryStore'
import redis from './redis'

export default class RedisStore extends Store {
  constructor() {
    super()
    this.sid = 0
    this.redis = redis
  }

  async get(sid) {
    return (JSON.parse(await this.redis.get(`SESSION:${sid}`)) || { session: null }).session
  }

  async set(sid, session = {}, maxAge = ONE_DAY) {
    maxAge /= 1000
    session = { session, sid, maxAge }
    try {
      await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge)
    } catch (e) {
      throw e
    }
  }

  async add(session = {}, maxAge = ONE_DAY) {
    await this.set(++this.sid + '', session, maxAge)
    return this.sid
  }

  async delete(sid) {
    await this.redis.del(`SESSION:${sid}`)
  }
}
