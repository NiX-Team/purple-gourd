export default (opts = {}) => {
  const { key = 'session' } = opts
  const sessions = new Map()

  let sid = 0
  sessions.set(++sid + '', 'wow')
  return async (ctx, next) => {
    let id = ctx.cookies.get(key, opts)

    if (!id) ctx.session = null
    else {
      ctx.session = sessions.get(id)
      // if (typeof ctx.session !== 'object' || ctx.session == null)
      //   ctx.session = {}
    }

    const dirty = JSON.stringify(ctx.session)

    await next()

    if (dirty === JSON.stringify(ctx.session)) return

    if (id && !ctx.session) {
      sessions.delete(id)
      return
    }

    sessions.set(++sid + '', ctx.session)
    ctx.cookies.set(key, sid + '', opts)
  }
}
