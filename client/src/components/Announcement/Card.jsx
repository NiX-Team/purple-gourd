import React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { Card, Form, Button, Input, Divider, message, Upload, Icon } from 'antd'
import Announcement from '@/models/Announcement'
import styles from './Card.css'

const Dragger = Upload.Dragger

function FileUpload(props) {
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
      <p className="ant-upload-hint">
        绿色文件名为当前最新文件，文件历史最多为5项
      </p>
    </Dragger>
  )
}

@observer
class AnnouncementCard extends React.Component {
  @observable
  announcement = {
    formField: [],
  }
  @observable loading = true
  state = {
    fileList: [],
  }

  async componentDidMount() {
    const id = this.props.match.params.id
    const { data } = await Announcement.getAnnouncementById(id)
    this.announcement = data
    this.loading = false
    this.setState({
      fileList: this.fileListFilter(this.announcement.files[0].list),
    })
  }

  fileListFilter = list => {
    return list
      .map((item, index) => {
        item.uid = index
        item.status = 'done'
        item.name = (
          <React.Fragment>
            <span className={index === list.length - 1 ? styles.latest : null}>
              {item.fid.filename}
            </span>
            <span className={styles.time}>{item.uploadTime}</span>
          </React.Fragment>
        )
        return item
      })
      .sort((a, b) => a.uploadTime > b.uploadTime)
  }

  handleUploadChange = info => {
    const status = info.file.status
    let fileList = info.fileList
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功`)

      fileList = this.fileListFilter(
        fileList[fileList.length - 1].response.list,
      )
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败`)
    }

    this.setState({ fileList })
  }

  render() {
    const uploadProps = {
      name: 'file',
      fileList: this.state.fileList,
      showUploadList: {
        showRemoveIcon: false,
      },
      multiple: false,
      action: `/announcements/${this.announcement._id}/upload`,
      onChange: this.handleUploadChange,
    }

    return (
      <Card title="公告详情" bordered={false} loading={this.loading}>
        <Card.Meta
          title={this.announcement.title}
          description={this.announcement.description}
        />
        <Divider />
        <Form>
          {this.announcement.uploadType === 'form' ? (
            this.announcement.formField
              .map((item, index) => (
                <Form.Item label={item.fieldName} key={index}>
                  <Input />
                </Form.Item>
              ))
              .concat(
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                </Form.Item>,
              )
          ) : (
            <FileUpload {...uploadProps} />
          )}
        </Form>
      </Card>
    )
  }
}

export default AnnouncementCard
