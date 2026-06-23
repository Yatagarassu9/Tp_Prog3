import { Op } from "sequelize";
import { Appointment, User, Cut } from "../models/relations.js";

// obtener todos los turnos
// si se pasa un barberId filtra solo los turnos de ese barbero
// si no se pasa nada trae todos (para el admin)
export const getAppointments = async (barberId = null) => {
  const where = barberId ? { barberId } : {};

  // el include trae los datos relacionados: cliente, barbero y tipo de corte
  return await Appointment.findAll({
    where,
    include: [
      { model: User, as: "client" },
      { model: User, as: "barber" },
      { model: Cut },
    ],
  });
};

// buscar un turno especifico por su id
// si no existe lanzamos un error para que el controlador devuelva 404
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

// crear un nuevo turno con todas las validaciones necesarias
export const createAppointment = async (data) => {
  // validamos que la fecha del turno sea futura, no se pueden sacar turnos en el pasado
  const selectedDate = new Date(data.appointmentDate);

  if (selectedDate < new Date()) {
    throw new Error("Invalid appointment date");
  }

  // verificamos que el barbero exista y tenga rol barbero
  const barber = await User.findByPk(data.barberId);

  if (!barber || barber.role !== "barber") {
    throw new Error("Invalid barber");
  }

  // verificamos que el cliente exista y tenga rol cliente
  const client = await User.findByPk(data.clientId);

  if (!client || client.role !== "client") {
    throw new Error("Invalid client");
  }

  // chequeamos que no haya otro turno para ese barbero en la misma fecha y hora
  // asi evitamos que dos clientes reserven el mismo horario con el mismo barbero
  const exists = await Appointment.findOne({
    where: {
      appointmentDate: data.appointmentDate,
      barberId: data.barberId,
    },
  });

  if (exists) {
    throw new Error("This appointment is already booked");
  }

  // validamos que el tipo de corte exista en la base de datos
  const cut = await Cut.findByPk(data.cutId);

  if (!cut) throw new Error("Invalid cut");

  const appointment = await Appointment.create(data);

  return appointment;
};

// actualizar un turno existente (fecha, hora, estado, etc)
export const updateAppointment = async (id, data) => {
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  // si se esta cambiando la fecha, verificamos que no haya conflicto con otro turno
  // el Op.ne (not equal) excluye el turno actual de la busqueda para que no colisione consigo mismo
  if (data.appointmentDate) {
    const exists = await Appointment.findOne({
      where: {
        appointmentDate: data.appointmentDate,
        barberId: data.barberId || appointment.barberId,
        id: { [Op.ne]: id },
      },
    });
    if (exists) throw new Error("This appointment is already booked");
  }

  return await appointment.update(data);
};

// eliminar un turno por id
// primero lo buscamos para asegurarnos que existe
export const deleteAppointment = async (id) => {
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return await appointment.destroy();
};

// devuelve los horarios ya ocupados para un barbero en una fecha especifica
// lo usa el calendario del front para deshabilitar los horarios tomados
export const getBookedSlots = async (barberId, date) => {
  // parseamos la fecha como local para evitar problemas de zona horaria con UTC
  const [year, month, day] = date.split("-").map(Number);
  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);

  const appointments = await Appointment.findAll({
    where: {
      barberId,
      appointmentDate: { [Op.between]: [start, end] },
      status: { [Op.ne]: "cancelled" }, // los cancelados no cuentan como ocupados
    },
    attributes: ["appointmentDate"],
  });

  // devolvemos solo la hora en formato HH:MM para comparar en el front
  return appointments.map((a) => {
    const d = new Date(a.appointmentDate);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  });
};

// trae todos los turnos de un cliente especifico ordenados del mas reciente al mas viejo
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
