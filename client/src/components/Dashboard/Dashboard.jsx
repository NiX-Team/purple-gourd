import React from 'react'
import { observer } from 'mobx-react'
import { observable, intercept } from 'mobx'
import { List, Card, Tabs, Badge } from 'antd'
import Announcement from '@/models/Announcement'

const { TabPane } = Tabs

@observer
class Dashboard extends React.Component {
  @observable followingAnnouncements = []
  @observable createdAnnouncements = []
  @observable loading = true
  @observable key

  componentWillMount() {
    intercept(this, 'key', change => {
      this.handleTagChange(change.newValue)
      return change
    })
  }

  componentDidMount() {
    this.key = (this.props.location.state || { tab: 'following' }).tab
  }

  handleTagChange = key => {
    this.loading = true
    switch (key) {
      case 'following':
        Announcement.getFollowingAnnouncements().then(({ data }) => {
          this.followingAnnouncements = data
          this.loading = false
        })
        break
      case 'created':
        Announcement.getCreatedAnnouncements().then(({ data }) => {
          this.createdAnnouncements = data
          this.loading = false
        })
        break
      default:
        return
    }
    this.props.history.replace({
      state: {
        tab: key,
      },
    })
  }

  handleCardClick = item => e => {
    e.preventDefault()
    this.props.history.push({
      pathname: `/${item}`,
    })
  }

  render() {
    return (
      <Card bordered={false}>
        <Card.Meta title={<h1>公告</h1>} />
        <Tabs activeKey={this.key} size="large" onChange={key => (this.key = key)}>
          <TabPane tab="我关注的" key="following">
            <List
              loading={this.loading}
              itemLayout="vertical"
              dataSource={this.followingAnnouncements}
              renderItem={item => (
                <Card hoverable={true} style={{ marginTop: '12px' }} onClick={this.handleCardClick(item._id)}>
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={item.description ? item.description : '无描述...'}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {item.files.length === 0 ? (
                        <Badge status="processing" text="未提交" />
                      ) : (
                        <Badge status="success" text="已提交" />
                      )}
                      <span style={{ color: 'gray' }}>发布于 {new Date(item.createdAt).toLocaleString('zh-cn')}</span>
                    </div>
                  </List.Item>
                </Card>
              )}
            />
          </TabPane>
          <TabPane tab="我发布的" key="created">
            <List
              loading={this.loading}
              itemLayout="vertical"
              dataSource={this.createdAnnouncements}
              renderItem={item => (
                <Card hoverable={true} style={{ marginTop: '12px' }} onClick={this.handleCardClick(item._id)}>
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={item.description ? item.description : '无描述...'}
                    />
                    <span style={{ color: 'gray' }}>发布于 {new Date(item.createdAt).toLocaleString('zh-cn')}</span>
                  </List.Item>
                </Card>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default Dashboard