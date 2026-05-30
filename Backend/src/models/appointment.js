import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Appointment = sequelize.define("Appointment", {

  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(
      "pending",
      "confirmed",
      "cancelled",
      "completed"
    ),
    allowNull: false,
    defaultValue: "pending"
  }

});

export default Appointment;