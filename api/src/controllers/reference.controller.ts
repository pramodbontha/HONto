import e, { Request, Response } from "express";
import { logger } from "@/config";
import {
  getFilteredReferences,
  getFilteredReferencesCount,
  getFilteredReferencesWithQueries,
} from "@/services";

export const getFilteredReferencesController = async (
  req: Request,
  res: Response
) => {
  const { searchTerm } = req.query;
  try {
    const references = await getFilteredReferences(searchTerm as string);
    res.status(200).json(references);
  } catch (error) {
    logger.error("Error getting references", error);
    res.sendStatus(500);
  }
};

export const getFilteredReferencesWithQueriesController = async (
  req: Request,
  res: Response
) => {
  const { searchTerm } = req.query;
  const { context, text, skip, limit } = req.body;
  const referenceFilter = {
    searchTerm: searchTerm as string,
    context,
    text,
    skip,
    limit,
  };
  try {
    const references = await getFilteredReferencesWithQueries(referenceFilter);
    res.status(200).json(references);
  } catch (error) {
    logger.error("Error getting references", error);
    res.sendStatus(500);
  }
};

export const getFilteredReferencesCountController = async (
  req: Request,
  res: Response
) => {
  const { searchTerm } = req.query;
  const { context, text, skip, limit } = req.body;
  const referenceFilter = {
    searchTerm: searchTerm as string,
    context,
    text,
    skip,
    limit,
  };
  try {
    const count = await getFilteredReferencesCount(referenceFilter);
    res.status(200).json(count);
  } catch (error) {
    logger.error("Error getting references count", error);
    res.sendStatus(500);
  }
};
