import { Router } from "express";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from "../services/service.service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.json(await getServices());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await getServiceById(req.params.id));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(201).json(await createService(req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    res.json(await updateService(req.params.id, req.body));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    res.json(await deleteService(req.params.id));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;