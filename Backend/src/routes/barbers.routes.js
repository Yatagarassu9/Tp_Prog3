import { Router } from "express";
import {
  getBarbers,
  getBarberById,
  createBarber,
  updateBarber,
  deleteBarber
} from "../services/barber.service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.json(await getBarbers());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(201).json(await createBarber(req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;