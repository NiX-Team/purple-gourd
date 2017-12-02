import RedisStore from '~/models/redisStore'
import { ONE_DAY } from '~/models/memoryStore'

export default (opts = {}) => {
  const { key = 'session', store = new RedisStore(), maxAge = ONE_DAY } = opts

  return async (ctx, next) => {
    let id = ctx.cookies.get(key, opts),
      session = id ? await store.get(id) : null,
      dirty = false

    Object.defineProperty(ctx, 'session', {
      get() {
        return session
      },
      set(newValue) {
        session = newValue
        dirty = true
      },
    })

    await next()

    if (!dirty) return

    if (id && !ctx.session) {
      await store.delete(id)
      return
    }

    let sid = await store.add(ctx.session, maxAge)
    ctx.cookies.set(key, sid + '', opts)
  }
}
