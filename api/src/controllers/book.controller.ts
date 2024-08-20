import e, { Request, Response } from "express";
import { getAllBooks, getPathTillParent, getSectionsInToc } from "@/services";
import { logger } from "@/config";

export const getAllBooksController = async (_: Request, res: Response) => {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    logger.error("Error getting books", error);
    res.sendStatus(500);
  }
};

export const getPathTillParentController = async (
  req: Request,
  res: Response
) => {
  const { bookId } = req.params;
  try {
    logger.info(bookId);
    const path = await getPathTillParent(bookId);
    res.status(200).json(path);
  } catch (error) {
    logger.error("Error getting path till parent", error);
    res.sendStatus(500);
  }
};

export const getSectionsInTocController = async (
  req: Request,
  res: Response
) => {
  const { bookId } = req.params;
  try {
    logger.info(bookId);
    const sections = await getSectionsInToc(bookId);
    res.status(200).json(sections);
  } catch (error) {
    logger.error("Error getting sections in TOC", error);
    res.sendStatus(500);
  }
};
