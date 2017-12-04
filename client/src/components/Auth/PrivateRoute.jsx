import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Auth from './AuthModel'
import { Observer } from 'mobx-react'

export default ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        <Observer>
          {() =>
            Auth.isAuthenticated ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: '/login',
                  from: props.location,
                }}
              />
            )
          }
        </Observer>
      )}
    />
  )
}
