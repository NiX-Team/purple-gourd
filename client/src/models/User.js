import { observe, observable, intercept } from 'mobx'
import { request } from '@/services/fetch'

const User = new class User {
  @observable isAuthenticated

  async login(data) {
    let response = await request('/login', 'POST', data)
    this.isAuthenticated = response.response.ok
    return response
  }

  async logout() {
    this.isAuthenticated = false
    return await request('/logout', 'POST')
  }

  async getUsername() {
    return await request('/users')
  }
}()

intercept(User, 'isAuthenticated', change => {
  if (typeof change.newValue === 'string') change.newValue = change.newValue === 'false' ? false : true
  return change
})

observe(User, 'isAuthenticated', change => {
  localStorage.setItem('isAuth', change.newValue)
})

User.isAuthenticated = localStorage.getItem('isAuth')

export default User
