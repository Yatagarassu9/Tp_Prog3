import { Router } from "express";
import {
  getBarbers,
  getBarberById,
  createBarber,
  updateBarber,
  deleteBarber,
} from "../services/barber.service.js";

const router = Router();

router.get("/", getBarbers);

router.get("/:id", getBarberById);

router.post("/", createBarber);

router.put("/:id", updateBarber);

router.delete("/:id", deleteBarber);

export default router;