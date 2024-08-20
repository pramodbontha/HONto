import { db, logger } from "@/config";
import _ from "lodash";

export const getAllBooks = async () => {
  const session = db.session();
  logger.info("Fetching all books");
  try {
    const result = await session.run(
      ` MATCH (n:TOC)-[:PART_OF]->(n)
        RETURN n`
    );
    const books = result.records.map((record) => {
      const book = record.get("n").properties;
      return { ...book };
    });

    return books;
  } catch (error) {
    throw error;
  }
};

export const getPathTillParent = async (bookId: string) => {
  const session = db.session();
  logger.info("Fetching path till parent");
  try {
    const result = await session.run(
      `MATCH (n:TOC {id: $bookId})
        WITH n
        MATCH path = (n)-[:PART_OF*]->(p:TOC)
        WHERE p.id = n.next_toc AND n.id <> p.id
        RETURN DISTINCT p, length(path) as depth
        ORDER BY depth DESC`,
      { bookId }
    );
    const path = result.records.map((record) => {
      const parent = record.get("p").properties;
      return { ...parent };
    });
    const uniquePath = _.uniqBy(path, "id");

    return uniquePath;
  } catch (error) {
    throw error;
  }
};

export const getSectionsInToc = async (bookId: string) => {
  const session = db.session();
  logger.info("Fetching sections in TOC");
  try {
    const result = await session.run(
      `MATCH (t:TOC)-[:PART_OF]->(section:TOC)
      WHERE toLower(section.id) = toLower('${bookId}') AND id(t) <> id(section)
      RETURN DISTINCT t, elementId(t) AS elementId`
    );
    const sections = result.records.map((record) => {
      const section = record.get("t").properties;
      const sectionId = record.get("elementId");
      return { ...section, sectionId };
    });
    return sections;
  } catch (error) {
    throw error;
  }
};
