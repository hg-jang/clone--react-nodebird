export const initialState = {
  mainPosts: [{
    id: 1,
    User: {
      id: 1,
      nickname: '레드블루'
    },
    content: '첫 번째 게시글 #기대#두근두근 ##메에롱',
    Images: [{
      src: 'https://www.mhnew.com/news/photo/202007/11035_12043_403.jpg'
    },
    {
      src: 'http://image.sportsseoul.com/2020/04/08/news/2020040801000557800034481.jpg'
    },
    {
      src: 'https://mblogthumb-phinf.pstatic.net/MjAyMDA0MDJfMjU3/MDAxNTg1ODM1OTI3MTg2.0-qfYJxCiuO9kMyGUoZVWvc2zisBUMgnvLtV2hTm4sIg.T7QyoCT9f8Ye01CW3KZJvMb7s6oec91Pwrq6z_L7gC0g.JPEG.skil666/SE-1f8eb5c4-e9c3-4440-850f-ad8655df1cb2.jpg?type=w800'
    }],
    Comments: [{
      User: {
        nickname: '광등',
      },
      content: '얼른 보고 싶어요~'
    }],
  }],
  imagePaths: [],
  postAdded: false,
}

const ADD_POST = 'ADD_POST'
export const addPost = {
  type: ADD_POST
}

const dummyPost = {
  id: 2,
  content: '더미데이터입니다.',
  User: {
    id: 1,
    nickname: '닉네임',
  },
  Images: [],
  Comments: [],
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true,
      }
    default:
      return state
  }
}

export default reducer