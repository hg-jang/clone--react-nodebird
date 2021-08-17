import { all, fork, delay, takeLatest, put, call } from "redux-saga/effects";
import axios from 'axios'
import { FOLLOW_SUCCESS, FOLLOW_FAILURE, FOLLOW_REQUEST, UNFOLLOW_SUCCESS, UNFOLLOW_FAILURE, UNFOLLOW_REQUEST, LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE, LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE } from '../reducers/user'

function followAPI(data) {
  return axios.post('/api/login', data)
}
function* follow(action) {
  try{
    // const result = yield call(logInAPI, action.data)
    yield delay(1000)
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    })
  } catch(err) {
    yield put({
      type: FOLLOW_FAILURE,
      data: err.response.data,
    })
  }
}

function unfollowAPI(data) {
  return axios.post('/api/login', data)
}
function* unfollow(action) {
  try{
    // const result = yield call(logInAPI, action.data)
    yield delay(1000)
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    })
  } catch(err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      data: err.response.data,
    })
  }
}

function logInAPI(data) {
  return axios.post('/user/login', data)
}
function* logIn(action) {
  try{
    const result = yield call(logInAPI, action.data)
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    })
  } catch(err) {
    yield put({
      type: LOG_IN_FAILURE,
      data: err.response.data,
    })
  }
}

function logOutAPI() {
  return axios.post('/user/logout')
}
function* logOut() {
  try{
    yield call(logOutAPI)
    yield put({
      type: LOG_OUT_SUCCESS,
    })
  } catch(err) {
    yield put({
      type: LOG_OUT_FAILURE,
      data: err.response.data,
    })
  }
}

function signUpAPI(data) {
  return axios.post('/user', data)
}
function* signUp(action) {
  try{
    const result = yield call(signUpAPI, action.data)
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
    })
  } catch(err) {
    yield put({
      type: SIGN_UP_FAILURE,
      data: err.response.data,
    })
  }
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow)
}
function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow)
}
function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn)
}
function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut)
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp)
}

export default function* userSaga() {
  yield all([
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ])
}