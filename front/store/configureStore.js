import { createWrapper } from 'next-redux-wrapper'
import { applyMiddleware, compose, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from '../reducers/index'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas'

const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action)
  return next(action)
}

// store는 state와 reducer를 포함하는 것을 의미한다고 생각하면 됨.
// dispatch 하는 순간 type과 data는 reducer로 전달 됨.
const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const middlewares = [sagaMiddleware, loggerMiddleware]
  const enhancer = process.env.NODE_ENV === 'production'
  ? compose(applyMiddleware(...middlewares))                  // 배포용
  : composeWithDevTools(applyMiddleware(...middlewares))      // 개발용
  const store = createStore(reducer, enhancer)
  store.sagaTask = sagaMiddleware.run(rootSaga)
  return store
}

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
})

export default wrapper