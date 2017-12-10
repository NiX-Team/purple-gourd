export default () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      ctx.status = e.statusCode || e.status || 500
      ctx.body = { message: e.message }
    }
  }
}

export function error(statusCode, message) {
  const e = new Error(message)
  e.statusCode = statusCode
  return e
}
