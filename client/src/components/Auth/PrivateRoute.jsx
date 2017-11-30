import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Auth } from './index'

export default ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
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
    />
  )
}
