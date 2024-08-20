import { Router } from "express";
import {
  getAllArticlesController,
  getFilteredArticlesController,
  getFilteredArticlesCountController,
} from "@/controllers";

const router = Router();

router.get("/", getAllArticlesController);
router.post("/search", getFilteredArticlesController);
router.post("/count", getFilteredArticlesCountController);

export default router;
