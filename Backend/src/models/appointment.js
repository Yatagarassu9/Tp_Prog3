import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import { BRANCHES } from "../enums/enums.js";
const Appointment = sequelize.define("Appointment", {

  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },

branch: {//sucursales
  type: DataTypes.ENUM(
    BRANCHES.ARROYITO,
    BRANCHES.PICHINCHA,
    BRANCHES.BARRIO_MARTIN
  ),
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