export default () => {
  return async (ctx, next) => {
    if (!ctx.session) ctx.throw(403, 'No permission to access')
    else await next()
  }
}
