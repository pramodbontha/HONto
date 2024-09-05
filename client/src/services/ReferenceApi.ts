import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Reference, ReferenceFilter } from "@/types";
import { CitationsCaseFilter } from "./CaseApi";

interface ArticleReferenceFilter {
  articleId: string;
  searchTerm?: string;
  skip?: number;
  limit?: number;
}
export const referenceApi = createApi({
  reducerPath: "referencesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
  }),
  tagTypes: ["Reference"],
  endpoints: (build) => ({
    getReferences: build.query<Reference[], void>({
      query: () => "references/",
      providesTags: ["Reference"],
    }),
    getFilteredReferences: build.query<Reference[], string>({
      query: (filter) => ({
        url: `references/search`,
        method: "POST",
        body: { searchTerm: filter },
      }),
      providesTags: ["Reference"],
    }),
    FilteredReferencesCount: build.mutation<number, ReferenceFilter>({
      query: (filter) => {
        return {
          url: `references/count`,
          method: "POST",
          body: { ...filter, searchTerm: filter.searchTerm },
        };
      },
    }),
    FilteredReferencesWithQueries: build.mutation<Reference[], ReferenceFilter>(
      {
        query: (filter) => {
          return {
            url: `references/filter`,
            method: "POST",
            body: { ...filter, searchTerm: filter.searchTerm },
          };
        },
      }
    ),
    referencesWithArticle: build.mutation<Reference[], ArticleReferenceFilter>({
      query: ({ articleId, skip, limit, searchTerm }) => ({
        url: `articles/${articleId}/references`,
        method: "POST",
        body: { skip, limit, searchTerm },
      }),
    }),
    referencesWithArticleCount: build.query<number, ArticleReferenceFilter>({
      query: ({ articleId, searchTerm }) => ({
        url: `articles/${articleId}/references/count`,
        method: "POST",
        body: { searchTerm },
      }),
    }),
    referencesWithCase: build.mutation<Reference[], CitationsCaseFilter>({
      query: ({ caseId, searchTerm, skip, limit }) => ({
        url: `cases/${caseId}/references`,
        method: "POST",
        body: { skip, limit, searchTerm },
      }),
    }),
    referencesWithCaseCount: build.query<number, CitationsCaseFilter>({
      query: ({ caseId, searchTerm }) => ({
        url: `cases/${caseId}/references/count`,
        method: "POST",
        body: { searchTerm },
      }),
    }),
    getResources: build.query<string[], void>({
      query: () => "references/resources",
    }),
  }),
});

export const {
  useGetReferencesQuery,
  useLazyGetFilteredReferencesQuery,
  useFilteredReferencesWithQueriesMutation,
  useFilteredReferencesCountMutation,
  useReferencesWithArticleMutation,
  useReferencesWithCaseMutation,
  useGetResourcesQuery,
  useLazyReferencesWithArticleCountQuery,
  useLazyReferencesWithCaseCountQuery,
} = referenceApi;
