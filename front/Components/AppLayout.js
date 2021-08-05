import PropTypes from 'prop-types'
import Link from 'next/link'
import { Menu, Input, Row, Col } from 'antd'
import UserProfile from '../Components/UserProfile'
import LoginForm from '../Components/LoginForm'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

const SearchInput = styled(Input.Search)`
  vertical-align: middle
`

const AppLayout = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  // 구조분해 할당 방식
  // const { isLoggedIn } = useSelector((state) => state.user)

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
          <SearchInput />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup"><a>회원가입</a></Link>
        </Menu.Item>
      </Menu>
      <Row>
        <Col xs={24} md={6}>
          {isLoggedIn ? <UserProfile /> : <LoginForm />} 
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