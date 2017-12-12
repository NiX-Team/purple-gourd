import React from 'react'
import { Affix, Dropdown, Avatar, Menu, Icon } from 'antd'

export default function Account() {
  const menu = (
    <Menu>
      <Menu.Item>
        <Icon type="logout" />
        登出
      </Menu.Item>
    </Menu>
  )
  return (
    <Affix
      offsetTop={8}
      style={{
        position: 'absolute',
        zIndex: 1,
        right: 0,
        marginTop: '8px',
        marginRight: '8px',
      }}
    >
      <Dropdown overlay={menu} trigger={['click', 'hover']}>
        <Avatar size="large" icon="user" />
      </Dropdown>
    </Affix>
  )
}
