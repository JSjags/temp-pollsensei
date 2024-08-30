"use client";

import {
  configureStore,
  combineReducers,
  Action,
  ThunkAction,
  Reducer,
} from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import apiSlice from "../services/config/apiSlice";
import userReducer from "./slices/user.slice";
import hardSet from "redux-persist/es/stateReconciler/hardSet";
import toggleReducer from "./slices/invite.slice";
import formReducer from "./slices/form.slice";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { createPersistStorage } from "./storage";
import questionReducer from "./slices/questions.slice";
import themeReducer from './slices/theme.slice'

// At the top of the file, after imports
export type RootState = {
  user: ReturnType<typeof userReducer>;
  toggle: ReturnType<typeof toggleReducer>;
  form: ReturnType<typeof formReducer>;
  question: ReturnType<typeof questionReducer>;
  themes: ReturnType<typeof themeReducer>;
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
};

const rootReducer = combineReducers({
  user: userReducer,
  toggle: toggleReducer,
  form: formReducer,
  question: questionReducer,
  themes: themeReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
}) as unknown as Reducer<RootState>;

const persistConfig = {
  key: "root",
  storage: createPersistStorage(),
  version: 1,
  transforms: [
    encryptTransform({
      secretKey: process.env.NEXT_PUBLIC_APP_ENCRYPT_KEY || "",
      onError: (error: Error) => {
        console.error(error);
      },
    }),
  ],
  stateReconciler: hardSet,
  blacklist: [apiSlice.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

type PersistedRootState = ReturnType<typeof persistedReducer>;

const store = configureStore<PersistedRootState>({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware) as any,
});

// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

const persistor = persistStore(store);

export default store;
export { persistor };
