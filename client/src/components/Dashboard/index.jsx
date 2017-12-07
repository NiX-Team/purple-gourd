import React from 'react'
import Upload from '@/components/Upload'
import AnnouncementForm from '@/components/Announcement/Form'
import User from '@/models/User'

export default class Dashboard extends React.Component {
  state = {}

  async componentDidMount() {
    let { data } = await User.getUsername()
    this.setState({ username: data.username })
  }

  render() {
    const { username } = this.state
    return (
      <div>
        <h2>Dashboard</h2>
        <p>Hello {username} !</p>
        <Upload />
        <AnnouncementForm />
      </div>
    )
  }
}
