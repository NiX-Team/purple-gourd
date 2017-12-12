import React from 'react'
import { Form, DatePicker, Button, Select, Input, message, Icon } from 'antd'
import moment from 'moment'
const Option = Select.Option
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

let uuid = 0
class AnnouncementForm extends React.Component {
  remove = k => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 1) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  add = () => {
    uuid++
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(uuid)
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  postForm = async data => {
    let response
    try {
      response = await fetch('/announcement', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (e) {
      throw e
    }
    return response.ok
  }

  handleSubmit = e => {
    e.preventDefault()

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return

      if (fieldsValue.uploadType === 'form') {
        fieldsValue.formField = []
        for (const i in fieldsValue)
          if (i.substr(0, 5) === 'names') {
            fieldsValue.formField.push({
              fieldName: fieldsValue[i],
            })
            delete fieldsValue[i]
          }
      }
      const rangeTimeValue = fieldsValue['rangeTime']
      const values = {
        ...fieldsValue,
        beginTime: rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
      }
      delete values['rangeTime']

      this.postForm(values)
        .then(ok => {
          if (ok) message.success('发布成功！')
          else message.error('发布失败！')
        })
        .catch(e => {
          message.error(`网络错误，请检查网络！`)
        })
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const rangeConfig = {
      initialValue: [moment(Date.now()), moment(Date.now()).add(1, 'week')],
      rules: [
        { type: 'array', required: true, message: 'Please select time!' },
      ],
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
          label={index === 0 ? 'Passengers' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names-${k}`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input passenger's name or delete this field.",
              },
            ],
          })(
            <Input
              placeholder="passenger name"
              style={{ width: '60%', marginRight: 8 }}
            />,
          )}
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
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="标题">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入公告标题！' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="起止时间">
            {getFieldDecorator('rangeTime', rangeConfig)(
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
            )}
          </FormItem>
          <FormItem label="公告类型">
            {getFieldDecorator('uploadType', {
              rules: [{ required: true, message: '请选择你的公告类型!' }],
              initialValue: 'form',
            })(
              <Select
                placeholder="选择公告的收取类型"
                onChange={this.handleSelectChange}
                disabled
              >
                <Option value="form">表格</Option>
                <Option value="file">文件</Option>
              </Select>,
            )}
          </FormItem>
          {formItems}
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> Add field
            </Button>
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(AnnouncementForm)