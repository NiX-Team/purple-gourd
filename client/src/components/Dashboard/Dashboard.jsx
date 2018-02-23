import React from 'react'
import { observer } from 'mobx-react'
import { observable, intercept } from 'mobx'
import { List, Card, Tabs, Badge, Progress, Tooltip, Icon } from 'antd'
import Announcement from '@/models/Announcement'
import User from '@/models/User'

const { TabPane } = Tabs

@observer
class Dashboard extends React.Component {
  @observable followingAnnouncements = []
  @observable createdAnnouncements = []
  @observable followers = []
  @observable loading = true
  @observable key

  constructor() {
    super()
    intercept(this, 'key', change => {
      this.handleTagChange(change.newValue)
      return change
    })
  }

  componentDidMount() {
    this.key = (this.props.location.state || { tab: 'following' }).tab
  }

  handleTagChange = async key => {
    this.loading = true
    switch (key) {
      case 'following':
        const { data: following } = await Announcement.getFollowingAnnouncements()
        this.followingAnnouncements = following
        this.loading = false
        break
      case 'created':
        const { data: created } = await Announcement.getCreatedAnnouncements()
        this.createdAnnouncements = created
        const { data: { followers } } = await User.getFollowers()
        this.followers = followers
        this.loading = false
        break
      default:
        return
    }
    this.props.history.replace({ state: { tab: key } })
  }

  handleCardClick = item => e => {
    e.preventDefault()
    this.props.history.push({ pathname: `/${item}` })
  }

  handleDownload = item => e => {
    e.preventDefault()
    window.open(`/api/announcements/${item}/archive`, '_blank')
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
                <Card
                  hoverable={true}
                  style={{ marginTop: '12px' }}
                  actions={[
                    <Tooltip title="下载存档">
                      <Icon type="download" onClick={this.handleDownload(item._id)} />
                    </Tooltip>,
                    <Tooltip title="编辑">
                      <Icon type="edit" />
                    </Tooltip>,
                    <Tooltip title="更多">
                      <Icon type="ellipsis" />
                    </Tooltip>,
                  ]}
                >
                  <List.Item onClick={this.handleCardClick(item._id)}>
                    <List.Item.Meta
                      title={item.title}
                      description={item.description ? item.description : '无描述...'}
                    />
                    <span style={{ color: 'gray' }}>发布于 {new Date(item.createdAt).toLocaleString('zh-cn')}</span>
                    <Tooltip title={`${item.files.length} / ${this.followers.length} 人已提交`}>
                      <Progress percent={item.files.length / this.followers.length * 100} />
                    </Tooltip>
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
