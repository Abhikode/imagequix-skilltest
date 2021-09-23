'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Post, {
        foreignKey : 'post_id'
      }),
      Comment.hasMany(models.CommentThread, {
        foreignKey: 'root_comment_id'
      }),
      Comment.hasMany(models.CommentThread, {
        foreignKey: 'child_comment_id'
      })
    }
  };
  Comment.init({
    user_id: DataTypes.STRING,
    post_id: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};