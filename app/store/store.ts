// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { nomenclatureJsonReducer } from "./nomenclatureJsonSlice";
import { initialNReducer } from "./initialNSlice";
import { orderReducer } from "./initialOrderSlice";
import { taskJsonReducer } from "./taskJsonSlice";
import { monitoringReducer } from "./monitoringSlice";
import { DBWorkReducer } from "./DBWorkSlice";
import { authReducer } from './authSlice';
import { templatesReducer } from "./templateSlice";
import { oldSortingReducer } from "./OldSortingSlice";

const store = configureStore({
  reducer: {
    nomenklanureJson: nomenclatureJsonReducer,
    oldSorting: oldSortingReducer,
    taskJson: taskJsonReducer,
    initialN: initialNReducer,
    initialOrder: orderReducer,
    DBWork: DBWorkReducer,
    monitoring: monitoringReducer,
    auth: authReducer,
    templates: templatesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
