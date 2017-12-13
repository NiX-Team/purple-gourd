import React from 'react'
import fetchIntercept from 'fetch-intercept'
import { withRouter } from 'react-router'
import User from '@/models/User'

class Interceptor extends React.Component {
  componentWillMount() {
    let self = this
    fetchIntercept.register({
      request: function(url, config = {}) {
        // Modify the url or config here
        config.credentials = 'same-origin' // Please see https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
        return [url, config]
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
            self.props.history.push('/login')
            break
          default:
            return response
        }
        return response
      },

      responseError: function(error) {
        // Handle an fetch error
        return Promise.reject(error)
      },
    })
  }

  render() {
    return null
  }
}

export default withRouter(Interceptor)
