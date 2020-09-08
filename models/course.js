'use strict';
const { Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '"title" cannot be empty'
        },
        notNull: {
          msg: '"title" is required'
        }
      }
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '"description" cannot be empty'
        },
        notNull: {
          msg: '"description" is required'
        }
      }
    },
    estimatedTime: {
      type: Sequelize.STRING
    },
    materialsNeeded: {
      type: Sequelize.STRING
    }
  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'Owner',
      foreignKey: 'userId'
    });
  }

  return Course;
}