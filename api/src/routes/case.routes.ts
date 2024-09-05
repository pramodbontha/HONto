import { Router } from "express";
import {
  getAllCasesController,
  getCaseCitingArticlesController,
  getCaseCitingArticlesCountController,
  getCaseCitingOtherCasesController,
  getCasesCitingGivenCaseController,
  getCasesCitingGivenCaseCountController,
  getCasesCitingOtherCasesCountController,
  getDecisionTypesController,
  getFilteredCasesController,
  getFilteredCasesCountController,
  getReferencesWithGivenCaseController,
  getReferencesWithGivenCaseCountController,
} from "@/controllers";

const router = Router();

router.get("/", getAllCasesController);
router.post("/search", getFilteredCasesController);
router.post("/count", getFilteredCasesCountController);
router.post("/:caseId/citing", getCaseCitingOtherCasesController);
router.post("/:caseId/citing/count", getCasesCitingOtherCasesCountController);
router.post("/:caseId/citedBy", getCasesCitingGivenCaseController);
router.post("/:caseId/citedBy/count", getCasesCitingGivenCaseCountController);
router.post("/:caseId/articles", getCaseCitingArticlesController);
router.post("/:caseId/articles/count", getCaseCitingArticlesCountController);
router.post("/:caseId/references", getReferencesWithGivenCaseController);
router.post(
  "/:caseId/references/count",
  getReferencesWithGivenCaseCountController
);
router.get("/decisions", getDecisionTypesController);

export default router;
