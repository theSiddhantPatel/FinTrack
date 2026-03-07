import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getCategories);
router.post("/", createCategory);

export default router;
