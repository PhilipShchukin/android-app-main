// src/store/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { formatRecordJsonToReadableList } from "./helper";
import { IOldSorting, ISearchRes } from "./types";

const initialState: IOldSorting = {
  selectedFileName: "",
  jsonFiles: [],
  selectedAllFileContent: null,
  selectedFileContent: '',
  selectedFileContentBoxLimit: null,
  allBoxes: [],
  totalBoxesCount: 0,
  selectedBoxNumber: null,
  allPallets: [],
  totalPalletsCount: 0,
  selectedPalletNumber: null,
};

const oldSortingSlice = createSlice({
  name: "oldSorting",
  initialState,
  reducers: {
    saveOldSortingFile: (state, { payload }: PayloadAction<any>) => {
      const { data, filename } = payload;
      state.selectedFileName = filename;
      state.selectedFileContent = formatRecordJsonToReadableList(data);
      state.selectedAllFileContent = data;
      state.selectedFileContentBoxLimit = +data.pieces_per_package;
    },
    saveOldSortingFiles: (state, { payload }: PayloadAction<string[]>) => {
      state.jsonFiles = payload;
    },
    saveOldBoxes: (state, { payload }: PayloadAction<any[]>) => {
      state.allBoxes = payload;
    },
    saveOldBoxesCount: (state, { payload }: PayloadAction<number>) => {
      state.totalBoxesCount = +payload;
    },
    changeSelectedOldBoxNumber: (state, { payload }: PayloadAction<number | null>) => {
      state.selectedBoxNumber = payload;
    },
    saveOldPallets: (state, { payload }: PayloadAction<any[]>) => {
      state.allPallets = payload;
    },
    saveOldPalletCount: (state, { payload }: PayloadAction<number>) => {
      state.totalPalletsCount = +payload;
    },
    changeSelectedOldPalletNumber: (state, { payload }: PayloadAction<number | null>) => {
      state.selectedPalletNumber = payload;
    },
    deleteOldSortingFile: (state, { payload }: PayloadAction<string>) => {
      state.jsonFiles = state.jsonFiles.filter(
        (file) => file !== payload
      );
      state.selectedFileName = "";
      state.selectedFileContent = '';
    },
  },
});

export const {
  saveOldSortingFile,
  saveOldSortingFiles,
  deleteOldSortingFile,
  saveOldBoxes,
  changeSelectedOldBoxNumber,
  saveOldBoxesCount,
  saveOldPallets,
  changeSelectedOldPalletNumber,
  saveOldPalletCount
} = oldSortingSlice.actions;
export const oldSortingReducer = oldSortingSlice.reducer;
export default oldSortingSlice;
