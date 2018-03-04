import React from 'react'
import { Link } from 'react-router-dom'
import { message, Form, Icon, Input, Button, Checkbox } from 'antd'
import User from '@/models/User'
import styles from './index.css'
import favicon from '~/public/favicon.ico'

const FormItem = Form.Item

class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        User.login(values).then(({ response }) => {
          if (this.props.location.from === '/login') this.props.location.from = '/dashboard'
          if (response.ok) {
            message.success('登录成功！')
            this.props.history.push(this.props.location.from || '/dashboard')
          } else message.error('登录失败，用户名或密码错误！')
        })
      }
    })
  }

  componentWillMount() {
    if (User.isAuthenticated && this.props.location.isLogout !== true) this.props.history.push('/dashboard')
    else if (this.props.location.from) message.info('未登录！')
  }

  async componentDidMount() {
    if (this.props.location.isLogout) await User.logout()
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div className={styles.container}>
        <div className={styles.title}>
          <Link to="/">
            <h1>
              <img src={favicon} alt="purple-gourd" height="44px" />紫金葫芦
            </h1>
            <h2 className={styles.description}>专注于收各种作业、表格</h2>
          </Link>
        </div>
        <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名!' }],
            })(<Input prefix={<Icon type="user" />} placeholder="用户名" autoComplete="username" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码！' }],
            })(
              <Input
                prefix={<Icon type="lock" />}
                type="password"
                placeholder="密码"
                autoComplete="current-password"
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox className={styles.remember}>记住我</Checkbox>)}
            <Link className={styles.forgot} to="/">
              忘记密码
            </Link>
            <Button type="primary" htmlType="submit" className={styles.submit}>
              登录
            </Button>
            其他登录方式：
            <Icon type="wechat" />
            <Link className={styles.register} to="/register">
              立即注册
            </Link>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(LoginForm)
