import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import PrivateRoute from '@components/Auth/PrivateRoute'
import Login from '@components/Login'
import Dashboard from '@components/Dashboard'
import Interceptor from '@components/Auth/Interceptors'

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Interceptor />
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
          <Route path="/login" component={Login} />
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

export default App
