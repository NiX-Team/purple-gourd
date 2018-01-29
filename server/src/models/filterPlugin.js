export default function filterPlugin(schema, opt) {
  const defaultList = { _id: false, __v: false }
  const { tree, options } = schema
  if (options.timestamps) {
    defaultList.createdAt = false
    defaultList.updatedAt = false
  }

  const blackList = Object.assign(
    Object.keys(tree).reduce((cur, key) => {
      cur[key] = tree[key].writable === false ? false : true
      return cur
    }, {}),
    defaultList,
  )

  schema.statics.getFilterObject = obj => {
    return Object.keys(obj).reduce((cur, key) => {
      if (blackList[key] === true) {
        if (Array.isArray(obj[key])) {
          cur[key] = obj[key].map(item => {
            return (tree[key].type || tree[key])[0].statics.getFilterObject(item)
          })
        } else cur[key] = obj[key]
      }
      return cur
    }, {})
  }

  schema.statics.getFilterProxy = obj => {
    return new Proxy(obj, {
      get(target, p) {
        const o = target[p]
        let res
        if (blackList[p] === true) {
          if (Array.isArray(o)) {
            res = o.map(item => {
              return (tree[p].type || tree[p])[0].statics.getFilterProxy(item)
            })
          } else res = o
        }
        return res
      },
    })
  }

  schema.statics.getFilterDecorator = () => (target, name, descriptor) => {
    const oldValue = descriptor.value
    descriptor.value = function() {
      const ctx = arguments[0]
      ctx.request.body = schema.statics.getFilterObject(ctx.request.body)
      return oldValue.apply(null, arguments)
    }
    return descriptor
  }
}
