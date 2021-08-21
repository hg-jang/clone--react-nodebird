import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Head from 'next/head'
import Router from 'next/router'
import AppLayout from '../Components/AppLayout'
import NicknameEditForm from '../Components/NicknameEditForm'
import FollowList from '../Components/FollowList'
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST } from '../reducers/user'

const Profile = () => {
  const dispatch = useDispatch()
  const { me } = useSelector((state) => state.user)
  
  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    })
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    })
  }, [])

  if(!me) {
    return null
  }

  useEffect(() => {
    if(!(me && me.id)) {
      Router.push('/')
    }
  }, [me && me.id])

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={me.Followings} />
        <FollowList header="팔로워 목록" data={me.Followers} />
      </AppLayout>
    </>
  )
}

export default Profile