const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')

const { Hashtag, Post, Image, Comment, User } = require('../models')

// 특정 해쉬태그의 게시글 불러오기
router.get('/:hashtag', async (req, res, next) => {     // GET /hashtag/노드
  try {
    const where = {}
    if(parseInt(req.query.lastId, 10)) {  // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) } // lastId보다 작은 걸로
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
      ],
      include: [{
        model: Hashtag,
        where: { name: req.params.hashtag },
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname']
        }]
      }, {
        model: User,  // 좋아요 누른 사람
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
  } catch(error) {
    console.error(error)
    next(error)
  }
})

module.exports = router