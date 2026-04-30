import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Barber = sequelize.define("Barber", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialty: {
    type: DataTypes.STRING
  }
});

export default Barber;