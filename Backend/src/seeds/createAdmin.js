// script para crear el usuario admin una sola vez
// se corre con: node src/seeds/createAdmin.js
// verifica si ya existe antes de crear uno nuevo

import "dotenv/config";
import bcrypt from "bcryptjs";
import sequelize from "../db.js";
import "../models/relations.js";
import { User } from "../models/relations.js";

const createAdmin = async () => {
  await sequelize.sync();

  // chequeamos si ya hay un admin para no duplicar
  const existing = await User.findOne({ where: { role: "admin" } });

  if (existing) {
    console.log("Ya existe un admin:", existing.email);
    await sequelize.close();
    return;
  }

  const hashedPassword = await bcrypt.hash("superadmin123", 10);

  await User.create({
    name: "SuperAdmin",
    email: "superadmin@gmail.com",
    password: hashedPassword,
    phone: null,
    role: "admin",
  });

  console.log("Admin creado correctamente");
  await sequelize.close();
};

createAdmin();