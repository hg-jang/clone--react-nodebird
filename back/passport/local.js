const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const bcrypt = require('bcrypt')
const { User } = require('../models')

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ // email 존재하는지 검사
        where: { email }
      })
      if(!user) { // 존재하지 안흥면
        return done(null, false, { reason: '존재하지 않는 이메일입니다!' }) // done(서버 에러, 성공, 클라이언트 에러)
      }
      const result = await bcrypt.compare(password, user.password) // 비밀번호 일치하는지 검사
      if(result) { // 존재하면
        return done(null, user)
      }
      return done(null, false, { reson: '비밀번호가 틀렸습니다.' })
    } catch(error) {
      console.error(error)
      return done(error)
    }
  }))
}