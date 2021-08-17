import React, { useEffect } from 'react'
import Head from 'next/head'
import AppLayout from '../Components/AppLayout'
import NicknameEditForm from '../Components/NicknameEditForm'
import FollowList from '../Components/FollowList'
import { useSelector } from 'react-redux'
import Router from 'next/router'

const Profile = () => {
  
  const { me } = useSelector((state) => state.user)
  
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