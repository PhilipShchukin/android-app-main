import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITemplateState } from "./types";

const initialState: ITemplateState = {
  boxTemplate: [],
  palletTemplate: []
};

const templatesSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    addBoxTemplate: (state, { payload }: PayloadAction<string[]>) => {
      state.boxTemplate = payload
    },
    addPalletTemplate: (state, { payload }: PayloadAction<string[]>) => {
      state.palletTemplate = payload
    },
    removeBoxTemplate: (state) => {
      state.boxTemplate = []
    },
    removePalletTemplate: (state) => {
      state.palletTemplate = []
    },
  },
});

export const { addBoxTemplate, addPalletTemplate, removeBoxTemplate, removePalletTemplate } =
  templatesSlice.actions;
export const templatesReducer = templatesSlice.reducer;

export default templatesSlice;
