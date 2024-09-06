import { db, logger } from "@/config";
import { ArticleFilter } from "@/types";
import _ from "lodash";

export const getAllArticles = async () => {
  const session = db.session();
  logger.info("Fetching all articles");
  try {
    const result = await session.run(
      `MATCH (a:Article)-[:IS_NAMED]->(n:Name) RETURN a, n.short AS articleName, elementId(a) AS elementId
       ORDER BY a.citing_cases DESC LIMIT 10`
    );
    const articles = result.records.map((record) => {
      const article = record.get("a").properties;
      const articleId = record.get("elementId");
      const name = record.get("articleName");
      return { ...article, name, id: articleId };
    });
    return articles;
  } catch (error) {
    throw error;
  }
};

export const getFilteredArticles = async (articleFilter: ArticleFilter) => {
  const session = db.session();

  const query = prepareFilterQuery(articleFilter, false);
  console.log(query);
  try {
    const result = await session.run(query);
    const articles = result.records.map((record) => {
      const article = record.get("a").properties;
      const name = record.get("name");
      const articleId = record.get("elementId");
      return { ...article, name, id: articleId };
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

export const getCitedByArticles = async (
  articleId: string,
  searchTerm: string,
  skip: number,
  limit: number
) => {
  const session = db.session();
  logger.info(`Fetching articles cited by article: ${articleId}`);
  let query = `MATCH (a:Article)-[:CITES]->(b:Article{number: '${articleId}'}) `;
  if (searchTerm) {
    query += `WHERE toLower(a.number) CONTAINS '${searchTerm}'
    OR toLower(a.text) CONTAINS '${searchTerm}' `;
  }
  query += `OPTIONAL MATCH (a:Article)-[:IS_NAMED]->(n:Name) `;
  if (searchTerm) {
    query += `WHERE toLower(n.short) CONTAINS '${searchTerm}' `;
  }
  query += `RETURN DISTINCT a, n.short AS name, elementId(a) AS elementId SKIP ${skip} LIMIT ${limit}`;
  try {
    const result = await session.run(query);
    const articles = result.records.map((record) => {
      const article = record.get("a").properties;
      const articleId = record.get("elementId");
      const name = record.get("name");
      return { ...article, id: articleId, name };
    });
    return articles;
  } catch (error) {
    throw error;
  }
};

export const getCitedByArticlesCount = async (
  articleId: string,
  searchTerm: string
) => {
  const session = db.session();
  let query = `MATCH (a:Article)-[:CITES]->(b:Article{number: '${articleId}'}) `;
  if (searchTerm) {
    query += `WHERE toLower(a.number) CONTAINS '${searchTerm}'
    OR toLower(a.text) CONTAINS '${searchTerm}' `;
  }
  query += `OPTIONAL MATCH (a:Article)-[:IS_NAMED]->(n:Name) `;
  if (searchTerm) {
    query += `WHERE toLower(n.short) CONTAINS '${searchTerm}' `;
  }
  query += `RETURN COUNT(a) AS count`;
  try {
    const result = await session.run(query);
    return result.records[0].get("count").low;
  } catch (error) {
    throw error;
  }
};

export const getArticleCitingOtherArticles = async (
  articleId: string,
  searchTerm: string,
  skip: number,
  limit: number
) => {
  const session = db.session();
  let query = `MATCH (a:Article{number: '${articleId}'})-[:CITES]->(b:Article) `;
  if (searchTerm) {
    query += `WHERE toLower(b.number) CONTAINS '${searchTerm}'
    OR toLower(b.text) CONTAINS '${searchTerm}' `;
  }
  query += `OPTIONAL MATCH (b)-[:IS_NAMED]->(n:Name) `;
  if (searchTerm) {
    query += `WHERE toLower(n.short) CONTAINS '${searchTerm} `;
  }
  query += `RETURN DISTINCT b, n.short AS name, elementId(b) AS elementId SKIP ${skip} LIMIT ${limit}`;
  try {
    const result = await session.run(
      `MATCH (a:Article{number: '${articleId}'})-[:CITES]->(b:Article)-[:IS_NAMED]->(n:Name)
      RETURN DISTINCT b, n.short AS name, elementId(b) AS elementId SKIP ${skip} LIMIT ${limit}`
    );
    const articles = result.records.map((record) => {
      const article = record.get("b").properties;
      const articleId = record.get("elementId");
      const name = record.get("name");
      return { ...article, id: articleId, name };
    });
    return articles;
  } catch (error) {
    throw error;
  }
};

export const getArticleCitingOtherArticlesCount = async (
  articleId: string,
  searchTerm: string
) => {
  const session = db.session();
  let query = `MATCH (a:Article{number: '${articleId}'})-[:CITES]->(b:Article) `;
  if (searchTerm) {
    query += `WHERE toLower(b.number) CONTAINS '${searchTerm}'
    OR toLower(b.text) CONTAINS '${searchTerm}' `;
  }
  query += `OPTIONAL MATCH (b)-[:IS_NAMED]->(n:Name) `;
  if (searchTerm) {
    query += `WHERE toLower(n.short) CONTAINS '${searchTerm} `;
  }
  query += `RETURN COUNT(b) AS count`;
  try {
    const result = await session.run(query);
    return result.records[0].get("count").low;
  } catch (error) {
    throw error;
  }
};

export const getCasesCitingArticle = async (
  articleId: string,
  searchTerm: string,
  skip: number,
  limit: number
) => {
  const session = db.session();
  let query = `MATCH (c:Case)-[:REFERS_TO]->(a:Article {number: '${articleId}'}) `;
  if (searchTerm) {
    query += `WHERE toLower(c.number) CONTAINS toLower('${searchTerm}') 
    OR toLower(c.judgment) CONTAINS toLower('${searchTerm}') 
    OR toLower(c.facts) CONTAINS toLower('${searchTerm}')
    OR toLower(c.reasoning) CONTAINS toLower('${searchTerm}')
    OR toLower(c.headnotes) CONTAINS toLower('${searchTerm}') 
    OR toLower(c.year) CONTAINS toLower('${searchTerm}')
    OR toLower(c.decision_type) CONTAINS toLower('${searchTerm}') `;
  }
  query += `OPTIONAL MATCH (c:Case)-[:IS_NAMED]->(n:Name) `;
  if (searchTerm) {
    query += `WHERE toLower(n.short) CONTAINS '${searchTerm}' `;
  }
  query += `RETURN DISTINCT c, n.short AS caseName, elementId(c) AS elementId SKIP ${skip} LIMIT ${limit}`;
  try {
    const result = await session.run(query);
    const cases = result.records.map((record) => {
      const caseg = record.get("c").properties;
      const caseName = record.get("caseName");
      const caseId = record.get("elementId");
      return { ...caseg, id: caseId, caseName };
    });
    return cases;
  } catch (error) {
    throw error;
  }
};

export const getCasesCitingArticleCount = async (
  articleId: string,
  searchTerm: string
) => {
  const session = db.session();
  let query = `MATCH (c:Case)-[:REFERS_TO]->(a:Article {number: '${articleId}'}) `;
  if (searchTerm) {
    query += `WHERE toLower(c.number) CONTAINS toLower('${searchTerm}') 
    OR toLower(c.judgment) CONTAINS toLower('${searchTerm}') 
    OR toLower(c.facts) CONTAINS toLower('${searchTerm}')
    OR toLower(c.reasoning) CONTAINS toLower('${searchTerm}')
    OR toLower(c.headnotes) CONTAINS toLower('${searchTerm}') 
    OR toLower(c.year) CONTAINS toLower('${searchTerm}')
    OR toLower(c.decision_type) CONTAINS toLower('${searchTerm}') `;
  }
  query += `OPTIONAL MATCH (c:Case)-[:IS_NAMED]->(n:Name) `;
  if (searchTerm) {
    query += `WHERE toLower(n.short) CONTAINS '${searchTerm}' `;
  }
  query += `RETURN COUNT(c) AS count`;
  try {
    const result = await session.run(query);
    return result.records[0].get("count").low;
  } catch (error) {
    throw error;
  }
};

export const getReferencesWithArticle = async (
  articleId: string,
  searchTerm: string,
  skip: number,
  limit: number
) => {
  const session = db.session();
  let query = `MATCH (r:Reference)-[:MENTIONS]->(a:Article{number: '${articleId}'}) `;
  if (searchTerm) {
    query += `WHERE toLower(r.context) CONTAINS '${searchTerm}'
    OR toLower(r.text) CONTAINS '${searchTerm}' `;
  }
  query += `RETURN DISTINCT r SKIP ${skip} LIMIT ${limit}`;
  try {
    const result = await session.run(query);
    const references = result.records.map((record) => {
      const reference = record.get("r").properties;
      return { ...reference };
    });
    return references;
  } catch (error) {
    throw error;
  }
};

export const getReferencesWithArticleCount = async (
  articleId: string,
  searchTerm: string
) => {
  const session = db.session();
  let query = `MATCH (r:Reference)-[:MENTIONS]->(a:Article{number: '${articleId}'}) `;
  if (searchTerm) {
    query += `WHERE toLower(r.context) CONTAINS '${searchTerm}'
    OR toLower(r.text) CONTAINS '${searchTerm}' `;
  }
  query += `RETURN COUNT(r) AS count`;
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
): string => {
  const cleanedFilter = _.pickBy(articleFilter, (value) => value !== undefined);
  const { skip = 0, limit = 10, searchTerm, ...filters } = cleanedFilter;
  const trimmedSearchTerm = searchTerm?.trim().toLowerCase();
  const extractedSearchTerm = trimmedSearchTerm?.match(/(\d+[a-zA-Z]?)/)?.[0];

  // Start the base query
  let query = filters.name
    ? "MATCH (a:Article)-[:IS_NAMED]->(n:Name) "
    : "MATCH (a:Article) ";

  let conditions: string[] = [];

  // Handle the case where no search term and no filters are provided
  if (!trimmedSearchTerm && _.isEmpty(filters)) {
    if (isCountQuery) {
      return `${query} RETURN COUNT(a) AS count`;
    } else {
      if (!filters.name) {
        query += "OPTIONAL MATCH (a)-[:IS_NAMED]->(n:Name) ";
      }
      return `${query} RETURN a, n.short AS name, elementId(a) AS elementId ORDER BY a.citing_cases DESC SKIP ${skip} LIMIT ${limit}`;
    }
  }

  // Handle search term or filters
  if (trimmedSearchTerm && _.isEmpty(filters)) {
    // Only search term, no filters
    if (extractedSearchTerm) {
      conditions.push(
        `a.number contains '${extractedSearchTerm}' OR toLower(a.text) CONTAINS '${trimmedSearchTerm}'`
      );
    } else {
      conditions.push(
        `a.number contains '${trimmedSearchTerm}' OR toLower(a.text) CONTAINS '${trimmedSearchTerm}'`
      );
    }
  } else {
    // Filters with or without search term
    if (filters.number) {
      if (extractedSearchTerm) {
        conditions.push(`a.number contains '${extractedSearchTerm}'`);
      } else {
        conditions.push(`a.number contains '${trimmedSearchTerm}'`);
      }
    }
    if (filters.text) {
      conditions.push(`toLower(a.text) CONTAINS '${trimmedSearchTerm}'`);
    }
  }

  // Add conditions to query if any exist
  if (conditions.length > 0) {
    query += `WHERE ${conditions.join(" OR ")} `;
  }

  // Add optional match for name if name filter is not provided
  if (!filters.name) {
    query += "OPTIONAL MATCH (a)-[:IS_NAMED]->(n:Name) ";
  }

  // Handle name filter
  if (filters.name) {
    if (trimmedSearchTerm && conditions.length === 0) {
      query += `WHERE toLower(n.short) CONTAINS '${trimmedSearchTerm}' `;
    } else if (trimmedSearchTerm && conditions.length > 0) {
      query += `OR toLower(n.short) CONTAINS '${trimmedSearchTerm}' `;
    }
  }

  // Finalize the query for count or result set
  if (isCountQuery) {
    query += "RETURN COUNT(a) AS count";
  } else {
    query += "RETURN a, n.short AS name, elementId(a) AS elementId ";
    query += `SKIP ${skip} LIMIT ${limit}`;
  }

  return query;
};
