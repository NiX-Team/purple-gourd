import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { observer } from 'mobx-react'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Interceptor from '@/components/Auth/Interceptor'
import Account from '@/components/Account'
import { AnnouncementCard, AnnouncementForm, AnnouncementPost } from '@/components/Announcement'
import User from '@/models/User'

@observer
class App extends React.Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          {User.isAuthenticated ? (
            <React.Fragment>
              <Account />
              <AnnouncementPost />
            </React.Fragment>
          ) : null}
          <Interceptor />
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            <Route path="/login" component={Login} />
            <Route path="/form" component={AnnouncementForm} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/:id" component={AnnouncementCard} />
          </Switch>
        </React.Fragment>
      </Router>
    )
  }
}

export default App
