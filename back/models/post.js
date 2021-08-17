module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4', // utf8은 한글, mb4는 이모티콘
    collate: 'utf8mb4_general_ci',
  })
  Post.associate = (db) => {
    db.Post.belongsTo(db.User) // 어떤 post는 어떤 user에게 속해 있다.
    db.Post.hasMany(db.Comment)
    db.Post.hasMany(db.Image)
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' })
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' })
    db.Post.belongsTo(db.Post, { as: 'Retweet' })
  }
  return Post
}