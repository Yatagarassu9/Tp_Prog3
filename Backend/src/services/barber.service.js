import { Barber } from "../models/index.js";

export const getBarbers = async () => {
  return await Barber.findAll();
};

export const getBarberById = async (id) => {
  const barber = await Barber.findByPk(id);
  if (!barber) throw new Error("Barber not found");
  return barber;
};

export const createBarber = async (data) => {
  return await Barber.create(data);
};

export const updateBarber = async (id, data) => {
  const barber = await Barber.findByPk(id);
  if (!barber) throw new Error("Barber not found");
  return await barber.update(data);
};

export const deleteBarber = async (id) => {
  const barber = await Barber.findByPk(id);
  if (!barber) throw new Error("Barber not found");
  return await barber.destroy();
};