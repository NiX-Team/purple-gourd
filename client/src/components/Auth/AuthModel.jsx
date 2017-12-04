import { observe, observable, intercept } from 'mobx'

const Auth = new class Auth {
  @observable isAuthenticated

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
  }
}()

intercept(Auth, 'isAuthenticated', change => {
  if (typeof change.newValue === 'string')
    change.newValue = change.newValue === 'false' ? false : true
  return change
})

observe(Auth, 'isAuthenticated', change => {
  localStorage.setItem('isAuth', change.newValue)
})

Auth.isAuthenticated = localStorage.getItem('isAuth')

export default Auth
