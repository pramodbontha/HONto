import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Reference, ReferenceFilter } from "@/types";

export const referenceApi = createApi({
  reducerPath: "referencesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/" }),
  tagTypes: ["Reference"],
  endpoints: (build) => ({
    getReferences: build.query<Reference[], void>({
      query: () => "references/",
      providesTags: ["Reference"],
    }),
    getFilteredReferences: build.query<Reference[], string>({
      query: (filter) => `references/search?searchTerm=${filter}`,
      providesTags: ["Reference"],
    }),
    FilteredReferencesCount: build.mutation<number, ReferenceFilter>({
      query: (filter) => ({
        url: `references/count?searchTerm=${filter.searchTerm}`,
        method: "POST",
        body: filter,
      }),
    }),
    FilteredReferencesWithQueries: build.mutation<Reference[], ReferenceFilter>(
      {
        query: (filter) => ({
          url: `references/filter?searchTerm=${filter.searchTerm}`,
          method: "POST",
          body: filter,
        }),
      }
    ),
  }),
});

export const {
  useGetReferencesQuery,
  useLazyGetFilteredReferencesQuery,
  useFilteredReferencesWithQueriesMutation,
  useFilteredReferencesCountMutation,
} = referenceApi;
