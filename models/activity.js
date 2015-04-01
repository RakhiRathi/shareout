"use strict";

module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define("Activity", {
    title: DataTypes.STRING,
    price: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        Activity.belongsTo(models.Group);
      }
    }
  });

  return Activity;
};