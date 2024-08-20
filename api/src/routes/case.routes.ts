import { Router } from "express";
import {
  getAllCasesController,
  getFilteredCasesController,
  getFilteredCasesCountController,
} from "@/controllers";

const router = Router();

router.get("/", getAllCasesController);
router.post("/search", getFilteredCasesController);
router.post("/count", getFilteredCasesCountController);

export default router;
