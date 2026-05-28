import { User } from "../models/relations.js";

export const getBarbers = async () => {
  return await User.findAll({
    where: {
      role: "barber",
    },
  });
};

export const getBarberById = async (id) => {
  const barber = await User.findByPk(id);
  if (!barber) throw new Error("Barber not found");
  return barber;
};

export const createBarber = async (data) => {
  return await User.create({
    ...data,
    role: "barber",
    password: "sin-password",
  });
};

export const updateBarber = async (id, data) => {
  const barber = await User.findByPk(id);
  if (!barber) throw new Error("User not found");
  return await barber.update(data);
};

export const deleteBarber = async (id) => {
  const barber = await User.findByPk(id);
  if (!barber) throw new Error("User not found");
  return await barber.destroy();
};
