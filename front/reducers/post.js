export const initialState = {
  mainPosts: [{
    id: 1,
    User: {
      id: 1,
      nickname: '레드블루'
    },
    content: '첫 번째 게시글',
    Images: [{
      src: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.mhnew.com%2Fnews%2FarticleView.html%3Fidxno%3D11035&psig=AOvVaw3B6BiJfkRzRzwNx7T6OOF3&ust=1628225130936000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCNC9qLuJmfICFQAAAAAdAAAAABAF'
    },
    {
      src: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.blog.naver.com%2Ftaiji15%2F221896943894&psig=AOvVaw0xFCkxDYlFZ6dn28XmtsuK&ust=1628225237197000&source=images&cd=vfe&ved=0CAoQjRxqFwoTCJjZ_uyJmfICFQAAAAAdAAAAABAJ'
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