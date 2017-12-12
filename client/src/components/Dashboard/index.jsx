import React from 'react'
import { Link } from 'react-router-dom'
import { List, Card } from 'antd'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import Announcement from '@/models/Announcement'

@observer
export default class Dashboard extends React.Component {
  @observable announcements
  @observable loading = true

  async componentDidMount() {
    const { data } = await Announcement.getFollowingAnnouncements()
    this.announcements = data
    this.loading = false
  }

  render() {
    return (
      <div>
        <Card title="公告栏" bordered={false}>
          <List
            loading={this.loading}
            itemLayout="horizontal"
            dataSource={this.announcements}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<Link to={item._id}>{item.title}</Link>}
                  description={
                    item.description ? item.description : '无描述...'
                  }
                />
                <span>发布于{item.createdAt}</span>
              </List.Item>
            )}
          />
        </Card>
      </div>
    )
  }
}
