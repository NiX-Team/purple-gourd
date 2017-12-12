import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { observer } from 'mobx-react'
import PrivateRoute from '@/components/Auth/PrivateRoute'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Interceptor from '@/components/Auth/Interceptor'
import Account from '@/components/Account'
import User from '@/models/User'

@observer
class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          {User.isAuthenticated ? <Account /> : null}
          <Interceptor />
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
