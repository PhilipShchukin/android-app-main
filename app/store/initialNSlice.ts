// src/store/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NOMENCLATURES } from "../components/Nomenclatures/sample";
import { IInputData } from "./types";

const defaultNomenclaturesKeys = NOMENCLATURES.map((el) => {
  const a = { ...el, value: "" };
  return a;
});

const initialState: IInputData[] = defaultNomenclaturesKeys;

const initialNSlice = createSlice({
  name: "Nomenclatures",
  initialState,
  reducers: {
    updateN: (state, { payload }: PayloadAction<IInputData[]>) => {
      state = payload;
    },
    resetN: (state) => {
      state = initialState;
    },
  },
});

export const { updateN, resetN } = initialNSlice.actions;
export const initialNReducer = initialNSlice.reducer;
export default initialNSlice;
