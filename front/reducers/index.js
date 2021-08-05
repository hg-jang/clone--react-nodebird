import { HYDRATE } from 'next-redux-wrapper'
import user from './user'
import post from './post'
import { combineReducers } from 'redux'

// HYDRATE는 ssr을 위한 것.
// dispatch된 data와 type이 넘어옴.
// 초기 state에서 action을 받으면 다음 state로 바뀜
const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch(action.type) {
      case HYDRATE:
        console.log('HYDRATE', action)
        return { ...state, ...action.payload }
        default:
          return state
    }
  },
  user,
  post,
})

export default rootReducer