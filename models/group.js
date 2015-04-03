"use strict";

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
    name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    description: DataTypes.TEXT,
    finishedAt: DataTypes.TIME
  }, {
    classMethods: {
      associate: function(models) {
        Group.belongsTo(models.User)
        Group.hasMany(models.Activity)
        Group.hasMany(models.UserShare)
        Group.belongsToMany(models.User, {through: 'UserShare'});
      }
    },
    instanceMethods: {
      getStatus: function(){
        if (this.finishedAt)
          return "Finished"
        else
          return "Active"
      },

      isActive: function(){
        return !this.finishedAt
      }
    }
  });

  return Group;
};