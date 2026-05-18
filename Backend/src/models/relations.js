import User from "./user.js";
import Service from "./cut.js";
import Appointment from "./appointment.js";

// 🔗 relaciones

// cliente
Appointment.belongsTo(User, { as: "client", foreignKey: "clientId" });
User.hasMany(Appointment, { as: "clientAppointments", foreignKey: "clientId" });

// barbero
Appointment.belongsTo(User, { as: "barber", foreignKey: "barberId" });
User.hasMany(Appointment, { as: "barberAppointments", foreignKey: "barberId" });

// servicio
Appointment.belongsTo(Service, { foreignKey: "cutId" });
Service.hasMany(Appointment, { foreignKey: "cutId" });

export {
  User,
  Service,
  Appointment
};