"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Group)
        User.belongsToMany(models.Group, {through: 'UserShare'});
      }
    },
    instanceMethods: {
      toSearchResult: function(){
        return { id: this.id, name: this.name, email: this.email }
      }
    }
  });

  return User;
};
