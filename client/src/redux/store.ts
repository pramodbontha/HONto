import { articleApi } from "@/services/ArticleApi";
import { bookApi } from "@/services/BookApi";
import { caseApi } from "@/services/CaseApi";
import { referenceApi } from "@/services/ReferenceApi";
import { articleReducer } from "@/slices/ArticleSlice";
import { caseReducer } from "@/slices/CaseSlice";
import { formReducer } from "@/slices/FormSlice";
import { languageReducer } from "@/slices/LanguageSlice";
import { referenceReducer } from "@/slices/ReferenceSlice";
import { searchBarReducer } from "@/slices/SearchBarSlice";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [articleApi.reducerPath]: articleApi.reducer,
    [caseApi.reducerPath]: caseApi.reducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [referenceApi.reducerPath]: referenceApi.reducer,
    articles: articleReducer,
    cases: caseReducer,
    references: referenceReducer,
    searchBar: searchBarReducer,
    form: formReducer,
    language: languageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      articleApi.middleware,
      caseApi.middleware,
      bookApi.middleware,
      referenceApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
