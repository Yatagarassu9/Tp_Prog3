import { Router } from "express";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../services/user.service.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();


//obtener todos los usuarios
//solo admin
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),

  async (req, res) => {
    try {

      const users = await getUsers();

      res.json(users);

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }
  }
);


// obtener usuario por id
// admin o el mismo usuario
router.get(
  "/:id",
  authMiddleware,

  async (req, res) => {
    try {

      const userId = Number(req.params.id);

      // si no es admin y no es su propio usuario
      if (
        req.user.role !== "admin" &&
        req.user.id !== userId
      ) {
        return res.status(403).json({
          error: "Forbidden"
        });
      }

      const user = await getUserById(userId);

      res.json(user);

    } catch (error) {

      res.status(404).json({
        error: error.message
      });

    }
  }
);


//crear usuario
// solo admin
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),

  async (req, res) => {
    try {

      const user = await createUser(req.body);

      res.status(201).json(user);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }
  }
);


// actualizar usuario
// admin o el mismo usuario
router.put(
  "/:id",
  authMiddleware,

  async (req, res) => {
    try {

      const userId = Number(req.params.id);

      if (
        req.user.role !== "admin" &&
        req.user.id !== userId
      ) {
        return res.status(403).json({
          error: "Forbidden"
        });
      }

      const updatedUser = await updateUser(
        userId,
        req.body
      );

      res.json(updatedUser);

    } catch (error) {

      res.status(400).json({
        error: error.message
      });

    }
  }
);


// eliminar usuario
// solo admin
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),

  async (req, res) => {
    try {

      const deletedUser = await deleteUser(
        req.params.id
      );

      res.json(deletedUser);

    } catch (error) {

      res.status(404).json({
        error: error.message
      });

    }
  }
);

export default router;