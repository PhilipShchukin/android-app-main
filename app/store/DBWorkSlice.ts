// src/store/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDBWork, ISearchRes } from "./types";
import { SearchFrom } from "../API/types/types";

const initialState: IDBWork = {
  codeResponce: null,
  countInBox: null,
  selectedBoxNumber: null,
  currentBoxPage: 1,
  boxResponce: [],
  allBoxes: [],
  totalBoxes: 0,
  allPallets: [],
  totalPallets: 0,
  currentGtin: '',
  isRequest: false,
  from: null,
};

const DBWorkSlice = createSlice({
  name: "DBWork",
  initialState,
  reducers: {
    saveCodeRequest: (state, { payload }: PayloadAction<ISearchRes | null>) => {
      state.codeResponce = payload;
      state.selectedBoxNumber = payload?.box_number ? +payload?.box_number : null;
    },
    changeCountInBox: (state, { payload }: PayloadAction<number | null>) => {
      state.countInBox = payload;
    },
    changeBoxNumber: (state, { payload }: PayloadAction<number | null>) => {
      state.selectedBoxNumber = payload;
    },
    searhChangeBoxNumberPage: (state, { payload }: PayloadAction<number>) => {
      state.currentBoxPage = payload;
    },
    saveBoxRequest: (state, { payload }: PayloadAction<ISearchRes[]>) => {
      state.boxResponce = payload;
    },
    clearBoxRequest: (state) => { state.boxResponce = []; },
    saveAllBoxesRequest: (state, { payload }: PayloadAction<ISearchRes[]>) => {
      state.allBoxes = payload;
    },
    saveTotalBoxesCount: (state, { payload }: PayloadAction<number>) => {
      state.totalBoxes = +payload;
    },
    clearAllBoxRequest: (state) => { state.allBoxes = []; },
    saveAllPalletsRequest: (state, { payload }: PayloadAction<ISearchRes[]>) => {
      state.allPallets = payload;
    },
    saveTotalPalletCount: (state, { payload }: PayloadAction<number>) => {
      state.totalPallets = payload;
    },
    clearAllPalletRequest: (state) => { state.allPallets = []; },
    changeCurrentGtin: (state, { payload }: PayloadAction<string>) => {
      state.currentGtin = payload;
    },
    changeIsRequest: (state, { payload }: PayloadAction<boolean>) => {
      state.isRequest = payload;
    },
    changeFrom: (state, { payload }: PayloadAction<SearchFrom | null>) => {
      state.from = payload;
    },
  },
});

export const {
  saveCodeRequest,
  changeCountInBox,
  changeBoxNumber,
  searhChangeBoxNumberPage,
  saveBoxRequest,
  clearBoxRequest,
  saveAllBoxesRequest,
  saveTotalBoxesCount,
  clearAllBoxRequest,
  saveAllPalletsRequest,
  saveTotalPalletCount,
  clearAllPalletRequest,
  changeCurrentGtin,
  changeIsRequest,
  changeFrom,
} = DBWorkSlice.actions;
export const DBWorkReducer = DBWorkSlice.reducer;
export default DBWorkSlice;
