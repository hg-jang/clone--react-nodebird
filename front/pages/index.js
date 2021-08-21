import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import AppLayout from "../Components/AppLayout"
import PostForm from '../Components/PostForm'
import PostCard from '../Components/PostCard'
import { LOAD_POSTS_REQUEST } from '../reducers/post'
import { LOAD_USER_REQUEST } from '../reducers/user'

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
    dispatch({
      type: LOAD_USER_REQUEST,
    })
    dispatch({
      type: LOAD_POSTS_REQUEST,
    })
  }, [])

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

export default Home