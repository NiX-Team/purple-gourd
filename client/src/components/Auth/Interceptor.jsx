import React from 'react'
import fetchIntercept from 'fetch-intercept'
import { withRouter } from 'react-router'
import { message } from 'antd'
import User from '@/models/User'

class Interceptor extends React.Component {
  componentWillMount() {
    let self = this
    fetchIntercept.register({
      request: function(url, config = {}) {
        // Modify the url or config here
        config.credentials = 'same-origin' // Please see https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
        return [`/api${url}`, config]
      },

      requestError: function(error) {
        // Called when an error occurred during another 'request' interceptor call
        return Promise.reject(error)
      },

      response: function(response) {
        // Modify the response object
        switch (response.status) {
          case 401:
            User.isAuthenticated = false
            self.props.history.push({
              pathname: '/login',
              from: self.props.history.location.pathname,
            })
            break
          default:
            return response
        }
        return response
      },

      responseError: function(error) {
        // Handle an fetch error
        message.error('网络错误，请检查网络')
        return Promise.reject(error)
      },
    })
  }

  render() {
    return null
  }
}

export default withRouter(Interceptor)
