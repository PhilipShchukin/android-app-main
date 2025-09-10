// src/store/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChangeCount, IMonitoring } from "./types";

const initialState: IMonitoring = {
  isMonitoring: false,
  isOldMonitoring: false,
  isSorting: false,
  isPause: false,
  isUnfinishedTask: false,
  taskName: '',
  countProduct: 0,
  productsInCurrentBox: 0,
  boxesInCurrentPallet: 0,
  currentBoxNumber: 0,
  currentPalletNumber: 0,
  countBox: 0,
  countPallet: 0,
};

const monitoringSlice = createSlice({
  name: "monitoring",
  initialState,
  reducers: {
    changeMonitoringStatus: (state, { payload }: PayloadAction<boolean>) => {
      state.isMonitoring = payload;
      state.isSorting = state.isMonitoring || state.isOldMonitoring;
    },
    changeOldMonitoringStatus: (state, { payload }: PayloadAction<boolean>) => {
      state.isOldMonitoring = payload;
      state.isSorting = state.isMonitoring || state.isOldMonitoring;
    },
    changePauseStatus: (state, { payload }: PayloadAction<boolean>) => {
      state.isPause = payload;
    },
    changeIsUnfinishedTask: (state, { payload }: PayloadAction<boolean>) => {
      state.isUnfinishedTask = payload;
    },
    clearCountsMonitoring: (state) => {
      state.countProduct = 0;
      state.productsInCurrentBox = 0;
      state.boxesInCurrentPallet = 0;
      state.countBox = 0;
      state.countPallet = 0;
      state.currentBoxNumber = 0;
      state.currentPalletNumber = 0;
    },
    saveTaskName: (state, { payload }: PayloadAction<string>) => {
      state.taskName = payload;
    },
    changeCount: (state, { payload }: PayloadAction<IChangeCount>) => {
      const {
        productCount,
        productsInCurrentBox,
        boxesInCurrentPallet,
        boxCount,
        palletCount,
        currentBoxNumber,
        currentPalletNumber
      } = payload;

      state.countProduct = productCount;
      state.productsInCurrentBox = productsInCurrentBox;
      state.boxesInCurrentPallet = boxesInCurrentPallet;
      state.countBox = boxCount;
      state.countPallet = palletCount;
      state.currentBoxNumber = currentBoxNumber;
      state.currentPalletNumber = currentPalletNumber;
    }
  },
});

export const {
  changeMonitoringStatus,
  changeOldMonitoringStatus,
  changePauseStatus,
  changeIsUnfinishedTask,
  clearCountsMonitoring,
  saveTaskName,
  changeCount
} = monitoringSlice.actions;
export const monitoringReducer = monitoringSlice.reducer;
export default monitoringSlice;
