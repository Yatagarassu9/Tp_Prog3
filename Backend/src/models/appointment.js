import { DataTypes } from "sequelize";
import sequelize from "../db.js";

// aca definimos el modelo de turno (Appointment)
// sequelize se encarga de mapear este objeto a una tabla en la base de datos
const Appointment = sequelize.define("Appointment", {

  // fecha y hora del turno, es obligatorio siempre
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },

  // estado del turno, solo puede ser uno de estos tres valores
  // por defecto cuando se crea un turno queda en "pending" (pendiente)
  // cancelled = el cliente o barbero lo cancelo
  // completed = ya se realizo el corte
  status: {
    type: DataTypes.ENUM(
      "pending",
      "cancelled",
      "completed"
    ),
    allowNull: false,
    defaultValue: "pending"
  }

});

export default Appointment;
