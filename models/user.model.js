import { DataTypes } from "sequelize";
import sequelize  from "./index.js"; // Adjusted import to match the new structure

const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  otp: { type: DataTypes.STRING },
  otpExpiresAt: { type: DataTypes.DATE }
});

export default User;