import { Op } from "sequelize";
import { Appointment, User, Cut } from "../models/relations.js";
import { sendAppointmentConfirmation } from "./email.service.js";

// obtener todos los turnos
export const getAppointments = async (barberId = null) => {
  const where = barberId ? { barberId } : {};

  return await Appointment.findAll({
    where,
    include: [
      { model: User, as: "client" },
      { model: User, as: "barber" },
      { model: Cut },
    ],
  });
};

//  obtener turno por id
export const getAppointmentById = async (id) => {
  const appointment = await Appointment.findByPk(id, {
    include: [
      { model: User, as: "client" },
      { model: User, as: "barber" },
      { model: Cut },
    ],
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return appointment;
};

//  crear turno
export const createAppointment = async (data) => {
  // validar fecha
  const selectedDate = new Date(data.appointmentDate);

  if (selectedDate < new Date()) {
    throw new Error("Invalid appointment date");
  }

  // validar barber
  const barber = await User.findByPk(data.barberId);

  if (!barber || barber.role !== "barber") {
    throw new Error("Invalid barber");
  }

  // validar client
  const client = await User.findByPk(data.clientId);

  if (!client || client.role !== "client") {
    throw new Error("Invalid client");
  }

  // validar turno duplicado
  const exists = await Appointment.findOne({
    where: {
      appointmentDate: data.appointmentDate,

      barberId: data.barberId,
    },
  });

  if (exists) {
    throw new Error("This appointment is already booked");
  }

  const cut = await Cut.findByPk(data.cutId);

  const appointment = await Appointment.create(data);

  sendAppointmentConfirmation({
    clientEmail: client.email,
    clientName: client.name,
    barberName: barber.name,
    cutName: cut?.name ?? "Servicio",
    appointmentDate: data.appointmentDate,
  }).catch((err) => console.error("Error enviando email:", err.message));

  return appointment;
};

// actualizar turno
export const updateAppointment = async (id, data) => {
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return await appointment.update(data);
};

//  eliminar turno
export const deleteAppointment = async (id) => {
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return await appointment.destroy();
};

// obtener horarios ocupados para un barbero en una fecha (público)
export const getBookedSlots = async (barberId, date) => {
  // Parsear "YYYY-MM-DD" como fecha local para evitar el desfase UTC
  const [year, month, day] = date.split("-").map(Number);
  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);

  const appointments = await Appointment.findAll({
    where: {
      barberId,
      appointmentDate: { [Op.between]: [start, end] },
      status: { [Op.ne]: "cancelled" },
    },
    attributes: ["appointmentDate"],
  });

  return appointments.map((a) => {
    const d = new Date(a.appointmentDate);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  });
};

// obtener turnos por cliente
// hacer fetch para conectar el appointment con el user

export const getAppointmentsByClientId = async (clientId) => {
  return await Appointment.findAll({
    where: { clientId },
    include: [
      { model: User, as: "client" },
      { model: User, as: "barber" },
      { model: Cut },
    ],
    order: [["appointmentDate", "DESC"]],
  });
};
