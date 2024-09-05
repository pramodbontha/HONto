import { Request, Response } from "express";
import {
  getAllArticles,
  getArticleCitingOtherArticles,
  getArticleCitingOtherArticlesCount,
  getCaseCitingArticles,
  getCasesCitingArticle,
  getCasesCitingArticleCount,
  getCitedByArticles,
  getCitedByArticlesCount,
  getFilteredArticles,
  getFilteredArticlesCount,
  getReferencesWithArticle,
  getReferencesWithArticleCount,
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
  const { id, name, number, text, skip, limit } = req.body;
  const articleFilter = {
    searchTerm: searchTerm as string,
    id,
    name,
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
  const { id, name, number, text, skip, limit } = req.body;
  const articleFilter = {
    searchTerm: searchTerm as string,
    id,
    name,
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

export const getCitedByArticlesController = async (
  req: Request,
  res: Response
) => {
  const { articleId } = req.params;
  const { skip, limit, searchTerm } = req.body;
  try {
    const articles = await getCitedByArticles(
      articleId,
      searchTerm,
      skip,
      limit
    );
    res.status(200).json(articles);
  } catch (error) {
    logger.error("Error getting articles", error);
    res.sendStatus(500);
  }
};

export const getCitedByArticlesCountController = async (
  req: Request,
  res: Response
) => {
  const { articleId } = req.params;
  const { searchTerm } = req.body;
  try {
    const count = await getCitedByArticlesCount(articleId, searchTerm);
    res.status(200).json(count || 0);
  } catch (error) {
    logger.error("Error getting articles count", error);
    res.sendStatus(500);
  }
};

export const getArticleCitingOtherArticlesController = async (
  req: Request,
  res: Response
) => {
  const { articleId } = req.params;
  const { skip, limit, searchTerm } = req.body;
  try {
    const articles = await getArticleCitingOtherArticles(
      articleId,
      searchTerm,
      skip,
      limit
    );
    res.status(200).json(articles);
  } catch (error) {
    logger.error("Error getting articles", error);
    res.sendStatus(500);
  }
};

export const getArticleCitingOtherArticlesCountController = async (
  req: Request,
  res: Response
) => {
  const { articleId } = req.params;
  const { searchTerm } = req.body;
  try {
    const count = await getArticleCitingOtherArticlesCount(
      articleId,
      searchTerm
    );
    res.status(200).json(count || 0);
  } catch (error) {
    logger.error("Error getting articles count", error);
    res.sendStatus(500);
  }
};

export const getCasesCitingArticleController = async (
  req: Request,
  res: Response
) => {
  const { articleId } = req.params;
  const { skip, limit, searchTerm } = req.body;
  try {
    const cases = await getCasesCitingArticle(
      articleId,
      searchTerm,
      skip,
      limit
    );
    res.status(200).json(cases);
  } catch (error) {
    logger.error("Error getting cases", error);
    res.sendStatus(500);
  }
};

export const getCasesCitingArticleCountController = async (
  req: Request,
  res: Response
) => {
  const { articleId } = req.params;
  const { searchTerm } = req.body;
  try {
    const count = await getCasesCitingArticleCount(articleId, searchTerm);
    res.status(200).json(count || 0);
  } catch (error) {
    logger.error("Error getting cases count", error);
    res.sendStatus(500);
  }
};

export const getReferencesWithArticleController = async (
  req: Request,
  res: Response
) => {
  const { articleId } = req.params;
  const { skip, limit, searchTerm } = req.body;
  try {
    const references = await getReferencesWithArticle(
      articleId,
      searchTerm,
      skip,
      limit
    );
    res.status(200).json(references);
  } catch (error) {
    logger.error("Error getting references", error);
    res.sendStatus(500);
  }
};

export const getReferencesWithArticleCountController = async (
  req: Request,
  res: Response
) => {
  const { articleId } = req.params;
  const { searchTerm } = req.body;
  try {
    const count = await getReferencesWithArticleCount(articleId, searchTerm);
    res.status(200).json(count || 0);
  } catch (error) {
    logger.error("Error getting references count", error);
    res.sendStatus(500);
  }
};
