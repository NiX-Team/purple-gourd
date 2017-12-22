class Condition {
  notNull = fn => value => {
    if (value === null) fn()
    return value
  }
}

export default new Condition()
