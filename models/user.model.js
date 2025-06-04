const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  otp: { type: DataTypes.STRING },
  otpExpiresAt: { type: DataTypes.DATE }
});

module.exports = User;