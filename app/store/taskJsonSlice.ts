// src/store/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IJsonTaskState } from "./types";

const initialState: IJsonTaskState = {
  selectedFileName: "",
  jsonFiles: [],
  selectedFileContent: null,
};

const taskJsonSlice = createSlice({
  name: "taskJson",
  initialState,
  reducers: {
    saveTaskJsonFile: (
      state,
      action: PayloadAction<{ filename: string; data: any }>
    ) => {
      const { data, filename } = action.payload;
      state.selectedFileName = filename;
      state.selectedFileContent = data;
    },
    saveTaskJsonFiles: (state, { payload }: PayloadAction<string[]>) => {
      state.jsonFiles = payload;
    },
    saveTaskFileName: (state, { payload }: PayloadAction<string>) => {
      state.selectedFileName = payload;
    },
    deleteTaskJsonFile: (state, { payload }: PayloadAction<string>) => {
      state.jsonFiles = state.jsonFiles.filter(
        (file) => file !== payload
      );
      state.selectedFileName = "";
      state.selectedFileContent = [];
    },
  },
});

export const { saveTaskJsonFile, saveTaskJsonFiles, deleteTaskJsonFile, saveTaskFileName } =
  taskJsonSlice.actions;
export const taskJsonReducer = taskJsonSlice.reducer;

export default taskJsonSlice;
