import { HYDRATE } from 'next-redux-wrapper'
import { combineReducers } from 'redux'
import user from './user'
import post from './post'

// HYDRATE는 ssr을 위한 것.
// dispatch된 data와 type이 넘어옴.
// 초기 state에서 action을 받으면 다음 state로 바뀜

// serverside 이전
// const rootReducer = combineReducers({
//   index: (state = {}, action) => {
//     switch(action.type) {
//       case HYDRATE:
//         console.log('HYDRATE', action)
//         return { ...state, ...action.payload }
//         default:
//           return state
//     }
//   },
//   user,
//   post,
// })

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action)
      return action.payload
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      })
      return combinedReducer(state, action)
    }
  }
}

export default rootReducer