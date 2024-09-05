import { Request, Response } from "express";
import {
  getAllCases,
  getCaseCitingArticles,
  getCaseCitingArticlesCount,
  getCaseCitingOtherCases,
  getCasesCitingGivenCase,
  getCasesCitingGivenCaseCount,
  getDecisionTypes,
  getFilteredCases,
  getFilteredCasesCount,
  getReferencesWithGivenCase,
} from "@/services";
import { logger } from "@/config";
import {
  getCaseCitingOtherCasesCount,
  getReferencesWithGivenCaseCount,
} from "../services/case.service";

export const getAllCasesController = async (_: Request, res: Response) => {
  try {
    const cases = await getAllCases();
    res.status(200).json(cases);
  } catch (error) {
    logger.error("Error getting cases", error);
    res.sendStatus(500);
  }
};

export const getFilteredCasesController = async (
  req: Request,
  res: Response
) => {
  const { searchTerm } = req.query;
  const {
    name,
    number,
    judgment,
    facts,
    reasoning,
    headnotes,
    skip,
    limit,
    startYear,
    endYear,
    decisionType,
  } = req.body;
  const caseFilter = {
    searchTerm: searchTerm as string,
    name,
    number,
    judgment,
    facts,
    reasoning,
    headnotes,
    startYear,
    endYear,
    skip,
    limit,
    decisionType,
  };
  try {
    const cases = await getFilteredCases(caseFilter);
    res.status(200).json(cases);
  } catch (error) {
    logger.error("Error getting cases", error);
    res.sendStatus(500);
  }
};

export const getFilteredCasesCountController = async (
  req: Request,
  res: Response
) => {
  const { searchTerm } = req.query;
  const {
    name,
    number,
    judgement,
    facts,
    reasoning,
    headnotes,
    skip,
    limit,
    startYear,
    endYear,
    decisionType,
  } = req.body;
  const caseFilter = {
    searchTerm: searchTerm as string,
    name,
    number,
    judgement,
    facts,
    reasoning,
    headnotes,
    startYear,
    endYear,
    skip,
    limit,
    decisionType,
  };
  try {
    const count = await getFilteredCasesCount(caseFilter);
    res.status(200).json(count || 0);
  } catch (error) {
    logger.error("Error getting cases count", error);
    res.sendStatus(500);
  }
};

export const getCaseCitingOtherCasesController = async (
  req: Request,
  res: Response
) => {
  const { caseId } = req.params;
  const { skip, limit, searchTerm } = req.body;
  try {
    const cases = await getCaseCitingOtherCases(
      caseId,
      searchTerm,
      skip,
      limit
    );
    res.status(200).json(cases);
  } catch (error) {
    logger.error("Error getting cases citing article", error);
    res.sendStatus(500);
  }
};

export const getCasesCitingOtherCasesCountController = async (
  req: Request,
  res: Response
) => {
  const { caseId } = req.params;
  const { searchTerm } = req.body;
  try {
    const count = await getCaseCitingOtherCasesCount(caseId, searchTerm);
    res.status(200).json(count);
  } catch (error) {
    logger.error("Error getting cases citing case count", error);
    res.sendStatus(500);
  }
};

export const getCasesCitingGivenCaseController = async (
  req: Request,
  res: Response
) => {
  const { caseId } = req.params;
  const { skip, limit, searchTerm } = req.body;
  try {
    const cases = await getCasesCitingGivenCase(
      caseId,
      searchTerm,
      skip,
      limit
    );
    res.status(200).json(cases);
  } catch (error) {
    logger.error("Error getting cases citing case", error);
    res.sendStatus(500);
  }
};

export const getCasesCitingGivenCaseCountController = async (
  req: Request,
  res: Response
) => {
  const { caseId } = req.params;
  const { searchTerm } = req.body;
  try {
    const count = await getCasesCitingGivenCaseCount(caseId, searchTerm);
    res.status(200).json(count);
  } catch (error) {
    logger.error("Error getting cases citing case count", error);
    res.sendStatus(500);
  }
};

export const getCaseCitingArticlesController = async (
  req: Request,
  res: Response
) => {
  const { caseId } = req.params;
  const { skip, limit, searchTerm } = req.body;
  try {
    const articles = await getCaseCitingArticles(
      caseId,
      searchTerm,
      skip,
      limit
    );
    res.status(200).json(articles);
  } catch (error) {
    logger.error("Error getting cases citing article", error);
    res.sendStatus(500);
  }
};

export const getCaseCitingArticlesCountController = async (
  req: Request,
  res: Response
) => {
  const { caseId } = req.params;
  const { searchTerm } = req.body;
  try {
    const count = await getCaseCitingArticlesCount(caseId, searchTerm);
    res.status(200).json(count);
  } catch (error) {
    logger.error("Error getting cases citing article count", error);
    res.sendStatus(500);
  }
};

export const getReferencesWithGivenCaseController = async (
  req: Request,
  res: Response
) => {
  const { caseId } = req.params;
  const { skip, limit, searchTerm } = req.body;
  try {
    const references = await getReferencesWithGivenCase(
      caseId,
      searchTerm,
      skip,
      limit
    );
    res.status(200).json(references);
  } catch (error) {
    logger.error("Error getting references with case", error);
    res.sendStatus(500);
  }
};

export const getReferencesWithGivenCaseCountController = async (
  req: Request,
  res: Response
) => {
  const { caseId } = req.params;
  const { searchTerm } = req.body;
  try {
    const count = await getReferencesWithGivenCaseCount(caseId, searchTerm);
    res.status(200).json(count);
  } catch (error) {
    logger.error("Error getting references with case count", error);
    res.sendStatus(500);
  }
};

export const getDecisionTypesController = async (
  req: Request,
  res: Response
) => {
  try {
    const decisionTypes = await getDecisionTypes();
    res.status(200).json(decisionTypes);
  } catch (error) {
    logger.error("Error getting decision types", error);
    res.sendStatus(500);
  }
};
