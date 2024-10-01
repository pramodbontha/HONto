import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CaseFilter, CitationsCases, ICase } from "@/types";

interface ArticleCaseFilter {
  articleId: string;
  searchTerm?: string;
  skip?: number;
  limit?: number;
}

export interface CitationsCaseFilter {
  caseId: string;
  searchTerm?: string;
  skip?: number;
  limit?: number;
}

export const caseApi = createApi({
  reducerPath: "caseApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://2dc5-2a02-8109-ba00-8100-641e-d0e6-124-c4b1.ngrok-free.app/",
  }),
  tagTypes: ["Case"],
  endpoints: (build) => ({
    getCases: build.query<ICase[], void>({
      query: () => "cases/",
      providesTags: ["Case"],
    }),
    FilteredCases: build.mutation<ICase[], CaseFilter>({
      query: (caseFilter) => ({
        url: `cases/search?searchTerm=${caseFilter.searchTerm}`,
        method: "POST",
        body: caseFilter,
      }),
    }),
    FilteredCasesCount: build.mutation<number, CaseFilter>({
      query: (caseFilter) => ({
        url: `cases/count?searchTerm=${caseFilter.searchTerm}`,
        method: "POST",
        body: caseFilter,
      }),
    }),
    casesCitingArticle: build.mutation<ICase[], ArticleCaseFilter>({
      query: ({ articleId, searchTerm, skip, limit }) => ({
        url: `articles/${articleId}/case`,
        method: "POST",
        body: { skip, limit, searchTerm },
      }),
    }),
    casesCitingArticleCount: build.query<number, ArticleCaseFilter>({
      query: ({ articleId, searchTerm }) => ({
        url: `articles/${articleId}/case/count`,
        method: "POST",
        body: { searchTerm },
      }),
    }),
    citedByCases: build.mutation<CitationsCases, CitationsCaseFilter>({
      query: ({ caseId, searchTerm, skip, limit }) => ({
        url: `cases/${caseId}/citedBy`,
        method: "POST",
        body: { skip, limit, searchTerm },
      }),
    }),
    citedByCasesCount: build.query<number, CitationsCaseFilter>({
      query: ({ caseId, searchTerm }) => ({
        url: `cases/${caseId}/citedBy/count`,
        method: "POST",
        body: { searchTerm },
      }),
    }),
    citingCases: build.mutation<CitationsCases, CitationsCaseFilter>({
      query: ({ caseId, searchTerm, skip, limit }) => ({
        url: `cases/${caseId}/citing`,
        method: "POST",
        body: { skip, limit, searchTerm },
      }),
    }),
    citingCasesCount: build.query<number, CitationsCaseFilter>({
      query: ({ caseId, searchTerm }) => ({
        url: `cases/${caseId}/citing/count`,
        method: "POST",
        body: { searchTerm },
      }),
    }),
    getDecisionTypes: build.query<string[], void>({
      query: () => "cases/decisions",
    }),
  }),
});

export const {
  useGetCasesQuery,
  useFilteredCasesMutation,
  useFilteredCasesCountMutation,
  useCasesCitingArticleMutation,
  useCitedByCasesMutation,
  useCitingCasesMutation,
  useGetDecisionTypesQuery,
  useLazyCasesCitingArticleCountQuery,
  useLazyCitedByCasesCountQuery,
  useLazyCitingCasesCountQuery,
} = caseApi;
