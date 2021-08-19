const passport = require('passport')
const local = require('./local')
const { User } = require('../models')

module.exports = () => {
  // serializeUser로 id만 갖고 있다가
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // 한 번 로그인한 이후에는 deserializeUser가 전달됨.
  // router에 접근하게 되면 deserializeUser를 거쳐 id를 토대로 사용자 정보를 복구하고 이것을 req.user로 전달함.
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id }})
      done(null, user)
    } catch(error) {
      console.error(error)
      done(error)
    }
  })

  local()
}