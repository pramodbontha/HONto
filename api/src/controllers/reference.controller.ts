import e, { Request, Response } from "express";
import { logger } from "@/config";
import {
  getFilteredReferences,
  getFilteredReferencesCount,
  getFilteredReferencesWithQueries,
  getResources,
} from "@/services";

export const getFilteredReferencesController = async (
  req: Request,
  res: Response
) => {
  const { searchTerm } = req.body;
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
  const {
    searchTerm,
    context,
    text,
    skip,
    limit,
    resources,
    refCasesArticles,
  } = req.body;
  const referenceFilter = {
    searchTerm: searchTerm as string,
    context,
    text,
    skip,
    limit,
    resources,
    refCasesArticles,
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
  const {
    searchTerm,
    context,
    text,
    skip,
    limit,
    resources,
    refCasesArticles,
  } = req.body;
  const referenceFilter = {
    searchTerm: searchTerm as string,
    context,
    text,
    skip,
    limit,
    resources,
    refCasesArticles,
  };
  try {
    const count = await getFilteredReferencesCount(referenceFilter);
    res.status(200).json(count);
  } catch (error) {
    logger.error("Error getting references count", error);
    res.sendStatus(500);
  }
};

export const getResourcesController = async (req: Request, res: Response) => {
  try {
    const resources = await getResources();
    res.status(200).json(resources);
  } catch (error) {
    logger.error("Error getting resources", error);
    res.sendStatus(500);
  }
};
