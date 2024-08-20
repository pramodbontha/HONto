import { Request, Response } from "express";
import {
  getAllCases,
  getFilteredCases,
  getFilteredCasesCount,
} from "@/services";
import { logger } from "@/config";

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
  };
  try {
    const count = await getFilteredCasesCount(caseFilter);
    res.status(200).json(count || 0);
  } catch (error) {
    logger.error("Error getting cases count", error);
    res.sendStatus(500);
  }
};
