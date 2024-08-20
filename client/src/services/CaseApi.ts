import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CaseFilter, ICase } from "@/types";

export const caseApi = createApi({
  reducerPath: "caseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/" }),
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
  }),
});

export const {
  useGetCasesQuery,
  useFilteredCasesMutation,
  useFilteredCasesCountMutation,
} = caseApi;
