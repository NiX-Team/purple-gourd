import React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { Card, Form, Button, Input, Divider, message, Upload, Icon, Tooltip, Tag } from 'antd'
import Announcement from '@/models/Announcement'
import styles from './Card.css'

const MAX_FILE_SIZE = 16

const Dragger = Upload.Dragger

function FileUpload(props) {
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
      <p className="ant-upload-hint">绿色文件名为当前最新文件，文件历史最多为5项，单个文件最大{MAX_FILE_SIZE}M</p>
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
      fileList: this.fileListFilter(this.announcement.files.length ? this.announcement.files[0].list : []),
    })
  }

  fileListFilter = list => {
    return list
      .map((item, index) => {
        item.uid = index
        item.status = 'done'
        item.url = `api/files/${item.fid._id}`
        item.name = (
          <Tooltip placement="topLeft" title={item.fid.originalname}>
            <div className={index === list.length - 1 ? styles.latest : null}>
              <span style={{ color: index === list.length - 1 ? 'green' : 'gray' }}>{item.fid.originalname}</span>
              <Tag color={index === list.length - 1 ? 'green' : 'gray'} className={styles.time}>
                {new Date(item.fid.updatedAt).toLocaleString('zh-cn')}
              </Tag>
            </div>
          </Tooltip>
        )
        return item
      })
      .sort((a, b) => a.uploadTime > b.uploadTime)
  }

  handleUploadChange = info => {
    const status = info.file.status
    let fileList = info.fileList

    if (status === 'done') {
      message.success(`${info.file.name} 上传成功！`)
      fileList = this.fileListFilter(fileList[fileList.length - 1].response.list)
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败`)
    } else if (status === 'uploading') {
    } else return
    this.setState({ fileList })
  }

  handleBeforeUpload = file => {
    const isSizeOK = file.size < MAX_FILE_SIZE * 1024 * 1024
    if (!isSizeOK) message.error(`${file.name} 文件过大，只允许${MAX_FILE_SIZE}M以内的文件！`)
    return isSizeOK
  }

  render() {
    const uploadProps = {
      name: 'file',
      fileList: this.state.fileList,
      showUploadList: {
        showRemoveIcon: false,
      },
      multiple: false,
      action: `api/announcements/${this.announcement._id}/upload`,
      onChange: this.handleUploadChange,
      beforeUpload: this.handleBeforeUpload,
    }

    return (
      <Card title="公告详情" bordered={false} loading={this.loading}>
        <Card.Meta title={this.announcement.title} description={this.announcement.description} />
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
