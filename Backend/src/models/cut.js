import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const cut = sequelize.define("cut", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER // minutos
  }
});

export default cut;