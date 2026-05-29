import {
  Appointment,
  User,
  Cut
} from "../models/relations.js";


// obtener todos los turnos
export const getAppointments = async () => {

  return await Appointment.findAll({
    include: [
      { model: User, as: "client" },
      { model: User, as: "barber" },
      { model: Cut }
    ]
  });

};


//  obtener turno por id
export const getAppointmentById = async (id) => {

  const appointment = await Appointment.findByPk(id, {
    include: [
      { model: User, as: "client" },
      { model: User, as: "barber" },
      { model: Cut }
    ]
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return appointment;

};


//  crear turno
export const createAppointment = async (data) => {

  // validar fecha
  const selectedDate = new Date(
    data.appointmentDate
  );

  if (selectedDate < new Date()) {
    throw new Error(
      "Invalid appointment date"
    );
  }

  // validar barber
  const barber = await User.findByPk(
    data.barberId
  );

  if (
    !barber ||
    barber.role !== "barber"
  ) {
    throw new Error("Invalid barber");
  }

  // validar client
  const client = await User.findByPk(
    data.clientId
  );

  if (
    !client ||
    client.role !== "client"
  ) {
    throw new Error("Invalid client");
  }

  // validar turno duplicado
  const exists = await Appointment.findOne({
    where: {
      appointmentDate:
        data.appointmentDate,

      barberId:
        data.barberId
    }
  });

  if (exists) {
    throw new Error(
      "This appointment is already booked"
    );
  }

  return await Appointment.create(data);

};


// actualizar turno
export const updateAppointment = async (
  id,
  data
) => {

  const appointment =
    await Appointment.findByPk(id);

  if (!appointment) {
    throw new Error(
      "Appointment not found"
    );
  }

  return await appointment.update(data);

};


//  eliminar turno
export const deleteAppointment = async (
  id
) => {

  const appointment =
    await Appointment.findByPk(id);

  if (!appointment) {
    throw new Error(
      "Appointment not found"
    );
  }

  return await appointment.destroy();

};