import { User } from "../models/relations.js";
import bcrypt from "bcryptjs";
export const getUsers = async () => {
  return await User.findAll();
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  return user;
};

export const createUser = async (data) => {

  const hashedPassword = await bcrypt.hash(
    data.password,
    10
  );

  return await User.create({
    ...data,
    password: hashedPassword
  });
};

export const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  return await user.update(data);
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  return await user.destroy();
};