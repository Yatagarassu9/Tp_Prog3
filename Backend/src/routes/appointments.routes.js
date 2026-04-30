import { Router } from "express";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from "../services/appointment.service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.json(await getAppointments());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await getAppointmentById(req.params.id));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = await createAppointment(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    res.json(await updateAppointment(req.params.id, req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    res.json(await deleteAppointment(req.params.id));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;