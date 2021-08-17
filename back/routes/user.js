const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')

const { User, Post } = require('../models')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')

const router = express.Router()

// 로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err) { // server 에러 있는 경우
      console.error(err)
      return next(err)
    }
    if(info) { // client 에러 있는 경우
      return res.status(401).send(info.reason)
    }
    return req.login(user, async (loginErr) => { 
      if(loginErr) { // passport login 에러 있는 경우
        console.log(loginErr);
        return next(loginErr)
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {exclude: ['password']},
        include: [{
          model: Post,
        }, {
          model: User,
          as: 'Followings',
        }, {
          model: User,
          as: 'Followers',
        }]
      })
      return res.status(200).json(fullUserWithoutPassword)
    })
  })(req, res, next)
})

// 회원가입
router.post('/',isNotLoggedIn , async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      }
    })

    if(exUser) {
      return res.status(403).send('이미 사용중인 이메일입니다.')
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    })
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.status(201).send('ok')
  } catch(err) {
    console.log(error);
    next(err)
  }
})

// 로그아웃
router.post('/logout',isLoggedIn , (req, res) => {
  req.logout()
  req.session.destroy()
  res.send('ok')
})

module.exports = router