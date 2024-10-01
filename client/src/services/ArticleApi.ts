import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Article, ArticleFilter } from "@/types";

interface ArticleCitationFilter {
  articleId: string;
  searchTerm?: string;
  skip?: number;
  limit?: number;
}

interface CaseCitingArticlesFilter {
  caseId: string;
  searchTerm?: string;
  skip?: number;
  limit?: number;
}

export const articleApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://2dc5-2a02-8109-ba00-8100-641e-d0e6-124-c4b1.ngrok-free.app/",
  }),
  tagTypes: ["Article"],
  endpoints: (build) => ({
    getArticles: build.query<Article[], void>({
      query: () => "articles/",
      providesTags: ["Article"],
    }),
    filteredArticles: build.mutation<Article[], ArticleFilter>({
      query: ({ searchTerm, name, number, text, skip, limit }) => ({
        url: `articles/search?searchTerm=${searchTerm}`,
        method: "POST",
        body: { name, number, text, skip, limit },
      }),
    }),
    filteredArticlesCount: build.mutation<number, ArticleFilter>({
      query: ({ searchTerm, name, number, text, skip, limit }) => ({
        url: `articles/count?searchTerm=${searchTerm}`,
        method: "POST",
        body: { name, number, text, skip, limit },
      }),
    }),
    citedByArticles: build.mutation<Article[], ArticleCitationFilter>({
      query: ({ articleId, searchTerm, skip, limit }) => ({
        url: `articles/${articleId}/citedBy`,
        method: "POST",
        body: { skip, limit, searchTerm },
      }),
    }),
    citedByArticlesCount: build.query<number, ArticleCitationFilter>({
      query: ({ articleId, searchTerm }) => ({
        url: `articles/${articleId}/citedBy/count`,
        method: "POST",
        body: { searchTerm },
      }),
    }),
    articleCitingOtherArticles: build.mutation<
      Article[],
      ArticleCitationFilter
    >({
      query: ({ articleId, searchTerm, skip, limit }) => ({
        url: `articles/${articleId}/citing`,
        method: "POST",
        body: { skip, limit, searchTerm },
      }),
    }),
    articleCitingOtherArticlesCount: build.query<number, ArticleCitationFilter>(
      {
        query: ({ articleId, searchTerm }) => ({
          url: `articles/${articleId}/citing/count`,
          method: "POST",
          body: { searchTerm },
        }),
      }
    ),
    articlesCitingCase: build.mutation<Article[], CaseCitingArticlesFilter>({
      query: ({ caseId, skip, limit }) => ({
        url: `cases/${caseId}/articles`,
        method: "POST",
        body: { skip, limit },
      }),
    }),
    articlesCitingCaseCount: build.query<number, CaseCitingArticlesFilter>({
      query: ({ caseId, searchTerm }) => ({
        url: `cases/${caseId}/articles/count`,
        method: "POST",
        body: { searchTerm },
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useFilteredArticlesMutation,
  useFilteredArticlesCountMutation,
  useCitedByArticlesMutation,
  useArticleCitingOtherArticlesMutation,
  useArticlesCitingCaseMutation,
  useLazyCitedByArticlesCountQuery,
  useLazyArticleCitingOtherArticlesCountQuery,
  useLazyArticlesCitingCaseCountQuery,
} = articleApi;
