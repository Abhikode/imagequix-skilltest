'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CommentThreads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      root_comment_id: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Comments',
          key : 'id'
        }
      },
      child_comment_id: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Comments',
          key : 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CommentThreads');
  }
};