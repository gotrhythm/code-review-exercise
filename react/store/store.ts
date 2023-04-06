import { configureStore } from '@reduxjs/toolkit';
import sandwichReducer from './sandwichSlice';

export const store = configureStore({
  reducer: {
    sandwich: sandwichReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
