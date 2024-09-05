import { Router } from "express";
import {
  getFilteredReferencesController,
  getFilteredReferencesCountController,
  getFilteredReferencesWithQueriesController,
  getResourcesController,
} from "@/controllers";

const router = Router();

router.post("/search", getFilteredReferencesController);
router.post("/filter", getFilteredReferencesWithQueriesController);
router.post("/count", getFilteredReferencesCountController);
router.get("/resources", getResourcesController);

export default router;
