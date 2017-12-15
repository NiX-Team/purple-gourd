import React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { Card, Form, Button, Input, Divider } from 'antd'
import Announcement from '@/models/Announcement'

@observer
class AnnouncementCard extends React.Component {
  @observable
  announcement = {
    formField: [],
  }

  @observable loading = true
  async componentDidMount() {
    const id = this.props.match.params.id
    const { data } = await Announcement.getAnnouncementById(id)
    this.announcement = data
    this.loading = false
  }

  render() {
    return (
      <Card title="公告详情" bordered={false} loading={this.loading}>
        <Card.Meta
          title={this.announcement.title}
          description={this.announcement.description}
        />
        <Divider />
        <Form>
          {this.announcement.formField.map((item, index) => (
            <Form.Item label={item.fieldName} key={index}>
              <Input />
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

export default AnnouncementCard
