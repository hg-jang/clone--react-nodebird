import shortId from 'shortid'
import { ADD_POST_TO_ME } from './user'

export const initialState = {
  mainPosts: [{
    id: 1,
    User: {
      id: 1,
      nickname: 'hyeon-gwang'
    },
    content: '첫 번째 게시글 #기대#두근두근 ##메에롱',
    Images: [{
      id: shortId.generate(),
      src: 'https://www.mhnew.com/news/photo/202007/11035_12043_403.jpg'
    },
    {
      id: shortId.generate(),
      src: 'http://image.sportsseoul.com/2020/04/08/news/2020040801000557800034481.jpg'
    },
    {
      id: shortId.generate(),
      src: 'https://mblogthumb-phinf.pstatic.net/MjAyMDA0MDJfMjU3/MDAxNTg1ODM1OTI3MTg2.0-qfYJxCiuO9kMyGUoZVWvc2zisBUMgnvLtV2hTm4sIg.T7QyoCT9f8Ye01CW3KZJvMb7s6oec91Pwrq6z_L7gC0g.JPEG.skil666/SE-1f8eb5c4-e9c3-4440-850f-ad8655df1cb2.jpg?type=w800'
    }],
    Comments: [{
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: '레드블루',
      },
      content: '얼른 보고 싶어요~'
    }],
  }],
  imagePaths: [],
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
}

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST'
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS'
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE'

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST'
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS'
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE'

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST'
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS'
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE'


export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
})
export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
})

const dummyPost = (data) => ({
  id: data.id,
  User: {
    id: 1,
    nickname: 'hyeon-gwang',
  },
  content: data.content,
  Images: [],
  Comments: [],
})

const dummyComment = (data) => ({
  id: shortId.generate(),
  User: {
    id: 1,
    nickname: 'hyeon-gwang',
  },
  content: data,
})

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      }
    case ADD_POST_SUCCESS:
      return {
        ...state,
        mainPosts: [dummyPost(action.data), ...state.mainPosts],
        addPostLoading: false,
        addPostDone: true,
      }
    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      }
    case REMOVE_POST_REQUEST:
      return {
        ...state,
        removePostLoading: true,
        removePostDone: false,
        removePostError: null,
      }
    case REMOVE_POST_SUCCESS:
      return {
        ...state,
        mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
        removePostLoading: false,
        removePostDone: true,
      }
    case REMOVE_POST_FAILURE:
      return {
        ...state,
        removePostLoading: false,
        removePostError: action.error,
      }
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      }
    case ADD_COMMENT_SUCCESS: {
      const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId)
      const post = { ...state.mainPosts[postIndex] }
      post.Comments = [dummyComment(action.data.content), ...post.Comments]
      const mainPosts = [...state.mainPosts]
      mainPosts[postIndex] = post

      return {
        ...state,
        addCommentLoading: false,
        addCommentDone: true,
        mainPosts,
      }
    }
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      }
    default:
      return state
  }
}

export default reducer