'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    }
  });

  User.associate = function(models) {
    models.User.hasMany(models.Task);
  };

  User.Instance.prototype.verifyPassword = function (pass) {
    return this.password === pass
  };

  return User;
};
