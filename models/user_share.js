"use strict";

module.exports = function(sequelize, DataTypes) {
  var UserShare = sequelize.define("UserShare", {
    share: DataTypes.FLOAT,
    paid: DataTypes.FLOAT,
    comment: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        UserShare.belongsTo(models.User);
      }
    },
    instanceMethods: {
      getShare: function(genericShare){
        return this.share || genericShare;
      }
    }
  });

  return UserShare;
};