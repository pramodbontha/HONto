import { Reference } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ReferenceState {
  references: Reference[];
  referencesCount: number;
}

const initialState: ReferenceState = {
  references: [],
  referencesCount: 0,
};

const referenceSlice = createSlice({
  name: "references",
  initialState,
  reducers: {
    setReferences: (state, action: PayloadAction<Reference[]>) => {
      state.references = action.payload;
    },

    setReferenceCount: (state, action: PayloadAction<number>) => {
      state.referencesCount = action.payload;
    },
  },
});

export const { setReferences, setReferenceCount } = referenceSlice.actions;

export const referenceReducer = referenceSlice.reducer;
