const express = require('express')
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path')

const postRouter = require('./routes/post')
const postsRouter = require('./routes/posts')
const userRouter = require('./routes/user')
const hashtagRouter = require('./routes/hashtag')
const db = require('./models')

const passportconfig = require('./passport')

dotenv.config()

const app = express()
db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공...')
  })
  .catch(console.error)
passportconfig()

// 이미지 경로 관련
app.use('/', express.static(path.join(__dirname, 'uploads')))

app.use(morgan('dev'))

// cors 문제 해결
app.use(cors({
  origin: 'http://localhost:3000',    // client 주소
  credentials: true,                  // true면 쿠키 전달, false면 불가
}))

// front에서 받은 data를 req.body에 넣어주는 역할
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.send('hello express')
})

app.use('/post', postRouter)
app.use('/posts', postsRouter)
app.use('/user', userRouter)
app.use('/hashtag', hashtagRouter)

app.listen(80, () => {
  console.log('서버 실행 중...')
})
