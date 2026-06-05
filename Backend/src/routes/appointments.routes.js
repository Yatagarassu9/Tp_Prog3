import { Router } from "express";

import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByClientId,
} from "../services/appointment.service.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

// obtener todos los turnos
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "barber"),

  async (req, res) => {
    try {
      const barberId = req.user.role === "barber" ? req.user.id : null;
      const appointments = await getAppointments(barberId);

      res.json(appointments);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
);

// obtener turnos del usuario autenticado
router.get(
  "/my",
  authMiddleware,

  async (req, res) => {
    try {
      const appointments = await getAppointmentsByClientId(req.user.id);

      res.json(appointments);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
);

// obtener turno por id
router.get(
  "/:id",
  authMiddleware,

  async (req, res) => {
    try {
      const appointment = await getAppointmentById(req.params.id);

      res.json(appointment);
    } catch (error) {
      res.status(404).json({
        error: error.message,
      });
    }
  },
);

// crear turno
router.post(
  "/",
  authMiddleware,
  roleMiddleware("client"),

  async (req, res) => {
    try {
      const appointment = await createAppointment(req.body);

      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },
);

// actualizar turno
router.put(
  "/:id",
  authMiddleware,

  async (req, res) => {
    try {
      const appointment = await updateAppointment(req.params.id, req.body);

      res.json(appointment);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },
);

// eliminar turno
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),

  async (req, res) => {
    try {
      const appointment = await deleteAppointment(req.params.id);

      res.json(appointment);
    } catch (error) {
      res.status(404).json({
        error: error.message,
      });
    }
  },
);

export default router;
