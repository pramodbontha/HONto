import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Book } from "@/types";

export const bookApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://2dc5-2a02-8109-ba00-8100-641e-d0e6-124-c4b1.ngrok-free.app/",
  }),
  tagTypes: ["Book"],
  endpoints: (build) => ({
    getBooks: build.query<Book[], void>({
      query: () => "books/",
      providesTags: ["Book"],
    }),
    getFilteredBooks: build.query<Book[], string>({
      query: (filter) => `books/search?searchTerm=${filter}`,
      providesTags: ["Book"],
    }),
    getPathTillParent: build.query<Book[], string>({
      query: (bookId) => `books/${bookId}`,
      providesTags: ["Book"],
    }),
    getSectionsInToc: build.query<Book[], string>({
      query: (bookId) => `books/${bookId}/sections`,
      providesTags: ["Book"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetSectionsInTocQuery,
  useLazyGetFilteredBooksQuery,
  useLazyGetPathTillParentQuery,
  useLazyGetSectionsInTocQuery,
} = bookApi;
