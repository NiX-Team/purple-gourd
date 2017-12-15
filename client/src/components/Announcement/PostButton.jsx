import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Affix, Avatar } from 'antd'
import styles from './PostButton.css'

function PostButton(props) {
  return (
    <Affix
      offsetBottom={16}
      style={{
        position: 'fixed',
        zIndex: 1,
        right: 0,
        bottom: 0,
        marginBottom: '16px',
        marginRight: '16px',
      }}
    >
      <Link to="/post">
        <Avatar size="large" icon="plus" className={styles.add} />
      </Link>
    </Affix>
  )
}

export default withRouter(PostButton)
