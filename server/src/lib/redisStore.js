import uid from 'uid-safe'
import Store, { ONE_DAY } from './memoryStore'
import redis from '~/config/redis'

export default class RedisStore extends Store {
  constructor() {
    super()
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
    return sid
  }

  async add(session = {}, maxAge = ONE_DAY) {
    return await this.set(await uid(32), session, maxAge)
  }

  async delete(sid) {
    await this.redis.del(`SESSION:${sid}`)
  }
}
