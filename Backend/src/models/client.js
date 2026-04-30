import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Client = sequelize.define("Client", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING
  }
});

export default Client;