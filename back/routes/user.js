const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const { Op } = require('sequelize')

const { User, Post, Comment, Image } = require('../models')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')

const router = express.Router()

// 새로고침 할 때 사용자 정보 가져오기
router.get('/', async (req, res, next) => {
  try {
    if(req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {exclude: ['password']},
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      })
      res.status(200).json(fullUserWithoutPassword)
    } else {
      res.status(200).json(null)
    }
  } catch(error) {
    console.error(error)
    next(error)
  }
})

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
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      })
      return res.status(200).json(fullUserWithoutPassword)
    })
  })(req, res, next)
})

// 회원가입
router.post('/', isNotLoggedIn , async (req, res, next) => {
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
router.post('/logout', isLoggedIn , (req, res) => {
  req.logout()
  req.session.destroy()
  res.send('ok')
})


// 닉네임 변경
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await User.update({
      nickname: req.body.nickname,
    }, {
      where: { id: req.user.id },
    })
    res.status(200).json({ nickname: req.body.nickname })
  } catch(error) {
    console.error(error)
    next(error)
  }
})

// 나를 팔로우 한 사람들 불러오기
router.get('/followers', isLoggedIn, async (req, res, next) => { // GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id }})
    if(!user) {
      res.status(403).send('없는 사람을 찾으려고 하시네요?')
    }
    const followers = await user.getFollowers({
      limit: parseInt(req.query.limit),
    })
    res.status(200).send(followers)
  } catch(error) {
    console.error(error)
    next(error)
  }
})

// 팔로잉 한 사람 불러오기
router.get('/followings', isLoggedIn, async (req, res, next) => { // GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id }})
    if(!user) {
      res.status(403).send('없는 사람을 찾으려고 하시네요?')
    }
    const followings = await user.getFollowings({
      limit: parseInt(req.query.limit),
    })
    res.status(200).send(followings)
  } catch(error) {
    console.error(error)
    next(error)
  }
})

// 유저 팔로우
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {  // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId }})
    if(!user) {
      res.status(403).send('없는 사람을  팔로우하려고 하시네요?')
    }
    await user.addFollowers(req.user.id)
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) })
  } catch(error) {
    console.error(error)
    next(error)
  }
})

// 내가 팔로우한 사람 팔로우 취소
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {   // DELETE /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId }})
    if(!user) {
      res.status(403).send('없는 사람을  언팔로우하려고 하시네요?')
    }
    await user.removeFollowers(req.user.id)
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) })
  } catch(error) {
    console.error(error)
    next(error)
  }
})

// 나를 팔로우 한 사람 삭제
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {   // DELETE /user/follow/1
  try {
    const user = await User.findOne({ where: { id: req.params.userId }})
    if(!user) {
      res.status(403).send('없는 사람을 차단하려고 하시네요?')
    }
    await user.removeFollowings(req.user.id)
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) })
  } catch(error) {
    console.error(error)
    next(error)
  }
})

// 특정 유저의 게시글 불러오기
router.get('/:userId/posts', async (req, res, next) => {         // GET /user/1/posts
  try {
    const where = { UserId: req.params.userId }
    if(parseInt(req.query.lastId, 10)) {               // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
          order: [['createdAt', 'DESC']],
        }],
      }, {
        model: User, // 좋아요 누른 사람
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }]
      }],
    })
    res.status(200).json(posts)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

module.exports = router