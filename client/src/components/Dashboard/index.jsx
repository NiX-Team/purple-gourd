import React from 'react'
import Upload from '@/components/Upload'
import AnnouncementForm from '@/components/Announcement/Form'

export default class Dashboard extends React.Component {
  state = {}

  async componentDidMount() {
    let username = (await (await fetch('/user')).json()).username
    this.setState({ username })
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
