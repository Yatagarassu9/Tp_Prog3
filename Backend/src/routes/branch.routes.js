import { Router } from "express";
import {
  getBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../services/branch.service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const branch = await getBranches();

    res.json(branch);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const branch = await getBranchById(req.params.id);
    res.status(200).json(branch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const branch = await createBranch(req.body);
    res.status(201).json(branch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const branch = await updateBranch(req.params.id, req.body);
    res.status(200).json(branch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const branch = await deleteBranch(req.params.id);
    res.status(200).json(branch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
