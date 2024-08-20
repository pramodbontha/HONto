import { ICase } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CaseState {
  cases: ICase[];
  casesCount: number;
}

const initialState: CaseState = {
  cases: [],
  casesCount: 0,
};

const caseSlice = createSlice({
  name: "cases",
  initialState,
  reducers: {
    setCases: (state, action: PayloadAction<ICase[]>) => {
      state.cases = action.payload;
    },
    setCaseCount: (state, action: PayloadAction<number>) => {
      state.casesCount = action.payload;
    },
  },
});

export const { setCases, setCaseCount } = caseSlice.actions;

export const caseReducer = caseSlice.reducer;
