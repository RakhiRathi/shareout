"use strict";

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
    name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Group.belongsTo(models.User)
        Group.hasMany(models.Activity)
        Group.belongsToMany(models.User, {through: 'UserShare'});
      }
    }
  });

  return Group;
};