import React from 'react'
import { Link } from 'react-router-dom'
import { Affix, Dropdown, Avatar, Menu, Icon } from 'antd'

function Account() {
  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/dashboard">
          <Icon type="dashboard" />
          公告栏
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Link
          to={{
            pathname: '/login',
            isLogout: true,
          }}
        >
          <Icon type="logout" />
          登出
        </Link>
      </Menu.Item>
    </Menu>
  )
  return (
    <Affix
      offsetTop={16}
      style={{
        position: 'absolute',
        zIndex: 1,
        right: 0,
        marginTop: '16px',
        marginRight: '16px',
      }}
    >
      <Dropdown overlay={menu} trigger={['click']}>
        <Avatar size="large" icon="user" />
      </Dropdown>
    </Affix>
  )
}

export default Account
