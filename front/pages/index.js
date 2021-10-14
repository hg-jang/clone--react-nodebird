import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { END } from 'redux-saga'
import AppLayout from "../Components/AppLayout"
import PostForm from '../Components/PostForm'
import PostCard from '../Components/PostCard'
import { LOAD_MY_INFO_REQUEST } from '../reducers/user'
import { LOAD_POSTS_REQUEST } from '../reducers/post'
import wrapper from '../store/configureStore'
import axios from 'axios'

const Home = () => {
  const dispatch = useDispatch()
  const { me } = useSelector((state) => state.user)
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } = useSelector((state) => state.post)

  useEffect(() => {
    const lastId = mainPosts[mainPosts.length - 1]?.id
    function onScroll() {
      if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if(hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          })
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [hasMorePosts, loadPostsLoading])

  useEffect(() => {
    if(retweetError) {
      alert(retweetError)
    }
  }, [retweetError])

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  )
}

// redux의 getServerSideProps

// store.dispatch의 결과가 HYDRATE로 보내짐.
// getServerSideProps는 front 서버에서부터 행해짐.
// front와 back의 로컬호스트가 달라 쿠키 전달이 안됨. => credentials를 true로
// 헌데 credentials는 이미 true. 그렇다면 보내는 쪽에 문제가 있을 수도 있음.
// 브라우저에서 데이터를 보낼때는 header에 쿠킬를 담아 보내주지만
// 프론트 서버에서 데이터를 보내면 쿠키가 자동으로 담기지 않음.
// back에서 req.headers를 콘솔로 찍으면 cookie 확인 가능
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // 요런 식으로 프론트에서 요청을 할 때 헤더에 쿠키를 담을 수 있음.
  // 하지만 이렇게 되면 하나의 서버에서 모든 쿠키를 공유하기 때문에 내가 로그인한 직후 다른 사람이 페이지에 접속하면 그 사람이 나의 쿠키를 사용하게 됨
  // const cookie = context.req ? context.req.headers.cookie : ''
  // axios.defaults.headers.Cookie = cookie

  const cookie = context.req ? context.req.headers.cookie : ''
  axios.defaults.headers.Cookie = ''
  // 따라서 서버일때랑? 쿠키가 있을 때만 넣어서 전달하도록 한다.
  // 쿠키를 써서 요청할 때만 잠깐 넣고, 쿠키 안 쓸때는 서버에서  공유하는 쿠키를 지우도록.
  if(context.req && cookie) {
    axios.defaults.headers.Cookie = cookie
  }
  
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  })
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  })
  context.store.dispatch(END)
  await context.store.sagaTask.toPromise()
})

export default Home