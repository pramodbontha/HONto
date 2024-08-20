import { db, logger } from "@/config";
import { ReferenceFilter } from "@/types";
import _ from "lodash";

export const getFilteredReferences = async (searchTerm: string) => {
  const session = db.session();
  logger.info(`Searching for references with term: ${searchTerm}`);
  try {
    const result = await session.run(
      `MATCH (n:Reference) 
         WHERE toLower(n.context) CONTAINS toLower($searchTerm)
         OR n.id = $searchTerm
         RETURN n LIMIT 100`,
      { searchTerm }
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

export const getFilteredReferencesWithQueries = async (
  referenceFilter: ReferenceFilter
) => {
  const session = db.session();
  logger.info(
    `Searching for references with term: ${referenceFilter.searchTerm}`
  );
  const query = prepareFilterQuery(referenceFilter, false);
  try {
    const result = await session.run(query);
    const references = result.records.map((record) => {
      const reference = record.get("n").properties;
      return { ...reference };
    });
    return references;
  } catch (error) {
    throw error;
  }
};

export const getFilteredReferencesCount = async (
  referenceFilter: ReferenceFilter
) => {
  const session = db.session();
  const query = prepareFilterQuery(referenceFilter, true);
  try {
    const result = await session.run(query);
    return result.records[0].get("count").low;
  } catch (error) {
    throw error;
  }
};

const prepareFilterQuery = (
  referenceFilter: ReferenceFilter,
  isCountQuery: boolean
) => {
  const cleanedFilter = _.pickBy(
    referenceFilter,
    (value) => value !== undefined
  );
  let query = "MATCH (n:Reference) ";
  let conditions = [];

  if (cleanedFilter.context) {
    conditions.push(
      `toLower(n.context) CONTAINS toLower('${referenceFilter.searchTerm}')`
    );
  }

  if (cleanedFilter.text) {
    conditions.push(
      `toLower(n.text) CONTAINS toLower('${referenceFilter.searchTerm}')`
    );
  }

  if (conditions.length) {
    query += `WHERE ${conditions.join(" OR ")} `;
  }

  if (!cleanedFilter.context && !cleanedFilter.text) {
    query += `WHERE toLower(n.text) CONTAINS toLower('${referenceFilter.searchTerm}')`;
  }

  if (isCountQuery) {
    query += "RETURN count(n) as count";
  } else {
    query += `RETURN n SKIP ${referenceFilter.skip} LIMIT ${referenceFilter.limit}`;
  }

  return query;
};
