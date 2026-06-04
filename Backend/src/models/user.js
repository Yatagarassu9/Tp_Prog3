import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import { ROLES } from "../enums/enums.js";

const User = sequelize.define("User", {
  // dato del user y barbero
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // datos del usuario
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // datos del barbero
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  yearsOfExperience: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // roles
  role: {
    type: DataTypes.ENUM(ROLES.CLIENT, ROLES.BARBER, ROLES.ADMIN),
    allowNull: false,
  },
});

export default User;
