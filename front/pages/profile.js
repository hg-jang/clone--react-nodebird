import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import Head from 'next/head'
import Router from 'next/router'
import AppLayout from '../Components/AppLayout'
import NicknameEditForm from '../Components/NicknameEditForm'
import FollowList from '../Components/FollowList'
import { LOAD_MY_INFO_REQUEST } from '../reducers/user'
import axios from 'axios'
import { END } from 'redux-saga'
import useSWR from 'swr'
import wrapper from '../store/configureStore'

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data)

const Profile = () => {
  const [followersLimit, setFollowersLimit] = useState(3)
  const [followingsLimit, setFollowingsLimit] = useState(3)

  const { me } = useSelector((state) => state.user)

  const { data: followersData, error: followerError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher)
  const { data: followingsData, error: followingError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher)

  useEffect(() => {
    if(!(me && me.id)) {
      Router.push('/')
    }
  }, [me && me.id])

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3)
  }, [])
  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3)
  }, [])
  
  if(!me) {
    return null
  }

  if(followerError || followingError) {
    console.error(followerError || followingError)
    return '팔로잉/팔로워 로딩 중 에러가 발생합니다.'
  }

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError} />
        <FollowList header="팔로워 목록" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError} />
      </AppLayout>
    </>
  )
}

export default Profile

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