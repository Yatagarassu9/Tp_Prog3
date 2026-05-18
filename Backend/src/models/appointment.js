import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Appointment = sequelize.define("Appointment", {

  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Appointment;