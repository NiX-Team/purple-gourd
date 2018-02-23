import React from 'react'
import { Form, DatePicker, Button, Select, Input, message, Icon, Card } from 'antd'
import moment from 'moment'
import Announcement from '@/models/Announcement'

const Option = Select.Option
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

let uuid = 0

class AnnouncementForm extends React.Component {
  remove = k => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    if (keys.length === 1) {
      return
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  add = () => {
    uuid++
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(uuid)
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  state = {
    nowTime: Date.now(),
  }

  handleSubmit = e => {
    e.preventDefault()

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return

      if (fieldsValue.uploadType === 'form') {
        fieldsValue.formField = []
        fieldsValue.keys.forEach(i => {
          fieldsValue.formField.push({ fieldName: fieldsValue[`names-${i}`] })
          delete fieldsValue[`names-${i}`]
        })
        delete fieldsValue.keys
      }
      const rangeTimeValue = fieldsValue['rangeTime']
      const values = {
        ...fieldsValue,
        beginTime: rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
      }
      delete values['rangeTime']

      Announcement.postAnnouncement(values).then(({ response }) => {
        if (response.ok) {
          message.success('发布成功！')
          this.props.history.push({ pathname: `/dashboard`, state: { tab: 'created' } })
        } else message.error('发布失败！')
      })
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { nowTime } = this.state
    const rangeConfig = {
      initialValue: [moment(nowTime), moment(nowTime).add(1, 'week')],
      rules: [{ type: 'array', required: true, message: '请选择起止时间！' }],
    }
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 20 } },
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 20, offset: 4 } },
    }
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '字段' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入字段名或删除该字段',
              },
            ],
          })(<Input placeholder="字段名" style={{ width: '60%', marginRight: 8 }} />)}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      )
    })
    return (
      <Card bordered={false}>
        <Card.Meta title={<h1>发布</h1>} />
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="标题">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入公告标题！' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="描述">{getFieldDecorator('description')(<Input.TextArea rows={4} />)}</FormItem>
          <FormItem label="起止时间">
            {getFieldDecorator('rangeTime', rangeConfig)(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
          </FormItem>
          <FormItem label="公告类型">
            {getFieldDecorator('uploadType', {
              rules: [{ required: true, message: '请选择你的公告类型!' }],
              initialValue: 'file',
            })(
              <Select placeholder="选择公告的收取类型" onChange={this.handleSelectChange} disabled>
                <Option value="form">表格</Option>
                <Option value="file">文件</Option>
              </Select>,
            )}
          </FormItem>
          {true ? null : (
            <React.Fragment>
              {formItems}
              <FormItem {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                  <Icon type="plus" /> 添加字段
                </Button>
              </FormItem>
            </React.Fragment>
          )}
          <FormItem>
            <Button type="primary" htmlType="submit">
              发布
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(AnnouncementForm)
