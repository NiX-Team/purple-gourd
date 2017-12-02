let isAuthenticated = localStorage.getItem('isAuth') || false

const Auth = {
  async login(data) {
    let response
    try {
      response = await fetch('/login', {
        method: 'POST',
        body: ((username, password) => {
          let form = new FormData()
          form.append('username', username)
          form.append('password', password)
          return form
        })(data.username, data.password),
      })
    } catch (err) {
      throw err
    }
    return (this.isAuthenticated = response.ok)
  },
  authenticate() {},
  logout() {
    this.isAuthenticated = false
  },
}

Object.defineProperty(Auth, 'isAuthenticated', {
  get() {
    return isAuthenticated
  },
  set(newValue) {
    localStorage.setItem('isAuth', (isAuthenticated = newValue))
  },
})

export { Auth }
