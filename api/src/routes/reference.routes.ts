import { Router } from "express";
import {
  getFilteredReferencesController,
  getFilteredReferencesCountController,
  getFilteredReferencesWithQueriesController,
} from "@/controllers";

const router = Router();

router.get("/search", getFilteredReferencesController);
router.post("/filter", getFilteredReferencesWithQueriesController);
router.post("/count", getFilteredReferencesCountController);

export default router;
