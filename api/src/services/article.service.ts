import { db, logger } from "@/config";
import { ArticleFilter } from "@/types";
import _ from "lodash";

export const getAllArticles = async () => {
  const session = db.session();
  logger.info("Fetching all articles");
  try {
    const result = await session.run(
      "MATCH (a:Article) RETURN a, elementId(a) AS elementId ORDER BY a.total_case_citations DESC  LIMIT 25"
    );
    const articles = result.records.map((record) => {
      const article = record.get("a").properties;
      const articleId = record.get("elementId");
      return { ...article, id: articleId };
    });
    return articles;
  } catch (error) {
    throw error;
  }
};

export const getFilteredArticles = async (articleFilter: ArticleFilter) => {
  const session = db.session();

  const query = prepareFilterQuery(articleFilter, false);
  try {
    const result = await session.run(query);
    const articles = result.records.map((record) => {
      const article = record.get("a").properties;
      const articleId = record.get("elementId");
      return { ...article, id: articleId };
    });
    return articles;
  } catch (error) {
    throw error;
  }
};

export const getFilteredArticlesCount = async (
  articleFilter: ArticleFilter
) => {
  const session = db.session();
  const query = prepareFilterQuery(articleFilter, true);
  try {
    const result = await session.run(query);
    return result.records[0].get("count").low;
  } catch (error) {
    throw error;
  }
};

const prepareFilterQuery = (
  articleFilter: ArticleFilter,
  isCountQuery: boolean
) => {
  const cleanedFilter = _.pickBy(articleFilter, (value) => value !== undefined);
  let query = "MATCH (a:Article) ";
  let conditions = [];

  if (cleanedFilter.number) {
    conditions.push(
      `toLower(a.number) CONTAINS toLower('${articleFilter.searchTerm}')`
    );
  }

  if (cleanedFilter.text) {
    conditions.push(
      `toLower(a.text) CONTAINS toLower('${articleFilter.searchTerm}')`
    );
  }

  if (conditions.length) {
    query += `WHERE ${conditions.join(" OR ")} `;
  }

  if (!cleanedFilter.number && !cleanedFilter.text) {
    query += `WHERE toLower(a.number) CONTAINS toLower('${articleFilter.searchTerm}') `;
  }

  if (isCountQuery) {
    query += "RETURN COUNT(a) AS count";
  } else {
    query += "RETURN a, elementId(a) AS elementId ";
    query += `SKIP ${articleFilter.skip} LIMIT ${articleFilter.limit}`;
  }

  return query;
};
