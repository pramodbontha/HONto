import { Router } from "express";
import {
  getAllBooksController,
  getPathTillParentController,
  getSectionsInTocController,
} from "@/controllers";

const router = Router();

router.get("/", getAllBooksController);
router.get("/:bookId", getPathTillParentController);
router.get("/:bookId/sections", getSectionsInTocController);

export default router;
