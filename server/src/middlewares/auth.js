export default () => {
  return async (ctx, next) => {
    if (!ctx.session) ctx.throw(401, 'No permission to access')
    else await next()
  }
}
