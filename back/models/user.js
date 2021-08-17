module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // MySQL에는 users 테이블 생성
    // id가 기본적으로 들어있다.
    email: {
      type: DataTypes.STRING(30),
      allowNull: false, // 필수
      unique: true, // 고유한 값
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  })
  User.associate = (db) => {
    db.User.hasMany(db.Post) // 사람이 post를 여러 개 가질 수 있다.
    db.User.hasMany(db.Comment)
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }),
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followerId' }),
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followingId' })
  }
  return User
}