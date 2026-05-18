import { Router } from "express";

import {
  getCuts,
  getCutById,
  createCut,
  updateCut,
  deleteCut
} from "../services/cut.service.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();


// 🔍 obtener todos los cortes
router.get(
  "/",
  authMiddleware,

  async (req, res) => {

    try {

      const cuts = await getCuts();

      res.json(cuts);

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  }
);


// 🔍 obtener corte por id
router.get(
  "/:id",
  authMiddleware,

  async (req, res) => {

    try {

      const cut = await getCutById(
        req.params.id
      );

      res.json(cut);

    } catch (error) {

      res.status(404).json({
        error: error.message
      });

    }

  }
);


// ➕ crear corte
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "barber"),

  async (req, res) => {

    try {

      const cut = await createCut(
        req.body
      );

      res.status(201).json(cut);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }

  }
);


// ✏️ actualizar corte
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "barber"),

  async (req, res) => {

    try {

      const cut = await updateCut(
        req.params.id,
        req.body
      );

      res.json(cut);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }

  }
);


// ❌ eliminar corte
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),

  async (req, res) => {

    try {

      const cut = await deleteCut(
        req.params.id
      );

      res.json(cut);

    } catch (error) {

      res.status(404).json({
        error: error.message
      });

    }

  }
);

export default router;