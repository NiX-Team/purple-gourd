import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
} from 'react-router-dom'
import PrivateRoute from '@components/Auth/PrivateRoute'
import Login from '@components/Login'
import '@components/Auth/Interceptors'

class App extends React.Component {
  state = {
    redirect: { path: '/', hasDone: true },
  }

  redirect(path) {
    this.setState({ redirect: { path, hasDone: false } }, () => {
      this.setState({ redirect: { hasDone: true } })
    })
  }

  render() {
    const { redirect } = this.state
    return (
      <Router>
        <div>
          {redirect.hasDone ? null : <Redirect to={redirect.path} />}
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
          <Route exact path="/" component={Home} />
          <Route
            path="/login"
            render={props => (
              <Login
                {...props}
                redirect={path => {
                  this.redirect(path)
                }}
              />
            )}
          />
          <PrivateRoute path="/dashboard" component={Dashboard} />
        </div>
      </Router>
    )
  }
}

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
  </div>
)

export default App
