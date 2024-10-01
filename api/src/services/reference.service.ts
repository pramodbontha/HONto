import { db, logger } from "@/config";
import { ReferenceFilter } from "@/types";
import _ from "lodash";

export const getFilteredReferences = async (searchTerm: string) => {
  const session = db.session();
  logger.info(`Searching for references with term: ${searchTerm}`);
  const splitString = searchTerm.split(" > ");

  // Remove the last element
  splitString.pop();

  // Join the remaining parts back together
  const nextToc = splitString.join(" > ");
  console.log(nextToc);
  try {
    const result = await session.run(
      `MATCH (n:Reference) 
         WHERE toLower(n.context) CONTAINS toLower($searchTerm)
         OR n.id = $searchTerm
          OR toLower(n.next_toc) CONTAINS toLower($nextToc)
         RETURN n`,
      { searchTerm, nextToc }
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
  console.log(query);
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

export const getResources = async () => {
  const session = db.session();
  try {
    const result = await session.run(
      `MATCH (n:Reference) 
         RETURN DISTINCT n.resource as resources`
    );
    const resources = result.records.map((record) => {
      return record.get("resources");
    });
    return resources;
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
  let conditions: string[] = [];
  let andConditions = [];

  const { skip, limit, searchTerm, ...filters } = cleanedFilter;

  const trimmedSearchTerm = referenceFilter.searchTerm?.trim();

  if (!trimmedSearchTerm && _.isEmpty(filters)) {
    // No search term provided, return the basic query
    return isCountQuery
      ? "MATCH (n:Reference) RETURN COUNT(n) AS count"
      : `MATCH (n:Reference) RETURN n SKIP ${referenceFilter.skip} LIMIT ${referenceFilter.limit}`;
  }

  if (_.isEmpty(filters) && trimmedSearchTerm) {
    const fieldsToSearch = ["n.resource", "n.text", "n.context"];
    conditions = _.map(
      fieldsToSearch,
      (field) => `toLower(${field}) CONTAINS toLower('${trimmedSearchTerm}')`
    );
  } else {
    if (cleanedFilter.refCasesArticles) {
      query += `OPTIONAL MATCH (n)-[:MENTIONS]->(a:Article) OPTIONAL MATCH (n)-[:MENTIONS]->(c:Case) `;
    }

    if (cleanedFilter.context) {
      conditions.push(
        `toLower(n.context) CONTAINS toLower('${trimmedSearchTerm}')`
      );
    }

    if (cleanedFilter.text) {
      conditions.push(
        `toLower(n.text) CONTAINS toLower('${trimmedSearchTerm}')`
      );
    }

    if (cleanedFilter.resources) {
      const resourcesCondition = cleanedFilter.resources
        .map((resource) => `'${resource.toLowerCase()}'`)
        .join(", ");
      andConditions.push(
        `any(res IN [${resourcesCondition}] WHERE toLower(n.resource) = res)`
      );
    }
  }

  if (conditions.length) {
    query += `WHERE ${conditions.join(" OR ")} `;
  } else {
    query += `WHERE toLower(n.context) CONTAINS toLower('${trimmedSearchTerm}') `;
  }

  if (andConditions.length > 0) {
    query += `AND ${andConditions.join(" AND ")} `;
  }

  if (isCountQuery) {
    query += "RETURN count(n) as count";
  } else {
    query += `RETURN n SKIP ${referenceFilter.skip} LIMIT ${referenceFilter.limit}`;
  }

  return query;
};
