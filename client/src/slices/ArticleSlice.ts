import { Article } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ArticleState {
  articles: Article[];
  articlesCount: number;
}

const initialState: ArticleState = {
  articles: [],
  articlesCount: 0,
};

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
    setArticleCount: (state, action: PayloadAction<number>) => {
      state.articlesCount = action.payload;
    },
  },
});

export const { setArticles, setArticleCount } = articleSlice.actions;

export const articleReducer = articleSlice.reducer;
