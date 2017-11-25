const ONE_DAY = 1000 * 60 * 60 * 24

class SessionStore {
  constructor() {
    this.sessions = new Map()
    this.sid = 0
  }

  get(sid) {
    return (this.sessions.get(sid) || { session: undefined }).session
  }

  set(sid, session = {}, maxAge = ONE_DAY) {
    session = {
      session,
      sid,
      maxAge,
      __timer: setTimeout(() => {
        this.delete(sid)
      }, maxAge),
    }
    try {
      this.sessions.set(sid, session)
    } catch (err) {
      throw err
    }
  }

  add(session = {}, maxAge = ONE_DAY) {
    this.set(++this.sid + '', session, maxAge)
    return this.sid
  }

  delete(sid) {
    this.sessions.delete(sid)
  }
}

export default (opts = {}) => {
  const { key = 'session' } = opts
  const store = new SessionStore()

  return async (ctx, next) => {
    let id = ctx.cookies.get(key, opts),
      session = id ? store.get(id) : null,
      dirty = true

    Object.defineProperty(ctx, 'session', {
      get() {
        return session
      },
      set(newValue) {
        session = newValue
        dirty = false
      },
    })

    await next()

    if (!dirty) return

    if (id && !ctx.session) {
      store.delete(id)
      return
    }

    let sid = store.add(ctx.session)
    ctx.cookies.set(key, sid + '', opts)
  }
}
