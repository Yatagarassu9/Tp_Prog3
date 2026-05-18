import { Router } from "express";
import { loginUser } from "../services/auth.service.js";

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

export default router;