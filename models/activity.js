"use strict";

module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define("Activity", {
    title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    cost: { type: DataTypes.FLOAT, allowNull: false, validate: { isFloat: true, min: 0.1 } }
  }, {
    classMethods: {
      associate: function(models) {
        Activity.belongsTo(models.Group);
      }
    }
  });

  return Activity;
};