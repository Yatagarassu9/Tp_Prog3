import { Appointment, User, Service } from "../models/relations.js";

// obtener todos los turnos
export const getAppointments = async () => {
  return await Appointment.findAll({
    include: [
      { model: User, as: "client" },
      { model: User, as: "barber" },
      { model: Service }
    ]
  });
};

// obtener un turno por ID
export const getAppointmentById = async (id) => {
  const appointment = await Appointment.findByPk(id, {
    include: [
      { model: User, as: "client" },
      { model: User, as: "barber" },
      { model: Service }
    ]
  });

  if (!appointment) throw new Error("Appointment not found");

  return appointment;
};

// crear turno
export const createAppointment = async (data) => {
  // validar que el barbero exista
  const barber = await User.findByPk(data.barberId);
  if (!barber || barber.role !== "barber") {
    throw new Error("Invalid barber");
  }

  //  validar que el cliente exista
  const client = await User.findByPk(data.clientId);
  if (!client || client.role !== "client") {
    throw new Error("Invalid client");
  }

  // verificar turnos dobles 
  const exists = await Appointment.findOne({
    where: {
      date: data.date,
      time: data.time,
      barberId: data.barberId
    }
  });

  if (exists) {
    throw new Error("This time is already booked");
  }

  return await Appointment.create(data);
};

// actualizar turno
export const updateAppointment = async (id, data) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) throw new Error("Appointment not found");

  return await appointment.update(data);
};

// eliminar turno
export const deleteAppointment = async (id) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) throw new Error("Appointment not found");

  return await appointment.destroy();
};