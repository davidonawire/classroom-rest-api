'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '"firstName" cannot be empty'
        },
        notNull: {
          msg: '"firstName" is required'
        }
      }
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '"lastName" cannot be empty'
        },
        notNull: {
          msg: '"lastName" is required'
        }
      }
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: '"emailAddress" cannot be empty'
        },
        notNull: {
          msg: '"emailAddress" is required'
        },
        isEmail: {
          msg: '"emailAddress" must be a valid email address'
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '"password" cannot be empty'
        },
        notNull: {
          msg: '"password" is required'
        }
      }
    }
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'Owner',
      foreignKey: 'userId'
    });
  }

  return User;
}