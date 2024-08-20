import { Request, Response } from "express";
import {
  getAllArticles,
  getFilteredArticles,
  getFilteredArticlesCount,
} from "@/services";
import { logger } from "@/config";

export const getAllArticlesController = async (_: Request, res: Response) => {
  try {
    const articles = await getAllArticles();
    res.status(200).json(articles);
  } catch (error) {
    logger.error("Error getting articles", error);
    res.sendStatus(500);
  }
};

export const getFilteredArticlesController = async (
  req: Request,
  res: Response
) => {
  const searchTerm = req.query.searchTerm;
  const { id, number, text, skip, limit } = req.body;
  const articleFilter = {
    searchTerm: searchTerm as string,
    id,
    number,
    text,
    skip,
    limit,
  };
  try {
    const articles = await getFilteredArticles(articleFilter);
    res.status(200).json(articles);
  } catch (error) {
    logger.error("Error getting articles", error);
    res.sendStatus(500);
  }
};

export const getFilteredArticlesCountController = async (
  req: Request,
  res: Response
) => {
  const searchTerm = req.query.searchTerm;
  const { id, number, text, skip, limit } = req.body;
  const articleFilter = {
    searchTerm: searchTerm as string,
    id,
    number,
    text,
    skip,
    limit,
  };
  try {
    const count = await getFilteredArticlesCount(articleFilter);
    res.status(200).json(count || 0);
  } catch (error) {
    logger.error("Error getting articles count", error);
    res.sendStatus(500);
  }
};
