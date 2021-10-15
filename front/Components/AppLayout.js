import PropTypes from 'prop-types'
import Link from 'next/link'
import { Menu, Input, Row, Col } from 'antd'
import UserProfile from '../Components/UserProfile'
import LoginForm from '../Components/LoginForm'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import useInput from '../hooks/useInput'
import { useCallback } from 'react'
import Router from 'next/router'

const SearchInput = styled(Input.Search)`
  vertical-align: middle
`

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user)
  const [searchInput, onChangeSearchInput] = useInput('')

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`)
  }, [searchInput])

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/"><a>노드버드</a></Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile"><a>프로필</a></Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton value={searchInput} onChange={onChangeSearchInput} onSearch={onSearch} />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup"><a>회원가입</a></Link>
        </Menu.Item>
      </Menu>
      <Row>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />} 
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          오른쪽 메뉴
        </Col>
      </Row>
    </div>
  )
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppLayout