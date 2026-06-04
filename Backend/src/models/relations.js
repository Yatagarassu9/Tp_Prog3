import User from "./user.js";
import Cut from "./cut.js";
import Appointment from "./appointment.js";
import Branch from "./branch.js";

// relaciones

// cliente
Appointment.belongsTo(User, {
  as: "client",
  foreignKey: "clientId",
});

User.hasMany(Appointment, {
  as: "clientAppointments",
  foreignKey: "clientId",
});

// barbero
Appointment.belongsTo(User, {
  as: "barber",
  foreignKey: "barberId",
});

User.hasMany(Appointment, {
  as: "barberAppointments",
  foreignKey: "barberId",
});

// corte
Appointment.belongsTo(Cut, {
  foreignKey: "cutId",
});

Cut.hasMany(Appointment, {
  foreignKey: "cutId",
});

// branch se relaciona con user (barber)
Branch.hasMany(User, {
  foreignKey: "branchId",
});

User.belongsTo(Branch, {
  foreignKey: "branchId",
});

// branch se relacion con appointment desde Barber, por lo tanto
// no creamos esa relacion redundante


export { User, Cut, Appointment, Branch };
