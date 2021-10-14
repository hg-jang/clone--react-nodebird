import React from "react"
import { useRouter } from "next/router"
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user"
import { LOAD_POST_REQUEST } from "../../reducers/post"
import AppLayout from "../../Components/AppLayout"
import PostCard from "../../Components/PostCard"
import { useSelector } from "react-redux"
import axios from 'axios'
import { END } from "redux-saga"
import wrapper from "../../store/configureStore"
import Head from "next/head"

const Post = () => {
  const router = useRouter()
  const {} = router.query
  const { singlePost } = useSelector((state) => state.post)

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singlePost.content} />
        {/* <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'} /> */}
        <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  )
}

export default Post

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
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.params.id,
  })
  context.store.dispatch(END)
  await context.store.sagaTask.toPromise()
})