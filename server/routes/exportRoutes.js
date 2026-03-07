import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { exportTransactionsCsv } from "../controllers/exportController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/csv", exportTransactionsCsv);

export default router;
