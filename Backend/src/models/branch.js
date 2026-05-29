import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Branch = sequelize.define("Branch", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Branch;
