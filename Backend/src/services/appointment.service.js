import { Appointment, Client, Barber, Service } from "../models/index.js";

export const getAppointments = async () => {
  return await Appointment.findAll({
    include: [Client, Barber, Service]
  });
};

export const getAppointmentById = async (id) => {
  const appointment = await Appointment.findByPk(id, {
    include: [Client, Barber, Service]
  });

  if (!appointment) throw new Error("Appointment not found");

  return appointment;
};

export const createAppointment = async (data) => {
  // verofica si ya hay un turno, si hay manda un error
  const exists= await Appointment.findOne({
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

export const updateAppointment = async (id, data) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) throw new Error("Appointment not found");

  return await appointment.update(data);
};

export const deleteAppointment = async (id) => {
  const appointment = await Appointment.findByPk(id);
  if (!appointment) throw new Error("Appointment not found");

  return await appointment.destroy();
};