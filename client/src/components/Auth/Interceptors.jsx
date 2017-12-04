import React from 'react'
import fetchIntercept from 'fetch-intercept'
import { withRouter } from 'react-router'
import Auth from './AuthModel'

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
        // TODO: MobX will be better, or convert auth to a component ??
        if (response.status === 403) {
          Auth.isAuthenticated = false
          self.props.history.push('/login')
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
