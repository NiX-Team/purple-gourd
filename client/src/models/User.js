import { observe, observable, intercept } from 'mobx'
import { request } from '@/services/fetch'

class UserModel {
  @observable isAuthenticated
  @observable userInfo

  login = async data => {
    let response = await request('/login', 'POST', data)
    this.isAuthenticated = response.response.ok
    return response
  }

  logout = async () => {
    this.isAuthenticated = false
    return await request('/logout', 'POST')
  }

  getUserInfo = async () => {
    if (this.userInfo) return { data: this.userInfo }
    else {
      const result = await request('/users')
      this.userInfo = result.data
      return result
    }
  }

  getFollowers = async () => await request('/users')
}

const User = new UserModel()

intercept(User, 'isAuthenticated', change => {
  if (typeof change.newValue === 'string') change.newValue = change.newValue === 'false' ? false : true
  return change
})

observe(User, 'isAuthenticated', change => localStorage.setItem('isAuth', change.newValue))
observe(User, 'userInfo', change => localStorage.setItem('userInfo', JSON.stringify(change.newValue)))

User.isAuthenticated = localStorage.getItem('isAuth')
User.userInfo = JSON.parse(localStorage.getItem('userInfo'))

export default User
