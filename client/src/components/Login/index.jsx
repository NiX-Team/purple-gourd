import React from 'react'
import { Link } from 'react-router-dom'
import { message, Form, Icon, Input, Button, Checkbox } from 'antd'
import { Auth } from '@components/Auth'

const FormItem = Form.Item

class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Auth.login(values)
          .then(ok => {
            if (ok) {
              message.success('登录成功！')
              this.props.redirect('/dashboard')
            } else message.error('登录失败，用户名或密码错误！')
          })
          .catch(error => {
            message.error(`网络错误，请检查网络！`)
          })
      }
    })
  }

  componentDidMount() {
    if (Auth.isAuthenticated) this.props.redirect('/dashboard')
    else {
      if (this.props.location.from) message.info('未登录！')
    }
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
          <Link className="login-form-forgot" to="/">
            忘记密码
          </Link>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
          或
          <Link className="login-form-register" to="/">
            立即注册
          </Link>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(LoginForm)
