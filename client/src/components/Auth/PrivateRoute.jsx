import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import User from '@/models/User'
import { Observer } from 'mobx-react'

export default ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        <Observer>
          {() =>
            User.isAuthenticated ? (
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
