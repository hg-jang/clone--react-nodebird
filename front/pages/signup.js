import React, { useCallback, useEffect, useState } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import { Form, Input, Checkbox, Button } from 'antd'
import AppLayout from '../Components/AppLayout'
import useInput from '../hooks/useInput'
import styled from 'styled-components'
import { SIGN_UP_REQUEST } from '../reducers/user'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { END } from'redux-saga'

const ErrorMessage = styled.div`
  color: red
`

const Signup = () => {
  const dispatch = useDispatch()
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user)

  const [email, onChangeEmail] = useInput('')
  const [nickname, onChangeNickname] = useInput('')
  const [password, onChangePassword] = useInput('')
  
  const [passwordCheck, setPasswordCheck] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value)
    setPasswordError(e.target.value !== password)
  }, [password])
  
  const [term, setTerm] = useState('')
  const [termError, setTermError] = useState(false)
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked)
    setTermError(false)
  }, [])

  const onSubmit = useCallback(() => {
    if(password !== passwordCheck) {
      return setPasswordError(true)
    }
    if(!term) {
      return setTermError(true)
    }
    console.log(email, nickname, password)
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    })
  }, [email, password, passwordCheck, term])

  useEffect(() => {
    if(signUpDone) {
      Router.replace('/')
    }
  }, [signUpDone])
  useEffect(() => {
    if(signUpError) {
      alert(signUpError)
    }
  }, [signUpError])
  useEffect(() => {
    if(me && me.id) {
      Router.replace('/')
    }
  }, [me && me.id])

  return (
    <>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <AppLayout>
        <Form onFinish={onSubmit}>
          <div>
            <label htmlFor="user-email">이메일</label>
            <br />
            <Input name="user-email" value={email} type="email" required onChange={onChangeEmail} />
          </div>
          <div>
            <label htmlFor="user-nickname">닉네임</label>
            <br />
            <Input name="user-nickname" value={nickname} required onChange={onChangeNickname} />
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input name="user-password" value={password} required onChange={onChangePassword} />
          </div>
          <div>
            <label htmlFor="user-password-check">비밀번호 확인</label>
            <br />
            <Input
              name="user-password-check"
              type="password"
              value={passwordCheck}
              required
              onChange={onChangePasswordCheck}
            />
            {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
          </div>
          <div>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>주인님께 복종할 것을 동의합니다.</Checkbox>
            {termError && <ErrorMessage>약관에 동의하십시오.</ErrorMessage>}
          </div>
          <div style={{ marginTop: 10 }}>
            <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
          </div>
        </Form>
      </AppLayout>
    </>
  )
}

export default Signup

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSidProps start');
  console.log(context.req.headers);

  const cookie = context.req ? context.req.headers.cookie : ''
  axios.defaults.headers.Cookie = ''
  
  if(context.req && cookie) {
    axios.defaults.headers.Cookie = cookie
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  })
  
  context.store.dispatch(END)
  await context.store.sagaTask.toPromise()
})