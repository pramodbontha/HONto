import { db, logger } from "@/config";
import { CaseFilter } from "@/types";
import _ from "lodash";

export const getAllCases = async () => {
  const session = db.session();
  logger.info("Fetching all cases");
  try {
    const result = await session.run(
      "MATCH (c:Case)-[:IS_NAMED]->(n:Name) RETURN c, n.short AS caseName, elementId(c) AS elementId ORDER BY c.citing_cases DESC LIMIT 25"
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

export const getCasesCitingGivenCase = async (
  caseId: string,
  searchTerm: string,
  skip: number,
  limit: number
) => {
  const session = db.session();
  const tx = session.beginTransaction(); // Start a transaction

  logger.info(`Fetching cases citing case: ${caseId}`);

  // Query to calculate total count of cases with names
  let countQueryWithName = `
    MATCH (c:Case)-[:REFERS_TO]->(citedCase:Case {number: "${caseId}"})
    MATCH (c)-[:IS_NAMED]->(n:Name) 
  `;
  if (searchTerm) {
    countQueryWithName += `
      WHERE toLower(c.number) CONTAINS toLower('${searchTerm}')
      OR toLower(c.judgment) CONTAINS toLower('${searchTerm}')
      OR toLower(c.facts) CONTAINS toLower('${searchTerm}')
      OR toLower(c.reasoning) CONTAINS toLower('${searchTerm}')
      OR toLower(c.headnotes) CONTAINS toLower('${searchTerm}')
      OR toLower(c.year) CONTAINS toLower('${searchTerm}')
      OR toLower(c.decision_type) CONTAINS toLower('${searchTerm}')
      OR toLower(n.short) CONTAINS toLower('${searchTerm}')
    `;
  }
  countQueryWithName += `RETURN count(c) AS totalCountWithName`;

  // Query to calculate total count of cases without names
  let countQueryWithoutName = `
    MATCH (c:Case)-[:REFERS_TO]->(citedCase:Case {number: "${caseId}"})
    WHERE NOT (c)-[:IS_NAMED]->() 
  `;
  if (searchTerm) {
    countQueryWithoutName += `
      AND (toLower(c.number) CONTAINS toLower('${searchTerm}')
      OR toLower(c.judgment) CONTAINS toLower('${searchTerm}')
      OR toLower(c.facts) CONTAINS toLower('${searchTerm}')
      OR toLower(c.reasoning) CONTAINS toLower('${searchTerm}')
      OR toLower(c.headnotes) CONTAINS toLower('${searchTerm}')
      OR toLower(c.year) CONTAINS toLower('${searchTerm}')
      OR toLower(c.decision_type) CONTAINS toLower('${searchTerm}'))
    `;
  }
  countQueryWithoutName += `RETURN count(c) AS totalCountWithoutName`;

  // Query to get paginated results with names
  let queryWithName = `
    MATCH (c:Case)-[:REFERS_TO]->(citedCase:Case {number: "${caseId}"})
    MATCH (c)-[:IS_NAMED]->(n:Name) 
  `;
  if (searchTerm) {
    queryWithName += `
      WHERE toLower(c.number) CONTAINS toLower('${searchTerm}')
      OR toLower(c.judgment) CONTAINS toLower('${searchTerm}')
      OR toLower(c.facts) CONTAINS toLower('${searchTerm}')
      OR toLower(c.reasoning) CONTAINS toLower('${searchTerm}')
      OR toLower(c.headnotes) CONTAINS toLower('${searchTerm}')
      OR toLower(c.year) CONTAINS toLower('${searchTerm}')
      OR toLower(c.decision_type) CONTAINS toLower('${searchTerm}')
      OR toLower(n.short) CONTAINS toLower('${searchTerm}')
    `;
  }
  queryWithName += `
    RETURN c, n.short AS caseName, elementId(c) AS elementId
    ORDER BY c.citing_cases DESC
    SKIP ${skip} LIMIT ${limit}
  `;

  // Query to get paginated results without names
  let queryWithoutName = `
    MATCH (c:Case)-[:REFERS_TO]->(citedCase:Case {number: "${caseId}"})
    WHERE NOT (c)-[:IS_NAMED]->() 
  `;
  if (searchTerm) {
    queryWithoutName += `
      AND (toLower(c.number) CONTAINS toLower('${searchTerm}')
      OR toLower(c.judgment) CONTAINS toLower('${searchTerm}')
      OR toLower(c.facts) CONTAINS toLower('${searchTerm}')
      OR toLower(c.reasoning) CONTAINS toLower('${searchTerm}')
      OR toLower(c.headnotes) CONTAINS toLower('${searchTerm}')
      OR toLower(c.year) CONTAINS toLower('${searchTerm}')
      OR toLower(c.decision_type) CONTAINS toLower('${searchTerm}'))
    `;
  }
  queryWithoutName += `
    RETURN c, elementId(c) AS elementId
    ORDER BY c.citing_cases DESC
    SKIP ${skip} LIMIT ${limit}
  `;

  try {
    // Run count queries and paginated queries concurrently
    const [
      countWithNameResult,
      countWithoutNameResult,
      resultWithName,
      resultWithoutName,
    ] = await Promise.all([
      tx.run(countQueryWithName),
      tx.run(countQueryWithoutName),
      tx.run(queryWithName),
      tx.run(queryWithoutName),
    ]);

    // Extract the total counts
    const totalCountWithName =
      countWithNameResult.records[0].get("totalCountWithName").low || 0;
    const totalCountWithoutName =
      countWithoutNameResult.records[0].get("totalCountWithoutName").low || 0;

    // Process cases with names
    const casesWithName = resultWithName.records.map((record) => {
      const caseg = record.get("c").properties;
      const caseId = record.get("elementId");
      const caseName = record.get("caseName");
      return { ...caseg, id: caseId, caseName };
    });

    // Process cases without names
    const casesWithoutName = resultWithoutName.records.map((record) => {
      const caseg = record.get("c").properties;
      const caseId = record.get("elementId");
      return { ...caseg, id: caseId, caseName: null };
    });

    // Commit the transaction
    await tx.commit();

    // Combine the cases with and without names
    const combinedCases = [...casesWithName, ...casesWithoutName];

    // Combine the total counts
    const totalCount = totalCountWithName + totalCountWithoutName;

    return { cases: combinedCases, total: totalCount };
  } catch (error) {
    await tx.rollback(); // Rollback in case of error
    throw error;
  } finally {
    await session.close(); // Close the session
  }
};

// export const getCasesCitingGivenCase = async (
//   caseId: string,
//   searchTerm: string,
//   skip: number,
//   limit: number
// ) => {
//   const session = db.session();
//   logger.info(`Fetching cases citing case: ${caseId}`);
//   let query = `MATCH (c:Case)-[:REFERS_TO]->(citedCase:Case {number: "${caseId}"}) `;
//   if (searchTerm) {
//     query += `WHERE toLower(c.number) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.judgment) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.facts) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.reasoning) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.headnotes) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.year) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.decision_type) CONTAINS toLower('${searchTerm}') `;
//   }
//   query += `OPTIONAL MATCH (c:Case)-[:IS_NAMED]->(n:Name) `;
//   if (searchTerm) {
//     query += `WHERE toLower(n.short) CONTAINS toLower('${searchTerm}') `;
//   }
//   query += `WITH count(c) AS totalCount MATCH (c:Case)-[:REFERS_TO]->(citedCase:Case {number: "${caseId}"}) `;
//   if (searchTerm) {
//     query += `WHERE toLower(c.number) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.judgment) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.facts) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.reasoning) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.headnotes) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.year) CONTAINS toLower('${searchTerm}')
//     OR toLower(c.decision_type) CONTAINS toLower('${searchTerm}') `;
//   }
//   query += `OPTIONAL MATCH (c:Case)-[:IS_NAMED]->(n:Name)`;
//   if (searchTerm) {
//     query += `WHERE toLower(n.short) CONTAINS toLower('${searchTerm}') `;
//   }
//   query += `RETURN c, n.short AS caseName, elementId(c) AS elementId, totalCount ORDER BY c.citing_cases DESC  SKIP ${skip} LIMIT ${limit}`;
//   console.log(query);
//   try {
//     const result = await session.run(query);
//     if (result.records.length === 0) {
//       return { cases: [], total: 0 };
//     }
//     const cases = result.records.map((record) => {
//       const caseg = record.get("c").properties;
//       const caseId = record.get("elementId");
//       const caseName = record.get("caseName");
//       return { ...caseg, id: caseId, caseName };
//     });
//     const total = result.records[0].get("totalCount").low || 0;
//     return { cases, total };
//   } catch (error) {
//     throw error;
//   }
// };

export const getCasesCitingGivenCaseCount = async (
  caseId: string,
  searchTerm: string
) => {
  const session = db.session();
  logger.info(`Fetching cases citing case: ${caseId}`);
  let query = `MATCH (c:Case)-[:REFERS_TO]->(citedCase:Case {number: "${caseId}"}) `;
  query += `OPTIONAL MATCH (c:Case)-[:IS_NAMED]->(n:Name)`;
  query += `RETURN count(c) AS count`;
  try {
    const result = await session.run(query);
    return result.records[0].get("count").low;
  } catch (error) {
    throw error;
  }
};

export const getCaseCitingOtherCases = async (
  caseId: string,
  searchTerm: string,
  skip: number,
  limit: number
) => {
  const session = db.session();
  const tx = session.beginTransaction(); // Start a transaction

  logger.info(`Fetching cases citing case: ${caseId}`);

  // Query to calculate total count of cases with names
  let countQueryWithName = `
    MATCH (c:Case {number: "${caseId}"})-[:REFERS_TO]->(citedCase:Case)
    MATCH (citedCase)-[:IS_NAMED]->(n:Name) 
  `;
  if (searchTerm) {
    countQueryWithName += `
      WHERE toLower(citedCase.number) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.judgment) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.facts) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.reasoning) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.headnotes) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.year) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.decision_type) CONTAINS toLower('${searchTerm}')
      OR toLower(n.short) CONTAINS toLower('${searchTerm}')
    `;
  }
  countQueryWithName += `RETURN count(citedCase) AS totalCountWithName`;

  // Query to calculate total count of cases without names
  let countQueryWithoutName = `
    MATCH (c:Case {number: "${caseId}"})-[:REFERS_TO]->(citedCase:Case) 
    WHERE NOT (citedCase)-[:IS_NAMED]->() 
  `;
  if (searchTerm) {
    countQueryWithoutName += `
      AND (toLower(citedCase.number) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.judgment) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.facts) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.reasoning) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.headnotes) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.year) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.decision_type) CONTAINS toLower('${searchTerm}'))
    `;
  }
  countQueryWithoutName += `RETURN count(citedCase) AS totalCountWithoutName`;

  // Query to get paginated results with names
  let queryWithName = `
    MATCH (c:Case {number: "${caseId}"})-[:REFERS_TO]->(citedCase:Case) 
    MATCH (citedCase)-[:IS_NAMED]->(n:Name) 
  `;
  if (searchTerm) {
    queryWithName += `
      WHERE toLower(citedCase.number) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.judgment) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.facts) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.reasoning) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.headnotes) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.year) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.decision_type) CONTAINS toLower('${searchTerm}')
      OR toLower(n.short) CONTAINS toLower('${searchTerm}')
    `;
  }
  queryWithName += `
    RETURN citedCase, n.short AS caseName, elementId(citedCase) AS elementId
    ORDER BY citedCase.citing_cases DESC
    SKIP ${skip} LIMIT ${limit}
  `;

  // Query to get paginated results without names
  let queryWithoutName = `
    MATCH (c:Case {number: "${caseId}"})-[:REFERS_TO]->(citedCase:Case) 
    WHERE NOT (citedCase)-[:IS_NAMED]->() 
  `;
  if (searchTerm) {
    queryWithoutName += `
      AND (toLower(citedCase.number) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.judgment) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.facts) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.reasoning) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.headnotes) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.year) CONTAINS toLower('${searchTerm}')
      OR toLower(citedCase.decision_type) CONTAINS toLower('${searchTerm}'))
    `;
  }
  queryWithoutName += `
    RETURN citedCase, elementId(citedCase) AS elementId
    ORDER BY citedCase.citing_cases DESC
    SKIP ${skip} LIMIT ${limit}
  `;

  try {
    // Run count queries and paginated queries concurrently
    const [
      countWithNameResult,
      countWithoutNameResult,
      resultWithName,
      resultWithoutName,
    ] = await Promise.all([
      tx.run(countQueryWithName),
      tx.run(countQueryWithoutName),
      tx.run(queryWithName),
      tx.run(queryWithoutName),
    ]);

    // Extract the total counts
    const totalCountWithName =
      countWithNameResult.records[0].get("totalCountWithName").low || 0;
    const totalCountWithoutName =
      countWithoutNameResult.records[0].get("totalCountWithoutName").low || 0;

    // Process cases with names
    const casesWithName = resultWithName.records.map((record) => {
      const caseg = record.get("citedCase").properties;
      const caseId = record.get("elementId");
      const caseName = record.get("caseName");
      return { ...caseg, id: caseId, caseName };
    });

    // Process cases without names
    const casesWithoutName = resultWithoutName.records.map((record) => {
      const caseg = record.get("citedCase").properties;
      const caseId = record.get("elementId");
      return { ...caseg, id: caseId, caseName: null };
    });

    // Commit the transaction
    await tx.commit();

    // Combine the cases with and without names
    const combinedCases = [...casesWithName, ...casesWithoutName];

    // Combine the total counts
    const totalCount = totalCountWithName + totalCountWithoutName;

    return { cases: combinedCases, total: totalCount };
  } catch (error) {
    await tx.rollback(); // Rollback in case of error
    throw error;
  } finally {
    await session.close(); // Close the session
  }
};

// export const getCaseCitingOtherCases = async (
//   caseId: string,
//   searchTerm: string,
//   skip: number,
//   limit: number
// ) => {
//   const session = db.session();
//   logger.info(`Fetching cases cited by case: ${caseId}`);
//   let query = `MATCH (c:Case {number: "${caseId}"})-[:REFERS_TO]->(citedCase:Case) `;
//   if (searchTerm) {
//     query += `WHERE toLower(citedCase.number) CONTAINS toLower('${searchTerm}')
//     OR toLower(citedCase.judgment) CONTAINS toLower('${searchTerm}')
//     OR toLower(citedCase.facts) CONTAINS toLower('${searchTerm}')
//     OR toLower(citedCase.reasoning) CONTAINS toLower('${searchTerm}')
//     OR toLower(citedCase.headnotes) CONTAINS toLower('${searchTerm}')
//     OR toLower(citedCase.year) CONTAINS toLower('${searchTerm}')
//     OR toLower(citedCase.decision_type) CONTAINS toLower('${searchTerm}') `;
//   }
//   query += `OPTIONAL MATCH (citedCase)-[:IS_NAMED]->(n:Name)`;
//   if (searchTerm) {
//     query += `WHERE toLower(n.short) CONTAINS toLower('${searchTerm}') `;
//   }
//   query += `RETURN citedCase,n.short AS caseName, elementId(citedCase) AS elementId SKIP ${skip} LIMIT ${limit}`;
//   try {
//     const result = await session.run(query);
//     const cases = result.records.map((record) => {
//       const caseg = record.get("citedCase").properties;
//       const caseId = record.get("elementId");
//       const caseName = record.get("caseName");
//       return { ...caseg, id: caseId, caseName };
//     });
//     return cases;
//   } catch (error) {
//     throw error;
//   }
// };

export const getCaseCitingOtherCasesCount = async (
  caseId: string,
  searchTerm: string
) => {
  const session = db.session();
  logger.info(`Fetching cases cited by case: ${caseId}`);
  let query = `MATCH (c:Case {number: "${caseId}"})-[:REFERS_TO]->(citedCase:Case) `;

  query += `OPTIONAL MATCH (citedCase)-[:IS_NAMED]->(n:Name) `;

  query += `RETURN count(citedCase) AS count`;
  try {
    const result = await session.run(query);
    return result.records[0].get("count").low;
  } catch (error) {
    throw error;
  }
};

export const getCaseCitingArticles = async (
  caseId: string,
  searchTerm: string,
  skip: number,
  limit: number
) => {
  const session = db.session();
  logger.info(`Fetching articles cited by case: ${caseId}`);
  let query = `MATCH (c:Case {number: "${caseId}"})-[:REFERS_TO]->(a:Article) `;
  if (searchTerm) {
    query += `WHERE toLower(a.number) CONTAINS toLower('${searchTerm}') 
    OR toLower(a.text) CONTAINS toLower('${searchTerm}') `;
  }
  query += `OPTIONAL MATCH (a)-[:IS_NAMED]->(n:Name)`;
  if (searchTerm) {
    query += `WHERE toLower(n.short) CONTAINS toLower('${searchTerm}') `;
  }
  query += `RETURN a, n.short AS articleName, elementId(a) AS elementId SKIP ${skip} LIMIT ${limit}`;
  try {
    const result = await session.run(query);
    const articles = result.records.map((record) => {
      const article = record.get("a").properties;
      const articleId = record.get("elementId");
      const name = record.get("articleName");
      return { ...article, id: articleId, name };
    });
    return articles;
  } catch (error) {
    throw error;
  }
};

export const getCaseCitingArticlesCount = async (
  caseId: string,
  searchTerm: string
) => {
  const session = db.session();
  logger.info(`Fetching articles cited by case: ${caseId}`);
  let query = `MATCH (c:Case {number: "${caseId}"})-[:REFERS_TO]->(a:Article) `;
  if (searchTerm) {
    query += `WHERE toLower(a.number) CONTAINS toLower('${searchTerm}') 
    OR toLower(a.text) CONTAINS toLower('${searchTerm}') `;
  }
  query += `OPTIONAL MATCH (a)-[:IS_NAMED]->(n:Name)`;
  if (searchTerm) {
    query += `WHERE toLower(n.short) CONTAINS toLower('${searchTerm}') `;
  }
  query += `RETURN count(a) AS count`;
  try {
    const result = await session.run(query);
    return result.records[0].get("count").low;
  } catch (error) {
    throw error;
  }
};

export const getReferencesWithGivenCase = async (
  caseId: string,
  searchTerm: string,
  skip: number,
  limit: number
) => {
  const session = db.session();
  logger.info(`Fetching references for case: ${caseId}`);
  let query = `MATCH (r:Reference)-[:MENTIONS]->(c:Case {number: "${caseId}"}) `;
  if (searchTerm) {
    query += `WHERE toLower(r.context) CONTAINS toLower('${searchTerm}') 
    OR toLower(r.text) CONTAINS toLower('${searchTerm}') `;
  }
  query += `RETURN r SKIP ${skip} LIMIT ${limit}`;
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

export const getReferencesWithGivenCaseCount = async (
  caseId: string,
  searchTerm: string
) => {
  const session = db.session();
  logger.info(`Fetching references for case: ${caseId}`);
  let query = `MATCH (r:Reference)-[:MENTIONS]->(c:Case {number: "${caseId}"}) `;
  if (searchTerm) {
    query += `WHERE toLower(r.context) CONTAINS toLower('${searchTerm}') 
    OR toLower(r.text) CONTAINS toLower('${searchTerm}') `;
  }
  query += `RETURN count(r) AS count`;
  try {
    const result = await session.run(query);
    return result.records[0].get("count").low;
  } catch (error) {
    throw error;
  }
};

export const getDecisionTypes = async () => {
  const session = db.session();
  try {
    const result = await session.run(
      "MATCH (c:Case) RETURN DISTINCT c.decision_type AS decisionType"
    );
    const decisionTypes = result.records.map((record) => {
      return record.get("decisionType");
    });
    return decisionTypes;
  } catch (error) {
    throw error;
  }
};

const prepareFilterQuery = (
  caseFilter: CaseFilter,
  isCountQuery: boolean
): string => {
  const cleanedFilter = _.pickBy(caseFilter, (value) => value !== undefined);
  const { skip = 0, limit = 10, searchTerm, ...filters } = cleanedFilter;
  const trimmedSearchTerm = searchTerm?.trim().toLowerCase();

  let query = filters.name
    ? "MATCH (c:Case)-[:IS_NAMED]->(n:Name) "
    : "MATCH (c:Case) ";

  let conditions: string[] = [];
  let andConditions: string[] = [];

  // Search term fields
  const fieldsToSearch = [
    "c.number",
    "c.judgment",
    "c.facts",
    "c.reasoning",
    "c.headnotes",
    "c.year",
    "c.decision_type",
  ];

  // If no filters are provided but a search term exists
  if (_.isEmpty(filters) && trimmedSearchTerm) {
    conditions = fieldsToSearch.map(
      (field) => `toLower(${field}) CONTAINS toLower('${trimmedSearchTerm}')`
    );
  } else {
    // Apply filters
    if (filters.number) {
      conditions.push(
        `toLower(c.number) CONTAINS toLower('${trimmedSearchTerm}')`
      );
    }
    if (filters.judgment) {
      conditions.push(
        `toLower(c.judgment) CONTAINS toLower('${trimmedSearchTerm}')`
      );
    }
    if (filters.facts) {
      conditions.push(
        `toLower(c.facts) CONTAINS toLower('${trimmedSearchTerm}')`
      );
    }
    if (filters.reasoning) {
      conditions.push(
        `toLower(c.reasoning) CONTAINS toLower('${trimmedSearchTerm}')`
      );
    }
    if (filters.headnotes) {
      conditions.push(
        `toLower(c.headnotes) CONTAINS toLower('${trimmedSearchTerm}')`
      );
    }
  }

  // Handle additional conditions for year and decision type
  if (filters.startYear) {
    andConditions.push(
      `toInteger(c.year) >= toInteger(${caseFilter.startYear})`
    );
  }

  if (filters.endYear) {
    andConditions.push(`toInteger(c.year) <= toInteger(${caseFilter.endYear})`);
  }

  if (filters.decisionType) {
    const decisionTypeCondition = filters.decisionType
      .map((type) => `'${type.toLowerCase()}'`)
      .join(", ");
    andConditions.push(
      `any(type IN [${decisionTypeCondition}] WHERE toLower(c.decision_type) = type)`
    );
  }

  // Combine conditions
  if (conditions.length > 0) {
    query += `WHERE (${conditions.join(" OR ")}) `;
  }

  if (andConditions.length > 0) {
    query +=
      conditions.length > 0
        ? `AND (${andConditions.join(" AND ")}) `
        : `WHERE ${andConditions.join(" AND ")} `;
  }

  // Add OPTIONAL MATCH when no name filter is provided
  if (!filters.name) {
    query += `OPTIONAL MATCH (c)-[:IS_NAMED]->(n:Name) `;
  }

  // Handle name filter
  if (filters.name) {
    if (
      trimmedSearchTerm &&
      conditions.length === 0 &&
      andConditions.length === 0
    ) {
      query += `WHERE toLower(n.short) CONTAINS '${trimmedSearchTerm}' `;
    } else if (
      trimmedSearchTerm &&
      conditions.length > 0 &&
      andConditions.length > 0
    ) {
      query += `OR toLower(n.short) CONTAINS '${trimmedSearchTerm}' `;
    }
  }

  // Final query for count or data
  if (isCountQuery) {
    query += "RETURN count(c) AS count";
  } else {
    query += "RETURN c, n.short AS caseName, elementId(c) AS elementId ";
    query += `SKIP ${skip} LIMIT ${limit}`;
  }

  return query;
};
