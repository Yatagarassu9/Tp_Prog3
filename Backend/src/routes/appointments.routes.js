import { Router } from "express";

import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByClientId,
  getBookedSlots,
} from "../services/appointment.service.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

// GET / → trae todos los turnos
// si el usuario es barbero solo ve los suyos, si es admin ve todos
// requiere estar logueado y tener rol admin o barbero
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

// GET /my → trae los turnos del usuario que esta logueado
// cualquier usuario autenticado puede usar esta ruta
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

// GET /availability → devuelve los horarios ocupados de un barbero en una fecha
// es publica, no necesita login, la usa el calendario al sacar turno
router.get("/availability", async (req, res) => {
  try {
    const { barberId, date } = req.query;
    if (!barberId || !date) {
      return res.status(400).json({ error: "barberId y date son requeridos" });
    }
    const slots = await getBookedSlots(barberId, date);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id → busca un turno por su id
// requiere estar logueado
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

// POST / → crea un nuevo turno
// solo los clientes pueden sacar turnos
// validamos los tipos de datos antes de llegar al servicio
router.post(
  "/",
  authMiddleware,
  roleMiddleware("client"),

  async (req, res) => {
    try {
      const { appointmentDate, barberId, clientId, cutId } = req.body;

      // validamos que la fecha sea una fecha real y no cualquier string
      if (!appointmentDate || isNaN(new Date(appointmentDate).getTime())) {
        return res.status(400).json({ error: "appointmentDate must be a valid date" });
      }
      // los ids tienen que ser numeros enteros positivos
      if (!Number.isInteger(Number(barberId)) || Number(barberId) <= 0) {
        return res.status(400).json({ error: "barberId must be a positive integer" });
      }
      if (!Number.isInteger(Number(clientId)) || Number(clientId) <= 0) {
        return res.status(400).json({ error: "clientId must be a positive integer" });
      }
      if (!Number.isInteger(Number(cutId)) || Number(cutId) <= 0) {
        return res.status(400).json({ error: "cutId must be a positive integer" });
      }

      const appointment = await createAppointment(req.body);

      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  },
);

// PUT /:id → modifica un turno existente (fecha, estado, etc)
// requiere estar logueado, cualquier rol puede modificar
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

// DELETE /:id → elimina un turno definitivamente
// solo el admin puede borrar turnos
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
