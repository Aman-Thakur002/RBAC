"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../utility/password-hash");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate() {}
  }

  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      accessToken: DataTypes.STRING,
      lastLogin: DataTypes.DATE,
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
      // Define other fields as necessary
    },
    {
      sequelize,
      modelName: "Users",
      paranoid: true,
      timestamps: true,
    }
  );

  Users.beforeCreate(async (user, options) => {
    if (user.password) {
      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;
    }
    user.createdAt = new Date();
  });

  Users.beforeUpdate(async (user, options) => {
    if (user.password) {
      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;
    }
    user.updatedAt = new Date();
  });

  return Users;
};
