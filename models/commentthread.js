'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CommentThread extends Model {
    static associate(models) {
      CommentThread.belongsTo(models.Comment, {
        foreignKey : 'root_comment_id'
      }),
      CommentThread.belongsTo(models.Comment, {
        foreignKey : 'child_comment_id'
      })
    }
  };
  CommentThread.init({
    root_comment_id: DataTypes.INTEGER,
    child_comment_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CommentThread',
  });
  return CommentThread;
};