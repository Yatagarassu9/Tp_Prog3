import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/relations.js";

export const loginUser = async (email, password) => {
  const user = await User.findOne({
    where: { email }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name, // jwt necesario para filtrar los barbers en su dashboard
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  return {
    token,
    user
  };
};