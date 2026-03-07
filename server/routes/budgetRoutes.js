import express from "express";
import { getBudgetByMonth, upsertBudget } from "../controllers/budgetController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/:month", getBudgetByMonth);
router.post("/", upsertBudget);

export default router;
