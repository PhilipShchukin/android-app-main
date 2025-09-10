// src/store/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getJSONNomList } from "./helper";
import { IJsonNState } from "./types";

const initialState: IJsonNState = {
  selectedFileName: "",
  jsonFiles: [],
  selectedFileContent: [],
  selectedAllFileContent: null,
};

const nomenclatureJsonSlice = createSlice({
  name: "nomenclatureJson",
  initialState,
  reducers: {
    saveNJsonFile: (
      state,
      action: PayloadAction<{ filename: string; data: any }>
    ) => {
      const { data, filename } = action.payload;
      state.selectedFileName = filename;
      state.selectedAllFileContent = data;
      state.selectedFileContent = getJSONNomList(data);
    },
    saveNJsonFiles: (state, { payload }: PayloadAction<string[]>) => {
      state.jsonFiles = payload;
    },
    deleteNJsonFile: (state, { payload }: PayloadAction<string>) => {
      state.jsonFiles = state.jsonFiles.filter(
        (file) => file !== payload
      );
      state.selectedFileName = "";
      state.selectedFileContent = [];
      state.selectedAllFileContent = null;
    },
  },
});

export const { saveNJsonFile, saveNJsonFiles, deleteNJsonFile } =
  nomenclatureJsonSlice.actions;
export const nomenclatureJsonReducer = nomenclatureJsonSlice.reducer;

export default nomenclatureJsonSlice;
