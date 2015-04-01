"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      isEmail: true,
      notNull: true
    },
    password: {
      type: DataTypes.STRING,
      notNull: true
    }
  }, {
    classMethods: {
      // associate: function(models) {
      //   User.hasMany(models.Task)
      // }
    }
  });

  return User;
};
