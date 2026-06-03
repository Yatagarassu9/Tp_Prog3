import { Router } from "express";
import { loginUser } from "../services/auth.service.js";
import { createUser } from "../services/user.service.js";
import { ROLES } from "../enums/enums.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.json(data);

  } catch (error) {
    res.status(401).json({
      error: error.message
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y contraseña son requeridos" });
    }

    const user = await createUser({ name, email, password, role: ROLES.CLIENT });

    res.status(201).json({ message: "Usuario creado correctamente", userId: user.id });

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

export default router;