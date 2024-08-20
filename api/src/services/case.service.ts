import { db, logger } from "@/config";
import { CaseFilter } from "@/types";
import _ from "lodash";

export const getAllCases = async () => {
  const session = db.session();
  logger.info("Fetching all cases");
  try {
    const result = await session.run(
      "MATCH (c:Case)-[:IS_NAMED]->(n:Name) RETURN c, n.short AS caseName, elementId(c) AS elementId ORDER BY c.total_case_citations DESC LIMIT 10"
    );
    const cases = result.records.map((record) => {
      const caseg = record.get("c").properties;
      const caseId = record.get("elementId");
      const caseName = record.get("caseName");
      return { ...caseg, id: caseId, caseName };
    });
    return cases;
  } catch (error) {
    throw error;
  }
};

export const getFilteredCases = async (caseFilter: CaseFilter) => {
  const session = db.session();
  logger.info(`Searching for cases with term: ${caseFilter.searchTerm}`);
  const query = prepareFilterQuery(caseFilter, false);
  console.log(query);
  try {
    const result = await session.run(query);
    const cases = result.records.map((record) => {
      const caseg = record.get("c").properties;
      const caseId = record.get("elementId");
      const caseName = record.get("caseName");
      return { ...caseg, id: caseId, caseName };
    });
    return cases;
  } catch (error) {
    throw error;
  }
};

export const getFilteredCasesCount = async (caseFilter: CaseFilter) => {
  const session = db.session();
  const query = prepareFilterQuery(caseFilter, true);
  console.log(query);
  try {
    const result = await session.run(query);
    console.log(result.records[0].get("count").low);
    return result.records[0].get("count").low;
  } catch (error) {
    throw error;
  }
};

const prepareFilterQuery = (caseFilter: CaseFilter, isCountQuery: boolean) => {
  const cleanedFilter = _.pickBy(caseFilter, (value) => value !== undefined);
  let query = "MATCH (c:Case) -[:IS_NAMED]->(n:Name) ";
  let conditions = [];
  let andConditions = [];

  if (cleanedFilter.name) {
    conditions.push(
      `toLower(n.short) CONTAINS toLower('${caseFilter.searchTerm}')`
    );
  }

  if (cleanedFilter.number) {
    conditions.push(
      `toLower(c.number) CONTAINS toLower('${caseFilter.searchTerm}')`
    );
  }
  if (cleanedFilter.judgment) {
    conditions.push(
      `toLower(c.judgment) CONTAINS toLower('${caseFilter.searchTerm}')`
    );
  }
  if (cleanedFilter.facts) {
    conditions.push(
      `toLower(c.facts) CONTAINS toLower('${caseFilter.searchTerm}')`
    );
  }
  if (cleanedFilter.reasoning) {
    conditions.push(
      `toLower(c.reasoning) CONTAINS toLower('${caseFilter.searchTerm}')`
    );
  }
  if (cleanedFilter.headnotes) {
    conditions.push(
      `toLower(c.headnotes) CONTAINS toLower('${caseFilter.searchTerm}')`
    );
  }

  if (cleanedFilter.startYear) {
    andConditions.push(
      `toInteger(c.year) >= toInteger(${caseFilter.startYear})`
    );
  }

  if (cleanedFilter.endYear) {
    andConditions.push(`toInteger(c.year) <= toInteger(${caseFilter.endYear})`);
  }

  if (conditions.length > 0) {
    query += `WHERE (${conditions.join(" OR ")}) `;
  }

  if (andConditions.length > 0) {
    if (conditions.length > 0) {
      query += `AND (${andConditions.join(" AND ")}) `;
    } else {
      query += `WHERE ${andConditions.join(" AND ")} `;
    }
  }

  if (
    conditions.length === 0 &&
    andConditions.length === 0 &&
    caseFilter.searchTerm
  ) {
    query += `WHERE toLower(n.short) CONTAINS toLower('${caseFilter.searchTerm}') `;
  }

  if (isCountQuery) {
    query += "RETURN count(c) AS count";
  } else {
    query += "RETURN c, n.short AS caseName, elementId(c) AS elementId ";
    query += `SKIP ${caseFilter.skip} LIMIT ${caseFilter.limit}`;
  }

  return query;
};
