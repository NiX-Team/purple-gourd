import React from 'react'
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Button, Checkbox } from 'antd'

const FormItem = Form.Item

class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        fetch('/login', {
          method: 'POST',
          body: ((username, password) => {
            let form = new FormData()
            form.append('username', username)
            form.append('password', password)
            return form
          })(values.username, values.password),
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(<Input prefix={<Icon type="user" />} placeholder="用户名" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码！' }],
          })(
            <Input
              prefix={<Icon type="lock" />}
              type="password"
              placeholder="密码"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>记住我</Checkbox>)}
          <a className="login-form-forgot" href="">
            忘记密码
          </a>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
          或 <Link to="/">立即注册</Link>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(LoginForm)
