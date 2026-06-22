import { Router } from "express";
import {
  getBarbers,
  getBarberById,
  createBarber,
  updateBarber,
  deleteBarber,
} from "../services/barber.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

// cualquiera puede ver los barberos para la reserva de turnos
router.get("/", async (req, res) => {
  try {
    const barber = await getBarbers();

    res.json(barber);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const barber = await getBarberById(req.params.id);
    res.status(200).json(barber);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// solo el admin puede crear, modificar o eliminar barberos
router.post("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const barber = await createBarber(req.body);
    res.status(201).json(barber);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const barber = await updateBarber(req.params.id, req.body);
    res.status(200).json(barber);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const barber = await deleteBarber(req.params.id);
    res.status(200).json(barber);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
