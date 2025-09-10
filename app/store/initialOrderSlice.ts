// src/store/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ORDER } from "../components/Order/sample";
import { IInputData } from "./types";

const defaultOrderKeys = ORDER.map((el) => {
  const a = { ...el, value: "" };
  if (el.name === 'startCorob' || el.name === 'startPallet') {
    a.value = "1";
  }
  return a;
});

const initialState: IInputData[] = defaultOrderKeys;

const initialOrderSlice = createSlice({
  name: "Order",
  initialState,
  reducers: {
    updateOrder: (state, { payload }: PayloadAction<IInputData[]>) => {
      state = payload;
    },
    resetOrder: (state) => {
      state = initialState;
    },
  },
});

export const { updateOrder, resetOrder } = initialOrderSlice.actions;
export const orderReducer = initialOrderSlice.reducer;
export default initialOrderSlice;
