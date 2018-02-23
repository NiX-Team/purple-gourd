const ONE_DAY = 1000 * 60 * 60 * 24

export { ONE_DAY }
export default class MemoryStore {
  constructor() {
    this.sessions = new Map()
    this.sid = 0
  }

  async get(sid) {
    return (this.sessions.get(sid) || { session: undefined }).session
  }

  async set(sid, session = {}, maxAge = ONE_DAY) {
    session = {
      session,
      maxAge,
      __timer: setTimeout(() => {
        this.delete(sid)
      }, maxAge),
    }
    try {
      this.sessions.set(sid, session)
    } catch (e) {
      throw e
    }
  }

  async add(session = {}, maxAge = ONE_DAY) {
    this.set(++this.sid + '', session, maxAge)
    return this.sid
  }

  async delete(sid) {
    this.sessions.delete(sid)
  }
}
