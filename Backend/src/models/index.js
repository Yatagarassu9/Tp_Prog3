import Client from "./client.js";
import Barber from "./barber.js";
import Service from "./service.js";
import Appointment from "./appointment.js";

// relacinooes de la bdd 
Appointment.belongsTo(Client, { foreignKey: "clientId" });
Client.hasMany(Appointment, { foreignKey: "clientId" });

Appointment.belongsTo(Barber, { foreignKey: "barberId" });
Barber.hasMany(Appointment, { foreignKey: "barberId" });

Appointment.belongsTo(Service, { foreignKey: "serviceId" });
Service.hasMany(Appointment, { foreignKey: "serviceId" });

export {
  Client,
  Barber,
  Service,
  Appointment
};