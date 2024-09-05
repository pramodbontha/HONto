import { Router } from "express";
import {
  getAllArticlesController,
  getArticleCitingOtherArticlesController,
  getArticleCitingOtherArticlesCountController,
  getCasesCitingArticleController,
  getCasesCitingArticleCountController,
  getCitedByArticlesController,
  getCitedByArticlesCountController,
  getFilteredArticlesController,
  getFilteredArticlesCountController,
  getReferencesWithArticleController,
  getReferencesWithArticleCountController,
} from "@/controllers";

const router = Router();

router.get("/", getAllArticlesController);
router.post("/search", getFilteredArticlesController);
router.post("/count", getFilteredArticlesCountController);
router.post("/:articleId/citedBy", getCitedByArticlesController);
router.post("/:articleId/citedBy/count", getCitedByArticlesCountController);
router.post("/:articleId/citing", getArticleCitingOtherArticlesController);
router.post(
  "/:articleId/citing/count",
  getArticleCitingOtherArticlesCountController
);
router.post("/:articleId/case", getCasesCitingArticleController);
router.post("/:articleId/case/count", getCasesCitingArticleCountController);
router.post("/:articleId/references", getReferencesWithArticleController);
router.post(
  "/:articleId/references/count",
  getReferencesWithArticleCountController
);

export default router;
