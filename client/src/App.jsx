import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { observer } from 'mobx-react'
import PrivateRoute from '@/components/Auth/PrivateRoute'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Interceptor from '@/components/Auth/Interceptor'
import Account from '@/components/Account'
import AnnouncementCard from '@/components/Announcement/Card'
import User from '@/models/User'

@observer
class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          {User.isAuthenticated ? <Account /> : null}
          <Interceptor />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/dashboard/:tab" component={Dashboard} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <Route path="/:id" component={AnnouncementCard} />
          </Switch>
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
