import { observe, observable, intercept } from 'mobx'
import { request } from '@/services/fetch'

class UserModel {
  @observable isAuthenticated

  login = async data => {
    let response = await request('/login', 'POST', data)
    this.isAuthenticated = response.response.ok
    return response
  }

  logout = async () => {
    this.isAuthenticated = false
    return await request('/logout', 'POST')
  }

  getUsername = async () => await request('/users')

  getFollowers = async () => await request('/users/followers')
}

const User = new UserModel()

intercept(User, 'isAuthenticated', change => {
  if (typeof change.newValue === 'string') change.newValue = change.newValue === 'false' ? false : true
  return change
})

observe(User, 'isAuthenticated', change => {
  localStorage.setItem('isAuth', change.newValue)
})

User.isAuthenticated = localStorage.getItem('isAuth')

export default User
