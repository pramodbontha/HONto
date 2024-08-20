import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Article, ArticleFilter } from "@/types";

export const articleApi = createApi({
  reducerPath: "articlesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/" }),
  tagTypes: ["Article"],
  endpoints: (build) => ({
    getArticles: build.query<Article[], void>({
      query: () => "articles/",
      providesTags: ["Article"],
    }),
    filteredArticles: build.mutation<Article[], ArticleFilter>({
      query: ({ searchTerm, number, text, skip, limit }) => ({
        url: `articles/search?searchTerm=${searchTerm}`,
        method: "POST",
        body: { number, text, skip, limit },
      }),
    }),
    filteredArticlesCount: build.mutation<number, ArticleFilter>({
      query: ({ searchTerm, number, text, skip, limit }) => ({
        url: `articles/count?searchTerm=${searchTerm}`,
        method: "POST",
        body: { number, text, skip, limit },
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useFilteredArticlesMutation,
  useFilteredArticlesCountMutation,
} = articleApi;
